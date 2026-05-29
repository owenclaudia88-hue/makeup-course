import { getStripe } from "@/lib/stripe";

/**
 * Checks whether an email has a paying (active/trialing/past_due) Luumora
 * membership in Stripe. Used to gate platform signup + login so only members
 * who actually have a subscription can get in.
 */
export async function findActiveSubscription(
  email: string
): Promise<{ active: boolean; customerId?: string }> {
  const stripe = getStripe();
  if (!stripe) return { active: false };

  const customers = await stripe.customers.list({ email: email.trim().toLowerCase(), limit: 5 });
  const grace = ["active", "trialing", "past_due"];

  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
    if (subs.data.some((s) => grace.includes(s.status))) {
      return { active: true, customerId: customer.id };
    }
  }
  return { active: false, customerId: customers.data[0]?.id };
}

/** True if the email currently has a live (active/trialing/past_due) membership. */
export async function hasActiveMembership(email: string): Promise<boolean> {
  return (await findActiveSubscription(email)).active;
}

export type MembershipStatus = {
  found: boolean;
  status?: string; // trialing | active | past_due | canceled | ...
  trialDaysLeft?: number;
  trialEnd?: number; // unix seconds
  currentPeriodEnd?: number; // unix seconds
  cancelAtPeriodEnd?: boolean;
  subscriptionId?: string;
  canManage?: boolean; // true if it makes sense to show cancel/reactivate
};

/** Full membership status for the account page, by email. */
export async function getMembershipStatus(email: string): Promise<MembershipStatus> {
  const stripe = getStripe();
  if (!stripe) return { found: false };

  const customers = await stripe.customers.list({ email: email.trim().toLowerCase(), limit: 5 });
  const live = ["trialing", "active", "past_due"];

  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
    const sub = subs.data.find((s) => live.includes(s.status)) || subs.data[0];
    if (!sub) continue;

    const now = Math.floor(Date.now() / 1000);
    const trialDaysLeft =
      sub.status === "trialing" && sub.trial_end
        ? Math.max(0, Math.ceil((sub.trial_end - now) / 86400))
        : 0;

    return {
      found: true,
      status: sub.status,
      trialDaysLeft,
      trialEnd: sub.trial_end ?? undefined,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      subscriptionId: sub.id,
      canManage: live.includes(sub.status),
    };
  }
  return { found: false };
}
