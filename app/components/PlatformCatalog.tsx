"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CourseCover from "./CourseCover";

type CourseLite = {
  slug: string;
  title: string;
  category: string;
  level: string;
  minutesPerDay: number;
  summary: string;
  lessonCount: number;
};

type Section = {
  key: "continue" | "yours" | "more";
  title: string;
  courses: CourseLite[];
  locked?: boolean;
  emptyHint?: string;
  // For "continue": map slug → { lastPos: "1·3", percent: 23 } etc.
  meta?: Record<string, { resumeLabel: string; percent: number }>;
};

export default function PlatformCatalog({
  categories,
  sections,
}: {
  categories: string[];
  sections: Section[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections
      .map((sec) => ({
        ...sec,
        courses: sec.courses.filter((c) => {
          if (cat !== "All" && c.category !== cat) return false;
          if (!q) return true;
          return (
            c.title.toLowerCase().includes(q) ||
            c.summary.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((sec) => sec.courses.length > 0 || sec.emptyHint);
  }, [sections, query, cat]);

  return (
    <>
      {/* Search + category filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            type="search"
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-blush bg-white px-10 py-2.5 text-sm text-ink outline-none focus:border-rose"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              cat === c
                ? "border-rose bg-rose text-white"
                : "border-blush bg-white text-ink hover:border-rose"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filteredSections.map((sec) => (
        <section key={sec.key} className="mt-10">
          <h2 className="font-serif text-xl font-bold text-ink">{sec.title}</h2>
          {sec.courses.length === 0 && sec.emptyHint ? (
            <p className="mt-2 text-sm text-muted">{sec.emptyHint}</p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sec.courses.map((c) => {
                const meta = sec.meta?.[c.slug];
                const href = sec.locked
                  ? "/platform/account"
                  : `/platform/course/${c.slug}`;
                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className="card group flex flex-col overflow-hidden p-0 transition hover:border-rose"
                  >
                    <div className="relative">
                      <CourseCover
                        slug={c.slug}
                        title={c.title}
                        category={c.category}
                        className="aspect-[16/10] w-full"
                      />
                      {sec.locked && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/55">
                          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">
                            🔒 Unlock with membership
                          </span>
                        </div>
                      )}
                      {meta && (
                        <>
                          <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-ink/30">
                            <div
                              className="h-full bg-rose"
                              style={{ width: `${meta.percent}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex grow flex-col p-4">
                      {meta ? (
                        <p className="text-xs font-semibold text-rose">
                          {meta.resumeLabel}
                        </p>
                      ) : (
                        <p className="grow text-sm text-muted">{c.summary}</p>
                      )}
                      <span className="mt-3 text-xs font-medium text-muted">
                        {c.lessonCount} lessons · {c.minutesPerDay} min/day · {c.level}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ))}

      {filteredSections.length === 0 && (
        <p className="mt-10 text-center text-muted">
          No courses match those filters. Try clearing the search.
        </p>
      )}
    </>
  );
}
