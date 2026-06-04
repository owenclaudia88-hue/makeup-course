import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, membership, membershipMonthlyPrice } from "@/lib/offer";
import { getCourse, getLessonCount, type Course } from "@/lib/courses";
import { getCurrentCurrency } from "@/lib/currencyServer";
import { formatPrice } from "@/lib/currency";
import CourseCover from "../../components/CourseCover";

export const dynamic = "force-dynamic";

// ─── Defaults for any course that hasn't customized its `landing` block ───
const DEFAULT_PRICE_USD = 3900; // $39
const DEFAULT_VALUE_USD = 19000; // $190 anchor
const DEFAULT_SOCIAL = "Loved by 16,000+ members worldwide";

function getLanding(c: Course) {
  return {
    tagline: c.landing?.tagline ?? c.summary,
    priceUsd: c.landing?.priceUsd ?? DEFAULT_PRICE_USD,
    regularPriceUsd: c.landing?.regularPriceUsd ?? DEFAULT_VALUE_USD,
    bundle: c.landing?.bundle ?? [],
    socialProof: c.landing?.socialProof ?? DEFAULT_SOCIAL,
  };
}

function discountPct(price: number, regular: number): number {
  if (!regular || regular <= price) return 0;
  return Math.round((1 - price / regular) * 100);
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="text-gold" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
    </span>
  );
}

