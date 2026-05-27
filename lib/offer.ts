// ---------------------------------------------------------------------------
// Single source of truth for branding, products and pricing.
// All Stripe amounts are in öre (1 kr = 100 öre), SEK currency.
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
  // Regular price shown as the "ordinarie pris". Set this to a price you
  // genuinely intend to sell at outside the launch — do not invent a fake anchor.
  regularPriceOre?: number;
  // File served (gated) after a paid purchase. Lives in /protected, never in /public.
  file: string;
};

export const mainOffer: Product = {
  id: "makeup40",
  name: "10 Min Makeup 40+ – Mästarkursen",
  blurb:
    "Hela proffsguiden till att se yngre, fräschare och mer självsäker ut på 10 minuter. 9 djupgående lektioner, proffstips, do's & don'ts och checklistor.",
  priceOre: 2000, // 20 kr
  regularPriceOre: 39700, // 397 kr — sätt till ert verkliga ordinarie pris
  file: "10MinMakeup40_MasterCourse.pdf",
};

// Cheap one-click add-ons (order bumps). ~5 kr each.
export const upsells: Product[] = [
  {
    id: "face-sculpt",
    name: "Face Sculpt: Ansiktsritual för ett yngre ansikte",
    blurb: "Daglig 5-minutersritual som lyfter och definierar ansiktet naturligt.",
    priceOre: 500, // 5 kr
    file: "FaceSculpt_Ritual.pdf",
  },
  {
    id: "lymph-detox",
    name: "21-dagars Lymfdetox: Smalare ansikte & kropp",
    blurb: "Enkel daglig lymfmassage för mindre svullnad och en skarpare käklinje.",
    priceOre: 500,
    file: "LymphDetox_21Day.pdf",
  },
  {
    id: "face-lifting",
    name: "Face Lifting: Forma ansiktet & se yngre ut",
    blurb: "Lyftande tekniker för panna, kinder och käke – helt utan nålar.",
    priceOre: 500,
    file: "FaceLifting_Guide.pdf",
  },
];

export const allProducts: Product[] = [mainOffer, ...upsells];

export function productById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

/** Format öre as Swedish kr, e.g. 2000 -> "20 kr", 39700 -> "397 kr". */
export function formatKr(ore: number): string {
  const kr = ore / 100;
  const str = Number.isInteger(kr) ? String(kr) : kr.toFixed(2).replace(".", ",");
  return `${str} kr`;
}

/** Discount percentage of the main offer vs its regular price. */
export function mainDiscountPct(): number {
  if (!mainOffer.regularPriceOre) return 0;
  return Math.round((1 - mainOffer.priceOre / mainOffer.regularPriceOre) * 100);
}
