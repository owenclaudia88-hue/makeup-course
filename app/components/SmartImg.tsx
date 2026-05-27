"use client";

import { useState } from "react";

/**
 * Renders a real image from /public. If the file isn't there yet, it falls back
 * to a labelled gradient placeholder so the layout never looks broken.
 * Drop your file into /public with the matching name and it appears automatically.
 */
export default function SmartImg({
  src,
  alt,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-blush bg-gradient-to-br from-blush via-cream to-white ${className}`}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center text-sm font-medium text-muted">
          <span className="px-4">📷 {label}</span>
        </div>
      )}
    </div>
  );
}
