import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { ensureMembershipSubscription } from "@/lib/membership";
import { signToken } from "@/lib/download";
import { productById, formatKr, brand, membership } from "@/lib/offer";
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
  let productIds: string[] = [];
  let amount = 0;
  let email = "";
  let membershipStarted = false;

  if (stripe && piId) {
    try {
      const pi = await stripe.paymentIntents.retrieve(piId, { expand: ["payment_method"] });
      paid = pi.status === "succeeded";
      amount = pi.amount ?? 0;
      const pm = pi.payment_method;
      email =
        pi.receipt_email ||
        (typeof pm === "object" && pm?.billing_details?.email) ||
        "";
      productIds = (pi.metadata?.productIds ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (paid) {
        // Enrol the trialing membership (idempotent — safe on refresh).
        const subId = await ensureMembershipSubscription(stripe, pi, email);
        membershipStarted = !!subId;
      }
    } catch {
      paid = false;
    }
  }

  const products = productIds
    .map(productById)
    .filter(Boolean) as NonNullable<ReturnType<typeof productById>>[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush/50 to-cream px-5 py-16">
      {paid && <PurchaseEvent value={amount / 100} id={productIds[0] || "makeup40"} />}

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

            <div className="mt-7 space-y-3 text-left">
              {products.map((p) => (
                <a
                  key={p!.id}
                  href={`/api/download?pi=${encodeURIComponent(piId!)}&token=${encodeURIComponent(
                    signToken(piId!, p!.id)
                  )}`}
                  className="flex items-center justify-between rounded-xl border border-blush bg-white p-4 transition hover:border-rose"
                >
                  <span className="font-medium text-ink">{p!.name}</span>
                  <span className="font-semibold text-rose">Ladda ner ↓</span>
                </a>
              ))}
            </div>

            {membershipStarted && (
              <div className="mt-4 rounded-xl border border-rose/30 bg-rose/5 p-4 text-left">
                <p className="font-semibold text-ink">
                  🎁 {membership.name} – provperiod aktiv
                </p>
                <p className="mt-1 text-sm text-muted">
                  Din {membership.trialDays} dagars provtillgång till {membership.courses}+ kurser har
                  startat. Därefter {formatKr(membership.monthlyPriceOre)}/mån tills du avslutar –
                  avsluta när som helst.
                </p>
                <a
                  href={membership.platformUrl}
                  className="mt-3 inline-block font-semibold text-rose hover:text-rose-dark"
                >
                  Gå till plattformen →
                </a>
              </div>
            )}

            <p className="mt-6 text-sm text-muted">
              Spara den här sidan – nedladdningslänkarna fungerar så länge ditt köp är giltigt.
              Frågor? Mejla {brand.supportEmail}.
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
