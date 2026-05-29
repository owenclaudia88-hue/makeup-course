import { NextResponse } from "next/server";
import { getRedis, getUser } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { findActiveSubscription } from "@/lib/access";

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

  // Re-check the membership is still active before letting them back in.
  const sub = await findActiveSubscription(email);
  if (!sub.active) {
    return NextResponse.json(
      { error: "Ditt medlemskap verkar inte vara aktivt längre. Kontakta support om detta är fel." },
      { status: 403 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), cookieOpts);
  return res;
}
