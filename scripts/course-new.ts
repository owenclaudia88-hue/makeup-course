/**
 * Add a new course end-to-end:
 *   1. Find or create a Bunny Stream Collection named after the slug
 *   2. Upload every .mp4 in --videos= to that collection
 *   3. Poll until all videos finish encoding
 *   4. Write the new GUIDs into data/course-videos.ts (so the player picks
 *      them up the next time it renders)
 *   5. Print a ready-to-paste course block for lib/courses.ts (title +
 *      modules built from the filename order + the durations Bunny reports)
 *
 * Usage:
 *   pnpm course:new <slug> --videos="path/to/folder" [--title="..."] [--module="Module 1"]
 *
 * Files are uploaded in alphabetical order. Number your files (01_xxx.mp4,
 * 02_yyy.mp4) for predictable lesson ordering.
 */
import { promises as fs } from "node:fs";
import { createReadStream, statSync } from "node:fs";
import * as path from "node:path";

async function loadEnv(): Promise<void> {
  try {
    const txt = await fs.readFile(
      path.join(process.cwd(), ".env.local"),
      "utf8",
    );
    for (const line of txt.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq < 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {}
}

type BunnyVideo = {
  guid: string;
  title: string;
  length: number; // seconds
  status: number; // 4 = Finished
  collectionId?: string;
};
type BunnyCollection = { id: string; name: string };

const BASE = (libId: string) => `https://video.bunnycdn.com/library/${libId}`;

async function listCollections(
  libId: string,
  apiKey: string,
): Promise<BunnyCollection[]> {
  const r = await fetch(`${BASE(libId)}/collections?page=1&itemsPerPage=100`, {
    headers: { AccessKey: apiKey },
  });
  if (!r.ok) throw new Error(`Bunny list collections ${r.status}`);
  const data = (await r.json()) as { items: BunnyCollection[] };
  return data.items ?? [];
}

async function createCollection(
  libId: string,
  apiKey: string,
  name: string,
): Promise<BunnyCollection> {
  const r = await fetch(`${BASE(libId)}/collections`, {
    method: "POST",
    headers: { AccessKey: apiKey, "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!r.ok) throw new Error(`Bunny create collection ${r.status}: ${await r.text()}`);
  return (await r.json()) as BunnyCollection;
}

async function ensureCollection(
  libId: string,
  apiKey: string,
  name: string,
): Promise<string> {
  const existing = await listCollections(libId, apiKey);
  const match = existing.find((c) => c.name === name);
  if (match) {
    console.log(`  → reusing collection "${name}" (${match.id})`);
    return match.id;
  }
  const created = await createCollection(libId, apiKey, name);
  console.log(`  → created collection "${name}" (${created.id})`);
  return created.id;
}

async function createVideoEntry(
  libId: string,
  apiKey: string,
  collectionId: string,
  title: string,
): Promise<string> {
  const r = await fetch(`${BASE(libId)}/videos`, {
    method: "POST",
    headers: { AccessKey: apiKey, "content-type": "application/json" },
    body: JSON.stringify({ title, collectionId }),
  });
  if (!r.ok) throw new Error(`Bunny create video ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as { guid: string };
  return data.guid;
}

async function uploadVideoBinary(
  libId: string,
  apiKey: string,
  guid: string,
  filePath: string,
): Promise<void> {
  const size = statSync(filePath).size;
  const stream = createReadStream(filePath);
  const r = await fetch(`${BASE(libId)}/videos/${guid}`, {
    method: "PUT",
    headers: {
      AccessKey: apiKey,
      "content-type": "application/octet-stream",
      "content-length": String(size),
    },
    body: stream as unknown as BodyInit,
    // @ts-expect-error — Node fetch requires duplex for streamed bodies.
    duplex: "half",
  });
  if (!r.ok) throw new Error(`Bunny upload ${r.status}: ${await r.text()}`);
}

async function fetchVideo(
  libId: string,
  apiKey: string,
  guid: string,
): Promise<BunnyVideo> {
  const r = await fetch(`${BASE(libId)}/videos/${guid}`, {
    headers: { AccessKey: apiKey },
  });
  if (!r.ok) throw new Error(`Bunny get video ${r.status}`);
  return (await r.json()) as BunnyVideo;
}

async function waitForEncoded(
  libId: string,
  apiKey: string,
  guids: string[],
  pollMs = 15_000,
): Promise<BunnyVideo[]> {
  while (true) {
    const videos = await Promise.all(guids.map((g) => fetchVideo(libId, apiKey, g)));
    const pending = videos.filter((v) => v.status !== 4);
    const failed = videos.filter((v) => v.status === 5 || v.status === 6);
    if (failed.length > 0) {
      throw new Error(
        `Encoding failed for: ${failed.map((v) => v.title).join(", ")}`,
      );
    }
    if (pending.length === 0) return videos;
    console.log(`  encoding… (${videos.length - pending.length}/${videos.length} done)`);
    await new Promise((r) => setTimeout(r, pollMs));
  }
}

/** Niceify a filename → human lesson title (strip extension, leading numbers, separators). */
function lessonTitleFromFilename(file: string): string {
  return path
    .basename(file, path.extname(file))
    .replace(/^\d+[\s._-]+/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function arg(name: string, args: string[]): string | undefined {
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split("=").slice(1).join("=");
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
}

function writeCourseVideosFile(
  outFile: string,
  slug: string,
  videos: { guid: string; title: string; length: number }[],
  existing: Record<string, { m: number; l: number; videoId: string; title?: string }[]>,
): void {
  existing[slug] = videos.map((v, i) => ({
    m: 0,
    l: i,
    videoId: v.guid,
    title: v.title,
  }));
  const body = `// Generated by scripts/sync-bunny-course.ts and scripts/course-new.ts. Do not edit by hand.
// Maps a course slug to its lessons' Bunny Stream video GUIDs, by module/lesson index.

export type CourseVideoEntry = {
  m: number;
  l: number;
  videoId: string;
  title?: string;
};

export const courseVideos: Record<string, CourseVideoEntry[]> = ${JSON.stringify(existing, null, 2)};
`;
  return require("node:fs").writeFileSync(outFile, body);
}

function printSkeleton(opts: {
  slug: string;
  title: string;
  moduleTitle: string;
  videos: { guid: string; title: string; length: number }[];
}): void {
  const totalSec = opts.videos.reduce((a, v) => a + v.length, 0);
  const minutesPerDay = Math.max(5, Math.min(30, Math.round(totalSec / 60 / opts.videos.length)));
  const block = `  {
    slug: ${JSON.stringify(opts.slug)},
    title: ${JSON.stringify(opts.title)},
    category: "Wellness",
    level: "Beginner",
    minutesPerDay: ${minutesPerDay},
    core: false,
    summary:
      "TODO: write a one-sentence pitch — what the user walks away with, in plain language.",
    description: [
      "TODO: 3–5 paragraphs about the course.",
    ],
    learningOutcomes: [
      "TODO: outcome 1",
      "TODO: outcome 2",
    ],
    whoFor: [
      "TODO: audience 1",
    ],
    landing: {
      tagline: "TODO: short hero subhead",
      priceUsd: 3900,
      regularPriceUsd: 19000,
      bundle: [],
    },
    modules: [
      {
        title: ${JSON.stringify(opts.moduleTitle)},
        lessons: [
${opts.videos
  .map((v) => `          { title: ${JSON.stringify(v.title)}, durationSeconds: ${v.length} },`)
  .join("\n")}
        ],
      },
    ],
  },`;
  console.log("\n──────── PASTE INTO lib/courses.ts ────────\n");
  console.log(block);
  console.log("\n──────────────────────────────────────────\n");
}

async function main() {
  await loadEnv();
  const LIB = process.env.BUNNY_LIBRARY_ID;
  const KEY = process.env.BUNNY_API_KEY;
  if (!LIB || !KEY) {
    console.error("✗ Missing BUNNY_LIBRARY_ID or BUNNY_API_KEY in .env.local");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const videosDir = arg("videos", args);
  const titleArg = arg("title", args);
  const moduleTitle = arg("module", args) ?? "Module 1";

  if (!slug || !videosDir) {
    console.error("Usage: pnpm course:new <slug> --videos=<folder> [--title=\"...\"] [--module=\"Module 1\"]");
    process.exit(1);
  }

  const absVideos = path.resolve(videosDir);
  const all = await fs.readdir(absVideos);
  const mp4s = all
    .filter((f) => /\.mp4$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (mp4s.length === 0) {
    console.error(`✗ No .mp4 files found in ${absVideos}`);
    process.exit(1);
  }
  console.log(`→ Found ${mp4s.length} videos in ${absVideos}`);

  console.log(`→ Ensuring Bunny collection "${slug}"`);
  const collectionId = await ensureCollection(LIB, KEY, slug);

  console.log(`→ Uploading ${mp4s.length} videos…`);
  const created: { guid: string; file: string; title: string }[] = [];
  for (const file of mp4s) {
    const title = lessonTitleFromFilename(file);
    const guid = await createVideoEntry(LIB, KEY, collectionId, title);
    const abs = path.join(absVideos, file);
    const sizeMb = (statSync(abs).size / 1024 / 1024).toFixed(1);
    process.stdout.write(`  ↑ ${file} (${sizeMb} MB) → `);
    await uploadVideoBinary(LIB, KEY, guid, abs);
    console.log(`${guid.slice(0, 8)}…`);
    created.push({ guid, file, title });
  }

  console.log(`→ Waiting for Bunny to finish encoding (this can take a while)…`);
  const finished = await waitForEncoded(LIB, KEY, created.map((c) => c.guid));
  const byGuid = new Map(finished.map((v) => [v.guid, v]));

  // Preserve original upload order in the output.
  const ordered = created.map((c) => {
    const v = byGuid.get(c.guid)!;
    return { guid: v.guid, title: v.title, length: v.length };
  });

  // 4. Write data/course-videos.ts (preserving existing entries).
  const outFile = path.join(process.cwd(), "data", "course-videos.ts");
  let existing: Record<string, { m: number; l: number; videoId: string; title?: string }[]> = {};
  try {
    const raw = await fs.readFile(outFile, "utf8");
    const m = raw.match(/=\s*({[\s\S]*?});?\s*$/);
    if (m) existing = JSON.parse(m[1]);
  } catch {}
  writeCourseVideosFile(outFile, slug, ordered, existing);
  console.log(`\n✓ Wrote ${outFile} (${ordered.length} lessons under "${slug}")`);

  // 5. Print a course skeleton.
  printSkeleton({
    slug,
    title: titleArg ?? slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    moduleTitle,
    videos: ordered,
  });

  console.log(`Next steps:`);
  console.log(`  1. Paste the block above into lib/courses.ts (sort alphabetically by slug).`);
  console.log(`  2. Fill in summary / description / learningOutcomes / whoFor.`);
  console.log(`  3. git add . && git commit && git push.`);
  console.log(`  4. Course is live at /courses/${slug} and /platform/course/${slug}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
