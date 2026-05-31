import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "luumora_session";
const SESSION_DAYS = 7;

function sessionSecret(): string {
  return process.env.SESSION_SECRET || "dev-insecure-session-secret";
}

// ---- Passwords (Node scrypt, no external dep) ----

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === computed.length && crypto.timingSafeEqual(expected, computed);
}

// ---- Sessions (signed cookie, HMAC) ----

export function createSessionToken(email: string): string {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = Buffer.from(JSON.stringify({ email: email.toLowerCase(), exp })).toString(
    "base64url"
  );
  const sig = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): { email: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof exp !== "number" || Date.now() > exp) return null;
    return { email };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_DAYS * 86_400;

/** Read the current session from cookies (server components / route handlers). */
export function getSession(): { email: string } | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Use in a protected server component: redirects to login if not signed in. */
export function requireSession(): { email: string } {
  const session = getSession();
  if (!session) redirect("/platform/login");
  return session;
}
