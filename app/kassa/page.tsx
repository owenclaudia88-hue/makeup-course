"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand, mainOffer, bonuses, formatKr } from "@/lib/offer";
import { fbqTrack } from "../components/MetaPixel";

export default function KassaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fbqTrack("InitiateCheckout", { currency: "SEK", value: mainOffer.priceOre / 100 });
  }, []);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data?.notConfigured) {
        setError(
          "Betalning är inte konfigurerad än. Lägg in STRIPE_SECRET_KEY i .env.local för att testa hela flödet."
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      setError(data?.error || "Något gick fel. Försök igen.");
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blush/50 to-cream">
      <div className="container-narrow py-10">
        <Link href="/" className="text-sm font-medium text-rose hover:text-rose-dark">
          ← Tillbaka
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Slutför din beställning</h1>
        <p className="mt-1 text-muted">{brand.name} · säker betalning via Stripe</p>

        <div className="card mt-6 p-6">
          {/* Main item */}
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

          {/* Included free bonuses */}
          <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">
            Ingår gratis idag
          </p>
          <div className="mt-3 space-y-3">
            {bonuses.map((b) => (
              <div
                key={b.id}
                className="flex items-start gap-3 rounded-xl border border-blush bg-cream/60 p-4"
              >
                <span className="mt-0.5 text-lg">🎁</span>
                <span className="flex-1">
                  <span className="block font-medium text-ink">{b.name}</span>
                  <span className="block text-sm text-muted">{b.blurb}</span>
                </span>
                <span className="text-right">
                  {b.regularPriceOre && (
                    <span className="block text-sm text-muted line-through">
                      {formatKr(b.regularPriceOre)}
                    </span>
                  )}
                  <span className="block font-semibold text-rose-dark">0 kr</span>
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between border-t border-blush pt-4">
            <span className="font-semibold text-ink">Att betala</span>
            <span className="font-serif text-2xl font-bold text-rose-dark">
              {formatKr(mainOffer.priceOre)}
            </span>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">{error}</p>
          )}

          <button onClick={pay} disabled={loading} className="btn-primary-lg mt-5 disabled:opacity-60">
            {loading ? "Förbereder…" : `Betala ${formatKr(mainOffer.priceOre)} →`}
          </button>
          <p className="mt-3 text-center text-sm text-muted">
            🔒 Engångsbetalning · ingen prenumeration · 30 dagars garanti
          </p>
        </div>
      </div>
    </main>
  );
}
