import Link from "next/link";
import { getSession } from "@/lib/auth";
import { brand } from "@/lib/offer";

export const dynamic = "force-dynamic";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-blush bg-white/90 backdrop-blur">
        <div className="container-tight flex items-center justify-between py-3">
          <Link href="/plattform" className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-rose-dark">{brand.name}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Akademi
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {session ? (
              <>
                <span className="hidden text-muted sm:inline">{session.email}</span>
                <a href="/api/auth/logout" className="font-semibold text-rose hover:text-rose-dark">
                  Logga ut
                </a>
              </>
            ) : (
              <Link href="/plattform/logga-in" className="font-semibold text-rose hover:text-rose-dark">
                Logga in
              </Link>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
