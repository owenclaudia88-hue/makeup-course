import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/access";
import { membership, brand, membershipMonthlyPrice } from "@/lib/offer";
import { getCurrentCurrency } from "@/lib/currencyServer";
import { formatPrice } from "@/lib/currency";
import SubscriptionActions from "../../components/SubscriptionActions";

export const dynamic = "force-dynamic";

function fmtDate(ts?: number): string {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const session = requireSession();
  const s = await getMembershipStatus(session.email);
  const currency = getCurrentCurrency();
  const price = formatPrice(membershipMonthlyPrice(currency), currency);

  return (
    <main className="container-narrow py-10">
      <Link href="/platform" className="text-sm font-medium text-rose hover:text-rose-dark">
        ← Back to library
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink">My membership</h1>
      <p className="mt-1 text-muted">Signed in as {session.email}</p>

      <div className="card mt-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-xl font-bold text-ink">{membership.name}</p>
            <p className="text-sm text-muted">
              {price}/mo · access to {membership.courses}+ courses
            </p>
          </div>
          {s.found && s.status && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                s.cancelAtPeriodEnd
                  ? "bg-ink/10 text-ink"
                  : s.status === "trialing"
                    ? "bg-gold/20 text-gold"
                    : s.status === "active"
                      ? "bg-rose/15 text-rose-dark"
                      : "bg-rose/10 text-rose-dark"
              }`}
            >
              {s.cancelAtPeriodEnd
                ? "Ending"
                : s.status === "trialing"
                  ? "Free trial"
                  : s.status === "active"
                    ? "Active"
                    : s.status === "past_due"
                      ? "Payment failed"
                      : "Canceled"}
            </span>
          )}
        </div>

        <div className="mt-5 border-t border-blush pt-5 text-sm">
          {!s.found && (
            <p className="text-muted">
              We can't find a membership tied to this email.
            </p>
          )}

          {s.found && s.status === "trialing" && (
            <>
              <p className="text-2xl font-bold text-rose-dark">
                {s.trialDaysLeft} {s.trialDaysLeft === 1 ? "day" : "days"} left of your free trial
              </p>
              {s.cancelAtPeriodEnd ? (
                <p className="mt-2 text-muted">
                  Your trial ends {fmtDate(s.trialEnd)} and you won't be charged.
                </p>
              ) : (
                <p className="mt-2 text-muted">
                  Your trial ends {fmtDate(s.trialEnd)}. After that your membership renews at{" "}
                  {price}/month unless you cancel first.
                </p>
              )}
            </>
          )}

          {s.found && s.status === "active" && (
            <>
              {s.cancelAtPeriodEnd ? (
                <p className="text-muted">
                  Your membership ends {fmtDate(s.currentPeriodEnd)}. You have access until then.
                </p>
              ) : (
                <p className="text-muted">
                  Active membership. Next payment {fmtDate(s.currentPeriodEnd)}: {price}.
                </p>
              )}
            </>
          )}

          {s.found && s.status === "past_due" && (
            <p className="text-rose-dark">
              Your last payment failed. Update your card to keep your access, or contact us at{" "}
              {brand.supportEmail}.
            </p>
          )}

          {s.found && !["trialing", "active", "past_due"].includes(s.status || "") && (
            <p className="text-muted">Your membership is canceled.</p>
          )}

          {s.canManage && <SubscriptionActions cancelAtPeriodEnd={!!s.cancelAtPeriodEnd} />}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Cancel anytime — no commitments. Questions? {brand.supportEmail}
      </p>
    </main>
  );
}
