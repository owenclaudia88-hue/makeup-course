import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getStripe } from "@/lib/stripe";
import { verifyToken } from "@/lib/download";
import { productById } from "@/lib/offer";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id") || "";
  const token = searchParams.get("token") || "";

  if (!sessionId || !token) {
    return new NextResponse("Saknar parametrar.", { status: 400 });
  }

  // 1) Token must be valid for this session.
  const productId = verifyToken(sessionId, token);
  if (!productId) return new NextResponse("Ogiltig länk.", { status: 403 });

  const product = productById(productId);
  if (!product) return new NextResponse("Okänd produkt.", { status: 404 });

  // 2) The Stripe session must actually be paid and include this product.
  const stripe = getStripe();
  if (!stripe) return new NextResponse("Betalning ej konfigurerad.", { status: 503 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return new NextResponse("Betalning ej genomförd.", { status: 403 });
    }
    const ids = (session.metadata?.productIds ?? "").split(",").map((s) => s.trim());
    if (!ids.includes(productId)) {
      return new NextResponse("Produkten ingår inte i detta köp.", { status: 403 });
    }
  } catch {
    return new NextResponse("Kunde inte verifiera köpet.", { status: 403 });
  }

  // 3) Serve the file from /protected (never web-served directly).
  try {
    const filePath = path.join(process.cwd(), "protected", product.file);
    const data = await readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${product.file}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Filen kunde inte hittas.", { status: 404 });
  }
}
