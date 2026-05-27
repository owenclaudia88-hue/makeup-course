import { NextResponse } from "next/server";
import { getStripe, baseUrl } from "@/lib/stripe";
import { mainOffer, productById, CURRENCY, type Product } from "@/lib/offer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    // No keys yet — let the UI show a friendly message instead of 500.
    return NextResponse.json(
      { notConfigured: true, error: "Stripe är inte konfigurerat (saknar STRIPE_SECRET_KEY)." },
      { status: 200 }
    );
  }

  let selectedUpsells: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.upsells)) selectedUpsells = body.upsells.map(String);
  } catch {
    // no body / bad body -> just the main offer
  }

  // Always include the main offer; add any valid upsell add-ons.
  const products: Product[] = [mainOffer];
  for (const id of selectedUpsells) {
    const p = productById(id);
    if (p && p.id !== mainOffer.id && !products.includes(p)) products.push(p);
  }

  const line_items = products.map((p) => ({
    quantity: 1,
    price_data: {
      currency: CURRENCY,
      unit_amount: p.priceOre,
      product_data: { name: p.name, description: p.blurb },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "sv",
      line_items,
      metadata: { productIds: products.map((p) => p.id).join(",") },
      success_url: `${baseUrl()}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/kassa`,
      // Digital goods: collect email for receipt + delivery.
      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout] stripe error:", e?.message || e);
    return NextResponse.json({ error: "Kunde inte starta betalningen." }, { status: 500 });
  }
}
