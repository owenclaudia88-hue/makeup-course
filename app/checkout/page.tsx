"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import {
  brand,
  mainOffer,
  bonuses,
  membership,
  membershipMonthlyPrice,
} from "@/lib/offer";
import { formatPrice } from "@/lib/currency";
import { courses, type Course } from "@/lib/courses";
import { getStripePromise } from "@/lib/stripe-client";
import CheckoutForm from "../components/CheckoutForm";
import { fbqTrack } from "../components/MetaPixel";

type CartView = {
  title: string;
  blurb: string;
  priceLabel: string;
  regularLabel: string | null;
  bonuses: { name: string; blurb: string }[];
  courseSlug?: string;
};

export default function CheckoutPage() {
  const sp = useSearchParams();
  const courseSlug = sp.get("course");

  const [stripePromise] = useState(() => getStripePromise());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unconfigured" | "error">("loading");

  // Build a presentation-layer "cart" from either the per-course funnel or
  // the legacy intro bundle. Currency display = USD; Stripe charges in SEK
  // at a rough fixed rate (see app/api/checkout/route.ts).
  const cart: CartView = useMemo(() => {
    const course = courseSlug ? courses.find((c) => c.slug === courseSlug) : null;
    if (course) {
      const priceUsd = course.landing?.priceUsd ?? 3900;
      const regUsd = course.landing?.regularPriceUsd ?? 19000;
      const bundle = (course.landing?.bundle ?? [])
        .map((s) => courses.find((c) => c.slug === s))
        .filter((c): c is Course => !!c)
        .map((b) => ({ name: b.title, blurb: b.summary }));
      return {
        title: course.title,
        blurb: course.summary,
        priceLabel: formatPrice(priceUsd, "usd"),
        regularLabel: regUsd > priceUsd ? formatPrice(regUsd, "usd") : null,
        bonuses: bundle,
        courseSlug: course.slug,
      };
    }
    return {
      title: mainOffer.name,
      blurb: mainOffer.blurb,
      priceLabel: formatPrice(100, "usd"), // legacy intro displayed as $1
      regularLabel: formatPrice(3700, "usd"),
      bonuses: bonuses.map((b) => ({ name: b.name, blurb: b.blurb })),
      courseSlug: undefined,
    };
  }, [courseSlug]);

  useEffect(() => {
    fbqTrack("InitiateCheckout", { currency: "USD" });
    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(cart.courseSlug ? { course: cart.courseSlug } : {}),
        });
        const data = await res.json();
        if (data?.notConfigured || !stripePromise) {
          setStatus("unconfigured");
          return;
        }
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    })();
  }, [stripePromise, cart.courseSlug]);

  const monthly = formatPrice(membershipMonthlyPrice("usd"), "usd");

  return (
    <main className="min-h-screen bg-gradient-to-b from-blush/50 to-cream">
      <div className="container-narrow py-10">
        <Link
          href={cart.courseSlug ? `/courses/${cart.courseSlug}` : "/"}
          className="text-sm font-medium text-rose hover:text-rose-dark"
        >
          ← Back
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Complete your order</h1>
        <p className="mt-1 text-muted">{brand.name} · secure payment via Stripe</p>

        {/* Order summary */}
        <div className="card mt-6 p-6">
          <div className="flex items-start justify-between gap-4 border-b border-blush pb-4">
            <div>
              <p className="font-semibold text-ink">{cart.title}</p>
              <p className="text-sm text-muted">{cart.blurb}</p>
            </div>
            <div className="text-right">
              {cart.regularLabel && (
                <div className="text-sm text-muted line-through">{cart.regularLabel}</div>
              )}
              <div className="font-serif text-xl font-bold text-rose-dark">{cart.priceLabel}</div>
            </div>
          </div>

          {/* Membership trial */}
          <div className="flex items-start justify-between gap-4 border-b border-blush py-4">
            <div>
              <p className="font-semibold text-ink">
                {membership.name} — {membership.trialDays}-day free trial 🎁
              </p>
              <p className="text-sm text-muted">
                Access to {membership.courses}+ courses. Then {monthly}/mo — cancel anytime.
              </p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-rose-dark">Free today</div>
            </div>
          </div>

          {/* Bonuses */}
          {cart.bonuses.length > 0 && (
            <>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
                Free with your purchase
              </p>
              <ul className="mt-2 space-y-1.5">
                {cart.bonuses.map((b) => (
                  <li key={b.name} className="flex items-center justify-between text-sm">
                    <span className="text-ink">🎁 {b.name.split(":")[0]}</span>
                    <span className="text-rose-dark">Free</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-blush pt-4">
            <span className="font-semibold text-ink">Due today</span>
            <span className="font-serif text-2xl font-bold text-rose-dark">{cart.priceLabel}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="card mt-5 p-6">
          {status === "loading" && <p className="text-muted">Preparing secure payment…</p>}

          {status === "unconfigured" && (
            <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">
              Payments aren't configured yet. Add your Stripe keys to{" "}
              <code>.env.local</code> (STRIPE_SECRET_KEY +
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) to test the full flow.
            </p>
          )}

          {status === "error" && (
            <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">
              Something went wrong preparing your payment. Refresh the page and try again.
            </p>
          )}

          {status === "ready" && clientSecret && stripePromise && paymentIntentId && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#B14A6B",
                    colorText: "#2C2024",
                    fontFamily: "system-ui, sans-serif",
                    borderRadius: "10px",
                  },
                },
              }}
            >
              <CheckoutForm paymentIntentId={paymentIntentId} />
            </Elements>
          )}
        </div>
      </div>
    </main>
  );
}
