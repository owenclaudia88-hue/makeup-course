"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { mainOffer, membership, formatKr } from "@/lib/offer";

export default function CheckoutForm({ paymentIntentId }: { paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) return;
    if (!consent) {
      setError("Du behöver godkänna villkoren för medlemskapet för att fortsätta.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ange en giltig e-postadress så vi kan skicka kursen.");
      return;
    }

    setLoading(true);

    // Validate the Payment Element, then attach the email server-side.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Kontrollera kortuppgifterna.");
      setLoading(false);
      return;
    }
    await fetch("/api/checkout/details", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentIntentId, email }),
    }).catch(() => {});

    const returnUrl = `${window.location.origin}/tack?payment_intent=${encodeURIComponent(
      paymentIntentId
    )}`;

    const { error: payError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (payError) {
      setError(payError.message || "Betalningen kunde inte genomföras.");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      window.location.href = returnUrl;
      return;
    }
    // Otherwise Stripe handled a redirect to return_url already.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">E-post</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@email.se"
          className="w-full rounded-lg border border-blush bg-white px-3 py-2.5 text-ink outline-none focus:border-rose"
        />
      </div>

      <div className="rounded-lg border border-blush bg-white p-3">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-cream p-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-rose"
        />
        <span>
          Jag godkänner att jag betalar <strong>{formatKr(mainOffer.priceOre)}</strong> idag för
          kursen och samtidigt startar en <strong>{membership.trialDays} dagars provtillgång</strong>{" "}
          till {membership.name}. Efter provperioden förnyas medlemskapet automatiskt till{" "}
          <strong>{formatKr(membership.monthlyPriceOre)}/månad</strong> tills jag avslutar. Jag kan
          avsluta när som helst.
        </span>
      </label>

      {error && <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">{error}</p>}

      <button type="submit" disabled={!stripe || loading} className="btn-primary-lg disabled:opacity-60">
        {loading ? "Behandlar…" : `Betala ${formatKr(mainOffer.priceOre)} →`}
      </button>
      <p className="text-center text-sm text-muted">
        🔒 Säker betalning · provperioden kan avslutas när som helst
      </p>
    </form>
  );
}
