import Stripe from "stripe";

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
