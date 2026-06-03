"use client";

import { useState } from "react";
import { coverFor } from "@/lib/courses";

/**
 * Course thumbnail with the category tag + course title rendered ON the image
 * via CSS overlay — same visual style as wellls.com / eduelle.com / newmindstart.com.
 * Falls back to a branded gradient when /kurser/<slug>.png isn't there yet, so
 * cards look intentional even before per-course images are generated.
 *
 * Pass `showOverlay={false}` to render a bare image (e.g. for hero banners
 * where a separate H1 lives below).
 */
export default function CourseCover({
  slug,
  title,
  category,
  showOverlay = true,
  className = "",
}: {
  slug: string;
  title: string;
  category?: string;
  showOverlay?: boolean;
  className?: string;
}) {
  const [imageOk, setImageOk] = useState(true);
  return (
    <div
      className={`group relative overflow-hidden bg-gradient-to-br from-rose via-rose-light to-gold ${className}`}
    >
      {imageOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverFor(slug)}
          alt=""
          onError={() => setImageOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      )}

      {showOverlay && (
        <>
          {/* Dark gradient at the bottom for title legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

          {/* Category badge — top-left */}
          {category && (
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink shadow-sm">
              {category}
            </span>
          )}

          {/* Title overlay — bottom-left */}
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
            <h3 className="font-serif text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg lg:text-xl">
              {title}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
