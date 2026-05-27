import Header from "./components/Header";
import CtaButton from "./components/CtaButton";
import Countdown from "./components/Countdown";
import { brand, mainOffer, upsells, formatKr, mainDiscountPct } from "@/lib/offer";

const lessons = [
  {
    n: 1,
    title: "Varför smink åldrar dig",
    desc: "De 5 dolda misstagen som lägger på år – och varför mer produkt nästan alltid gör det värre.",
  },
  {
    n: 2,
    title: "Hudprep: grunden för varje look",
    desc: "2-minutersrutinen med fukt, ögonkräm och primer som får allt annat att sitta i timmar.",
  },
  {
    n: 3,
    title: "Foundation rätt – utan att kaka sig",
    desc: "Rätt formel, rätt verktyg och placeringen som jämnar ut huden istället för att framhäva linjer.",
  },
  {
    n: 4,
    title: "Concealer-mästarklass",
    desc: "Sudda bort mörka ringar och svullnad med rätt nyans och den omvända triangeln – på 60 sekunder.",
  },
  {
    n: 5,
    title: "Eye-lift-effekten",
    desc: "Strategisk eyeliner och skuggplacering som öppnar och lyfter ögat – helt utan tung kantlinje.",
  },
  {
    n: 6,
    title: "Bryn som ramar in & föryngrar",
    desc: "Den snabbaste enskilda förändringen som föryngrar ansiktet. Fyll mjukt, aldrig ritat.",
  },
  {
    n: 7,
    title: "Rouge, bronzer & highlight för 40+",
    desc: "Var moget hud behöver färg och ljus – och var det definitivt inte ska placeras.",
  },
  {
    n: 8,
    title: "Läppar som inte blöder eller plattas till",
    desc: "Liner-tricket, formlerna och volymillusionen som ger fyllighet istället för ålder.",
  },
  {
    n: 9,
    title: "Din kompletta 10-minutersrutin",
    desc: "Allt på plats: verktyg, ordning, timing och finish – steg för steg, minut för minut.",
  },
];

const routine = [
  ["1–2 min", "Prep", "Fukt, ögonkräm, lysande primer. Låt sjunka in medan du dukar fram."],
  ["2–3 min", "Foundation", "Fuktad svamp, tunt lager, tryck utåt från mitten. Andra lagret bara där det behövs."],
  ["3–4 min", "Concealer", "Färgkorrigera vid behov. Omvänd triangel under ögat. Stippla och blanda."],
  ["4–5 min", "Bryn", "Fyll glesa partier med mjuk penna. Sätt uppåt med brynsgel."],
  ["5–6 min", "Ögon", "Varm skugga på locket. Yttre V. Highlight i inre ögonvrån. Liner nära fransraden."],
  ["6–7 min", "Rouge", "Krämrouge på kindernas äpplen, blandad uppåt. Bronzer lätt där solen träffar."],
  ["7–8 min", "Highlight", "Kindben, inre ögonvrår, amorbåge."],
  ["8–9 min", "Läppar", "Ifylld liner. Satinläppstift. En droppe gloss i mitten."],
  ["9–10 min", "Kontroll", "Kolla i dagsljus. Blanda kanter. Transparent puder bara på glansiga zoner."],
];

const reviews = [
  {
    stars: 5,
    text:
      "Jag ser 10 år yngre ut efter det här. Skillnaden bara av under-ögon-tekniken är obegriplig.",
    name: "Kelsey P.",
  },
  {
    stars: 5,
    text:
      "10 Min Makeup gjorde mig sååå självsäker. Jag hade glömt hur det kändes att se sig i spegeln och må bra.",
    name: "Eliza M.",
  },
  {
    stars: 5,
    text:
      "Äntligen smink anpassat efter min hud nu – inte reglerna jag lärde mig som 25. Tar mig faktiskt 10 minuter.",
    name: "Anna L.",
  },
];

const faqs = [
  {
    q: "Hur får jag tillgång till kursen?",
    a: "Direkt efter betalning får du den som nedladdningsbar PDF – på tacksidan och via mejl. Den är din för alltid.",
  },
  {
    q: "Funkar det för min ålder och hudtyp?",
    a: "Hela kursen är byggd för moget hud, 40+. Teknikerna utgår från hur huden faktiskt förändras med åren.",
  },
  {
    q: "Behöver jag köpa dyra produkter?",
    a: "Nej. Det handlar om teknik och placering – principerna fungerar med de produkter du redan har hemma.",
  },
  {
    q: "Vad ingår?",
    a: "9 djupgående lektioner, proffstips, do's & don'ts samt checklistor för varje steg och en komplett 10-minutersrutin.",
  },
  {
    q: "Kan jag få pengarna tillbaka?",
    a: "Ja. Är du inte nöjd inom 30 dagar mejlar du oss så får du pengarna tillbaka – inga krångliga frågor.",
  },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="text-gold" aria-label={`${n} av 5 stjärnor`}>
      {"★".repeat(n)}
    </span>
  );
}

