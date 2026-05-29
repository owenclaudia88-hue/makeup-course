"use client";

import { useState } from "react";
import { coverFor } from "@/lib/courses";

/**
 * Course cover image. Shows /kurser/<slug>.jpg when present, otherwise a
 * branded gradient with the title — so the catalog looks good before (and if)
 * the generated images are added.
 */
export default function CourseCover({
  slug,
  title,
  className = "",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-rose via-rose-light to-gold ${className}`}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverFor(slug)}
          alt={title}
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-center">
          <span className="font-serif text-lg font-bold text-white drop-shadow">{title}</span>
        </div>
      )}
    </div>
  );
}
