import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/access";

export const runtime = "nodejs";

/**
 * Cancels the logged-in member's subscription at period end (they keep access
 * until the current period/trial ends — and during a trial this means no charge).
 * The subscription is resolved from the SESSION, never trusted from the client,
 * so a member can only cancel their own membership.
 */
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
    await stripe.subscriptions.update(status.subscriptionId, { cancel_at_period_end: true });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[subscription/cancel]", e?.message || e);
    return NextResponse.json({ error: "Kunde inte avsluta medlemskapet." }, { status: 500 });
  }
}
