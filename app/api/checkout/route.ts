import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { mainOffer, deliveredProductIds, CURRENCY } from "@/lib/offer";

export const runtime = "nodejs";

/**
 * Creates the on-domain checkout intent:
 *  - a Customer
 *  - a PaymentIntent for the 10 kr one-time course charge, with the card saved
 *    (setup_future_usage) so the trialing membership subscription can bill it
 *    on day 3.
 * Returns the client secret for the Payment Element. No Stripe dashboard setup
 * is needed — everything is created over the API.
 */
export async function POST() {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { notConfigured: true, error: "Stripe är inte konfigurerat (saknar STRIPE_SECRET_KEY)." },
      { status: 200 }
    );
  }

  try {
    const customer = await stripe.customers.create();

    const pi = await stripe.paymentIntents.create({
      amount: mainOffer.priceOre,
      currency: CURRENCY,
      customer: customer.id,
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
      description: mainOffer.name,
      metadata: {
        flow: "lumora-kassa",
        productIds: deliveredProductIds.join(","),
        membership: "1",
      },
    });

    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (e: any) {
    console.error("[checkout] intent error:", e?.message || e);
    return NextResponse.json({ error: "Kunde inte förbereda betalningen." }, { status: 500 });
  }
}
