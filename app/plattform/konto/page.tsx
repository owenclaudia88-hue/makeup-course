import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/access";
import { membership, formatKr, brand } from "@/lib/offer";
import SubscriptionActions from "../../components/SubscriptionActions";

export const dynamic = "force-dynamic";

function svDate(ts?: number): string {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function KontoPage() {
  const session = requireSession();
  const s = await getMembershipStatus(session.email);

  const price = formatKr(membership.monthlyPriceOre);

  return (
    <main className="container-narrow py-10">
      <Link href="/plattform" className="text-sm font-medium text-rose hover:text-rose-dark">
        ← Till kurserna
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Mitt medlemskap</h1>
      <p className="mt-1 text-muted">Inloggad som {session.email}</p>

      <div className="card mt-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-xl font-bold text-ink">{membership.name}</p>
            <p className="text-sm text-muted">
              {price}/månad · tillgång till {membership.courses}+ kurser
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
                ? "Avslutas"
                : s.status === "trialing"
                  ? "Provperiod"
                  : s.status === "active"
                    ? "Aktiv"
                    : s.status === "past_due"
                      ? "Betalning misslyckades"
                      : "Avslutat"}
            </span>
          )}
        </div>

        <div className="mt-5 border-t border-blush pt-5 text-sm">
          {!s.found && (
            <p className="text-muted">Vi hittar inget medlemskap kopplat till din e-post.</p>
          )}

          {s.found && s.status === "trialing" && (
            <>
              <p className="text-2xl font-bold text-rose-dark">
                {s.trialDaysLeft} {s.trialDaysLeft === 1 ? "dag" : "dagar"} kvar av provperioden
              </p>
              {s.cancelAtPeriodEnd ? (
                <p className="mt-2 text-muted">
                  Ditt medlemskap avslutas {svDate(s.trialEnd)} och du kommer inte att debiteras.
                </p>
              ) : (
                <p className="mt-2 text-muted">
                  Provperioden slutar {svDate(s.trialEnd)}. Därefter förnyas medlemskapet till{" "}
                  {price}/månad om du inte avslutar innan dess.
                </p>
              )}
            </>
          )}

          {s.found && s.status === "active" && (
            <>
              {s.cancelAtPeriodEnd ? (
                <p className="text-muted">
                  Ditt medlemskap avslutas {svDate(s.currentPeriodEnd)}. Du har tillgång fram till
                  dess.
                </p>
              ) : (
                <p className="text-muted">
                  Aktivt medlemskap. Nästa betalning {svDate(s.currentPeriodEnd)}: {price}.
                </p>
              )}
            </>
          )}

          {s.found && s.status === "past_due" && (
            <p className="text-rose-dark">
              Senaste betalningen misslyckades. Uppdatera ditt kort för att behålla tillgången, eller
              kontakta {brand.supportEmail}.
            </p>
          )}

          {s.found && !["trialing", "active", "past_due"].includes(s.status || "") && (
            <p className="text-muted">Ditt medlemskap är avslutat.</p>
          )}

          {s.canManage && <SubscriptionActions cancelAtPeriodEnd={!!s.cancelAtPeriodEnd} />}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Du kan avsluta när som helst – inga bindningstider. Frågor? {brand.supportEmail}
      </p>
    </main>
  );
}
