import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { mainOffer, deliveredProductIds, CURRENCY } from "@/lib/offer";
import { getCourse } from "@/lib/courses";

export const runtime = "nodejs";

// Rough USD → SEK conversion used until we add real multi-currency Stripe
// Prices. The user opted out of maintaining separate Prices per currency, so
// landing pages display USD and Stripe charges the equivalent in SEK. Adjust
// as the FX rate drifts.
const USD_TO_SEK = 10.65;
function usdCentsToOre(cents: number): number {
  return Math.round(cents * USD_TO_SEK);
}

/**
 * Creates the on-domain checkout PaymentIntent.
 *
 * Two flows share one route:
 *   1. Legacy intro bundle (no `course` in body) — buys mainOffer + the
 *      bonus stack at mainOffer.priceOre.
 *   2. Per-course purchase (`course: "<slug>"` in body) — buys a single
 *      course at its landing price; after success the buyer is granted
 *      lifetime ownership of that slug + any slugs in landing.bundle.
 *
 * Either way the card is saved (setup_future_usage) so the trialing
 * membership subscription can bill it on day 3.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { notConfigured: true, error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 200 },
    );
  }

  const body = await req.json().catch(() => ({})) as { course?: string };
  const course = body.course ? getCourse(body.course) : null;

  // Resolve amount + description + metadata.
  let amountOre: number;
  let description: string;
  let productIdsCsv: string;
  let flow: string;
  let courseSlug: string | undefined;

  if (course) {
    const priceUsd = course.landing?.priceUsd ?? 3900; // default $39
    amountOre = usdCentsToOre(priceUsd);
    description = course.title;
    flow = "course-purchase";
    courseSlug = course.slug;
    productIdsCsv = [course.slug, ...(course.landing?.bundle ?? [])].join(",");
  } else {
    amountOre = mainOffer.priceOre;
    description = mainOffer.name;
    flow = "lumora-kassa";
    productIdsCsv = deliveredProductIds.join(",");
  }

  try {
    const customer = await stripe.customers.create();
    const pi = await stripe.paymentIntents.create({
      amount: amountOre,
      currency: CURRENCY,
      customer: customer.id,
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
      description,
      metadata: {
        flow,
        productIds: productIdsCsv,
        membership: "1",
        ...(courseSlug ? { courseSlug } : {}),
      },
    });
    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (e: any) {
    console.error("[checkout] intent error:", e?.message || e);
    return NextResponse.json({ error: "Could not prepare the payment." }, { status: 500 });
  }
}
