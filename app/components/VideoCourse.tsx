"use client";

import { useState } from "react";

export default function VideoCourse({
  lessons,
}: {
  lessons: { title: string; url: string }[];
}) {
  const [i, setI] = useState(0);
  const current = lessons[i];

  return (
    <div className="mt-6">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          key={current.url}
          src={current.url}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
          title={current.title}
        />
      </div>

      {lessons.length > 1 && (
        <div className="mt-4 space-y-2">
          {lessons.map((l, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                idx === i ? "border-rose bg-rose/5" : "border-blush hover:border-rose"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
                {idx + 1}
              </span>
              <span className="font-medium text-ink">{l.title}</span>
              {idx === i && <span className="ml-auto text-xs font-semibold text-rose">Spelas nu</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
