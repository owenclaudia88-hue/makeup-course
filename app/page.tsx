import Link from "next/link";
import Header from "./components/Header";
import CtaButton from "./components/CtaButton";
import SmartImg from "./components/SmartImg";
import CourseCover from "./components/CourseCover";
import {
  brand,
  membership,
  membershipMonthlyPrice,
} from "@/lib/offer";
import { courses } from "@/lib/courses";
import { getCurrentCurrency } from "@/lib/currencyServer";
import { formatPrice } from "@/lib/currency";

// Curated set shown on the homepage. Sampled across categories so visitors see
// the breadth of the academy on first scroll.
const FEATURED_SLUGS = [
  "makeup40",
  "natural-face-lift",
  "ansiktsyoga",
  "hudvard-40",
  "battre-somn",
  "lymfdetox-21",
  "meditation-nyborjare",
  "personlig-stil-40",
];

const CATEGORIES = [
  {
    name: "Beauty",
    emoji: "💆‍♀️",
    blurb: "Face yoga, skincare, lymph drainage, makeup that flatters mature skin.",
  },
  {
    name: "Wellness",
    emoji: "🌿",
    blurb: "Sleep, stress, breathwork, meditation — small habits, big shifts.",
  },
  {
    name: "Health",
    emoji: "💪",
    blurb: "Posture, mobility, mindful eating — care for the body underneath.",
  },
  {
    name: "Personal growth",
    emoji: "✨",
    blurb: "Self-esteem, focus, digital detox — feel as good as you look.",
  },
  {
    name: "Style",
    emoji: "👗",
    blurb: "Build a wardrobe that fits you, not last year's trends.",
  },
  {
    name: "Masterclass",
    emoji: "🎓",
    blurb: "Deep-dive courses on the topics our members ask about most.",
  },
];

const HOW_IT_WORKS = [
  {
    n: 1,
    title: "Browse the library",
    desc: "20+ courses across beauty, wellness, mindfulness, and personal growth. New ones added every month.",
  },
  {
    n: 2,
    title: "Watch in 5–15 minutes",
    desc: "Short, focused video lessons from real practitioners. No filler, no fluff — just what works.",
  },
  {
    n: 3,
    title: "Make it stick",
    desc: "Daily streaks, mark-complete progress, and a private notebook turn watching into doing.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I never thought 5 minutes a day could make this much difference. My skin glows, my jaw is less tense, and I actually look forward to my morning ritual.",
    name: "Sarah K.",
    meta: "47 · New York",
  },
  {
    quote:
      "The face yoga lessons gave me a lift I couldn't get from any cream. I'm hooked — and now I'm working through the lymph drainage course too.",
    name: "Maria L.",
    meta: "52 · London",
  },
  {
    quote:
      "I bought the makeup masterclass and stayed for everything else. The streaks and progress tracking are what finally made me consistent.",
    name: "Linda P.",
    meta: "44 · Sydney",
  },
  {
    quote:
      "Worth every dollar. Video makes it so easy to actually do the practice — not just read about it and forget by lunchtime.",
    name: "Emma R.",
    meta: "39 · Toronto",
  },
];

const FAQS = [
  {
    q: "What exactly is the Luumora Academy membership?",
    a: "One subscription, the whole library. 20+ courses across beauty, wellness, health, personal growth, and style — plus new courses added every month. Stream from any device, track your progress, and cancel any time.",
  },
  {
    q: "Can I really cancel anytime?",
    a: "Yes. One click in your account page. No phone calls, no friction, no questions asked. If you cancel during the 3-day free trial you won't be charged at all.",
  },
  {
    q: "Do I need any equipment or products?",
    a: "Not really. Most courses use just your hands. A few suggest a Gua Sha tool, a yoga mat, or a basic skincare routine — but the techniques work with what you already own.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "30-day money-back guarantee on every paid course. Email us within 30 days and we'll refund you. No back-and-forth.",
  },
  {
    q: "How is this different from free YouTube videos?",
    a: "Curated, structured, and finishable. Every course is built as a real program with modules, durations, progress tracking, and an expert instructor — not a random algorithm rabbit hole. You learn faster and you actually finish.",
  },
  {
    q: "If I buy a single course, do I keep it forever?",
    a: "Yes. Any course you purchase outright is yours for life — even if you cancel your membership. The other courses in the library stay available as long as your membership is active.",
  },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="text-gold" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
    </span>
  );
}

