import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/access";

export const runtime = "nodejs";

/** Undoes a scheduled cancellation for the logged-in member's subscription. */
export async function POST() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Inte konfigurerat." }, { status: 503 });

  const status = await getMembershipStatus(session.email);
  if (!status.found || !status.subscriptionId) {
    return NextResponse.json({ error: "Inget medlemskap hittades." }, { status: 404 });
  }

  try {
    await stripe.subscriptions.update(status.subscriptionId, { cancel_at_period_end: false });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[subscription/reactivate]", e?.message || e);
    return NextResponse.json({ error: "Kunde inte återaktivera medlemskapet." }, { status: 500 });
  }
}
