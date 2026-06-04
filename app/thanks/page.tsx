import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { ensureMembershipSubscription } from "@/lib/membership";
import { formatKr, brand, membership, membershipMonthlyPrice } from "@/lib/offer";
import { getCurrentCurrency } from "@/lib/currencyServer";
import { formatPrice } from "@/lib/currency";
import { grantCourses } from "@/lib/ownership";
import PurchaseEvent from "../components/PurchaseEvent";

export const dynamic = "force-dynamic";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: { payment_intent?: string };
}) {
  const piId = searchParams.payment_intent;
  const stripe = getStripe();

  let paid = false;
  let amount = 0;
  let email = "";

  if (stripe && piId) {
    try {
      const pi = await stripe.paymentIntents.retrieve(piId, { expand: ["payment_method"] });
      paid = pi.status === "succeeded";
      amount = pi.amount ?? 0;
      const pm = pi.payment_method;
      email = pi.receipt_email || (typeof pm === "object" && pm?.billing_details?.email) || "";
      if (paid) {
        await ensureMembershipSubscription(stripe, pi, email);
        // Grant lifetime ownership of every slug the buyer purchased.
        // PaymentIntent metadata.productIds is a CSV of slugs (course +
        // any bundled bonuses) set by /api/checkout.
        const slugsCsv = pi.metadata?.productIds || "";
        const slugs = slugsCsv.split(",").map((s) => s.trim()).filter(Boolean);
        if (email && slugs.length > 0) {
          await grantCourses(email, slugs);
        }
      }
    } catch {
      paid = false;
    }
  }

  const signupHref = `/platform/login?ny=1${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  const currency = getCurrentCurrency();
  const monthly = formatPrice(membershipMonthlyPrice(currency), currency);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush/50 to-cream px-5 py-16">
      {paid && <PurchaseEvent value={amount / 100} id="makeup40" />}

      <div className="card w-full max-w-lg p-8 text-center">
        {paid ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose text-3xl text-white">
              ✓
            </div>
            <h1 className="mt-5 font-serif text-3xl font-bold text-ink">Thanks for your purchase!</h1>
            <p className="mt-2 text-muted">
              Your payment of {formatKr(amount)} is complete
              {email ? <> — a receipt is on its way to {email}.</> : "."}
            </p>

            <div className="mt-6 rounded-xl bg-cream p-4 text-left">
              <p className="font-semibold text-ink">Last step: create your account</p>
              <p className="mt-1 text-sm text-muted">
                Your courses are ready to watch in {brand.name} Academy. Create an account with{" "}
                {email ? <strong>{email}</strong> : "your email"} (the same one you paid with) and
                you're in.
              </p>
            </div>

            <Link href={signupHref} className="btn-primary-lg mt-5">
              Create account & open my courses →
            </Link>

            <p className="mt-4 text-sm text-muted">
              Your {membership.trialDays}-day free trial has started — then {monthly}/mo, cancel
              anytime. Questions? {brand.supportEmail}.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold text-ink">We can't find that purchase</h1>
            <p className="mt-3 text-muted">
              {stripe
                ? "We couldn't confirm your payment. If you just paid, give it a moment and refresh — or reach out to us."
                : "Payments aren't configured yet (add your Stripe keys in .env.local to test the full flow)."}
            </p>
            <Link href="/" className="btn-primary mt-6">
              Back to home
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
