import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { courses, getLessonCount, type Course } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";
import { brand, membership } from "@/lib/offer";
import { getStreak } from "@/lib/progress";
import { getOwnedSlugs } from "@/lib/ownership";
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
          category={c.category}
          className="aspect-[16/10] w-full"
        />
        {locked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/55">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">
              🔒 Unlock with membership
            </span>
          </div>
        )}
      </div>
      <div className="flex grow flex-col p-4">
        <p className="grow text-sm text-muted">{c.summary}</p>
        <span className="mt-3 text-xs font-medium text-muted">
          {lessonCount} lessons · {c.minutesPerDay} min/day · {c.level}
        </span>
      </div>
    </>
  );
  return (
    <Link
      href={locked ? "/platform/account" : `/platform/course/${c.slug}`}
      className={cls}
    >
      {inner}
    </Link>
  );
}

export default async function CatalogPage() {
  const session = requireSession();
  const [member, streak, ownedSlugs] = await Promise.all([
    hasActiveMembership(session.email),
    getStreak(session.email),
    getOwnedSlugs(session.email),
  ]);
  // "Yours forever" = explicitly purchased + legacy `core: true` intro bundle.
  const isOwned = (c: Course) => c.core === true || ownedSlugs.has(c.slug);
  const yoursForever = courses.filter(isOwned);
  const rest = courses.filter((c) => !isOwned(c));

  return (
    <main className="container-tight py-10">
      <p className="eyebrow mb-2">{brand.name} Academy</p>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Your library
          </h1>
          <p className="mt-1 text-muted">
            Courses you've purchased are yours forever — the rest stay as long
            as your membership is active.
          </p>
        </div>
        {streak.count > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-blush bg-cream px-4 py-2"
            title={`Last active ${streak.lastDate}`}
          >
            <span className="text-xl">🔥</span>
            <div className="text-sm leading-tight">
              <p className="font-bold text-ink">
                {streak.count}-day streak
              </p>
              <p className="text-[11px] text-muted">Consistency wins.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <PlattformGreeting />
      </div>

      {yoursForever.length > 0 && (
        <>
          <h2 className="mt-8 font-serif text-xl font-bold text-ink">
            Yours forever
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {yoursForever.map((c) => (
              <CourseCard key={c.slug} c={c} />
            ))}
          </div>
        </>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-ink">
          More with your membership
        </h2>
        {!member && (
          <Link
            href="/platform/account"
            className="text-sm font-semibold text-rose hover:text-rose-dark"
          >
            Reactivate →
          </Link>
        )}
      </div>
      <p className="text-sm text-muted">
        {member
          ? `${membership.courses}+ courses included with ${membership.name}.`
          : "Your membership isn't active — reactivate to unlock these courses."}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c) => (
          <CourseCard key={c.slug} c={c} locked={!member} />
        ))}
      </div>
    </main>
  );
}
