import { NextResponse } from "next/server";
import { getRedis, getUser, createUser } from "@/lib/db";
import { hashPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
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

  if (!isEmail(email)) return NextResponse.json({ error: "Ange en giltig e-postadress." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: "Lösenordet måste vara minst 8 tecken." }, { status: 400 });
  }

  if (await getUser(email)) {
    return NextResponse.json(
      { error: "Det finns redan ett konto med den här e-posten – logga in istället." },
      { status: 409 }
    );
  }

  // Gate: must have a paying membership on this email.
  const sub = await findActiveSubscription(email);
  if (!sub.active) {
    return NextResponse.json(
      { error: "Vi hittar inget aktivt medlemskap för den här e-posten. Använd samma e-post som vid köpet." },
      { status: 403 }
    );
  }

  await createUser({
    email,
    passwordHash: hashPassword(password),
    stripeCustomerId: sub.customerId,
    createdAt: Date.now(),
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), cookieOpts);
  return res;
}
