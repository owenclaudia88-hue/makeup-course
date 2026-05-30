/**
 * Currency: display-side multi-currency for the Luumora Academy.
 * Stripe is still SEK-only until Prices are created in other currencies — see
 * docs in lib/offer.ts.
 */

export type Currency = "usd" | "eur" | "gbp" | "sek";

export const SUPPORTED_CURRENCIES: Currency[] = ["usd", "eur", "gbp", "sek"];

export const CURRENCY_INFO: Record<
  Currency,
  { symbol: string; locale: string; label: string }
> = {
  usd: { symbol: "$", locale: "en-US", label: "USD" },
  eur: { symbol: "€", locale: "en-IE", label: "EUR" },
  gbp: { symbol: "£", locale: "en-GB", label: "GBP" },
  sek: { symbol: "kr", locale: "sv-SE", label: "SEK" },
};

const EUROZONE = new Set([
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK",
]);

export function currencyForCountry(
  country: string | undefined | null,
): Currency {
  if (!country) return "usd";
  const c = country.toUpperCase();
  if (c === "SE") return "sek";
  if (c === "GB" || c === "UK") return "gbp";
  if (EUROZONE.has(c)) return "eur";
  return "usd";
}

/**
 * Format an amount in the smallest unit (cents / öre / pence) as a
 * locale-aware price string. Drops decimals when the major-unit value is whole.
 */
export function formatPrice(amount: number, currency: Currency): string {
  const major = amount / 100;
  const info = CURRENCY_INFO[currency];
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: Number.isInteger(major) ? 0 : 2,
  }).format(major);
}
