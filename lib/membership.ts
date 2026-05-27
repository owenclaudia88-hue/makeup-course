import type Stripe from "stripe";
import { getOrCreateMembershipPrice } from "@/lib/stripe";
import { membership } from "@/lib/offer";

/**
 * Idempotently enrols the buyer in the trialing Lumora Membership after their
 * 10 kr course payment succeeds. Safe to call more than once for the same
 * PaymentIntent: the idempotency key + the stored subscriptionId prevent
 * creating duplicate subscriptions.
 *
 * The subscription starts with a 3-day trial, then renews monthly at the
 * membership price using the card saved by the PaymentIntent.
 */
export async function ensureMembershipSubscription(
  stripe: Stripe,
  pi: Stripe.PaymentIntent,
  email?: string | null
): Promise<string | null> {
  if (pi.status !== "succeeded") return null;
  if (pi.metadata?.subscriptionId) return pi.metadata.subscriptionId;

  const customerId = typeof pi.customer === "string" ? pi.customer : pi.customer?.id;
  const pmId =
    typeof pi.payment_method === "string" ? pi.payment_method : pi.payment_method?.id;
  if (!customerId || !pmId) return null;

  if (email) {
    try {
      await stripe.customers.update(customerId, { email });
    } catch {
      /* non-fatal */
    }
  }

  const price = await getOrCreateMembershipPrice(stripe);

  const sub = await stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price }],
      trial_period_days: membership.trialDays,
      default_payment_method: pmId,
      metadata: { source: "lumora-kassa", paymentIntentId: pi.id },
    },
    { idempotencyKey: `lumora_sub_${pi.id}` }
  );

  await stripe.paymentIntents.update(pi.id, {
    metadata: { ...pi.metadata, subscriptionId: sub.id },
  });

  return sub.id;
}
