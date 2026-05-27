// ---------------------------------------------------------------------------
// Single source of truth for branding, products and pricing.
// All amounts are in öre (1 kr = 100 öre), SEK currency.
// Change anything here and the whole funnel updates.
// ---------------------------------------------------------------------------

export const CURRENCY = "sek";

export const brand = {
  name: "Lumora",
  // Rename in this one place to rebrand the whole site.
  tagline: "10 minuters makeup som tar 10 år",
  supportEmail: "support@lumora.se",
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
  name: "10 Min Makeup 40+ – Mästarkursen",
  blurb:
    "Hela proffsguiden till att se yngre, fräschare och mer självsäker ut på 10 minuter. 9 djupgående lektioner, proffstips, do's & don'ts och checklistor.",
  priceOre: 1000, // 10 kr
  regularPriceOre: 39700, // 397 kr — sätt till ert verkliga ordinarie pris
  file: "10MinMakeup40_MasterCourse.pdf",
};

// Free bonuses that come bundled with the main offer (priceOre = 0). The
// regularPriceOre is the stated "värde" shown struck-through next to "0 kr".
export const bonuses: Product[] = [
  {
    id: "face-sculpt",
    name: "Face Sculpt: Ansiktsritual för ett yngre ansikte",
    blurb: "Daglig 5-minutersritual som lyfter och definierar ansiktet naturligt.",
    priceOre: 0,
    regularPriceOre: 19700, // värde 197 kr
    file: "FaceSculpt_Ritual.pdf",
  },
  {
    id: "lymph-detox",
    name: "21-dagars Lymfdetox: Smalare ansikte & kropp",
    blurb: "Enkel daglig lymfmassage för mindre svullnad och en skarpare käklinje.",
    priceOre: 0,
    regularPriceOre: 24700, // värde 247 kr
    file: "LymphDetox_21Day.pdf",
  },
  {
    id: "face-lifting",
    name: "Face Lifting: Forma ansiktet & se yngre ut",
    blurb: "Lyftande tekniker för panna, kinder och käke – helt utan nålar.",
    priceOre: 0,
    regularPriceOre: 19700, // värde 197 kr
    file: "FaceLifting_Guide.pdf",
  },
];

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
