// ---------------------------------------------------------------------------
// Single source of truth for branding, products and pricing.
// Amounts in legacy fields (priceOre / monthlyPriceOre) are in öre (1 kr = 100
// öre). Multi-currency amounts in `prices` / `monthlyPrices` are in the
// SMALLEST unit of each currency (cents, pence, öre).
//
// Stripe note: Stripe Prices are still SEK-only. To actually CHARGE in another
// currency you must create matching Prices in Stripe + add the Price IDs here
// in a `stripePriceIds: Partial<Record<Currency, string>>` field. Until then,
// the multi-currency amounts are display-only; checkout falls back to SEK.
// ---------------------------------------------------------------------------

import type { Currency } from "./currency";

export const CURRENCY = "sek";

export const brand = {
  name: "Luumora",
  // Rename in this one place to rebrand the whole site.
  tagline: "Daily rituals for a glowing life",
  supportEmail: "support@luumora.online",
};

export type Product = {
  id: string;
  name: string;
  blurb: string;
  priceOre: number; // legacy SEK; still used by Stripe checkout
  // The struck-through "regular" price. Set this to the price you genuinely
  // intend to sell at later — don't invent a fake anchor.
  regularPriceOre?: number;
  // File served (gated) after a paid purchase. Lives in /protected, never /public.
  file: string;
  // Multi-currency display prices (smallest unit per currency).
  prices?: Partial<Record<Currency, number>>;
  regularPrices?: Partial<Record<Currency, number>>;
};

export const mainOffer: Product = {
  id: "makeup40",
  name: "10-Minute Makeup 40+ — The Masterclass",
  blurb:
    "The complete pro guide to looking younger, fresher, and more confident in 10 minutes. 9 in-depth lessons, pro tips, do's & don'ts, and checklists.",
  priceOre: 1000, // 10 kr
  regularPriceOre: 39700, // 397 kr
  file: "10MinMakeup40_Masterkurs_Svenska.pdf",
  prices: { usd: 100, eur: 100, gbp: 100, sek: 1000 },
  regularPrices: { usd: 3700, eur: 3400, gbp: 3000, sek: 39700 },
};

// Free bonuses that come bundled with the main offer (priceOre = 0). The
// regularPriceOre is the stated "värde" shown struck-through next to "0 kr".
export const bonuses: Product[] = [
  {
    id: "face-sculpt",
    name: "Face Sculpt: Daily ritual for a younger face",
    blurb: "5-minute daily ritual that naturally lifts and defines your face.",
    priceOre: 0,
    regularPriceOre: 19700,
    file: "FaceSculpt_AlltIEtt_Svenska.pdf",
    prices: { usd: 0, eur: 0, gbp: 0, sek: 0 },
    regularPrices: { usd: 1900, eur: 1700, gbp: 1500, sek: 19700 },
  },
  {
    id: "lymph-detox",
    name: "21-Day Lymph Detox: Slimmer face & body",
    blurb: "Simple daily lymph massage to reduce puffiness and sharpen your jawline.",
    priceOre: 0,
    regularPriceOre: 24700,
    file: "21Dagars_LymfDetox_Svenska.pdf",
    prices: { usd: 0, eur: 0, gbp: 0, sek: 0 },
    regularPrices: { usd: 2400, eur: 2200, gbp: 1900, sek: 24700 },
  },
  {
    id: "face-lifting",
    name: "Face Lifting: Sculpt your face & look younger",
    blurb: "Lifting techniques for forehead, cheeks, and jaw — without needles.",
    priceOre: 0,
    regularPriceOre: 19700,
    file: "Ansiktslyft_SkulpteraDittAnsikte_Svenska.pdf",
    prices: { usd: 0, eur: 0, gbp: 0, sek: 0 },
    regularPrices: { usd: 1900, eur: 1700, gbp: 1500, sek: 19700 },
  },
];

// The Luumora Membership — a real subscription with a disclosed 3-day trial.
// Presented as a bonus, but its renewal terms must always be shown clearly
// (price + interval + cancel) next to a consent checkbox before payment.
export const membership = {
  id: "lumora-membership",
  name: "Luumora Academy Membership",
  monthlyPriceOre: 40700, // 407 kr/mo (legacy; still used by Stripe checkout)
  monthlyPrices: {
    usd: 3900, // $39/mo
    eur: 3500, // €35/mo
    gbp: 3000, // £30/mo
    sek: 40700,
  } satisfies Partial<Record<Currency, number>>,
  trialDays: 3,
  courses: 206,
  // Stripe Price is created once via the API using this lookup_key, then reused.
  lookupKey: "lumora_membership_monthly_sek",
  // Where members are sent to access the platform.
  platformUrl: process.env.NEXT_PUBLIC_LUMORA_PLATFORM_URL || "/platform/login",
};

/** Display price in the active currency (falls back to priceOre treated as SEK). */
export function priceFor(p: Product, currency: Currency): number {
  return p.prices?.[currency] ?? (currency === "sek" ? p.priceOre : p.priceOre);
}

/** Display regular price in the active currency, or undefined if not set. */
export function regularPriceFor(
  p: Product,
  currency: Currency,
): number | undefined {
  return p.regularPrices?.[currency] ?? p.regularPriceOre;
}

/** Membership monthly price in the active currency. */
export function membershipMonthlyPrice(currency: Currency): number {
  return membership.monthlyPrices[currency] ?? membership.monthlyPriceOre;
}

export const allProducts: Product[] = [mainOffer, ...bonuses];

// Everything the buyer gets access to after paying (main + all free bonuses).
export const deliveredProductIds: string[] = allProducts.map((p) => p.id);

export function productById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

/** Format öre as Swedish kr, e.g. 1000 -> "10 kr", 103800 -> "1 038 kr". */
export function formatKr(ore: number): string {
  const kr = ore / 100;
  const str = Number.isInteger(kr)
    ? kr.toLocaleString("sv-SE")
    : kr.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${str} kr`;
}

/** Discount percentage of the main offer vs its regular price. */
export function mainDiscountPct(): number {
  if (!mainOffer.regularPriceOre) return 0;
  return Math.round((1 - mainOffer.priceOre / mainOffer.regularPriceOre) * 100);
}

/** Total stated value of everything in the offer (course + all bonuses). */
export function totalStackValueOre(): number {
  return allProducts.reduce((sum, p) => sum + (p.regularPriceOre ?? p.priceOre), 0);
}
