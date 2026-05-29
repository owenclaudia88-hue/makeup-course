// Course catalogue for the Luumora platform. Pure data — add a course by
// appending to `courses`. The UI renders any number of courses/lessons.

export type Lesson = {
  title: string;
  insight: string; // one-line key takeaway
  body: string; // short explanation
  steps?: string[]; // ordered how-to
  checklist?: string[]; // self-check
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: "Nybörjare" | "Medel" | "Avancerad";
  minutesPerDay: number;
  summary: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    slug: "ansiktsyoga",
    title: "Ansiktsyoga: Lyft ansiktet på 10 minuter",
    category: "Skönhet",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary:
      "Enkla, dagliga ansiktsövningar som stärker musklerna, ökar cirkulationen och ger ett naturligt lyft – utan nålar eller dyra behandlingar.",
    lessons: [
      {
        title: "Varför ansiktsyoga fungerar",
        insight: "Ansiktet har över 40 muskler – tränas de inte tappar de spänst, precis som kroppen.",
        body:
          "Regelbunden, mild aktivering ökar blodflödet, stimulerar kollagen och motverkar att huden ser trött och insjunken ut. Nyckeln är mjuka, kontrollerade rörelser – inte att dra hårt i huden.",
        checklist: ["Jag förstår att resultat kommer av regelbundenhet", "Jag arbetar mjukt, aldrig genom att dra i huden"],
      },
      {
        title: "Uppvärmning & lymfdränage",
        insight: "Börja alltid med att tömma lymfan – mindre svullnad ger direkt en skarpare kontur.",
        body:
          "Med rena händer, stryk lätt från mitten av ansiktet utåt mot öronen och sedan ner längs halsen. Lätt tryck räcker; lymfan ligger precis under huden.",
        steps: [
          "Stryk från näsan utåt över kinderna mot öronen (10 ggr)",
          "Från käken längs halsen nedåt mot nyckelbenen (10 ggr)",
          "Lätt knackning runt ögonen med ringfingret",
        ],
      },
      {
        title: "Kind- och käklyft",
        insight: "Leendet du tränar är leendet som håller kinderna uppe.",
        body:
          "Dessa övningar aktiverar de stora muskler som bär upp mitten av ansiktet och definierar käklinjen.",
        steps: [
          "Le brett med stängd mun, tryck lätt uppåt på kindbenen, håll 5 sek × 10",
          "Skjut fram underkäken lätt och känn spänningen längs käklinjen, håll 5 sek × 10",
          "Blås upp kinderna med luft och flytta luften sida till sida × 10",
        ],
      },
      {
        title: "Panna och ögonparti",
        insight: "Spänningar i pannan skapar linjer – mjuka upp istället för att rynka.",
        body:
          "Vi släpper spänning i pannan och öppnar blicken utan att överarbeta det känsliga området kring ögonen.",
        steps: [
          "Placera fingrarna över ögonbrynen, tryck lätt nedåt medan du höjer brynen × 10",
          "Öppna ögonen stort, titta uppåt, håll 5 sek × 5",
          "Massera tinningarna i små cirklar",
        ],
      },
      {
        title: "Din 10-minutersrutin",
        insight: "Samma rutin varje dag slår en lång rutin då och då.",
        body:
          "Sätt ihop allt: 2 min lymf, 5 min lyftövningar, 2 min panna/ögon, 1 min avslappning. Gör den på morgonen eller medan du tittar på TV.",
        checklist: [
          "Jag har valt en fast tid på dagen",
          "Jag gör hela sekvensen på cirka 10 minuter",
          "Jag avslutar med några djupa andetag",
        ],
      },
    ],
  },
  {
    slug: "hudvard-40",
    title: "Hudvård efter 40",
    category: "Skönhet",
    level: "Nybörjare",
    minutesPerDay: 5,
    summary:
      "Bygg en enkel, effektiv hudvårdsrutin anpassad för moget hud – rätt ingredienser i rätt ordning för fukt, lyster och färre linjer.",
    lessons: [
      {
        title: "Hur huden förändras",
        insight: "Efter 40 minskar kollagen och naturlig olja – fokus blir fukt och skydd.",
        body:
          "Tunnare hud, mindre talg och långsammare cellförnyelse gör att huden lättare blir torr och glanslös. Rutinen ska återfukta, skydda och varsamt förnya.",
      },
      {
        title: "Rengöring och fukt",
        insight: "Skölj aldrig bort fukten – mild rengöring följt av återfuktning.",
        body:
          "Använd en krämig, mild rengöring kvälls­tid och bara vatten eller en mycket mild rengöring på morgonen. Lås in fukt med en serum + kräm medan huden är lätt fuktig.",
        steps: ["Mild rengöring", "Hydrerande serum (t.ex. hyaluronsyra)", "Återfuktande kräm", "På morgonen: avsluta med SPF"],
      },
      {
        title: "De aktiva ingredienserna som räknas",
        insight: "Tre ingredienser gör störst skillnad: SPF, C-vitamin och retinol.",
        body:
          "SPF varje morgon är det mest anti-age du kan göra. C-vitamin på dagen ger lyster och skydd; retinol på kvällen stimulerar förnyelse – börja långsamt, 2 ggr/vecka.",
        checklist: ["Jag använder SPF varje morgon", "Jag har introducerat retinol långsamt", "Jag tål mina aktiva ingredienser utan irritation"],
      },
      {
        title: "Kvällsrutinen",
        insight: "Natten är när huden reparerar – ge den verktygen.",
        body:
          "Rengör bort dagens smink och föroreningar, applicera behandlande produkter och lås med en rikare nattkräm. Konsekvens i några veckor ger synlig skillnad.",
      },
    ],
  },
  {
    slug: "battre-somn",
    title: "Bättre sömn: en kvällsrutin som funkar",
    category: "Välmående",
    level: "Nybörjare",
    minutesPerDay: 15,
    summary:
      "Somna lättare och vakna mer utvilad med en enkel kvällsrutin byggd på hur kroppens sömnsystem faktiskt fungerar.",
    lessons: [
      {
        title: "Varför sömn är din bästa skönhetsbehandling",
        insight: "Djupsömnen är när huden, hjärnan och humöret återställs.",
        body:
          "Dålig sömn syns direkt: tråkig hud, svullna ögon, sämre humör och sug efter socker. Att förbättra sömnen är den mest underskattade vanan för hur du ser ut och mår.",
      },
      {
        title: "Ljus och skärmar",
        insight: "Ljus styr din dygnsrytm mer än något annat.",
        body:
          "Starkt och blått ljus på kvällen lurar hjärnan att det är dag. Dämpa lamporna 1–2 timmar före läggdags och lägg undan skärmar, eller använd nattläge.",
        steps: ["Dämpa belysningen efter middagen", "Skärmfri sista 30–60 min", "Få dagsljus tidigt på morgonen"],
      },
      {
        title: "Kvällsrutinen steg för steg",
        insight: "Samma lugna sekvens varje kväll signalerar 'nu är det dags att sova'.",
        body:
          "Kroppen älskar förutsägbarhet. En kort, fast rutin blir en signal som gör att du somnar snabbare med tiden.",
        steps: [
          "Samma läggtid varje kväll",
          "Svalt, mörkt och tyst sovrum",
          "Lugn aktivitet: läsa, stretcha, dusch",
          "Skriv ner morgondagens tankar för att tömma huvudet",
        ],
      },
      {
        title: "Andning för att somna",
        insight: "Långsam utandning lugnar nervsystemet på minuter.",
        body:
          "Prova 4-7-8-andning: andas in 4 sek, håll 7 sek, andas ut 8 sek. Upprepa 4 gånger. Den långa utandningen aktiverar kroppens lugn-och-ro-system.",
        checklist: ["Jag har en fast läggtid", "Sovrummet är svalt och mörkt", "Jag använder andning när tankarna snurrar"],
      },
    ],
  },
  {
    slug: "lugn-pa-10-min",
    title: "Lugn på 10 minuter: stresshantering",
    category: "Välmående",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary:
      "Praktiska verktyg för att varva ner snabbt, bryta stresspiraler och bygga in små lugn-stunder i en hektisk vardag.",
    lessons: [
      {
        title: "Vad stress gör med kroppen",
        insight: "Stress är inte i huvudet – det är ett kroppsligt larm du kan stänga av.",
        body:
          "Långvarig stress höjer kortisol, stör sömn, matsmältning och hud. Goda nyheter: du kan aktivt signalera till kroppen att faran är över.",
      },
      {
        title: "Snabb nedvarvning",
        insight: "Tre långa utandningar kan sänka stressnivån direkt.",
        body:
          "När du känner dig spänd: stanna upp, släpp axlarna, och ta tre medvetna andetag med längre utandning än inandning.",
        steps: ["Släpp spänningen i käke och axlar", "Andas ut långsamt genom munnen", "Namnge känslan: 'jag känner stress' – det minskar dess grepp"],
      },
      {
        title: "Daglig mikropaus",
        insight: "Korta pauser ofta slår en lång paus sällan.",
        body:
          "Lägg in 2–3 minuters mikropauser i dagen: en kort promenad, ett glas vatten i lugn, eller bara blicken ut genom fönstret. Det nollställer nervsystemet.",
        checklist: ["Jag tar minst en mikropaus per förmiddag", "Jag använder andning när stressen stiger", "Jag avslutar dagen med något lugnande"],
      },
    ],
  },
  {
    slug: "sjalvkansla",
    title: "Självkänsla & självförtroende",
    category: "Personlig utveckling",
    level: "Medel",
    minutesPerDay: 10,
    summary:
      "Förstå skillnaden mellan självkänsla och självförtroende – och bygg båda med konkreta, dagliga övningar.",
    lessons: [
      {
        title: "Självkänsla vs självförtroende",
        insight: "Självförtroende är vad du gör; självkänsla är att du duger oavsett.",
        body:
          "Du kan ha högt självförtroende på jobbet men låg självkänsla. De byggs på olika sätt – och båda går att stärka.",
      },
      {
        title: "Den inre kritikern",
        insight: "Du behöver inte tro på allt din inre röst säger.",
        body:
          "Lägg märke till hård självkritik och fråga: skulle jag säga så till en vän? Byt ut domen mot något du faktiskt skulle säga till någon du bryr dig om.",
        steps: ["Fånga den kritiska tanken", "Fråga om den är sann och hjälpsam", "Formulera om den vänligt men ärligt"],
      },
      {
        title: "Kroppsspråk förändrar hur du känner",
        insight: "Hållningen påverkar humöret lika mycket som humöret påverkar hållningen.",
        body:
          "Räta på dig, sänk axlarna, lyft blicken. Bara någon minut i en öppen, stabil hållning kan höja känslan av lugn och säkerhet.",
      },
      {
        title: "Daglig praktik",
        insight: "Självkänsla byggs av små bevis du ger dig själv varje dag.",
        body:
          "Håll ett litet löfte till dig själv dagligen och notera tre saker du gjorde bra. Med tiden ändras din inre berättelse om vem du är.",
        checklist: ["Jag märker och mjukar upp självkritik", "Jag håller små löften till mig själv", "Jag noterar dagligen något jag gjorde bra"],
      },
    ],
  },
  {
    slug: "energirik-morgon",
    title: "Energirik morgonrutin",
    category: "Välmående",
    level: "Nybörjare",
    minutesPerDay: 15,
    summary:
      "Designa en morgon som ger dig energi och fokus istället för stress – byggd på enkla vanor som faktiskt håller.",
    lessons: [
      {
        title: "De första 10 minuterna",
        insight: "Hur du börjar dagen sätter tonen för resten.",
        body:
          "Undvik att gripa telefonen direkt. Ge dig själv några minuter utan input innan dagens krav börjar – det sänker stress och ökar fokus.",
        steps: ["Ingen telefon de första 10 minuterna", "Drick ett glas vatten", "Sträck på kroppen"],
      },
      {
        title: "Ljus och rörelse",
        insight: "Dagsljus tidigt ställer din inre klocka rätt.",
        body:
          "Få naturligt ljus inom en timme efter att du vaknat och rör på kroppen några minuter. Det ökar pigghet på dagen och bättre sömn på natten.",
      },
      {
        title: "Hydrering och frukost",
        insight: "Kroppen vaknar uttorkad – vätska före koffein.",
        body:
          "Drick vatten innan kaffet och välj en frukost med protein för stabil energi. Det minskar energidippar och sockersug senare.",
        checklist: ["Jag dricker vatten innan kaffe", "Jag får dagsljus tidigt", "Min frukost innehåller protein"],
      },
      {
        title: "Sätt dagens intention",
        insight: "En tydlig intention slår en lång att-göra-lista.",
        body:
          "Välj en sak som gör dagen lyckad om den blir gjord. Det ger riktning och en känsla av kontroll redan från start.",
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export const categories = Array.from(new Set(courses.map((c) => c.category)));
