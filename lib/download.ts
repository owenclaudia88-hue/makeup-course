import crypto from "crypto";

const SECRET = () => process.env.DOWNLOAD_SECRET || "dev-insecure-secret";

/**
 * Signs a short-lived download token tying a Stripe session to a product id.
 * The download route re-verifies the session is actually paid before serving,
 * so this is defence-in-depth, not the only gate.
 */
export function signToken(sessionId: string, productId: string): string {
  const payload = `${sessionId}.${productId}`;
  const sig = crypto.createHmac("sha256", SECRET()).update(payload).digest("hex").slice(0, 32);
  return `${productId}.${sig}`;
}

export function verifyToken(sessionId: string, token: string): string | null {
  const [productId, sig] = token.split(".");
  if (!productId || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SECRET())
    .update(`${sessionId}.${productId}`)
    .digest("hex")
    .slice(0, 32);
  // constant-time compare
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return productId;
}
