import { NextResponse } from "next/server";
import { getStripe, baseUrl } from "@/lib/stripe";
import { mainOffer, deliveredProductIds, CURRENCY } from "@/lib/offer";

export const runtime = "nodejs";

export async function POST() {
  const stripe = getStripe();
  if (!stripe) {
    // No keys yet — let the UI show a friendly message instead of 500.
    return NextResponse.json(
      { notConfigured: true, error: "Stripe är inte konfigurerat (saknar STRIPE_SECRET_KEY)." },
      { status: 200 }
    );
  }

  // One paid line item: the 20 kr course. The bonuses are free and bundled —
  // they aren't charged, but every delivered product id is recorded in metadata
  // so the thank-you page unlocks downloads for the course AND the bonuses.
  const line_items = [
    {
      quantity: 1,
      price_data: {
        currency: CURRENCY,
        unit_amount: mainOffer.priceOre,
        product_data: { name: mainOffer.name, description: mainOffer.blurb },
      },
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "sv",
      line_items,
      metadata: { productIds: deliveredProductIds.join(",") },
      success_url: `${baseUrl()}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/kassa`,
      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout] stripe error:", e?.message || e);
    return NextResponse.json({ error: "Kunde inte starta betalningen." }, { status: 500 });
  }
}
