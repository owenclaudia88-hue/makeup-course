import { type Currency } from "./currency";

export const CURRENCY_COOKIE = "luumora_currency";

/**
 * USD-only for now. The multi-currency infra in lib/currency.ts + the price
 * maps in lib/offer.ts are kept so we can flip on geo-detection + a switcher
 * again later — but until Stripe Prices exist in other currencies, charging
 * mismatches display. Cheaper to ship USD-only.
 */
export function getCurrentCurrency(): Currency {
  return "usd";
}
