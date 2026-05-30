// ---------------------------------------------------------------------------
// Single source of truth for branding, products and pricing.
// All amounts are in öre (1 kr = 100 öre), SEK currency.
// Change anything here and the whole funnel updates.
// ---------------------------------------------------------------------------

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
  priceOre: number;
  // The "ordinarie pris" / "värde" shown struck-through. For the main offer it's
  // the regular price; for a free bonus it's its standalone value. Set these to
  // prices you genuinely intend to sell at — don't invent a fake anchor.
  regularPriceOre?: number;
  // File served (gated) after a paid purchase. Lives in /protected, never /public.
  file: string;
};

export const mainOffer: Product = {
  id: "makeup40",
  name: "10-Minute Makeup 40+ — The Masterclass",
  blurb:
    "The complete pro guide to looking younger, fresher, and more confident in 10 minutes. 9 in-depth lessons, pro tips, do's & don'ts, and checklists.",
  priceOre: 1000, // 10 kr
  regularPriceOre: 39700, // 397 kr — set to your real regular price
  file: "10MinMakeup40_Masterkurs_Svenska.pdf",
};

// Free bonuses that come bundled with the main offer (priceOre = 0). The
// regularPriceOre is the stated "värde" shown struck-through next to "0 kr".
export const bonuses: Product[] = [
  {
    id: "face-sculpt",
    name: "Face Sculpt: Daily ritual for a younger face",
    blurb: "5-minute daily ritual that naturally lifts and defines your face.",
    priceOre: 0,
    regularPriceOre: 19700, // listed value 197 kr
    file: "FaceSculpt_AlltIEtt_Svenska.pdf",
  },
  {
    id: "lymph-detox",
    name: "21-Day Lymph Detox: Slimmer face & body",
    blurb: "Simple daily lymph massage to reduce puffiness and sharpen your jawline.",
    priceOre: 0,
    regularPriceOre: 24700, // listed value 247 kr
    file: "21Dagars_LymfDetox_Svenska.pdf",
  },
  {
    id: "face-lifting",
    name: "Face Lifting: Sculpt your face & look younger",
    blurb: "Lifting techniques for forehead, cheeks, and jaw — without needles.",
    priceOre: 0,
    regularPriceOre: 19700, // listed value 197 kr
    file: "Ansiktslyft_SkulpteraDittAnsikte_Svenska.pdf",
  },
];

// The Luumora Membership — a real subscription with a disclosed 3-day trial.
// Presented as a bonus, but its renewal terms must always be shown clearly
// (price + interval + cancel) next to a consent checkbox before payment.
export const membership = {
  id: "lumora-membership",
  name: "Luumora Academy Membership",
  monthlyPriceOre: 40700, // 407 kr/mo
  trialDays: 3,
  courses: 206,
  // Stripe Price is created once via the API using this lookup_key, then reused.
  lookupKey: "lumora_membership_monthly_sek",
  // Where members are sent to access the platform. Defaults to the built-in
  // Luumora Akademi; override with an env var only if you host it elsewhere.
  platformUrl: process.env.NEXT_PUBLIC_LUMORA_PLATFORM_URL || "/plattform/logga-in",
};

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
