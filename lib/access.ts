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
