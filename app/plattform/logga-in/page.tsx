"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, membership, formatKr } from "@/lib/offer";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/plattform");
        router.refresh();
        return;
      }
      setError(data.error || "Något gick fel. Försök igen.");
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-serif text-2xl font-bold text-ink">
          {mode === "login" ? "Logga in" : "Skapa konto"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "login"
            ? `Logga in på ${brand.name} Akademi.`
            : "Använd samma e-post som vid köpet för att aktivera ditt medlemskap."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-blush px-3 py-2.5 outline-none focus:border-rose"
          />
          <input
            type="password"
            required
            placeholder="Lösenord (minst 8 tecken)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-blush px-3 py-2.5 outline-none focus:border-rose"
          />
          {error && <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary-lg disabled:opacity-60">
            {loading ? "…" : mode === "login" ? "Logga in" : "Skapa konto"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="mt-4 text-sm font-medium text-rose hover:text-rose-dark"
        >
          {mode === "login" ? "Har du inget konto? Skapa ett" : "Har du redan ett konto? Logga in"}
        </button>

        <p className="mt-6 border-t border-blush pt-4 text-xs text-muted">
          Medlemskap {formatKr(membership.monthlyPriceOre)}/mån.{" "}
          <Link href="/" className="text-rose hover:text-rose-dark">
            Inte medlem än?
          </Link>
        </p>
      </div>
    </main>
  );
}
