"use client";

import { useState } from "react";

type LessonItem = { title: string; url: string; durationSeconds?: number };
type ModuleItem = { title: string; lessons: LessonItem[] };

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export default function VideoCourse({ modules }: { modules: ModuleItem[] }) {
  const [pos, setPos] = useState<{ m: number; l: number }>({ m: 0, l: 0 });
  const current = modules[pos.m]?.lessons[pos.l];
  if (!current) return null;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const showModuleTitles =
    modules.length > 1 || (modules[0]?.title?.trim().length ?? 0) > 0;
  let runningIndex = 0;

  return (
    <div className="mt-6">
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

      <p className="mt-3 font-serif text-lg font-bold text-ink">{current.title}</p>

      {totalLessons > 1 && (
        <div className="mt-6 space-y-6">
          {modules.map((mod, mIdx) => (
            <section key={mIdx}>
              {showModuleTitles && (
                <h3 className="mb-2 font-serif text-lg font-bold text-ink">{mod.title}</h3>
              )}
              <div className="space-y-2">
                {mod.lessons.map((l, lIdx) => {
                  runningIndex += 1;
                  const isCurrent = pos.m === mIdx && pos.l === lIdx;
                  return (
                    <button
                      key={lIdx}
                      onClick={() => setPos({ m: mIdx, l: lIdx })}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        isCurrent ? "border-rose bg-rose/5" : "border-blush hover:border-rose"
                      }`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
                        {runningIndex}
                      </span>
                      <span className="flex-1 font-medium text-ink">{l.title}</span>
                      {l.durationSeconds ? (
                        <span className="text-xs text-muted">{fmt(l.durationSeconds)}</span>
                      ) : null}
                      {isCurrent && (
                        <span className="text-xs font-semibold text-rose">Spelas nu</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
