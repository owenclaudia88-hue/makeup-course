import { cookies, headers } from "next/headers";
import {
  type Currency,
  SUPPORTED_CURRENCIES,
  currencyForCountry,
} from "./currency";

export const CURRENCY_COOKIE = "luumora_currency";

/**
 * Resolve the active currency for the current request. Order of preference:
 *   1. user's explicit choice (cookie set by the switcher)
 *   2. Vercel / Cloudflare geo header from edge
 *   3. USD fallback
 *
 * Server-only — uses cookies() / headers() which throw in client components.
 */
export function getCurrentCurrency(): Currency {
  const fromCookie = cookies().get(CURRENCY_COOKIE)?.value as
    | Currency
    | undefined;
  if (fromCookie && SUPPORTED_CURRENCIES.includes(fromCookie)) return fromCookie;

  const h = headers();
  const country =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    h.get("x-country");
  return currencyForCountry(country);
}
