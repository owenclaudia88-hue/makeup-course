import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";
import { bunnyEmbedUrl } from "@/lib/bunny";
import { membership } from "@/lib/offer";
import { getCourseCompleted, getLastLesson } from "@/lib/progress";
import CourseCover from "../../../components/CourseCover";
import CoursePlayer from "../../../components/CoursePlayer";

export const dynamic = "force-dynamic";

function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function parseIntOr(s: string | undefined, fallback: number): number {
  if (!s) return fallback;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : fallback;
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { m?: string; l?: string };
}) {
  const session = requireSession();
  const course = getCourse(params.slug);
  if (!course) notFound();

  const locked = !course.core && !(await hasActiveMembership(session.email));

  const rawModules =
    course.modules ??
    (course.videoLessons
      ? [
          {
            title: "",
            lessons: course.videoLessons.map((l) => ({
              title: l.title,
              videoId: l.videoId,
            })),
          },
        ]
      : []);

  const resolvedModules = rawModules.map((m) => ({
    title: m.title,
    lessons: m.lessons.map((l) => ({
      title: l.title,
      url: l.videoId ? bunnyEmbedUrl(l.videoId) : null,
      durationSeconds: l.durationSeconds,
    })),
  }));
  const totalVideoLessons = resolvedModules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );
  const playableCount = resolvedModules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.url).length,
    0,
  );

  let mode: "locked" | "video" | "video-pending" | "pdf" | "lessons" | "empty";
  if (locked) mode = "locked";
  else if (totalVideoLessons > 0 && playableCount === totalVideoLessons)
    mode = "video";
  else if (totalVideoLessons > 0) mode = "video-pending";
  else if (course.pdf) mode = "pdf";
  else if (course.lessons && course.lessons.length > 0) mode = "lessons";
  else mode = "empty";

  // Persisted progress drives initial position + the sidebar's checkmarks.
  const [completed, lastPos] =
    mode === "video"
      ? await Promise.all([
          getCourseCompleted(session.email, course.slug),
          getLastLesson(session.email, course.slug),
        ])
      : [[], null];

  const reqM = parseIntOr(searchParams.m, lastPos?.m ?? 0);
  const reqL = parseIntOr(searchParams.l, lastPos?.l ?? 0);
  const safeM = Math.min(
    Math.max(reqM, 0),
    Math.max(resolvedModules.length - 1, 0),
  );
  const safeL = Math.min(
    Math.max(reqL, 0),
    Math.max((resolvedModules[safeM]?.lessons.length ?? 1) - 1, 0),
  );

  return (
    <main className="container-narrow py-10">
      <Link
        href="/plattform"
        className="text-sm font-medium text-rose hover:text-rose-dark"
      >
        ← All courses
      </Link>
      <CourseCover
        slug={course.slug}
        title={course.title}
        className="mt-4 aspect-[16/6] w-full rounded-2xl"
      />
      <p className="eyebrow mb-2 mt-4">
        {course.category} · {course.level} · {course.minutesPerDay} min/day
        {totalVideoLessons > 0 ? <> · {totalVideoLessons} lessons</> : null}
      </p>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
        {course.title}
      </h1>
      <p className="mt-2 text-muted">{course.summary}</p>

      {mode === "locked" && (
        <div className="card mt-8 p-8 text-center">
          <p className="text-2xl">🔒</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            This course is included with {membership.name}
          </p>
          <p className="mt-2 text-muted">
            Your membership isn't active right now. Reactivate to unlock all{" "}
            {membership.courses}+ courses again.
          </p>
          <Link href="/plattform/konto" className="btn-primary mt-5">
            Manage membership
          </Link>
        </div>
      )}

      {mode === "video" && (
        <CoursePlayer
          slug={course.slug}
          modules={resolvedModules.map((m) => ({
            title: m.title,
            lessons: m.lessons.map((l) => ({
              title: l.title,
              url: l.url as string,
              durationSeconds: l.durationSeconds,
            })),
          }))}
          initial={{ m: safeM, l: safeL }}
          initialCompleted={completed.map((c) => `${c.m}::${c.l}`)}
        />
      )}

      {mode === "video-pending" && (
        <div className="mt-6">
          <div className="card flex items-center gap-4 p-5">
            <div className="text-3xl">🎬</div>
            <div>
              <p className="font-semibold text-ink">Video lessons uploading</p>
              <p className="text-sm text-muted">
                You can see the course structure below. Lessons become playable
                as soon as the videos are ready.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-6">
            {resolvedModules.map((mod, mIdx) => (
              <section key={mIdx}>
                {mod.title && (
                  <h3 className="mb-2 font-serif text-lg font-bold text-ink">
                    {mod.title}
                  </h3>
                )}
                <div className="space-y-2">
                  {mod.lessons.map((l, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center gap-3 rounded-xl border border-blush bg-cream/30 p-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-sm font-bold text-rose">
                        {lIdx + 1}
                      </span>
                      <span className="flex-1 font-medium text-ink/70">{l.title}</span>
                      {l.durationSeconds ? (
                        <span className="text-xs text-muted">{fmtDur(l.durationSeconds)}</span>
                      ) : null}
                      <span className="text-muted">🔒</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {mode === "pdf" && (
        <div className="mt-6">
          <iframe
            src={`/api/kurs-pdf?slug=${course.slug}`}
            title={course.title}
            className="h-[85vh] w-full rounded-2xl border border-blush bg-white"
          />
          <p className="mt-2 text-center text-xs text-muted">
            Can't see anything?{" "}
            <a
              href={`/api/kurs-pdf?slug=${course.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-rose hover:text-rose-dark"
            >
              Open PDF in a new tab
            </a>
          </p>
        </div>
      )}

      {mode === "lessons" && course.lessons && (
        <div className="mt-8 space-y-5">
          {course.lessons.map((l, i) => (
            <article key={i} className="card p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose">
                Lesson {i + 1}
              </span>
              <h2 className="mt-1 font-serif text-xl font-bold text-ink">{l.title}</h2>
              <p className="mt-3 rounded-lg bg-blush/40 p-3 text-sm font-medium text-ink">
                💡 {l.insight}
              </p>
              <p className="mt-3 text-muted">{l.body}</p>
              {l.steps && (
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-ink">
                  {l.steps.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ol>
              )}
              {l.checklist && (
                <ul className="mt-3 space-y-1">
                  {l.checklist.map((s, j) => (
                    <li key={j} className="flex gap-2 text-ink">
                      <span className="font-bold text-rose">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      {mode === "empty" && (
        <div className="card mt-8 p-8 text-center text-muted">
          Content coming soon.
        </div>
      )}

      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">What you'll learn</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {course.learningOutcomes.map((o, i) => (
              <li key={i} className="flex gap-2 text-ink">
                <span className="font-bold text-rose">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.description && course.description.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">About this course</h2>
          <div className="mt-4 space-y-4 text-muted">
            {course.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {course.whoFor && course.whoFor.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">Who this is for</h2>
          <ul className="mt-4 space-y-2">
            {course.whoFor.map((w, i) => (
              <li key={i} className="flex gap-2 text-ink">
                <span className="font-bold text-rose">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.instructor && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">Your instructor</h2>
          <div className="card mt-4 p-6">
            <h3 className="font-serif text-xl font-bold text-ink">
              {course.instructor.name}
            </h3>
            <div className="mt-3 space-y-3 text-muted">
              {course.instructor.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {course.instructor.credentials &&
              course.instructor.credentials.length > 0 && (
                <>
                  <h4 className="mt-5 font-semibold text-ink">
                    Teaching &amp; experience
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {course.instructor.credentials.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </>
              )}
            {course.instructor.education &&
              course.instructor.education.length > 0 && (
                <>
                  <h4 className="mt-5 font-semibold text-ink">Education</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {course.instructor.education.map((e, i) => (
                      <li key={i}>• {e}</li>
                    ))}
                  </ul>
                </>
              )}
          </div>
        </section>
      )}
    </main>
  );
}
