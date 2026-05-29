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
  // true = part of the paid bundle the buyer gets immediately ("Dina kurser").
  core?: boolean;
  // Filename in /protected. When set, the course is shown as the full PDF in an
  // embedded reader instead of the text lessons.
  pdf?: string;
};

/** Cover image path for a course (drop <slug>.webp into public/kurser/). */
export function coverFor(slug: string): string {
  return `/kurser/${slug}.webp`;
}

export const courses: Course[] = [
  {
    slug: "makeup40",
    pdf: "10MinMakeup40_Masterkurs_Svenska.pdf",
    title: "10 Min Makeup 40+ – Mästarkursen",
    category: "Mästarkurs",
    level: "Nybörjare",
    minutesPerDay: 10,
    core: true,
    summary:
      "Hela proffsguiden till att se yngre, fräschare och mer självsäker ut på 10 minuter. 9 lektioner med tekniker, do's & don'ts och en komplett rutin.",
    lessons: [
      {
        title: "Varför smink åldrar dig",
        insight: "Samma 5 misstag lägger på år – och mer produkt gör det nästan alltid värre.",
        body:
          "Tung foundation, kraftig undre eyeliner, slopad primer, fel concealer och helmatt finish får moget hud att se äldre ut. Korrigeringen är oftast att ta bort, inte lägga till.",
        checklist: ["Jag känner igen de 5 åldrande misstagen", "Jag förstår varför mindre produkt är bättre"],
      },
      {
        title: "Hudprep: grunden för varje look",
        insight: "Prep är 60 % av resultatet – foundation på oförberedd hud sitter sämre.",
        body: "Två minuters prep gör att allt annat sitter i timmar istället för att lägga sig i linjerna.",
        steps: ["Lättviktig, återfuktande kräm", "Klappa in ögonkräm", "Lysande primer i T-zonen"],
      },
      {
        title: "Foundation utan att kaka sig",
        insight: "Satin/dewy finish + fuktad svamp = jämn hud utan att framhäva linjer.",
        body: "Bygg tunt från mitten och utåt, lägg bara mer där det behövs. De flesta överdoserar.",
        steps: ["Välj satin/dewy, lätt täckning", "Applicera med fuktad svamp, tryck – dra inte", "Andra lagret bara på rodnad"],
      },
      {
        title: "Concealer-mästarklass",
        insight: "Omvänd triangel under ögat lyfter blicken och döljer mörka ringar.",
        body: "Färgkorrigera djupa ringar med persika/orange, matcha sedan hudtonen och sätt mycket lätt.",
        steps: ["Färgkorrigera vid behov", "Rita en omvänd triangel, inte en linje", "Stippla ut, pudra minimalt"],
      },
      {
        title: "Eye-lift utan tung eyeliner",
        insight: "Liner bara på övre fransraden + en mörk yttre V lyfter ögat.",
        body: "Undvik kraftig undre linje som drar ögat nedåt. Highlight i inre ögonvrån öppnar blicken.",
        steps: ["Liner nära övre fransraden", "Varm skugga på locket, mörkare i yttre V", "Highlight i inre ögonvrån"],
      },
      {
        title: "Bryn som ramar in & föryngrar",
        insight: "Mjuka, naturligt fyllda bryn är den snabbaste föryngringen.",
        body: "Fyll bara glesa partier, en nyans ljusare än håret, och sätt uppåt med gel.",
        checklist: ["Mjuk penna, inte vaxig", "En nyans ljusare än håret", "Borstad uppåt och fixerad"],
      },
      {
        title: "Rouge, bronzer & highlight för 40+",
        insight: "Placera färg uppåt och framåt – aldrig nedåt.",
        body: "Krämrouge på kindernas äpplen, blandad mot tinningen. Highlight på kindben, inte i hela ansiktet.",
        steps: ["Krämrouge uppåt mot tinningen", "Matt bronzer där solen träffar", "Highlight: kindben, inre ögonvrår, amorbåge"],
      },
      {
        title: "Läppar som inte blöder eller plattas till",
        insight: "Liner är det viktigaste läppsteget efter 40.",
        body: "Fyll hela läppen med liner före läppstift – det förhindrar att färgen blöder ut och ger volym.",
        steps: ["Fyll läppen med liner", "Satin- eller krämläppstift", "En droppe gloss i mitten för fyllighet"],
      },
      {
        title: "Din kompletta 10-minutersrutin",
        insight: "Samma optimerade ordning varje dag ger ett proffsresultat på 10 minuter.",
        body: "Sätt ihop allt – prep, foundation, concealer, bryn, ögon, kinder, highlight, läppar, kontroll i dagsljus.",
        checklist: ["Jag kan hela rutinen i rätt ordning", "Jag klarar looken på 10 minuter", "Jag kollar alltid i dagsljus till sist"],
      },
    ],
  },
  {
    slug: "face-sculpt",
    pdf: "FaceSculpt_AlltIEtt_Svenska.pdf",
    title: "Face Sculpt: Allt-i-ett-ritual för ett yngre ansikte",
    category: "Bonus",
    level: "Nybörjare",
    minutesPerDay: 5,
    core: true,
    summary:
      "En daglig 5-minutersritual som lyfter, definierar och ger lyster – med händer och enkla verktyg, helt utan nålar.",
    lessons: [
      {
        title: "Ritualens grund",
        insight: "Konsekvens slår intensitet – fem minuter dagligen ger synlig skillnad.",
        body:
          "Ritualen kombinerar lätt massage, lyftande grepp och avslappning av spända muskler. Använd en ansiktsolja så att händer eller verktyg glider mjukt.",
      },
      {
        title: "Lyft & definiera",
        insight: "Arbeta alltid uppåt och utåt längs ansiktets naturliga linjer.",
        body: "Dessa grepp aktiverar och lyfter de muskler som bär upp kinder och käklinje.",
        steps: [
          "Knogmassage längs käken, från hakan mot örat × 10",
          "Lyftande strykningar över kinderna mot tinningen",
          "Tryck och släpp längs ögonbrynsbågen",
        ],
      },
      {
        title: "Avslappning & lyster",
        insight: "Att släppa spänning gör lika mycket som att lyfta.",
        body:
          "Avsluta med att mjuka upp käke, panna och tinningar. Mindre spänning = slätare uttryck och bättre cirkulation, vilket ger naturlig lyster.",
        checklist: ["Jag gör ritualen dagligen", "Jag arbetar uppåt och utåt", "Jag avslutar med att slappna av käke och panna"],
      },
    ],
  },
  {
    slug: "lymfdetox-21",
    pdf: "21Dagars_LymfDetox_Svenska.pdf",
    title: "21-dagars Lymfdetox: Smalare ansikte & kropp",
    category: "Bonus",
    level: "Nybörjare",
    minutesPerDay: 10,
    core: true,
    summary:
      "Ett 21-dagars program med daglig lymfmassage och enkla vanor för mindre svullnad, en skarpare kontur och en lättare kropp.",
    lessons: [
      {
        title: "Så fungerar programmet",
        insight: "21 dagar bygger en vana – och vätskan minskar märkbart längs vägen.",
        body:
          "Varje dag gör du en kort lymfrutin för ansikte och kropp plus en stödjande vana (vatten, rörelse, andning). Små steg, varje dag.",
      },
      {
        title: "Daglig lymfrutin",
        insight: "Lätt tryck mot lymfknutorna – aldrig hårt.",
        body: "Samma sekvens varje dag tömmer vätska från ansikte, hals och kropp.",
        steps: [
          "Pumpa lätt vid nyckelbenen × 10",
          "Stryk ansiktet inifrån och ut mot öronen",
          "Borsta kroppen mot hjärtat (torrborste eller händer)",
        ],
      },
      {
        title: "Vanorna som förstärker",
        insight: "Lymfan rör sig av vatten, rörelse och andning.",
        body:
          "Komplettera massagen med tillräckligt vatten, dagliga promenader och några djupa andetag. Tillsammans ger de störst effekt på 21 dagar.",
        checklist: ["Jag gör lymfrutinen dagligen", "Jag dricker tillräckligt med vatten", "Jag rör på mig varje dag"],
      },
    ],
  },
  {
    slug: "ansiktslyft",
    pdf: "Ansiktslyft_SkulpteraDittAnsikte_Svenska.pdf",
    title: "Face Lifting: Forma ansiktet & se yngre ut",
    category: "Bonus",
    level: "Nybörjare",
    minutesPerDay: 8,
    core: true,
    summary:
      "Lyftande övningar för panna, kinder och käke som stärker musklerna och ger ett naturligt, mer ungdomligt ansikte – utan nålar.",
    lessons: [
      {
        title: "Varför muskelträning lyfter ansiktet",
        insight: "Starka ansiktsmuskler bär upp huden – precis som i kroppen.",
        body:
          "När musklerna under huden tappar spänst sjunker dragen. Riktad träning stärker dem igen och ger ett synligt lyft över tid.",
      },
      {
        title: "Lyftövningar steg för steg",
        insight: "Kontrollerade, isolerade rörelser – inte att dra i huden.",
        body: "Aktivera kind-, käk- och pannmuskler var för sig för bäst effekt.",
        steps: [
          "Kindlyft: le med stängd mun, tryck lätt uppåt på kindbenen, håll 5 sek × 10",
          "Käklinje: skjut fram underkäken lätt, håll 5 sek × 10",
          "Panna: håll brynen nere med fingrarna och höj dem mot motståndet × 10",
        ],
      },
      {
        title: "Rutin & resultat",
        insight: "Några minuter dagligen i några veckor ger synlig skillnad.",
        body:
          "Gör övningarna dagligen och var tålmodig – som all muskelträning syns resultatet med regelbundenhet, inte enstaka pass.",
        checklist: ["Jag gör övningarna dagligen", "Jag arbetar musklerna utan att dra i huden", "Jag ger det några veckor"],
      },
    ],
  },
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
  {
    slug: "lymfdranage",
    title: "Lymfdränage hemma: mindre svullnad",
    category: "Skönhet",
    level: "Nybörjare",
    minutesPerDay: 8,
    summary:
      "Daglig lymfmassage som tömmer vätska, minskar svullnad och ger en skarpare ansikts- och käklinje.",
    lessons: [
      {
        title: "Vad lymfsystemet gör",
        insight: "Lymfan transporterar bort vätska och slagg – men har ingen egen pump.",
        body:
          "Till skillnad från blodet rör sig lymfan bara när du rör dig eller masserar den. Stillasittande och sömnbrist gör att vätska samlas, vilket syns som svullnad och påsar.",
      },
      {
        title: "Ansiktsdränage steg för steg",
        insight: "Alltid lätt tryck, alltid i riktning mot lymfknutorna.",
        body: "Mjuka, strykande rörelser tömmer vätskan – tryck aldrig hårt.",
        steps: [
          "Börja vid nyckelbenen, pumpa lätt × 10",
          "Stryk från hakan längs käken mot öronen",
          "Från näsvingarna utåt över kinderna",
          "Lätt runt ögonen med ringfingret, utåt",
        ],
      },
      {
        title: "Kropp och dagliga vanor",
        insight: "Rörelse och vatten är din lymfas bästa vänner.",
        body:
          "Korta promenader, djupandning och tillräckligt med vatten håller lymfan i rörelse hela dagen.",
        checklist: ["Jag gör ansiktsdränage på morgonen", "Jag rör på mig regelbundet", "Jag dricker tillräckligt med vatten"],
      },
    ],
  },
  {
    slug: "harvard-moget-har",
    title: "Hårvård & volym för moget hår",
    category: "Skönhet",
    level: "Nybörjare",
    minutesPerDay: 5,
    summary: "Ge tunnare, moget hår mer volym, lyster och styrka med rätt rutiner och produkter.",
    lessons: [
      {
        title: "Hur håret förändras",
        insight: "Efter klimakteriet blir håret ofta tunnare och torrare.",
        body:
          "Lägre östrogen ger finare hårstrån och långsammare växt. Fokus blir att skydda, ge volym vid rötterna och undvika det som tynger ner.",
      },
      {
        title: "Tvätt och volym",
        insight: "Tvätta rätt, inte ofta – och bygg volym vid roten.",
        body: "Rätt teknik ger lyft utan att håret blir platt eller flottigt.",
        steps: [
          "Använd ett milt, volymgivande schampo",
          "Balsam bara på längderna, inte rötterna",
          "Föna med huvudet nedåt för lyft vid roten",
        ],
      },
      {
        title: "Skydd och styrka",
        insight: "Värme och hårda kemikalier åldrar håret snabbast.",
        body:
          "Använd värmeskydd, undvik för hög värme och klipp topparna regelbundet. En droppe hårolja på topparna ger lyster utan att tynga.",
        checklist: ["Jag använder värmeskydd", "Jag undviker att tvätta håret för ofta", "Jag klipper topparna regelbundet"],
      },
    ],
  },
  {
    slug: "andning-angest",
    title: "Andningsövningar för ångest",
    category: "Välmående",
    level: "Nybörjare",
    minutesPerDay: 8,
    summary:
      "Enkla andningstekniker som lugnar nervsystemet och dämpar ångest – var som helst, på några minuter.",
    lessons: [
      {
        title: "Varför andning hjälper",
        insight: "Långsam andning är snabbaste vägen att signalera lugn till hjärnan.",
        body:
          "Vid ångest andas vi ytligt och snabbt. Genom att medvetet sakta ner andningen aktiverar du det parasympatiska nervsystemet – kroppens broms.",
      },
      {
        title: "Box breathing",
        insight: "Fyrkantsandning ger sinnet något att fokusera på.",
        body: "En enkel, balanserad rytm som snabbt sänker oron.",
        steps: ["Andas in 4 sek", "Håll 4 sek", "Andas ut 4 sek", "Håll 4 sek – upprepa 4 varv"],
      },
      {
        title: "Förlängd utandning",
        insight: "Utandningen är där lugnet sitter.",
        body:
          "Gör utandningen längre än inandningen, t.ex. in 4 / ut 6. Bara någon minut sänker puls och oro.",
        checklist: ["Jag kan box breathing", "Jag använder förlängd utandning vid oro", "Jag övar någon minut dagligen"],
      },
    ],
  },
  {
    slug: "hallning-rorlighet",
    title: "Hållning & rörlighet på 10 minuter",
    category: "Hälsa",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary:
      "Motverka stelhet och skärmhållning med korta dagliga rörelser som öppnar kroppen och minskar värk.",
    lessons: [
      {
        title: "Vad stillasittande gör",
        insight: "Kroppen formas efter de positioner du håller mest.",
        body:
          "Långa stunder framför skärm ger framåtlutat huvud, runda axlar och stel rygg. Korta, ofta upprepade rörelser motverkar det bättre än ett långt pass.",
      },
      {
        title: "Tre öppnande rörelser",
        insight: "Öppna det som sittandet stänger: bröst, höfter, rygg.",
        body: "Gör dem långsamt och andas ut i varje stretch.",
        steps: [
          "Bröstöppning: knäpp händerna bakom ryggen, lyft lätt",
          "Höftböj: utfall, skjut höften framåt",
          "Rotation: sitt rakt och vrid överkroppen sida till sida",
        ],
      },
      {
        title: "Rörelsepauser",
        insight: "Res dig varje timme – kroppen mår av variation.",
        body:
          "Sätt en påminnelse att resa dig och röra dig en minut varje timme. Det håller leder och muskler vid liv och förbättrar fokus.",
        checklist: ["Jag reser mig minst en gång i timmen", "Jag gör öppnande rörelser dagligen", "Jag tänker på huvudets position vid skärmen"],
      },
    ],
  },
  {
    slug: "personlig-stil-40",
    title: "Personlig stil & garderob 40+",
    category: "Stil",
    level: "Medel",
    minutesPerDay: 10,
    summary:
      "Hitta en stil som känns som du och som lyfter dig – bygg en enkel, fungerande garderob för livet efter 40.",
    lessons: [
      {
        title: "Stil börjar med passform",
        insight: "Välsittande basplagg slår dyra trendplagg varje gång.",
        body:
          "Efter 40 förändras kroppen, och plagg som sitter rätt får dig att se mer samlad och självsäker ut – oavsett storlek.",
      },
      {
        title: "Bygg en kapsel-garderob",
        insight: "Färre plagg som funkar ihop = fler outfits, mindre stress.",
        body: "En genomtänkt bas gör att allt matchar och morgonen blir enklare.",
        steps: ["Välj 2–3 neutrala basfärger", "Investera i välsittande basplagg", "Lägg till några accentplagg och accessoarer"],
      },
      {
        title: "Klä för dig",
        insight: "Regler är riktlinjer – din komfort vinner.",
        body:
          "Bär det som får dig att känna dig bekväm och stark. Trygghet i kläderna syns mer än något trendplagg.",
        checklist: ["Mina basplagg sitter bra", "Min garderob har en sammanhållen färgpalett", "Jag bär det jag känner mig trygg i"],
      },
    ],
  },
  {
    slug: "mindful-eating",
    title: "Mindful eating & hälsosamma vanor",
    category: "Hälsa",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary: "Bygg ett lugnare, hälsosammare förhållande till mat – utan dieter, regler eller skuld.",
    lessons: [
      {
        title: "Mindful vs mindless",
        insight: "Det är inte bara vad du äter, utan hur.",
        body:
          "Att äta framför skärmen eller i stress gör att vi missar mättnadssignaler och äter mer. Närvaro vid måltiden förändrar både mängd och njutning.",
      },
      {
        title: "Praktisk mindful eating",
        insight: "Sakta ner – magen hinner inte med en snabb hjärna.",
        body: "Små förändringar vid bordet gör störst skillnad.",
        steps: ["Ät utan skärm", "Lägg ner besticket mellan tuggorna", "Stanna upp halvvägs och känn efter hur hungrig du är"],
      },
      {
        title: "Hållbara vanor",
        insight: "Små, hållbara byten slår snabba dieter.",
        body:
          "Lägg till mer av det goda (grönt, protein, vatten) istället för att förbjuda. Vanor som känns lätta håller i längden.",
        checklist: ["Jag äter minst en måltid utan skärm", "Jag lägger till grönt på tallriken", "Jag dömer inte mig själv för enskilda måltider"],
      },
    ],
  },
  {
    slug: "meditation-nyborjare",
    title: "Meditation för nybörjare",
    category: "Välmående",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary: "Kom igång med meditation från noll – korta, enkla pass som minskar stress och ökar fokus.",
    lessons: [
      {
        title: "Myter om meditation",
        insight: "Målet är inte att 'tömma hjärnan' – det är att märka och återvända.",
        body:
          "Tankar kommer alltid. Meditation är att lägga märke till att du vandrat iväg och vänligt komma tillbaka till andningen. Varje återvändning är träning för fokus.",
      },
      {
        title: "Ditt första pass",
        insight: "Två minuter dagligen slår tjugo minuter ibland.",
        body: "Enkelhet vinner – börja så litet att det känns nästan löjligt lätt.",
        steps: ["Sitt bekvämt, blunda", "Följ andningen in och ut", "När tankar kommer – notera och återvänd", "Börja med 2–5 minuter"],
      },
      {
        title: "Gör det till en vana",
        insight: "Koppla meditationen till något du redan gör.",
        body:
          "Meditera direkt efter morgonkaffet eller före sänggåendet. Att fästa vanan vid en befintlig rutin gör den lätt att hålla.",
        checklist: ["Jag har en fast tid att meditera", "Jag dömer inte vandrande tankar", "Jag har börjat litet och realistiskt"],
      },
    ],
  },
  {
    slug: "digital-detox",
    title: "Digital detox & fokus",
    category: "Personlig utveckling",
    level: "Nybörjare",
    minutesPerDay: 10,
    summary: "Ta tillbaka fokus och lugn från skärmen med enkla gränser som faktiskt håller.",
    lessons: [
      {
        title: "Hur skärmen kapar fokus",
        insight: "Varje notis återställer din uppmärksamhet – det tar minuter att komma tillbaka.",
        body:
          "Ständiga avbrott gör djupt fokus omöjligt och höjer stress. Problemet är sällan viljestyrka, utan en miljö byggd för att fånga din uppmärksamhet.",
      },
      {
        title: "Sätt gränser",
        insight: "Gör det jobbigt att fastna, lätt att fokusera.",
        body: "Designa miljön så att det rätta valet blir det enkla.",
        steps: ["Stäng av onödiga notiser", "Lägg telefonen utom synhåll vid fokus", "Inför skärmfria zoner (sängen, matbordet)"],
      },
      {
        title: "Fyll tomrummet",
        insight: "Detox funkar bara om något bättre tar platsen.",
        body:
          "Ersätt scrollandet med något du mår bra av: en promenad, en bok, en kontakt. Annars dras du snabbt tillbaka.",
        checklist: ["Jag har stängt av onödiga notiser", "Jag har minst en skärmfri zon", "Jag har en ersättningsvana för scrollandet"],
      },
    ],
  },
  {
    slug: "naglar-hander",
    title: "Vackra naglar & händer",
    category: "Skönhet",
    level: "Nybörjare",
    minutesPerDay: 5,
    summary:
      "Vårda händer och naglar så de ser unga och välvårdade ut – ofta det som avslöjar ålder mest.",
    lessons: [
      {
        title: "Varför händerna åldras",
        insight: "Händerna har tunn hud och mest solexponering – men minst omvårdnad.",
        body:
          "Torrhet, pigmentfläckar och sköra naglar kommer av sol, vatten och kemikalier. Lite daglig omsorg gör stor skillnad.",
      },
      {
        title: "Daglig handvård",
        insight: "Fukt + SPF på händerna, precis som ansiktet.",
        body: "De enkla stegen som håller händerna mjuka och jämna i ton.",
        steps: ["Handkräm efter varje handtvätt", "SPF på handryggarna på dagen", "Nagelolja på nagelband några gånger i veckan"],
      },
      {
        title: "Starkare naglar",
        insight: "Naglar bryts oftast av uttorkning, inte näringsbrist.",
        body:
          "Använd handskar vid disk och städ, undvik aceton och håll naglarna lagom korta. Fukt är nyckeln.",
        checklist: ["Jag använder handkräm dagligen", "Jag skyddar händerna vid disk/städ", "Jag oljar nagelbanden regelbundet"],
      },
    ],
  },
  {
    slug: "anti-age-kost",
    title: "Anti-age på tallriken: kost för huden",
    category: "Hälsa",
    level: "Medel",
    minutesPerDay: 10,
    summary:
      "Ät för hud som åldras vackert – enkla kostval som stödjer kollagen, fukt och lyster inifrån.",
    lessons: [
      {
        title: "Huden börjar i tallriken",
        insight: "Ingen kräm ersätter vad du äter.",
        body:
          "Socker och hårt processad mat bryter ner kollagen, medan protein, goda fetter och färgglada grönsaker bygger upp huden inifrån.",
      },
      {
        title: "Hudens bästa mat",
        insight: "Färg, protein och omega-3 är hudens byggstenar.",
        body: "Fyll tallriken med det som faktiskt stödjer huden.",
        steps: [
          "Protein vid varje måltid (kollagenets byggstenar)",
          "Omega-3: fet fisk, valnötter, linfrö",
          "Färgglada grönsaker och bär (antioxidanter)",
          "Vatten för fukt",
        ],
      },
      {
        title: "Mindre av det som åldrar",
        insight: "Du behöver inte vara perfekt – bara minska topparna.",
        body:
          "Dra ner på tillsatt socker, alkohol och starkt processad mat. Det syns på huden inom några veckor.",
        checklist: ["Jag får protein vid varje måltid", "Jag äter omega-3 regelbundet", "Jag har minskat tillsatt socker"],
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export const categories = Array.from(new Set(courses.map((c) => c.category)));
