import { NextResponse } from "next/server";
import { type Currency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { CURRENCY_COOKIE } from "@/lib/currencyServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { currency?: Currency }
    | null;
  const next = body?.currency;
  if (!next || !SUPPORTED_CURRENCIES.includes(next)) {
    return NextResponse.json({ error: "bad currency" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CURRENCY_COOKIE, next, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });
  return res;
}
