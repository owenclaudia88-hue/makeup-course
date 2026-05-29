import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";
import { bunnyEmbedUrl } from "@/lib/bunny";
import { membership } from "@/lib/offer";
import CourseCover from "../../../components/CourseCover";
import VideoCourse from "../../../components/VideoCourse";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const session = requireSession();
  const course = getCourse(params.slug);
  if (!course) notFound();

  // Core (purchased) courses are always accessible; membership courses require
  // a live subscription.
  const locked = !course.core && !(await hasActiveMembership(session.email));

  const videoLessons = (course.videoLessons ?? []).map((l) => ({
    title: l.title,
    url: bunnyEmbedUrl(l.videoId),
  }));
  const hasVideo = videoLessons.length > 0;
  const playable = videoLessons.filter((l) => l.url) as { title: string; url: string }[];

  let mode: "locked" | "video" | "video-pending" | "pdf" | "lessons";
  if (locked) mode = "locked";
  else if (hasVideo) mode = playable.length === videoLessons.length ? "video" : "video-pending";
  else if (course.pdf) mode = "pdf";
  else mode = "lessons";

  return (
    <main className="container-narrow py-10">
      <Link href="/plattform" className="text-sm font-medium text-rose hover:text-rose-dark">
        ← Alla kurser
      </Link>
      <CourseCover
        slug={course.slug}
        title={course.title}
        className="mt-4 aspect-[16/6] w-full rounded-2xl"
      />
      <p className="eyebrow mb-2 mt-4">
        {course.category} · {course.level} · {course.minutesPerDay} min/dag
      </p>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">{course.title}</h1>
      <p className="mt-2 text-muted">{course.summary}</p>

      {mode === "locked" && (
        <div className="card mt-8 p-8 text-center">
          <p className="text-2xl">🔒</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            Den här kursen ingår i {membership.name}
          </p>
          <p className="mt-2 text-muted">
            Ditt medlemskap är inte aktivt just nu. Återaktivera för att få tillgång till alla{" "}
            {membership.courses}+ kurser igen.
          </p>
          <Link href="/plattform/konto" className="btn-primary mt-5">
            Hantera medlemskap
          </Link>
        </div>
      )}

      {mode === "video" && <VideoCourse lessons={playable} />}

      {mode === "video-pending" && (
        <div className="card mt-8 p-8 text-center text-muted">
          Videon konfigureras snart. (Bunny Stream är inte kopplat än – lägg in
          BUNNY_LIBRARY_ID och BUNNY_TOKEN_KEY.)
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
            Ser du inget?{" "}
            <a
              href={`/api/kurs-pdf?slug=${course.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-rose hover:text-rose-dark"
            >
              Öppna PDF i ny flik
            </a>
          </p>
        </div>
      )}

      {mode === "lessons" && (
        <div className="mt-8 space-y-5">
          {course.lessons.map((l, i) => (
            <article key={i} className="card p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose">
                Lektion {i + 1}
              </span>
              <h2 className="mt-1 font-serif text-xl font-bold text-ink">{l.title}</h2>
              <p className="mt-3 rounded-lg bg-blush/40 p-3 text-sm font-medium text-ink">💡 {l.insight}</p>
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
    </main>
  );
}
