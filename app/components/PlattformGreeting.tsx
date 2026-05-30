"use client";

import { useEffect, useState } from "react";

export default function PlattformGreeting() {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    setH(new Date().getHours());
  }, []);

  if (h == null) return null; // avoid SSR/CSR text mismatch

  const greet =
    h < 5 ? "Trevlig kväll"
      : h < 10 ? "God morgon"
        : h < 13 ? "Hej"
          : h < 18 ? "God eftermiddag"
            : "God kväll";

  const tip =
    h < 10 ? "Perfekt tid för en kort morgonrutin – 5 minuter räcker."
      : h < 13 ? "Korta pass mitt på dagen blir ofta de mest gjorda."
        : h < 18 ? "En mikropaus nu sätter tonen för resten av dagen."
          : "Avsluta dagen med något lugnt – lymfdränage eller andning.";

  return (
    <p className="text-sm text-muted">
      <span className="font-semibold text-ink">{greet}.</span> {tip}
    </p>
  );
}
