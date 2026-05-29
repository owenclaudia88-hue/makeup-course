import { NextResponse } from "next/server";
import { getRedis, getUser } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function POST(req: Request) {
  if (!getRedis()) {
    return NextResponse.json({ error: "Plattformen är inte konfigurerad än." }, { status: 200 });
  }

  let email = "";
  let password = "";
  try {
    const b = await req.json();
    email = String(b.email || "").trim().toLowerCase();
    password = String(b.password || "");
  } catch {
    return NextResponse.json({ error: "Felaktig förfrågan." }, { status: 400 });
  }

  if (!isEmail(email) || !password) {
    return NextResponse.json({ error: "Fyll i e-post och lösenord." }, { status: 400 });
  }

  const user = await getUser(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Fel e-post eller lösenord." }, { status: 401 });
  }

  // Having an account = they bought the bundle, so they always keep access to
  // their purchased (core) courses. Membership-only courses are gated per page
  // on the live subscription status, so no subscription check here.

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), cookieOpts);
  return res;
}
