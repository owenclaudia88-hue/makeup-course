import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { signToken } from "@/lib/download";
import { productById, formatKr, brand } from "@/lib/offer";
import PurchaseEvent from "../components/PurchaseEvent";

export const dynamic = "force-dynamic";

export default async function TackPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const stripe = getStripe();

  let paid = false;
  let productIds: string[] = [];
  let amountTotal = 0;
  let email = "";

  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      amountTotal = session.amount_total ?? 0;
      email = session.customer_details?.email ?? "";
      productIds = (session.metadata?.productIds ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      paid = false;
    }
  }

  const products = productIds.map(productById).filter(Boolean) as NonNullable<
    ReturnType<typeof productById>
  >[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush/50 to-cream px-5 py-16">
      {paid && <PurchaseEvent value={amountTotal / 100} id={productIds[0] || "makeup40"} />}

      <div className="card w-full max-w-lg p-8 text-center">
        {paid ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose text-3xl text-white">
              ✓
            </div>
            <h1 className="mt-5 font-serif text-3xl font-bold text-ink">Tack för ditt köp!</h1>
            <p className="mt-2 text-muted">
              Din betalning på {formatKr(amountTotal)} är klar
              {email ? <> — en kvittokopia skickas till {email}.</> : "."}
            </p>

            <div className="mt-7 space-y-3 text-left">
              {products.map((p) => (
                <a
                  key={p!.id}
                  href={`/api/download?session_id=${encodeURIComponent(
                    sessionId!
                  )}&token=${encodeURIComponent(signToken(sessionId!, p!.id))}`}
                  className="flex items-center justify-between rounded-xl border border-blush bg-white p-4 transition hover:border-rose"
                >
                  <span className="font-medium text-ink">{p!.name}</span>
                  <span className="font-semibold text-rose">Ladda ner ↓</span>
                </a>
              ))}
            </div>

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
                : "Betalning är inte konfigurerad än (lägg in STRIPE_SECRET_KEY i .env.local för att testa hela flödet)."}
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