export default function CourseLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  const currency = getCurrentCurrency();
  const landing = getLanding(course);
  const price = formatPrice(landing.priceUsd, currency);
  const regular = formatPrice(landing.regularPriceUsd, currency);
  const off = discountPct(landing.priceUsd, landing.regularPriceUsd);
  const memberPrice = formatPrice(membershipMonthlyPrice(currency), currency);

  const lessonCount = getLessonCount(course);
  const bundle = landing.bundle
    .map((s) => getCourse(s))
    .filter((c): c is NonNullable<typeof c> => !!c);

  // Show top 6 lessons (or all modules' lesson titles for video courses).
  const previewLessons = course.modules
    ? course.modules
        .flatMap((m) => m.lessons.map((l) => l.title))
        .slice(0, 8)
    : (course.lessons ?? []).map((l) => l.title).slice(0, 8);

  // ─── Top of every section: link target for the buy CTA ───
  const buyHref = `/checkout?course=${course.slug}`;

  return (
    <main>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 border-b border-blush/70 bg-cream/85 backdrop-blur">
        <div className="container-tight flex items-center justify-between py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-rose-dark">
            {brand.name}
          </Link>
          <Link
            href={buyHref}
            className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-dark sm:px-5"
          >
            Get the course · {price}
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/60 to-cream">
        <div className="container-tight grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <p className="eyebrow mb-3">
              {course.category} · {course.level} · {course.minutesPerDay} min/day
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{landing.tagline}</p>

            <div className="mt-6 flex items-center gap-3">
              <Stars />
              <span className="text-sm font-medium text-muted">{landing.socialProof}</span>
            </div>

            <div className="mt-7 flex items-end gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-lg text-muted line-through">{regular}</span>
                <span className="font-serif text-5xl font-bold text-rose-dark">{price}</span>
              </div>
              {off > 0 && (
                <span className="rounded-full bg-rose px-3 py-1 text-sm font-bold text-white">
                  Save {off}%
                </span>
              )}
            </div>

            <div className="mt-6">
              <Link href={buyHref} className="btn-primary-lg inline-flex">
                Get this course for {price} →
              </Link>
              <p className="mt-3 text-sm text-muted">
                Yours forever · 30-day money-back guarantee · {membership.trialDays}-day free
                trial of {membership.name} included
              </p>
            </div>
          </div>

          <div className="animate-fade-up">
            <CourseCover
              slug={course.slug}
              title={course.title}
              category={course.category}
              className="aspect-[5/4] w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── At-a-glance bar ── */}
      <section className="border-y border-blush bg-white">
        <div className="container-tight grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          {[
            [`${lessonCount}`, "lessons"],
            [`${course.minutesPerDay} min`, "per day"],
            ["Lifetime", "access"],
            ["4.9 / 5", "rating"],
          ].map(([big, small]) => (
            <div key={small}>
              <div className="font-serif text-2xl font-bold text-rose-dark">{big}</div>
              <div className="text-sm text-muted">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-narrow text-center">
            <p className="eyebrow mb-3">What you'll walk away with</p>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              By the end of this course
            </h2>
          </div>
          <div className="container-tight mt-10 grid gap-3 sm:grid-cols-2">
            {course.learningOutcomes.map((o, i) => (
              <div key={i} className="card flex items-start gap-3 p-5">
                <span className="mt-0.5 text-rose">✓</span>
                <p className="text-ink">{o}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Lesson preview ── */}
      {previewLessons.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-narrow text-center">
            <p className="eyebrow mb-3">Inside the course</p>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {lessonCount} focused lessons — no fluff
            </h2>
            <p className="mt-3 text-muted">
              Short, repeatable lessons you can fit into your morning or evening.
            </p>
          </div>
          <div className="container-tight mt-10 grid gap-3 sm:grid-cols-2">
            {previewLessons.map((title, i) => (
              <div key={i} className="card flex items-center gap-4 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose font-serif text-sm font-bold text-white">
                  {i + 1}
                </div>
                <p className="font-medium text-ink">{title}</p>
              </div>
            ))}
          </div>
          {lessonCount > previewLessons.length && (
            <p className="mt-6 text-center text-sm text-muted">
              + {lessonCount - previewLessons.length} more lessons unlocked when you buy
            </p>
          )}
        </section>
      )}

      {/* ── Instructor (only if defined) ── */}
      {course.instructor && (
        <section className="py-16 sm:py-20">
          <div className="container-narrow">
            <p className="eyebrow mb-3 text-center">Your instructor</p>
            <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
              {course.instructor.name}
            </h2>
            <div className="card mt-8 p-6 sm:p-8">
              <div className="space-y-3 text-muted">
                {course.instructor.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {course.instructor.credentials && course.instructor.credentials.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold text-ink">Teaching &amp; experience</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {course.instructor.credentials.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Bundled extras ── */}
      {bundle.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-narrow text-center">
            <p className="eyebrow mb-3">Bundled in today</p>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {bundle.length} bonus {bundle.length === 1 ? "course" : "courses"} — free with your purchase
            </h2>
          </div>
          <div className="container-tight mt-10 grid gap-5 md:grid-cols-3">
            {bundle.map((b) => (
              <div key={b.slug} className="card overflow-hidden p-0">
                <CourseCover
                  slug={b.slug}
                  title={b.title}
                  category={b.category}
                  className="aspect-[16/10] w-full"
                />
                <div className="p-4">
                  <p className="text-xs text-muted">{b.summary}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-bold text-rose-dark">Free with this course</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Pricing card ── */}
      <section className="bg-gradient-to-b from-cream to-blush/60 py-16 sm:py-20">
        <div className="container-narrow">
          <div className="card overflow-hidden p-0">
            <div className="bg-rose px-6 py-4 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Yours forever — pay once, keep it
              </p>
            </div>
            <div className="p-6 sm:p-10">
              <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
                {course.title}
              </h2>

              <ul className="mx-auto mt-8 max-w-md space-y-2.5">
                <li className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 font-bold text-rose">✓</span>
                  <span>
                    The full {lessonCount}-lesson course — yours for life
                  </span>
                </li>
                {bundle.map((b) => (
                  <li key={b.slug} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5">🎁</span>
                    <span>
                      <strong>{b.title}</strong>{" "}
                      <span className="text-sm text-rose">(bonus, included free)</span>
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5">⭐</span>
                  <span>
                    {membership.trialDays}-day free trial of {membership.name} (
                    {membership.courses}+ courses) — cancel anytime, then{" "}
                    {memberPrice}/mo
                  </span>
                </li>
              </ul>

              <div className="mt-10 text-center">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-xl text-muted line-through">{regular}</span>
                  <span className="font-serif text-6xl font-bold text-rose-dark">{price}</span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  One-time payment · 30-day money-back guarantee
                </p>

                <div className="mx-auto mt-6 max-w-md">
                  <Link href={buyHref} className="btn-primary-lg inline-flex w-full justify-center">
                    Get the course for {price} →
                  </Link>
                </div>
                <p className="mt-3 text-xs text-muted">
                  🔒 Secure payment · powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* ── Guarantee ── */}
      <section className="bg-white py-14">
        <div className="container-narrow flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold font-serif text-sm font-bold text-gold">
            30 DAYS
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-ink">Risk-free guarantee</h3>
            <p className="mt-2 text-muted">
              Try the course for 30 days. If it doesn't deliver what you came for, email us at{" "}
              <span className="font-medium text-ink">{brand.supportEmail}</span> and we'll refund you in
              full. No back-and-forth.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
            Quick answers
          </h2>
          <div className="mt-8 space-y-3">
            {[
              {
                q: "When do I get access?",
                a: "Right after checkout. You'll create your account on the success page and the course is in your library immediately — watchable on any device.",
              },
              {
                q: "Is this really mine forever?",
                a: "Yes. This is a one-time purchase. Your access to this course doesn't depend on the membership trial or any subscription. Cancel everything else and you still keep this course.",
              },
              {
                q: "What if it's not for me?",
                a: `30-day money-back guarantee. Email ${brand.supportEmail} within 30 days and we refund you, no questions asked.`,
              },
              {
                q: "What's the free trial about?",
                a: `Every purchase includes a ${membership.trialDays}-day free trial of ${membership.name} so you can explore the rest of the library. It only converts to a paid membership (${memberPrice}/mo) if you don't cancel during the trial. You can cancel in one click on your account page.`,
              },
              {
                q: "Do I need any equipment?",
                a: "Most lessons use just your hands. A few suggest simple tools (a face oil, a gua sha, a yoga mat) but the techniques work with what you already own.",
              },
            ].map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                  {f.q}
                  <span className="ml-4 text-rose transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={buyHref} className="btn-primary-lg inline-flex">
              Get the course for {price} →
            </Link>
            <p className="mt-3 text-sm text-muted">
              30-day money-back guarantee · cancel the trial anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-blush bg-white py-10">
        <div className="container-tight text-center text-sm text-muted">
          <p className="font-serif text-lg font-bold text-rose-dark">{brand.name} Academy</p>
          <p className="mt-2">{brand.tagline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/" className="hover:text-rose">
              Home
            </Link>
            <Link href="/platform/login" className="hover:text-rose">
              Sign in
            </Link>
            <a href={`mailto:${brand.supportEmail}`} className="hover:text-rose">
              Contact
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-muted/80">
            Results vary from person to person. {brand.name} provides educational content and does
            not guarantee specific outcomes. © {new Date().getFullYear()} {brand.name}.
          </p>
        </div>
      </footer>
    </main>
  );
}
