"use client";

import { useEffect, useState } from "react";

export default function PlattformGreeting() {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    setH(new Date().getHours());
  }, []);

  if (h == null) return null; // avoid SSR/CSR text mismatch

  const greet =
    h < 5 ? "Late night"
      : h < 10 ? "Good morning"
        : h < 13 ? "Hi there"
          : h < 18 ? "Good afternoon"
            : "Good evening";

  const tip =
    h < 10 ? "Perfect time for a short morning ritual — 5 minutes is enough."
      : h < 13 ? "Short midday sessions are the ones that actually get done."
        : h < 18 ? "A micro-break right now sets the tone for the rest of the day."
          : "Wind down with something gentle — lymph drainage or a breathing exercise.";

  return (
    <p className="text-sm text-muted">
      <span className="font-semibold text-ink">{greet}.</span> {tip}
    </p>
  );
}
