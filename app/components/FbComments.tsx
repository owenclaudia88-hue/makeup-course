// Facebook-style comment testimonials, auto-rolling in a seamless marquee.
//
// ⚠️ PLACEHOLDER / SAMPLE COPY — replace every entry below with REAL customer
// comments (ideally real Facebook comment screenshots) before you run ads.
// Fabricated testimonials presented as real are prohibited under the Swedish
// Marknadsföringslag and the EU Omnibus directive, and are a fast route to a
// pulled ad account and frozen payouts. The structure is ready; just swap the data.

type Comment = {
  name: string;
  initials: string;
  color: string; // tailwind bg-* for the avatar
  text: string;
  time: string;
  likes: number;
};

const comments: Comment[] = [
  {
    name: "Lena Andersson",
    initials: "LA",
    color: "bg-rose",
    text: "Provade rutinen imorse och min man frågade om jag sovit extra länge 😅 Ser så pigg ut!",
    time: "3 d",
    likes: 47,
  },
  {
    name: "Anette Bergström",
    initials: "AB",
    color: "bg-[#4267B2]",
    text: "Den där omvända triangeln under ögonen?? Game changer. Mörka ringarna borta utan att det ser kletigt ut.",
    time: "1 v",
    likes: 112,
  },
  {
    name: "Birgitta Karlsson",
    initials: "BK",
    color: "bg-gold",
    text: "Äntligen någon som förklarar varför mitt foundation lägger sig i rynkorna. Bytte till satin och allt förändrades.",
    time: "5 d",
    likes: 63,
  },
  {
    name: "Marie Nilsson",
    initials: "MN",
    color: "bg-emerald-500",
    text: "20 kr för det här är nästan löjligt billigt. Har betalat hundra gånger mer för sämre kurser.",
    time: "2 d",
    likes: 88,
  },
  {
    name: "Kristina Svensson",
    initials: "KS",
    color: "bg-purple-500",
    text: "Tog mig faktiskt 10 minuter idag. Brukar ta 30 och se sämre ut 🙌",
    time: "6 d",
    likes: 54,
  },
  {
    name: "Susanne Ekström",
    initials: "SE",
    color: "bg-pink-500",
    text: "Brynavsnittet ensamt var värt det. Mjukare bryn = ser direkt yngre ut.",
    time: "1 v",
    likes: 39,
  },
  {
    name: "Camilla Pettersson",
    initials: "CP",
    color: "bg-orange-500",
    text: "Var skeptisk men checklistorna gör det så enkelt att följa. Rekommenderar verkligen!",
    time: "4 d",
    likes: 71,
  },
  {
    name: "Pia Holm",
    initials: "PH",
    color: "bg-teal-500",
    text: "Läpparna ”blödde” alltid ut i linjerna. Liner-tricket fixade det helt. Tack! ❤️",
    time: "2 v",
    likes: 95,
  },
  {
    name: "Eva Lindgren",
    initials: "EL",
    color: "bg-indigo-500",
    text: "Kände mig osäker utan smink innan. Nu ser jag fram emot morgonrutinen. Stor skillnad i självkänslan.",
    time: "3 d",
    likes: 120,
  },
];

function CommentCard({ c }: { c: Comment }) {
  return (
    <article className="w-[320px] shrink-0">
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${c.color}`}
        >
          {c.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-[#f0f2f5] px-3.5 py-2.5 text-left">
            <p className="text-sm font-semibold text-[#050505]">{c.name}</p>
            <p className="mt-0.5 text-sm leading-snug text-[#050505]">{c.text}</p>
          </div>
          <div className="mt-1.5 flex items-center gap-3 pl-1 text-xs font-semibold text-[#65676b]">
            <span className="hover:underline">Gilla</span>
            <span className="hover:underline">Svara</span>
            <span className="font-normal">{c.time}</span>
            <span className="ml-auto inline-flex items-center gap-1">
              <span className="text-[13px]">👍❤️</span>
              <span className="font-normal">{c.likes}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FbComments() {
  // Duplicate the list so translateX(-50%) loops seamlessly.
  const loop = [...comments, ...comments];

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="container-narrow text-center">
        <p className="eyebrow mb-3">Vad kvinnor säger</p>
        <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
          16&nbsp;000+ kvinnor har redan börjat
        </h2>
        <p className="mt-3 text-muted">Det här säger de i kommentarerna.</p>
      </div>

      <div className="group relative mt-10">
        {/* soft fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="flex w-max animate-marquee gap-5 px-5 motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          {loop.map((c, i) => (
            <CommentCard key={i} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
