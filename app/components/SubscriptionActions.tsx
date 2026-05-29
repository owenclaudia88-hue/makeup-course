"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionActions({
  cancelAtPeriodEnd,
}: {
  cancelAtPeriodEnd: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(path: string, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.refresh();
      } else {
        setError(data.error || "Något gick fel.");
      }
    } catch {
      setError("Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      {cancelAtPeriodEnd ? (
        <button
          disabled={loading}
          onClick={() => call("/api/subscription/reactivate")}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? "…" : "Återaktivera medlemskap"}
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={() =>
            call(
              "/api/subscription/cancel",
              "Är du säker på att du vill avsluta ditt medlemskap? Du behåller tillgången till periodens slut."
            )
          }
          className="rounded-full border border-rose px-6 py-3 font-semibold text-rose transition hover:bg-rose hover:text-white disabled:opacity-60"
        >
          {loading ? "…" : "Avsluta medlemskap"}
        </button>
      )}
      {error && <p className="mt-3 text-sm text-rose-dark">{error}</p>}
    </div>
  );
}
