"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, membership } from "@/lib/offer";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from the /thanks link: ?ny=1 opens signup, &email= fills the address.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("ny")) setMode("signup");
    const e = q.get("email");
    if (e) setEmail(e);
  }, []);

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
        router.push("/platform");
        router.refresh();
        return;
      }
      setError(data.error || "Something went wrong. Try again.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-serif text-2xl font-bold text-ink">
          {mode === "login" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "login"
            ? `Welcome back to ${brand.name} Academy.`
            : "Use the same email you paid with — your courses are waiting."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-blush px-3 py-2.5 outline-none focus:border-rose"
          />
          <input
            type="password"
            required
            placeholder="Password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-blush px-3 py-2.5 outline-none focus:border-rose"
          />
          {error && <p className="rounded-lg bg-rose/10 p-3 text-sm text-rose-dark">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary-lg disabled:opacity-60">
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="mt-4 text-sm font-medium text-rose hover:text-rose-dark"
        >
          {mode === "login" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>

        <p className="mt-6 border-t border-blush pt-4 text-xs text-muted">
          {membership.name} — 3-day free trial, then cancel anytime.{" "}
          <Link href="/" className="text-rose hover:text-rose-dark">
            Not a member yet?
          </Link>
        </p>
      </div>
    </main>
  );
}
