"use client";

import { useEffect, useRef } from "react";
import { fbqTrack } from "./MetaPixel";

/** Fires the Meta Purchase event once when the thank-you page mounts. */
export default function PurchaseEvent({ value, id }: { value: number; id: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fbqTrack("Purchase", { currency: "SEK", value, content_ids: [id] });
  }, [value, id]);
  return null;
}