/** Placeholder image box — replace src/labels with real photography later. */
function Photo({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-blush bg-gradient-to-br from-blush via-cream to-white text-center text-sm font-medium text-muted ${className}`}
    >
      <span className="px-4">📷 {label}</span>
    </div>
  );
}

export default function Page() {
  const reg = mainOffer.regularPriceOre ?? 0;

  return (
    <main>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/60 to-cream">
        <div className="container-tight grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <p className="eyebrow mb-4">För kvinnor 40+</p>
            <h1 className="font-serif text-4xl font-bold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              Se 10 år yngre ut <span className="text-rose">— på 10 minuter</span> om dagen
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Den kompletta proffsguiden till en fräschare, ljusare och mer självsäker look. Utan
              dyra produkter och utan timmar framför spegeln.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Stars />
              <span className="text-sm font-medium text-muted">
                Använd av 16&nbsp;000+ kvinnor världen över
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-end gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-lg text-muted line-through">{formatKr(reg)}</span>
                <span className="font-serif text-5xl font-bold text-rose-dark">
                  {formatKr(mainOffer.priceOre)}
                </span>
              </div>
              <span className="rounded-full bg-rose px-3 py-1 text-sm font-bold text-white">
                Spara {mainDiscountPct()}%
              </span>
            </div>

            <div className="mt-6">
              <CtaButton large>Ja, jag vill ha kursen för 20 kr →</CtaButton>
              <p className="mt-3 text-sm text-muted">
                ⏳ Introduktionspriset gäller idag i <Countdown /> · Säker betalning ·
                Direkt nedladdning
              </p>
            </div>
          </div>

          <div className="animate-fade-up">
            <Photo label="Hjältebild: före/efter 40+ look" className="aspect-[4/5] w-full" />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="border-y border-blush bg-white">
        <div className="container-tight grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          {[
            ["16 000+", "kvinnor"],
            ["9", "lektioner"],
            ["10 min", "om dagen"],
            ["4,9 / 5", "i snittbetyg"],
          ].map(([big, small]) => (
            <div key={small}>
              <div className="font-serif text-2xl font-bold text-rose-dark">{big}</div>
              <div className="text-sm text-muted">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">Känner du igen dig?</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Sminket som funkade förr verkar plötsligt jobba emot dig
          </h2>
        </div>
        <div className="container-tight mt-10 grid gap-4 sm:grid-cols-2">
          {[
            "Foundationen lägger sig i fina linjer och ser kletig ut redan efter en timme.",
            "Ögonen ser tröttare och mindre ut – trots att du drar eyeliner.",
            "Ju mer du lägger på för att dölja, desto äldre ser du ut.",
            "Läppstiftet ”blöder” ut i de små linjerna runt munnen.",
          ].map((t) => (
            <div key={t} className="card flex items-start gap-3 p-5">
              <span className="mt-0.5 text-rose">✕</span>
              <p className="text-muted">{t}</p>
            </div>
          ))}
        </div>
        <p className="container-narrow mt-8 text-center text-lg font-medium text-ink">
          Problemet är inte du. Det är att nästan allt vi lärde oss om smink slutar fungera efter
          40 — och ingen berättade vad man ska göra istället.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-tight grid items-center gap-10 lg:grid-cols-2">
          <Photo label="Instruktör / proffs-makeupartist" className="aspect-[4/3] w-full" />
          <div>
            <p className="eyebrow mb-3">Lösningen</p>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              Mindre produkt. Rätt placerad. Med rätt finish.
            </h2>
            <p className="mt-4 text-muted">
              Erfarna makeupartister som jobbar med kvinnor 40+ säger samma sak: korrigeringen är
              nästan alltid att <strong>ta bort</strong>, inte lägga till. {brand.name} samlar exakt
              de teknikerna i en enda kurs – och sätter ihop dem till en rutin du gör på 10 minuter.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Proffstekniker anpassade efter moget hud – inte 20-årsregler",
                "Steg-för-steg, så att du vet exakt vad du ska göra och varför",
                "En repeterbar 10-minutersrutin du kan göra varje morgon",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 font-bold text-rose">✓</span>
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">Det här lär du dig</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            9 lektioner – hela vägen från bar hud till färdig look
          </h2>
        </div>
        <div className="container-tight mt-10 grid gap-4 md:grid-cols-2">
          {lessons.map((l) => (
            <div key={l.n} className="card flex gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose font-serif text-lg font-bold text-white">
                {l.n}
              </div>
              <div>
                <h3 className="font-semibold text-ink">{l.title}</h3>
                <p className="mt-1 text-sm text-muted">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROUTINE TABLE */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">Allt på plats</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Din kompletta 10-minutersrutin
          </h2>
          <p className="mt-3 text-muted">Minut för minut – samma rutin proffsen använder, anpassad för dig.</p>
        </div>
        <div className="container-tight mt-10 overflow-hidden rounded-2xl border border-blush">
          {routine.map((r, i) => (
            <div
              key={r[0]}
              className={`grid grid-cols-[80px_1fr] items-start gap-3 px-4 py-4 sm:grid-cols-[110px_140px_1fr] sm:px-6 ${
                i % 2 ? "bg-cream" : "bg-white"
              }`}
            >
              <span className="font-semibold text-rose">{r[0]}</span>
              <span className="hidden font-semibold text-ink sm:block">{r[1]}</span>
              <span className="text-muted">
                <span className="font-semibold text-ink sm:hidden">{r[1]}: </span>
                {r[2]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <p className="eyebrow mb-3">Vad kvinnor säger</p>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Riktiga resultat, riktiga ord
          </h2>
        </div>
        <div className="container-tight mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="card flex flex-col p-6">
              <Stars n={r.stars} />
              <blockquote className="mt-3 grow text-ink">”{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section id="erbjudande" className="bg-gradient-to-b from-cream to-blush/60 py-16 sm:py-20">
        <div className="container-narrow">
          <div className="card overflow-hidden p-0">
            <div className="bg-rose px-6 py-4 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Introduktionserbjudande · gäller idag
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-center font-serif text-3xl font-bold text-ink">
                {mainOffer.name}
              </h2>

              <ul className="mx-auto mt-6 max-w-md space-y-3">
                {[
                  `Hela mästarkursen – 9 lektioner (värde ${formatKr(reg)})`,
                  "Checklistor för varje lektion",
                  "Komplett 10-minutersrutin steg för steg",
                  "Do's & don'ts för moget hud",
                  "Direkt nedladdning – din för alltid",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 font-bold text-rose">✓</span>
                    <span className="text-ink">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 text-center">
                <div className="flex items-end justify-center gap-3">
                  <span className="text-xl text-muted line-through">{formatKr(reg)}</span>
                  <span className="font-serif text-6xl font-bold text-rose-dark">
                    {formatKr(mainOffer.priceOre)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">Engångsbetalning. Ingen prenumeration.</p>

                <div className="mx-auto mt-6 max-w-md">
                  <CtaButton large>Lås upp kursen för {formatKr(mainOffer.priceOre)} →</CtaButton>
                </div>
                <p className="mt-3 text-sm text-muted">
                  🔒 Säker betalning · 30 dagars pengarna-tillbaka-garanti
                </p>
              </div>

              <div className="mt-8 rounded-xl bg-cream p-4 text-center text-sm text-muted">
                <span className="font-semibold text-ink">Vill du ha mer?</span> I kassan kan du lägga
                till våra extraguider för bara {formatKr(upsells[0].priceOre)} st —{" "}
                {upsells.map((u) => u.name.split(":")[0]).join(", ")}.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="bg-white py-14">
        <div className="container-narrow flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold font-serif text-sm font-bold text-gold">
            30 DAGAR
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-ink">Nöjd-kund-garanti</h3>
            <p className="mt-2 text-muted">
              Testa hela kursen i lugn och ro. Om du inte ser skillnad inom 30 dagar mejlar du oss på{" "}
              <span className="font-medium text-ink">{brand.supportEmail}</span> så får du pengarna
              tillbaka. Hela risken är vår.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
            Vanliga frågor
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                  {f.q}
                  <span className="ml-4 text-rose transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <CtaButton large>Kom igång nu för {formatKr(mainOffer.priceOre)} →</CtaButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blush bg-white py-10">
        <div className="container-tight text-center text-sm text-muted">
          <p className="font-serif text-lg font-bold text-rose-dark">{brand.name}</p>
          <p className="mt-2">{brand.tagline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="#" className="hover:text-rose">Integritetspolicy</a>
            <a href="#" className="hover:text-rose">Villkor</a>
            <a href={`mailto:${brand.supportEmail}`} className="hover:text-rose">Kontakt</a>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-muted/80">
            Resultat varierar från person till person. {brand.name} tillhandahåller utbildande
            innehåll om sminkteknik och garanterar inte specifika resultat. © {new Date().getFullYear()}{" "}
            {brand.name}.
          </p>
        </div>
      </footer>
    </main>
  );
}
