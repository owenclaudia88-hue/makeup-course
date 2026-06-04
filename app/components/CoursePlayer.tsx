"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = {
  title: string;
  url: string;
  durationSeconds?: number;
  takeaways?: string[];
};
type Module = { title: string; lessons: Lesson[] };

type Props = {
  slug: string;
  modules: Module[];
  initial: { m: number; l: number };
  initialCompleted: string[]; // "m::l"
};

const FEELINGS = [
  { key: "struggling", label: "Struggling", emoji: "😔" },
  { key: "processing", label: "Processing", emoji: "🤔" },
  { key: "hopeful", label: "Hopeful", emoji: "🌱" },
  { key: "relieved", label: "Relieved", emoji: "😊" },
  { key: "inspired", label: "Inspired", emoji: "✨" },
];

const AFFIRMATIONS = [
  "You're doing something good for yourself right now.",
  "Tiny rituals, real change.",
  "Five minutes counts.",
  "Be patient with the process.",
  "Consistency is the work.",
  "Small steps, kept up, beat big plans abandoned.",
  "The point isn't to be perfect. It's to come back tomorrow.",
  "This is care, not a chore.",
];
function affirmationFor(m: number, l: number) {
  return AFFIRMATIONS[Math.abs(m * 13 + l * 7) % AFFIRMATIONS.length];
}

function fmt(s?: number): string {
  if (!s) return "";
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
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

  // Reflection state for the current lesson
  const [feeling, setFeeling] = useState<string>("");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [reflectionSaved, setReflectionSaved] = useState<"idle" | "saving" | "saved">("idle");

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
  const flatIdx = flat.findIndex((x) => x.mIdx === pos.m && x.lIdx === pos.l);
  const next = flat[flatIdx + 1];
  const prev = flat[flatIdx - 1];

  // Persist position + URL state on lesson change.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("m", String(pos.m));
      url.searchParams.set("l", String(pos.l));
      window.history.replaceState({}, "", url.toString());
    }
    persistProgress({ action: "position", slug, m: pos.m, l: pos.l });
  }, [slug, pos]);

  // Load any prior reflection for the current lesson.
  useEffect(() => {
    let cancelled = false;
    setFeeling("");
    setReflectionText("");
    setReflectionSaved("idle");
    fetch(
      `/api/reflection?slug=${encodeURIComponent(slug)}&m=${pos.m}&l=${pos.l}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const r = data?.reflection;
        if (r) {
          setFeeling(r.feeling ?? "");
          setReflectionText(r.text ?? "");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
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

  async function saveReflection(nextFeeling: string, nextText: string) {
    setReflectionSaved("saving");
    try {
      await fetch("/api/reflection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          m: pos.m,
          l: pos.l,
          feeling: nextFeeling,
          text: nextText,
        }),
      });
      setReflectionSaved("saved");
      setTimeout(() => setReflectionSaved("idle"), 1500);
    } catch {
      setReflectionSaved("idle");
    }
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

        {/* Takeaways — when defined on the lesson */}
        {current.takeaways && current.takeaways.length > 0 && (
          <section className="card mt-6 p-5">
            <p className="eyebrow mb-2">Key takeaways</p>
            <ul className="space-y-2">
              {current.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 font-bold text-rose">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reflection — emoji + private text */}
        <section className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Reflect on this lesson</p>
            <span className="text-[11px] text-muted">🔒 Private — just for you</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            How are you feeling after this one?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FEELINGS.map((f) => {
              const active = feeling === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => {
                    const next = active ? "" : f.key;
                    setFeeling(next);
                    saveReflection(next, reflectionText);
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-rose bg-rose/10 text-rose-dark"
                      : "border-blush bg-white text-ink hover:border-rose"
                  }`}
                >
                  <span>{f.emoji}</span>
                  <span className="font-medium">{f.label}</span>
                </button>
              );
            })}
          </div>
          <textarea
            placeholder="A few thoughts… this is just for you."
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            onBlur={() => saveReflection(feeling, reflectionText)}
            rows={3}
            className="mt-3 w-full resize-none rounded-lg border border-blush bg-cream/40 p-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-rose"
          />
          <p className="mt-1 text-right text-[11px] text-muted">
            {reflectionSaved === "saving"
              ? "Saving…"
              : reflectionSaved === "saved"
                ? "Saved ✓"
                : "Saves automatically"}
          </p>
        </section>

        {/* Affirmation between lessons */}
        <div className="mt-6 rounded-2xl border border-blush bg-cream/60 p-4 text-center">
          <p className="font-serif text-base italic text-ink/80">
            "{affirmationFor(pos.m, pos.l)}"
          </p>
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
            <div className="min-w-0 flex-1">
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
                width: `${Math.round((doneCount / Math.max(totalLessons, 1)) * 100)}%`,
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
