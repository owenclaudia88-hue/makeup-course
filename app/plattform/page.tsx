import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { courses, type Course } from "@/lib/courses";
import { brand, membership } from "@/lib/offer";
import CourseCover from "../components/CourseCover";

export const dynamic = "force-dynamic";

function CourseCard({ c }: { c: Course }) {
  return (
    <Link
      href={`/plattform/kurs/${c.slug}`}
      className="card group flex flex-col overflow-hidden p-0 transition hover:border-rose"
    >
      <CourseCover slug={c.slug} title={c.title} className="aspect-[16/10] w-full" />
      <div className="flex grow flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-rose">{c.category}</span>
        <h3 className="mt-2 font-serif text-lg font-bold text-ink">{c.title}</h3>
        <p className="mt-2 grow text-sm text-muted">{c.summary}</p>
        <span className="mt-4 text-sm font-medium text-muted">
          {c.lessons.length} lektioner · {c.minutesPerDay} min/dag
        </span>
      </div>
    </Link>
  );
}

export default function CatalogPage() {
  requireSession();
  const core = courses.filter((c) => c.core);
  const rest = courses.filter((c) => !c.core);

  return (
    <main className="container-tight py-10">
      <p className="eyebrow mb-2">{brand.name} Akademi</p>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Dina kurser</h1>
      <p className="mt-1 text-muted">
        Allt du köpt finns här att titta på direkt – plus allt som ingår i ditt medlemskap.
      </p>

      {core.length > 0 && (
        <>
          <h2 className="mt-8 font-serif text-xl font-bold text-ink">Ingår i ditt köp</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((c) => (
              <CourseCard key={c.slug} c={c} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-12 font-serif text-xl font-bold text-ink">Mer i ditt medlemskap</h2>
      <p className="text-sm text-muted">
        {membership.courses}+ kurser ingår i {membership.name}.
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c) => (
          <CourseCard key={c.slug} c={c} />
        ))}
      </div>
    </main>
  );
}
