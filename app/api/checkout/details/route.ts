import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Attaches the buyer's email to the PaymentIntent + Customer before confirm,
 *  so receipts and the membership subscription go to the right address. */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ ok: false }, { status: 200 });

  let paymentIntentId = "";
  let email = "";
  try {
    const body = await req.json();
    paymentIntentId = String(body?.paymentIntentId || "");
    email = String(body?.email || "").trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!paymentIntentId || !email) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const pi = await stripe.paymentIntents.update(paymentIntentId, { receipt_email: email });
    const customerId = typeof pi.customer === "string" ? pi.customer : pi.customer?.id;
    if (customerId) await stripe.customers.update(customerId, { email });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[checkout/details]", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
