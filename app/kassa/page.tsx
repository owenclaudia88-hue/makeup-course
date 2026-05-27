"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { brand, mainOffer, bonuses, membership, formatKr } from "@/lib/offer";
import { getStripePromise } from "@/lib/stripe-client";
import CheckoutForm from "../components/CheckoutForm";
import { fbqTrack } from "../components/MetaPixel";

export default function KassaPage() {
  const [stripePromise] = useState(() => getStripePromise());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unconfigured" | "error">("loading");

  useEffect(() => {
    fbqTrack("InitiateCheckout", { currency: "SEK", value: mainOffer.priceOre / 100 });
    (async () => {
      try {
        const res = await fetch("/api/checkout", { method: "POST" });
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
  }, [stripePromise]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blush/50 to-cream">
      <div className="container-narrow py-10">
        <Link href="/" className="text-sm font-medium text-rose hover:text-rose-dark">
          ← Tillbaka
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Slutför din beställning</h1>
        <p className="mt-1 text-muted">{brand.name} · säker betalning via Stripe</p>

        {/* Order summary */}
        <div className="card mt-6 p-6">
          <div className="flex items-start justify-between gap-4 border-b border-blush pb-4">
            <div>
              <p className="font-semibold text-ink">{mainOffer.name}</p>
              <p className="text-sm text-muted">{mainOffer.blurb}</p>
            </div>
            <div className="text-right">
              {mainOffer.regularPriceOre && (
                <div className="text-sm text-muted line-through">
                  {formatKr(mainOffer.regularPriceOre)}
                </div>
              )}
              <div className="font-serif text-xl font-bold text-rose-dark">
                {formatKr(mainOffer.priceOre)}
              </div>
            </div>
          </div>

          {/* Membership trial */}
          <div className="flex items-start justify-between gap-4 border-b border-blush py-4">
            <div>
              <p className="font-semibold text-ink">
                {membership.name} – {membership.trialDays} dagars provtillgång 🎁
              </p>
              <p className="text-sm text-muted">
                Tillgång till {membership.courses}+ kurser. Därefter {formatKr(membership.monthlyPriceOre)}/mån
                – avsluta när som helst.
              </p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-rose-dark">0 kr idag</div>
            </div>
          </div>

          {/* Free bonuses */}
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Ingår gratis
          </p>
          <ul className="mt-2 space-y-1.5">
            {bonuses.map((b) => (
              <li key={b.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">🎁 {b.name.split(":")[0]}</span>
                <span className="text-rose-dark">0 kr</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-blush pt-4">
            <span className="font-semibold text-ink">Att betala idag</span>
            <span className="font-serif text-2xl font-bold text-rose-dark">
              {formatKr(mainOffer.priceOre)}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="card mt-5 p-6">
          {status === "loading" && <p className="text-muted">Förbereder säker betalning…</p>}

          {status === "unconfigured" && (
            <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">
              Betalning är inte konfigurerad än. Lägg in dina Stripe-nycklar i <code>.env.local</code>{" "}
              (STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) för att testa hela flödet.
            </p>
          )}

          {status === "error" && (
            <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">
              Något gick fel när betalningen skulle förberedas. Ladda om sidan och försök igen.
            </p>
          )}

          {status === "ready" && clientSecret && stripePromise && paymentIntentId && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                locale: "sv",
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
