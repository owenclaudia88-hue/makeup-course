import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { courses, getLessonCount, type Course } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";
import { brand, membership } from "@/lib/offer";
import { getStreak } from "@/lib/progress";
import CourseCover from "../components/CourseCover";
import PlattformGreeting from "../components/PlattformGreeting";

export const dynamic = "force-dynamic";

function CourseCard({ c, locked }: { c: Course; locked?: boolean }) {
  const cls =
    "card group flex flex-col overflow-hidden p-0 transition hover:border-rose";
  const lessonCount = getLessonCount(c);
  const inner = (
    <>
      <div className="relative">
        <CourseCover
          slug={c.slug}
          title={c.title}
          className="aspect-[16/10] w-full"
        />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/55">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
              🔒 Lås upp med medlemskap
            </span>
          </div>
        )}
      </div>
      <div className="flex grow flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-rose">
          {c.category}
        </span>
        <h3 className="mt-2 font-serif text-lg font-bold text-ink">{c.title}</h3>
        <p className="mt-2 grow text-sm text-muted">{c.summary}</p>
        <span className="mt-4 text-sm font-medium text-muted">
          {lessonCount} lektioner · {c.minutesPerDay} min/dag
        </span>
      </div>
    </>
  );
  return (
    <Link
      href={locked ? "/plattform/konto" : `/plattform/kurs/${c.slug}`}
      className={cls}
    >
      {inner}
    </Link>
  );
}

export default async function CatalogPage() {
  const session = requireSession();
  const [member, streak] = await Promise.all([
    hasActiveMembership(session.email),
    getStreak(session.email),
  ]);
  const core = courses.filter((c) => c.core);
  const rest = courses.filter((c) => !c.core);

  return (
    <main className="container-tight py-10">
      <p className="eyebrow mb-2">{brand.name} Akademi</p>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Dina kurser
          </h1>
          <p className="mt-1 text-muted">
            Kurserna du köpt är dina för alltid – resten ingår så länge ditt
            medlemskap är aktivt.
          </p>
        </div>
        {streak.count > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-blush bg-cream px-4 py-2"
            title={`Senast aktiv ${streak.lastDate}`}
          >
            <span className="text-xl">🔥</span>
            <div className="text-sm leading-tight">
              <p className="font-bold text-ink">
                {streak.count} {streak.count === 1 ? "dag" : "dagar"} i rad
              </p>
              <p className="text-[11px] text-muted">Konsekvens vinner.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <PlattformGreeting />
      </div>

      {core.length > 0 && (
        <>
          <h2 className="mt-8 font-serif text-xl font-bold text-ink">
            Ingår i ditt köp
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((c) => (
              <CourseCard key={c.slug} c={c} />
            ))}
          </div>
        </>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-ink">
          Mer i ditt medlemskap
        </h2>
        {!member && (
          <Link
            href="/plattform/konto"
            className="text-sm font-semibold text-rose hover:text-rose-dark"
          >
            Återaktivera →
          </Link>
        )}
      </div>
      <p className="text-sm text-muted">
        {member
          ? `${membership.courses}+ kurser ingår i ${membership.name}.`
          : "Ditt medlemskap är inte aktivt – återaktivera för att låsa upp dessa kurser."}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c) => (
          <CourseCard key={c.slug} c={c} locked={!member} />
        ))}
      </div>
    </main>
  );
}
