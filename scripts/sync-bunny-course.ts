/**
 * Sync a course's Bunny Stream videos into data/course-videos.ts by matching
 * lesson durations from lib/courses.ts against the Bunny library.
 *
 * Usage:
 *   pnpm bunny:sync <course-slug> [--collection=<id>] [--dry-run]
 *
 * Requires BUNNY_LIBRARY_ID and BUNNY_API_KEY in .env.local. Token auth key
 * (BUNNY_TOKEN_KEY) is a different thing and isn't needed by this script.
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline/promises";

// ---- 1. Load .env.local (so the user doesn't need dotenv installed) ----
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
  } catch {
    // .env.local doesn't have to exist — env vars might be in the shell.
  }
}

type BunnyVideo = {
  guid: string;
  title: string;
  length: number; // seconds
  status: number; // 4 = Finished
  collectionId?: string;
};

async function fetchAllVideos(
  libraryId: string,
  apiKey: string,
  collectionId?: string,
): Promise<BunnyVideo[]> {
  const all: BunnyVideo[] = [];
  let page = 1;
  while (true) {
    const url = new URL(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
    );
    url.searchParams.set("page", String(page));
    url.searchParams.set("itemsPerPage", "100");
    if (collectionId) url.searchParams.set("collection", collectionId);
    const r = await fetch(url, { headers: { AccessKey: apiKey } });
    if (!r.ok) {
      throw new Error(`Bunny API ${r.status}: ${await r.text()}`);
    }
    const data = (await r.json()) as {
      items: BunnyVideo[];
      totalItems: number;
    };
    all.push(...data.items);
    if (data.items.length === 0 || all.length >= data.totalItems) break;
    page++;
  }
  return all;
}

async function main() {
  await loadEnv();
  const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
  const API_KEY = process.env.BUNNY_API_KEY;
  if (!LIBRARY_ID || !API_KEY) {
    console.error(
      "✗ Missing BUNNY_LIBRARY_ID or BUNNY_API_KEY in .env.local",
    );
    process.exit(1);
  }

  const { courses } = await import("../lib/courses");

  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const collectionArg = args.find((a) => a.startsWith("--collection="));
  const collectionId = collectionArg?.split("=")[1];
  const isDryRun = args.includes("--dry-run");

  if (!slug) {
    console.error(
      "Usage: pnpm bunny:sync <course-slug> [--collection=<id>] [--dry-run]",
    );
    console.error(
      "Available: " +
        courses
          .filter((c) => c.modules?.length)
          .map((c) => c.slug)
          .join(", "),
    );
    process.exit(1);
  }

  const course = courses.find((c) => c.slug === slug);
  if (!course) {
    console.error(`✗ Course "${slug}" not found in lib/courses.ts`);
    process.exit(1);
  }
  if (!course.modules || course.modules.length === 0) {
    console.error(
      `✗ Course "${slug}" has no modules. Add a modules[] block first.`,
    );
    process.exit(1);
  }

  console.log(
    `→ Fetching Bunny library ${LIBRARY_ID}` +
      (collectionId ? ` (collection ${collectionId})` : "") +
      "...",
  );
  const videos = await fetchAllVideos(LIBRARY_ID, API_KEY, collectionId);
  console.log(`  ${videos.length} videos returned`);

  // Pool of unmatched, finished videos
  const pool = new Map<string, BunnyVideo>();
  let skipped = 0;
  for (const v of videos) {
    if (v.status !== 4) {
      skipped++;
      continue;
    }
    pool.set(v.guid, v);
  }
  if (skipped) {
    console.log(`  (skipped ${skipped} unfinished; encoding may still be running)`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const result: { m: number; l: number; videoId: string; title?: string }[] =
    [];
  let unmatched = 0;

  for (let mi = 0; mi < course.modules.length; mi++) {
    const mod = course.modules[mi];
    console.log(`\n[${mod.title || `Module ${mi + 1}`}]`);
    for (let li = 0; li < mod.lessons.length; li++) {
      const lesson = mod.lessons[li];
      const target = lesson.durationSeconds;
      if (!target) {
        console.log(`  L${li + 1} "${lesson.title}" — no duration, skipped`);
        continue;
      }
      const candidates = [...pool.values()]
        .map((v) => ({ v, diff: Math.abs(v.length - target) }))
        .filter((x) => x.diff <= 2)
        .sort((a, b) => a.diff - b.diff);

      if (candidates.length === 0) {
        console.log(
          `  L${li + 1} "${lesson.title}" (${target}s) — NO MATCH`,
        );
        unmatched++;
        continue;
      }

      let pick: BunnyVideo;
      if (candidates.length === 1) {
        pick = candidates[0].v;
        console.log(
          `  L${li + 1} "${lesson.title}" (${target}s) → ${pick.title} (${pick.length}s) ✓`,
        );
      } else {
        console.log(
          `  L${li + 1} "${lesson.title}" (${target}s) — ${candidates.length} candidates:`,
        );
        candidates.forEach((c, i) => {
          console.log(
            `     [${i + 1}] "${c.v.title}" (${c.v.length}s, ${c.v.guid.slice(0, 8)}…)`,
          );
        });
        const ans = await rl.question(`     Pick 1-${candidates.length}: `);
        const idx = parseInt(ans, 10) - 1;
        pick = candidates[idx]?.v ?? candidates[0].v;
      }

      pool.delete(pick.guid);
      result.push({
        m: mi,
        l: li,
        videoId: pick.guid,
        title: lesson.title,
      });
    }
  }

  rl.close();

  console.log(
    `\nMatched ${result.length} / ${course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons` +
      (unmatched ? ` (${unmatched} unmatched)` : ""),
  );
  if (pool.size > 0) {
    console.log(`\nUnused Bunny videos (${pool.size}):`);
    for (const v of pool.values()) {
      console.log(`  - "${v.title}" (${v.length}s, ${v.guid.slice(0, 8)}…)`);
    }
  }

  if (isDryRun) {
    console.log("\n(--dry-run: not writing data/course-videos.ts)");
    return;
  }

  // Merge with existing mappings
  const outFile = path.join(process.cwd(), "data", "course-videos.ts");
  let existing: Record<string, typeof result> = {};
  try {
    // Read raw and extract the JSON-looking object literal — robust enough for
    // a file we own and control.
    const raw = await fs.readFile(outFile, "utf8");
    const m = raw.match(/=\s*({[\s\S]*?});?\s*$/);
    if (m) existing = JSON.parse(m[1]);
  } catch {}
  existing[slug] = result;

  const body = `// Generated by scripts/sync-bunny-course.ts. Do not edit by hand.
// Maps a course slug to its lessons' Bunny Stream video GUIDs, by module/lesson index.

export type CourseVideoEntry = {
  m: number;
  l: number;
  videoId: string;
  title?: string;
};

export const courseVideos: Record<string, CourseVideoEntry[]> = ${JSON.stringify(existing, null, 2)};
`;
  await fs.writeFile(outFile, body);
  console.log(`\n✓ Wrote ${outFile}`);
  console.log(`  Restart dev server / redeploy to see the videos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
