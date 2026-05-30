"use client";

import { useRouter } from "next/navigation";
import {
  type Currency,
  SUPPORTED_CURRENCIES,
  CURRENCY_INFO,
} from "@/lib/currency";

export default function CurrencySwitcher({ value }: { value: Currency }) {
  const router = useRouter();

  async function change(next: Currency) {
    if (next === value) return;
    try {
      await fetch("/api/currency", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currency: next }),
      });
    } catch {}
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={(e) => change(e.target.value as Currency)}
      className="cursor-pointer rounded-full border border-blush bg-white px-2 py-1 text-xs font-medium text-ink hover:border-rose"
      aria-label="Currency"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {CURRENCY_INFO[c].label}
        </option>
      ))}
    </select>
  );
}
