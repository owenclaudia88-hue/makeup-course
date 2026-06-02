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
      setError("Please accept the membership terms to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email so we can send your course.");
      return;
    }

    setLoading(true);

    // Attach the email to the PaymentIntent server-side, then confirm.
    await fetch("/api/checkout/details", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentIntentId, email }),
    }).catch(() => {});

    const returnUrl = `${window.location.origin}/thanks?payment_intent=${encodeURIComponent(
      paymentIntentId,
    )}`;

    const { error: payError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (payError) {
      setError(payError.message || "Payment could not be completed.");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      window.location.href = returnUrl;
      return;
    }
    // Otherwise Stripe handled the redirect to return_url already.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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
          I agree to pay <strong>{formatKr(mainOffer.priceOre)}</strong> today for the course and
          start a <strong>{membership.trialDays}-day free trial</strong> of {membership.name}.
          After the trial it renews automatically at{" "}
          <strong>{formatKr(membership.monthlyPriceOre)}/month</strong> until I cancel. I can
          cancel anytime.
        </span>
      </label>

      {error && <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">{error}</p>}

      <button type="submit" disabled={!stripe || loading} className="btn-primary-lg disabled:opacity-60">
        {loading ? "Processing…" : `Pay ${formatKr(mainOffer.priceOre)} →`}
      </button>
      <p className="text-center text-sm text-muted">
        🔒 Secure payment · cancel your trial anytime
      </p>
    </form>
  );
}