export default function Home() {
  const currency = getCurrentCurrency();
  const memberPrice = membershipMonthlyPrice(currency);
  const featured = FEATURED_SLUGS.map((s) => courses.find((c) => c.slug === s)).filter(
    (c): c is NonNullable<typeof c> => !!c,
  );

  return (
    <main>
      <Header />

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/60 to-cream">
        <div className="container-tight grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <p className="eyebrow mb-4">{brand.name} Academy</p>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Daily rituals for a <span className="text-rose">glowing life.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Short, expert-led video courses on face yoga, skincare, lymph drainage,
              mindfulness, style, and more — practiced in 5 to 15 minutes a day.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Stars />
              <span className="text-sm font-medium text-muted">
                Loved by 16,000+ members worldwide
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <CtaButton large>Start your free 3-day trial →</CtaButton>
              <Link
                href="#courses"
                className="rounded-full border border-blush bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:border-rose hover:text-rose"
              >
                Browse the library
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted">
              Then {formatPrice(memberPrice, currency)}/mo · Cancel anytime · 30-day money-back guarantee
            </p>
          </div>

          <div className="animate-fade-up">
            <SmartImg
              src="/hero.png"
              alt="Luumora Academy — daily wellness and beauty rituals"
              label="Hero image (public/hero.png)"
              className="aspect-[5/4] w-full"
            />
          </div>
        </div>
      </section>

      {/* ───────── TRUST BAR ───────── */}
      <section className="border-y border-blush bg-white">
        <div className="container-tight grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          {[
            ["16,000+", "members"],
            [`${courses.length}+`, "courses"],
            ["5–15 min", "per day"],
            ["4.9 / 5", "average rating"],
          ].map(([big, small]) => (
            <div key={small}>
              <div className="font-serif text-2xl font-bold text-rose-dark">{big}</div>
              <div className="text-sm text-muted">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            A library that's actually built to be used
          </h2>
          <p className="mt-3 text-muted">
            Most online courses get abandoned. Luumora is designed differently — short
            lessons, daily nudges, and progress that compounds.
          </p>
        </div>
        <div className="container-tight mt-10 grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.n} className="card flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose font-serif text-lg font-bold text-white">
                {step.n}
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CATEGORIES ───────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">Six worlds, one membership</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Explore by what your day needs
          </h2>
        </div>
        <div className="container-tight mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="card flex items-start gap-4 p-5">
              <span className="text-3xl" aria-hidden>
                {c.emoji}
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">{c.name}</h3>
                <p className="mt-1 text-sm text-muted">{c.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FEATURED COURSES ───────── */}
      <section id="courses" className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">A taste of the library</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Just a few of the courses inside
          </h2>
          <p className="mt-3 text-muted">
            From a 30-lesson face yoga program to a 5-minute morning ritual — pick what
            calls to you today, switch tomorrow.
          </p>
        </div>
        <div className="container-tight mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => (
            <div key={c.slug} className="card group flex flex-col overflow-hidden p-0 transition hover:border-rose">
              <CourseCover slug={c.slug} title={c.title} className="aspect-[16/10] w-full" />
              <div className="flex grow flex-col p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-rose">
                  {c.category}
                </span>
                <h3 className="mt-1.5 font-serif text-base font-bold leading-snug text-ink">
                  {c.title}
                </h3>
                <p className="mt-1.5 grow text-xs text-muted">{c.summary}</p>
                <span className="mt-3 text-[11px] font-medium text-muted">
                  {c.minutesPerDay} min/day · {c.level}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="container-narrow mt-10 text-center">
          <CtaButton large>Start your free 3-day trial →</CtaButton>
          <p className="mt-3 text-sm text-muted">
            Full access to all {courses.length}+ courses, instantly.
          </p>
        </div>
      </section>

      {/* ───────── MEMBERSHIP PRICING ───────── */}
      <section className="bg-gradient-to-b from-cream to-blush/60 py-16 sm:py-20">
        <div className="container-narrow">
          <div className="card overflow-hidden p-0">
            <div className="bg-rose px-6 py-4 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-wide">
                One membership, the whole library
              </p>
            </div>
            <div className="p-6 sm:p-10">
              <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
                Everything inside, every day
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-center text-muted">
                {courses.length}+ courses, new ones added monthly, progress tracking, and a
                private notebook — all for less than a single in-person class.
              </p>

              <ul className="mx-auto mt-8 max-w-md space-y-2.5">
                {[
                  `All ${courses.length}+ courses — beauty, wellness, health, growth, style`,
                  "New courses added every month",
                  "Watch on any device — phone, tablet, laptop, TV",
                  "Streaks, progress tracking & private notebook",
                  "Cancel anytime — keep what you've purchased forever",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 font-bold text-rose">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-rose">
                  3 days free, then
                </p>
                <div className="mt-1 flex items-baseline justify-center gap-2">
                  <span className="font-serif text-6xl font-bold text-rose-dark">
                    {formatPrice(memberPrice, currency)}
                  </span>
                  <span className="text-lg text-muted">/ month</span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Cancel anytime · billed monthly · 30-day money-back guarantee
                </p>

                <div className="mx-auto mt-6 max-w-md">
                  <CtaButton large>Start your free trial →</CtaButton>
                </div>
                <p className="mt-3 text-xs text-muted">
                  🔒 Secure payment · powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">From our members</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Real results, real routines
          </h2>
        </div>
        <div className="container-tight mt-10 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col gap-3 p-6">
              <Stars />
              <blockquote className="text-ink">"{t.quote}"</blockquote>
              <figcaption className="text-sm font-semibold text-muted">
                — {t.name}, {t.meta}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
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
            <CtaButton large>Start your free 3-day trial →</CtaButton>
            <p className="mt-3 text-sm text-muted">
              {membership.trialDays}-day free trial · {formatPrice(memberPrice, currency)}/mo after · cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-blush bg-white py-10">
        <div className="container-tight text-center text-sm text-muted">
          <p className="font-serif text-lg font-bold text-rose-dark">{brand.name} Academy</p>
          <p className="mt-2">{brand.tagline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/platform/login" className="hover:text-rose">
              Sign in
            </Link>
            <a href="#" className="hover:text-rose">Privacy</a>
            <a href="#" className="hover:text-rose">Terms</a>
            <a href={`mailto:${brand.supportEmail}`} className="hover:text-rose">
              Contact
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-muted/80">
            Results vary from person to person. {brand.name} provides educational content
            and does not guarantee specific outcomes. © {new Date().getFullYear()}{" "}
            {brand.name}.
          </p>
        </div>
      </footer>
    </main>
  );
}
