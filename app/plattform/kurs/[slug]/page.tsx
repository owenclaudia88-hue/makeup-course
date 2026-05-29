import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCourse } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default function CoursePage({ params }: { params: { slug: string } }) {
  requireSession();
  const course = getCourse(params.slug);
  if (!course) notFound();

  return (
    <main className="container-narrow py-10">
      <Link href="/plattform" className="text-sm font-medium text-rose hover:text-rose-dark">
        ← Alla kurser
      </Link>
      <p className="eyebrow mb-2 mt-4">
        {course.category} · {course.level} · {course.minutesPerDay} min/dag
      </p>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">{course.title}</h1>
      <p className="mt-2 text-muted">{course.summary}</p>

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
    </main>
  );
}
