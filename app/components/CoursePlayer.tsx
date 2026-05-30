"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = { title: string; url: string; durationSeconds?: number };
type Module = { title: string; lessons: Lesson[] };

type Props = {
  slug: string;
  modules: Module[];
  initial: { m: number; l: number };
  initialCompleted: string[]; // "m::l"
};

function fmt(s?: number): string {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

async function persistProgress(body: object) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {}
}

export default function CoursePlayer({
  slug,
  modules,
  initial,
  initialCompleted,
}: Props) {
  const [pos, setPos] = useState(initial);
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(initialCompleted),
  );

  const flat = useMemo(
    () =>
      modules.flatMap((mod, mi) =>
        mod.lessons.map((l, li) => ({ ...l, mIdx: mi, lIdx: li })),
      ),
    [modules],
  );

  const current = modules[pos.m]?.lessons[pos.l];
  const currentKey = `${pos.m}::${pos.l}`;
  const isDone = completed.has(currentKey);
  const totalLessons = flat.length;
  const doneCount = completed.size;
  const flatIdx = flat.findIndex(
    (x) => x.mIdx === pos.m && x.lIdx === pos.l,
  );
  const next = flat[flatIdx + 1];
  const prev = flat[flatIdx - 1];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("m", String(pos.m));
      url.searchParams.set("l", String(pos.l));
      window.history.replaceState({}, "", url.toString());
    }
    persistProgress({ action: "position", slug, m: pos.m, l: pos.l });
  }, [slug, pos]);

  if (!current) return null;

  function toggle() {
    const wasDone = completed.has(currentKey);
    const nextSet = new Set(completed);
    if (wasDone) nextSet.delete(currentKey);
    else nextSet.add(currentKey);
    setCompleted(nextSet);
    persistProgress({
      action: wasDone ? "uncomplete" : "complete",
      slug,
      m: pos.m,
      l: pos.l,
    });
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            key={current.url}
            src={current.url}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
            title={current.title}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">
              {modules[pos.m]?.title || `Lesson ${flatIdx + 1}`}
            </p>
            <h2 className="truncate font-serif text-xl font-bold text-ink">
              {current.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={toggle}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isDone
                ? "bg-rose/15 text-rose hover:bg-rose/25"
                : "bg-rose text-white hover:bg-rose-dark"
            }`}
          >
            {isDone ? "✓ Done" : "Mark complete"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => prev && setPos({ m: prev.mIdx, l: prev.lIdx })}
            disabled={!prev}
            className="text-sm font-medium text-muted hover:text-rose disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => next && setPos({ m: next.mIdx, l: next.lIdx })}
            disabled={!next}
            className="text-sm font-medium text-rose hover:text-rose-dark disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        {next ? (
          <div className="card mt-6 flex items-center gap-4 p-5">
            <div className="text-3xl">▶️</div>
            <div className="flex-1 min-w-0">
              <p className="eyebrow">Up next</p>
              <p className="truncate font-semibold text-ink">{next.title}</p>
              {next.durationSeconds ? (
                <p className="text-xs text-muted">{fmt(next.durationSeconds)}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setPos({ m: next.mIdx, l: next.lIdx })}
              className="shrink-0 rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-dark"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="card mt-6 p-8 text-center">
            <p className="text-3xl">🌟</p>
            <p className="mt-2 font-semibold text-ink">
              You finished the whole course!
            </p>
            <p className="mt-1 text-sm text-muted">
              Come back any time — this course stays in your library.
            </p>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Course outline</p>
            <p className="text-xs font-semibold text-rose">
              {doneCount} / {totalLessons}
            </p>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blush">
            <div
              className="h-full bg-rose transition-all"
              style={{
                width: `${Math.round(
                  (doneCount / Math.max(totalLessons, 1)) * 100,
                )}%`,
              }}
            />
          </div>

          <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1 lg:max-h-[60vh]">
            {modules.map((mod, mi) => (
              <section key={mi}>
                {mod.title && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {mod.title}
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  {mod.lessons.map((l, li) => {
                    const key = `${mi}::${li}`;
                    const isCur = pos.m === mi && pos.l === li;
                    const isOk = completed.has(key);
                    return (
                      <button
                        key={li}
                        type="button"
                        onClick={() => setPos({ m: mi, l: li })}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${
                          isCur
                            ? "bg-rose/10 font-semibold text-ink"
                            : "text-ink/80 hover:bg-blush/40"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isOk
                              ? "bg-rose text-white"
                              : isCur
                                ? "bg-rose/20 text-rose"
                                : "bg-blush text-rose"
                          }`}
                        >
                          {isOk ? "✓" : li + 1}
                        </span>
                        <span className="flex-1 truncate">{l.title}</span>
                        {l.durationSeconds ? (
                          <span className="text-[11px] text-muted">
                            {fmt(l.durationSeconds)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
