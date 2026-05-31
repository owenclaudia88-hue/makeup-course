import Link from "next/link";
import { brand, mainOffer, priceFor, mainDiscountPct } from "@/lib/offer";
import { formatPrice } from "@/lib/currency";
import { getCurrentCurrency } from "@/lib/currencyServer";

export default function Header() {
  const currency = getCurrentCurrency();
  const price = priceFor(mainOffer, currency);

  return (
    <header className="sticky top-0 z-40 border-b border-blush/70 bg-cream/85 backdrop-blur">
      <div className="container-tight flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-rose-dark sm:text-2xl">
            {brand.name}
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-muted sm:inline">
            {brand.tagline}
          </span>
        </Link>
        <Link
          href="/kassa"
          className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-dark sm:px-5"
        >
          Get started · {formatPrice(price, currency)}
          <span className="ml-1 hidden rounded-full bg-white/20 px-2 py-0.5 text-[11px] sm:inline">
            -{mainDiscountPct()}%
          </span>
        </Link>
      </div>
    </header>
  );
}
