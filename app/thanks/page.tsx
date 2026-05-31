import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { ensureMembershipSubscription } from "@/lib/membership";
import { formatKr, brand, membership } from "@/lib/offer";
import PurchaseEvent from "../components/PurchaseEvent";

export const dynamic = "force-dynamic";

export default async function TackPage({
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
      }
    } catch {
      paid = false;
    }
  }

  const signupHref = `/plattform/logga-in?ny=1${email ? `&email=${encodeURIComponent(email)}` : ""}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush/50 to-cream px-5 py-16">
      {paid && <PurchaseEvent value={amount / 100} id="makeup40" />}

      <div className="card w-full max-w-lg p-8 text-center">
        {paid ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose text-3xl text-white">
              ✓
            </div>
            <h1 className="mt-5 font-serif text-3xl font-bold text-ink">Tack för ditt köp!</h1>
            <p className="mt-2 text-muted">
              Din betalning på {formatKr(amount)} är klar
              {email ? <> — ett kvitto skickas till {email}.</> : "."}
            </p>

            <div className="mt-6 rounded-xl bg-cream p-4 text-left">
              <p className="font-semibold text-ink">Sista steget: skapa ditt konto</p>
              <p className="mt-1 text-sm text-muted">
                Alla dina kurser finns att titta på direkt i {brand.name} Akademi. Skapa ett konto med{" "}
                {email ? <strong>{email}</strong> : "din e-post"} (samma som vid köpet) så är du inne.
              </p>
            </div>

            <Link href={signupHref} className="btn-primary-lg mt-5">
              Skapa konto & se mina kurser →
            </Link>

            <p className="mt-4 text-sm text-muted">
              Din {membership.trialDays} dagars provtillgång har startat – därefter{" "}
              {formatKr(membership.monthlyPriceOre)}/mån, avsluta när som helst. Frågor?{" "}
              {brand.supportEmail}.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold text-ink">Vi hittar inget köp</h1>
            <p className="mt-3 text-muted">
              {stripe
                ? "Det gick inte att bekräfta din betalning. Har du precis betalat, vänta en stund och uppdatera sidan – eller kontakta oss."
                : "Betalning är inte konfigurerad än (lägg in dina Stripe-nycklar i .env.local för att testa hela flödet)."}
            </p>
            <Link href="/" className="btn-primary mt-6">
              Till startsidan
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
