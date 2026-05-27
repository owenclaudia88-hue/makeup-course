import Stripe from "stripe";
import { CURRENCY, membership } from "@/lib/offer";

let cached: Stripe | null = null;

/**
 * Returns a configured Stripe client, or null if no secret key is set.
 * Returning null lets the UI show a friendly "betalning ej konfigurerad än"
 * state during local development instead of crashing.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Stripe(key, { apiVersion: "2024-06-20" });
  return cached;
}

export function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Returns the Stripe Price id for the Lumora Membership, creating the Product
 * and recurring Price on first use (keyed by lookup_key so it's reused, never
 * duplicated). No Stripe dashboard setup required — just the secret key.
 */
export async function getOrCreateMembershipPrice(stripe: Stripe): Promise<string> {
  const found = await stripe.prices.list({
    lookup_keys: [membership.lookupKey],
    active: true,
    limit: 1,
  });
  if (found.data[0]) return found.data[0].id;

  const product = await stripe.products.create({
    name: membership.name,
    description: `Medlemskap – tillgång till ${membership.courses}+ kurser`,
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: CURRENCY,
    unit_amount: membership.monthlyPriceOre,
    recurring: { interval: "month" },
    lookup_key: membership.lookupKey,
  });
  return price.id;
}
