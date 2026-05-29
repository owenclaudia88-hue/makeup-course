import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { courses } from "@/lib/courses";
import { brand, membership } from "@/lib/offer";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  requireSession();
  return (
    <main className="container-tight py-10">
      <p className="eyebrow mb-2">{brand.name} Akademi</p>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Dina kurser</h1>
      <p className="mt-1 text-muted">
        Välkommen tillbaka – {membership.courses}+ kurser ingår i ditt medlemskap. Börja med en idag.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Link
            key={c.slug}
            href={`/plattform/kurs/${c.slug}`}
            className="card flex flex-col p-5 transition hover:border-rose"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-rose">{c.category}</span>
            <h2 className="mt-2 font-serif text-lg font-bold text-ink">{c.title}</h2>
            <p className="mt-2 grow text-sm text-muted">{c.summary}</p>
            <span className="mt-4 text-sm font-medium text-muted">
              {c.lessons.length} lektioner · {c.minutesPerDay} min/dag · {c.level}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
