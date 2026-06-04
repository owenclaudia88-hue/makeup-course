import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { courses, getLessonCount, categories, type Course } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";
import { brand, membership } from "@/lib/offer";
import {
  getStreak,
  getActiveCourseSlugs,
  getCourseCompleted,
  getLastLesson,
} from "@/lib/progress";
import { getOwnedSlugs } from "@/lib/ownership";
import PlatformGreeting from "../components/PlattformGreeting";
import PlatformCatalog from "../components/PlatformCatalog";

export const dynamic = "force-dynamic";

function lite(c: Course) {
  return {
    slug: c.slug,
    title: c.title,
    category: c.category,
    level: c.level,
    minutesPerDay: c.minutesPerDay,
    summary: c.summary,
    lessonCount: getLessonCount(c),
  };
}

export default async function CatalogPage() {
  const session = requireSession();
  const [member, streak, ownedSlugs, activeSlugs] = await Promise.all([
    hasActiveMembership(session.email),
    getStreak(session.email),
    getOwnedSlugs(session.email),
    getActiveCourseSlugs(session.email),
  ]);

  // Per-course progress for the active set (used by "Continue watching").
  const activeProgress = await Promise.all(
    activeSlugs.map(async (slug) => {
      const [last, done] = await Promise.all([
        getLastLesson(session.email, slug),
        getCourseCompleted(session.email, slug),
      ]);
      return { slug, last, doneCount: done.length };
    }),
  );

  const isOwned = (c: Course) => c.core === true || ownedSlugs.has(c.slug);

  // "Continue watching" — only courses with last position AND not 100% complete.
  const continueCourses = activeProgress
    .map((p) => {
      const course = courses.find((c) => c.slug === p.slug);
      if (!course) return null;
      const total = getLessonCount(course);
      if (total === 0) return null;
      const percent = Math.min(100, Math.round((p.doneCount / total) * 100));
      if (percent === 100) return null;
      const lessonNum = p.last ? p.last.l + 1 : 1;
      return {
        course,
        percent,
        resumeLabel: percent === 0 ? `Start course` : `Resume at Lesson ${lessonNum}`,
      };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const yoursForever = courses.filter(isOwned);
  const rest = courses.filter((c) => !isOwned(c));

  const sections = [
    {
      key: "continue" as const,
      title: "Continue watching",
      courses: continueCourses.map((c) => lite(c.course)),
      meta: Object.fromEntries(
        continueCourses.map((c) => [
          c.course.slug,
          { resumeLabel: c.resumeLabel, percent: c.percent },
        ]),
      ),
      emptyHint: undefined,
    },
    {
      key: "yours" as const,
      title: "Yours forever",
      courses: yoursForever.map(lite),
      emptyHint:
        yoursForever.length === 0
          ? "You haven't purchased a course yet. Pick one from below to keep it forever."
          : undefined,
    },
    {
      key: "more" as const,
      title: member ? "More with your membership" : "Unlock with membership",
      courses: rest.map(lite),
      locked: !member,
      emptyHint: undefined,
    },
  ];

  return (
    <main className="container-tight py-10">
      <p className="eyebrow mb-2">{brand.name} Academy</p>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Your library</h1>
          <p className="mt-1 text-muted">
            Courses you've purchased are yours forever — the rest stay as long as your membership is active.
          </p>
        </div>
        {streak.count > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-blush bg-cream px-4 py-2"
            title={`Last active ${streak.lastDate}`}
          >
            <span className="text-xl">🔥</span>
            <div className="text-sm leading-tight">
              <p className="font-bold text-ink">{streak.count}-day streak</p>
              <p className="text-[11px] text-muted">Consistency wins.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <PlatformGreeting />
      </div>

      <PlatformCatalog categories={categories} sections={sections} />

      {!member && (
        <p className="mt-12 text-center text-sm text-muted">
          Want everything?{" "}
          <Link href="/platform/account" className="font-semibold text-rose hover:text-rose-dark">
            Reactivate {membership.name}
          </Link>{" "}
          to unlock the full library.
        </p>
      )}
    </main>
  );
}
