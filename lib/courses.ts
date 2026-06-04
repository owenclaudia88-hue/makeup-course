// Course catalogue for the Luumora platform. Pure data — add a course by
// appending to `courses`. The UI renders any number of courses/lessons.

import { courseVideos } from "../data/course-videos";

export type Lesson = {
  title: string;
  insight: string;
  body: string;
  steps?: string[];
  checklist?: string[];
  /** Engagement: 3–5 short takeaways rendered after the lesson body. */
  takeaways?: string[];
};

export type VideoLesson = {
  title: string;
  videoId?: string; // Bunny Stream GUID; assigned by sync once uploaded
  durationSeconds?: number; // Source-of-truth for the sync script's duration match
  /** Engagement: 3–5 short takeaways rendered under the video. */
  takeaways?: string[];
};

export type Module = {
  title: string;
  lessons: VideoLesson[];
};

export type Instructor = {
  name: string;
  bio: string[]; // paragraphs
  credentials?: string[];
  education?: string[];
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutesPerDay: number;
  summary: string;
  // Text lessons (used when there's no PDF or video).
  lessons?: Lesson[];
  // true = part of the legacy intro bundle (everyone who paid /checkout owns
  // these forever). Per-user ownership data in lib/ownership.ts handles
  // future per-course funnels.
  core?: boolean;
  // Filename in /protected. Renders the full PDF in an embedded reader.
  pdf?: string;
  // Legacy flat video list (one anonymous module). Prefer `modules` going forward.
  videoLessons?: { title: string; videoId: string }[];
  // Module-grouped video lessons. Renders the gated player + lesson list.
  modules?: Module[];
  // Rich course-page content rendered below the player/lessons.
  description?: string[]; // long-form paragraphs
  learningOutcomes?: string[]; // "What you'll learn"
  whoFor?: string[]; // "Who this is for"
  instructor?: Instructor;
  // Per-course landing-page sales config. When set, `/courses/<slug>` sells
  // the course as a one-time purchase. Slugs listed in `bundle` are also
  // granted (lifetime) on purchase.
  landing?: {
    tagline?: string; // short hero subhead
    priceUsd?: number; // smallest unit (cents). Default: 3900 = $39.
    regularPriceUsd?: number; // anchor price shown struck-through. Default: 19000 = $190.
    bundle?: string[]; // other course slugs granted on purchase
    socialProof?: string; // e.g. "Loved by 16,000+ members"
  };
};

/** Cover image path for a course (drop <slug>.webp into public/kurser/). */
export function coverFor(slug: string): string {
  return `/kurser/${slug}.webp`;
}

export const courses: Course[] = [
  {
    slug: "makeup40",
    pdf: "10MinMakeup40_Masterkurs_Svenska.pdf",
    title: "10-Minute Makeup 40+: The Masterclass",
    category: "Masterclass",
    level: "Beginner",
    minutesPerDay: 10,
    core: true,
    summary:
      "The full pro playbook for looking fresher, brighter, and more like yourself — in ten minutes flat. Nine focused lessons, the techniques makeup artists use on mature skin, and one complete routine you'll repeat for years.",
    lessons: [
      {
        title: "Why most makeup actually adds years",
        insight: "Five quiet habits make mature skin look older — and more product almost always makes it worse.",
        body:
          "Heavy foundation, harsh lower eyeliner, skipping primer, the wrong concealer, and a fully matte finish are the quiet age-adders. The fix is almost always subtraction, not addition — and once you see why, you can't unsee it.",
        checklist: [
          "I can name the five aging habits",
          "I understand why less product wins after 40",
        ],
      },
      {
        title: "Skin prep: the foundation under your foundation",
        insight: "Two minutes of prep does 60% of the work — everything else lasts longer because of it.",
        body:
          "Skipping prep is the biggest reason makeup creases, slides, or sits weird. A light, hydrating routine takes 120 seconds and turns the rest of the routine into a different game.",
        steps: [
          "Lightweight hydrating cream, patted in",
          "Eye cream tapped under the eye and over the lid",
          "Luminous primer on the T-zone and high points of the cheeks",
        ],
      },
      {
        title: "Foundation that won't cake",
        insight: "Satin finish + damp sponge + thin layers = even skin without amplifying lines.",
        body:
          "Most people use three times too much foundation. Build from the center outward and only add more where it's actually needed. The sponge is the secret — never drag, always press.",
        steps: [
          "Pick a satin or dewy finish, light coverage",
          "Damp sponge, press from the center outward",
          "Second pass only over redness or uneven patches",
        ],
      },
      {
        title: "Concealer masterclass",
        insight: "Draw an upside-down triangle under the eye — never a line — and the whole face lifts.",
        body:
          "If your dark circles are stubborn, color-correct with peach first. Then match your skin tone and stipple — don't drag. A whisper of powder only where you'll crease.",
        steps: [
          "Peach corrector if circles are deep",
          "Concealer in an inverted triangle, not a line",
          "Stipple to blend, set lightly",
        ],
      },
      {
        title: "The eye-lift effect (without heavy liner)",
        insight: "Liner along the upper lash line + a darker outer V lifts the eye more than any tutorial trick.",
        body:
          "Heavy lower liner drags the eye downward — the opposite of what you want. A pop of highlight in the inner corner opens the gaze. Warm shadow on the lid, mid-tone in the outer V.",
        steps: [
          "Liner pressed into the upper lash line",
          "Warm shadow across the lid, deeper in the outer V",
          "Inner-corner highlight to open the eye",
        ],
      },
      {
        title: "Brows that frame and quietly take years off",
        insight: "Soft, naturally filled brows are the fastest age-erasing change you can make.",
        body:
          "Fill only the sparse spots — pencil one shade lighter than your hair — and brush up with clear gel. Drawn-in brows read as drawn-in. Yours never should.",
        checklist: [
          "Soft pencil, not waxy",
          "One shade lighter than the hair",
          "Brushed up and set with clear gel",
        ],
      },
      {
        title: "Blush, bronzer & highlight for 40+",
        insight: "Place color upward and outward — never down. Gravity does enough work already.",
        body:
          "Cream blush on the apples blended toward the temples. Matte bronzer along the natural light-hit angles. Highlight on the cheekbones, the inner corners of the eyes, and the cupid's bow — nowhere else.",
        steps: [
          "Cream blush on the apples, blended up toward the temples",
          "Matte bronzer along the natural light-hit angles",
          "Highlight: cheekbones, inner eye corners, cupid's bow",
        ],
      },
      {
        title: "Lips that don't bleed or flatten",
        insight: "Liner is the most important lip step after 40 — even if you've never used it before.",
        body:
          "Fill the whole lip with liner before lipstick. It stops bleed-out, adds dimension, and gives the lipstick a stable base. A drop of gloss in the very center adds fullness without sticky overload.",
        steps: [
          "Liner across the whole lip, not just the edge",
          "Satin or cream lipstick on top",
          "A tiny dot of gloss in the very center",
        ],
      },
      {
        title: "Your complete 10-minute routine",
        insight: "Same order, same timing, same result — that's how makeup artists do it on every face.",
        body:
          "Putting it all together: prep, base, concealer, brows, eyes, cheeks, highlight, lips, daylight check. Repeat for a week and it becomes muscle memory.",
        checklist: [
          "I know the full sequence in order",
          "I can run it in 10 minutes",
          "I always do a daylight check before leaving",
        ],
      },
    ],
  },
  {
    slug: "face-sculpt",
    pdf: "FaceSculpt_AlltIEtt_Svenska.pdf",
    title: "Face Sculpt: All-in-one ritual for a younger face",
    category: "Bonus",
    level: "Beginner",
    minutesPerDay: 5,
    core: true,
    summary:
      "A daily five-minute ritual that lifts, defines, and brings back the glow — using just your hands and a few simple tools. No needles, no harsh products, no gym.",
    lessons: [
      {
        title: "The foundations of the ritual",
        insight: "Consistency beats intensity — five minutes daily creates the lift big appointments can't.",
        body:
          "This ritual blends light massage, lifting holds, and tension release. Use a face oil so your hands or a gua sha glide softly — never drag dry skin.",
      },
      {
        title: "Lift and define",
        insight: "Always work upward and outward along the face's natural lines.",
        body:
          "These moves activate the muscles that hold up your cheekbones and jawline, and release the spots where your face quietly clenches all day.",
        steps: [
          "Knuckle massage along the jaw, from chin to ear × 10",
          "Lifting strokes across the cheeks toward the temples",
          "Press and release along the brow bone",
        ],
      },
      {
        title: "Release & glow",
        insight: "Letting go of tension does as much as lifting — sometimes more.",
        body:
          "End by softening the jaw, forehead, and temples. Less tension = a smoother resting expression and better circulation, which is what a glow actually is.",
        checklist: [
          "I do the ritual every day",
          "I work upward and outward, never down",
          "I finish by releasing the jaw and forehead",
        ],
      },
    ],
  },
  {
    slug: "lymfdetox-21",
    pdf: "21Dagars_LymfDetox_Svenska.pdf",
    title: "21-Day Lymph Detox: A slimmer face & lighter body",
    category: "Bonus",
    level: "Beginner",
    minutesPerDay: 10,
    core: true,
    summary:
      "Three weeks of daily lymphatic drainage and simple supporting habits. By day 7 your face looks less puffy in the mirror — by day 21 it's a habit you keep.",
    lessons: [
      {
        title: "How the program works",
        insight: "Three weeks builds the habit — and the swelling visibly drops along the way.",
        body:
          "Each day is a short lymph routine for the face and body, plus one tiny supporting habit (water, movement, breath). Small things, every day, compound into a different face by week three.",
      },
      {
        title: "Your daily lymph routine",
        insight: "Light pressure toward the lymph nodes — never hard.",
        body:
          "The same sequence every day quietly clears fluid from your face, throat, and body. Lymph sits right under the skin — a gentle touch is all you need.",
        steps: [
          "Pump gently at the collarbones × 10",
          "Stroke from the center of the face outward toward the ears",
          "Brush the body toward the heart (dry brush or hands)",
        ],
      },
      {
        title: "The habits that amplify it",
        insight: "Lymph moves on water, movement, and breath. Add those and your results double.",
        body:
          "Pair the massage with enough water, a daily walk, and a few deep belly breaths. Together they're the difference between a temporary depuff and a face that actually changes.",
        checklist: [
          "I do the lymph routine every day",
          "I drink enough water",
          "I move my body daily, even if just a walk",
        ],
      },
    ],
  },
  {
    slug: "ansiktslyft",
    pdf: "Ansiktslyft_SkulpteraDittAnsikte_Svenska.pdf",
    title: "Face Lifting: Sculpt your face & look years younger",
    category: "Bonus",
    level: "Beginner",
    minutesPerDay: 8,
    core: true,
    summary:
      "Targeted strength training for the muscles that hold your face up. Eight minutes a day — no needles, no gym — and a visible lift you'll start noticing in a couple of weeks.",
    lessons: [
      {
        title: "Why muscle work actually lifts a face",
        insight: "Strong facial muscles hold up the skin on top — exactly the same way they do in the body.",
        body:
          "When the muscles under your skin lose tone, the features above them sink. Targeted training brings the tone back and the lift follows. It's the same logic as a Pilates class — applied above the neck.",
      },
      {
        title: "The lifting exercises, step by step",
        insight: "Isolate each muscle and squeeze — never drag, pinch, or pull the skin.",
        body:
          "Three core moves activate the cheeks, jaw, and forehead in turn. Done slowly with intent, they're more effective than any extra cream.",
        steps: [
          "Cheek lift: smile with mouth closed, press up gently on the cheekbones, hold 5s × 10",
          "Jawline: push the lower jaw forward, hold 5s × 10",
          "Forehead: hold the brows down with your fingers, lift them against the resistance × 10",
        ],
      },
      {
        title: "The rhythm — and when results show",
        insight: "Daily, short, focused. Like any strength training, regularity beats intensity.",
        body:
          "Do the routine every day for two weeks before judging it. By week three, friends start asking what you changed.",
        checklist: [
          "I do the exercises every day",
          "I train the muscles, not the skin",
          "I give it at least three weeks before deciding",
        ],
      },
    ],
  },
  {
    slug: "natural-face-lift",
    title: "Natural Face Lift: Face workout, massage & deep relaxation",
    category: "Bonus",
    level: "Beginner",
    minutesPerDay: 10,
    core: true,
    summary:
      "A complete, needle-free face lift — short targeted techniques, full-face workouts, and relaxing massage. 30 lessons across three modules, from Face Scan and Natural Botox to Gua Sha.",
    description: [
      "Natural Face Lift is a full face-fitness course built for visible, sustainable change without injections or invasive treatments. It treats the face as part of a whole system — neck, jaw, circulation, lymph flow, and muscle balance — so the results actually stick.",
      "The course opens with awareness and prep practices like the Face Scan and gentle eye rotations. They help you reconnect with your face, spot where you're holding tension, and prepare the tissue for real work.",
      "From there you'll move through targeted exercises for every key area: forehead and frown lines, eyes, cheeks, mouth, jaw and TMJ, and the neck. Signature moves like Natural Botox, Super Cheeks, Yum Yum, Super Boost, Swan Neck, and Koala Neck activate the muscles that have gone quiet and relax the ones that overwork — restoring balance to the face.",
      "Self-massage and breathwork are woven through every module to support blood flow, lymphatic drainage, and nervous-system regulation. Each Module 1 lesson is short and focused (40–90 seconds), so you can stack them into a custom morning ritual or follow the full sequence.",
      "Practiced consistently, students typically report reduced jaw and facial tension, improved muscle tone and balance, better circulation and lymph flow, a more lifted and rested appearance, and a quiet new awareness of how they carry their face all day.",
    ],
    learningOutcomes: [
      "Understand the muscles, fascia, and skin behind every facial change",
      "Master targeted face-yoga and toning techniques",
      "Release jaw, forehead, and eye tension with stress-relief practice",
      "Use lymphatic drainage and self-massage to reduce puffiness",
      "Build simple, repeatable rituals you can actually do daily",
      "See visible improvements in tone, lift, and glow with consistent practice",
    ],
    whoFor: [
      "Anyone who wants a natural, non-invasive face lift",
      "People carrying facial tension, stress, or early signs of aging",
      "Wellness-minded women who value self-care, mindfulness, and body awareness",
      "Beginners and experienced practitioners alike — no prior experience needed",
    ],
    instructor: {
      name: "Ivana Vujović",
      bio: [
        "Ivana Vujović is a certified Mat & Reformer Pilates instructor, 500-hour yoga teacher (Hatha & Vinyasa), and certified Face Yoga coach with a professional focus on face lifting, facial sculpting, and buccal massage.",
        "She has taught yoga, face yoga, Pilates, and Yogilates in studios, retreats, and private and public settings since 2019 — across Stuttgart, Bali, Montenegro, and Dubai.",
      ],
      credentials: [
        "Yoga Loft Süd, Stuttgart (2023–present)",
        "Stuttgart office and college settings (2022–present)",
        "Teaching in Bali (2022)",
        "Yoga Studio Podgorica, Montenegro (2021)",
        "Online teaching (2019–present)",
        "Private sessions and public beach yoga in Dubai (2019)",
      ],
      education: [
        "Reformer Pilates Training, Body Athletica, Bali (2025)",
        "Pilates Training, Stuttgart, Germany (2025)",
        "Face Lift, Sculpt & Buccal Massage, Olivia Szmidt, Vienna (2025)",
        "Yogilates Training (online, 2024)",
        "300h Yoga Teacher Training (Hatha & Vinyasa), Bali (2022)",
        "200h Hatha Yoga Teacher Training, Rishikesh, India (2019)",
        "Face Yoga Method, Fumiko Takatsu (online, 2019)",
      ],
    },
    modules: [
      {
        title: "Module 1: Face techniques — Natural Face Lift",
        lessons: [
          { title: "Face Scan", durationSeconds: 77 },
          { title: "+X (Eye Rotation)", durationSeconds: 75 },
          { title: "Frown Lines", durationSeconds: 57 },
          { title: "Natural Botox", durationSeconds: 53 },
          { title: "Face Lift – Forehead", durationSeconds: 66 },
          { title: "Quick Face Lift", durationSeconds: 84 },
          { title: "WOW", durationSeconds: 44 },
          { title: "Stress Relief – Eyes", durationSeconds: 50 },
          { title: "Fox", durationSeconds: 86 },
          { title: "Koala Neck", durationSeconds: 49 },
          { title: "Circle", durationSeconds: 88 },
          { title: "Yum Yum", durationSeconds: 66 },
          { title: "2 in 1", durationSeconds: 78 },
          { title: "Super Cheeks", durationSeconds: 59 },
          { title: "Yum Yum – Advanced", durationSeconds: 47 },
          { title: "Super Boost", durationSeconds: 53 },
          { title: "Super Boost – Advanced", durationSeconds: 44 },
          { title: "Cheek Relaxation", durationSeconds: 43 },
          { title: "Tapping", durationSeconds: 94 },
          { title: "TMJ Relief", durationSeconds: 68 },
          { title: "Swan Neck", durationSeconds: 57 },
          { title: "Hot Tea", durationSeconds: 78 },
          { title: "Love", durationSeconds: 69 },
          { title: "Bonus: Side Nodding", durationSeconds: 62 },
        ],
      },
      {
        title: "Module 2: The full-face workouts",
        lessons: [
          { title: "FaceLift – Upper face", durationSeconds: 911 },
          { title: "FaceLift – Mid face", durationSeconds: 664 },
          { title: "FaceLift – Lower face", durationSeconds: 697 },
          { title: "Full FaceLift", durationSeconds: 632 },
        ],
      },
      {
        title: "Module 3: Bonus — Massage & Gua Sha",
        lessons: [
          { title: "FaceLift & Detox Massage", durationSeconds: 415 },
          { title: "Gua Sha Massage", durationSeconds: 929 },
        ],
      },
    ],
  },
  {
    slug: "ansiktsyoga",
    pdf: "ansiktsyoga.pdf",
    title: "Face Yoga: Lift your face in 10 minutes",
    category: "Beauty",
    level: "Beginner",
    minutesPerDay: 10,
    summary:
      "Simple daily exercises that strengthen the muscles, boost circulation, and give a real, natural lift — no needles, no devices, no expensive appointments.",
    lessons: [
      {
        title: "Why face yoga actually works",
        insight: "Your face has 40+ muscles — untrained, they lose tone the same way the body does.",
        body:
          "Regular gentle activation drives blood flow, stimulates collagen, and stops the face from looking tired and sunken. The key is soft, controlled moves — never dragging the skin.",
        checklist: [
          "I understand results come from consistency",
          "I always work the muscles, not the skin",
        ],
      },
      {
        title: "Warm-up & lymph drainage",
        insight: "Always start by clearing the lymph — less puffiness is an instantly sharper face.",
        body:
          "With clean hands, sweep lightly from the center of the face outward toward the ears, then down the neck. Light pressure is enough — lymph sits just under the skin.",
        steps: [
          "Sweep from the nose outward across the cheeks toward the ears × 10",
          "From the jaw down the neck toward the collarbones × 10",
          "Light tapping around the eyes with your ring finger",
        ],
      },
      {
        title: "Cheek & jaw lift",
        insight: "The smile you train is the smile that holds your cheeks up.",
        body:
          "These moves activate the major muscles that hold the mid-face up and define the jawline.",
        steps: [
          "Smile wide with mouth closed, press up gently on the cheekbones, hold 5s × 10",
          "Push the lower jaw forward, feel the line along the jaw, hold 5s × 10",
          "Puff the cheeks with air and move it side to side × 10",
        ],
      },
      {
        title: "Forehead & eye area",
        insight: "Tension in the forehead creates lines — soften it instead of frowning through it.",
        body:
          "We release forehead tension and open the gaze without overworking the delicate area around the eyes.",
        steps: [
          "Place fingers above the brows, press gently down while lifting the brows × 10",
          "Open eyes wide, look up, hold 5s × 5",
          "Massage the temples in small circles",
        ],
      },
      {
        title: "Your 10-minute routine",
        insight: "The same routine every day beats a long routine once in a while.",
        body:
          "Put it all together: 2 min lymph, 5 min lifting, 2 min forehead/eyes, 1 min release. Do it first thing or while watching TV.",
        checklist: [
          "I have a fixed time of day for it",
          "I run the whole sequence in about 10 minutes",
          "I finish with a few deep breaths",
        ],
      },
    ],
  },
  {
    slug: "hudvard-40",
    pdf: "hudvard-40.pdf",
    title: "Skincare After 40: The minimalist routine that works",
    category: "Beauty",
    level: "Beginner",
    minutesPerDay: 5,
    summary:
      "Build a simple, effective skincare routine tuned for mature skin — the right ingredients in the right order for hydration, glow, and fewer lines.",
    lessons: [
      {
        title: "How your skin actually changes after 40",
        insight: "Less collagen, less natural oil — the focus shifts to hydration and protection.",
        body:
          "Thinner skin, less sebum, and slower cell renewal mean dryness and dullness creep in. The job of the routine becomes: hydrate, protect, and gently renew. Nothing fancy required.",
      },
      {
        title: "Cleansing & hydration",
        insight: "Never strip — gentle cleansing followed by serious hydration.",
        body:
          "Use a creamy, gentle cleanser at night and just water or a very mild cleanser in the morning. Lock in moisture with a serum + cream while the skin is still slightly damp.",
        steps: [
          "Gentle cleanser",
          "Hydrating serum (hyaluronic acid is a safe bet)",
          "Moisturizer over still-damp skin",
          "Morning: finish with SPF",
        ],
      },
      {
        title: "The three actives that actually move the needle",
        insight: "SPF, vitamin C, and retinol — start there, ignore the rest.",
        body:
          "SPF every morning is the single most anti-aging thing you can do. Vitamin C in the day adds glow and protection; retinol at night kickstarts renewal — start slow, twice a week.",
        checklist: [
          "I use SPF every morning",
          "I'm introducing retinol slowly",
          "My skin tolerates my actives without redness",
        ],
      },
      {
        title: "The evening routine",
        insight: "Night is when skin repairs — give it the tools.",
        body:
          "Remove the day's makeup and pollution, apply your treatment actives, and lock everything in with a richer night cream. A few weeks of consistency does the rest.",
      },
    ],
  },
  {
    slug: "battre-somn",
    pdf: "battre-somn.pdf",
    title: "Better Sleep: An evening routine that actually works",
    category: "Wellness",
    level: "Beginner",
    minutesPerDay: 15,
    summary:
      "Fall asleep easier and wake up actually rested with a simple evening routine built on how your body's sleep system really works.",
    lessons: [
      {
        title: "Why sleep is your best beauty treatment",
        insight: "Deep sleep is when the skin, brain, and mood are repaired.",
        body:
          "Bad sleep shows up immediately — dull skin, puffy eyes, lower mood, sugar cravings. Improving sleep is the single most underrated habit for both how you look and how you feel.",
      },
      {
        title: "Light & screens",
        insight: "Light controls your circadian rhythm more than anything else does.",
        body:
          "Bright and blue light at night tells the brain it's still daytime. Dim the lamps 1–2 hours before bed and put screens away, or at minimum use night mode.",
        steps: [
          "Dim the lights after dinner",
          "Screen-free in the last 30–60 minutes",
          "Get daylight on your face early in the morning",
        ],
      },
      {
        title: "Your evening routine, step by step",
        insight: "The same calm sequence every night becomes a sleep signal.",
        body:
          "Your body loves predictability. A short, fixed routine becomes a cue that helps you fall asleep faster over time.",
        steps: [
          "Same bedtime every night",
          "Cool, dark, quiet bedroom",
          "Calm activity: reading, stretching, shower",
          "Write tomorrow's thoughts down to empty the head",
        ],
      },
      {
        title: "Breathing yourself to sleep",
        insight: "A slow exhale calms the nervous system in minutes.",
        body:
          "Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Repeat four times. The long exhale activates your body's rest-and-digest mode.",
        checklist: [
          "I have a fixed bedtime",
          "My bedroom is cool and dark",
          "I use breath when my thoughts spiral",
        ],
      },
    ],
  },
  {
    slug: "lugn-pa-10-min",
    title: "Calm in 10 Minutes: Stress management for real life",
    category: "Wellness",
    level: "Beginner",
    minutesPerDay: 10,
    summary:
      "Practical tools to wind down fast, break a stress spiral, and weave small pockets of calm into a busy day.",
    lessons: [
      {
        title: "What stress actually does to your body",
        insight: "Stress isn't in your head — it's a body-wide alarm you can switch off.",
        body:
          "Chronic stress raises cortisol and disrupts sleep, digestion, and skin. The good news: you can actively signal to your body that the danger is over.",
      },
      {
        title: "Fast wind-down",
        insight: "Three long exhales can drop your stress level in real time.",
        body:
          "When you feel tense: stop, release the shoulders, and take three conscious breaths with a longer exhale than inhale.",
        steps: [
          "Release the jaw and shoulders",
          "Exhale slowly through the mouth",
          "Name the feeling: 'I'm feeling stressed' — naming it loosens its grip",
        ],
      },
      {
        title: "The daily micro-break",
        insight: "Frequent short breaks beat one long break, every time.",
        body:
          "Slip 2–3 minute micro-breaks into your day: a short walk, a glass of water in quiet, or even just a stare out the window. It resets your nervous system.",
        checklist: [
          "I take at least one micro-break each morning",
          "I use breath when stress rises",
          "I close my day with something calming",
        ],
      },
    ],
  },
  {
    slug: "sjalvkansla",
    title: "Self-Esteem & Confidence: The quiet rebuild",
    category: "Personal growth",
    level: "Intermediate",
    minutesPerDay: 10,
    summary:
      "Understand the real difference between self-esteem and confidence — then build both with concrete daily practices that actually compound.",
    lessons: [
      {
        title: "Self-esteem vs confidence",
        insight: "Confidence is what you can do; self-esteem is that you're enough either way.",
        body:
          "You can have high confidence at work and low self-esteem underneath. They're built differently — and both can be strengthened with intention.",
      },
      {
        title: "The inner critic",
        insight: "You don't have to believe every voice in your head.",
        body:
          "Notice the harsh self-criticism and ask: would I say this to a friend? Replace the verdict with what you'd actually say to someone you care about.",
        steps: [
          "Catch the critical thought",
          "Ask: is it true and useful?",
          "Rewrite it kindly but honestly",
        ],
      },
      {
        title: "Body language changes how you feel",
        insight: "Posture shapes mood just as much as mood shapes posture.",
        body:
          "Stand tall, lower the shoulders, lift the gaze. Even a minute in an open, stable posture can raise the felt sense of calm and steadiness.",
      },
      {
        title: "The daily practice",
        insight: "Self-esteem is built from small proofs you give yourself every day.",
        body:
          "Keep one small promise to yourself daily and note three things you did well. Over time, the inner story about who you are quietly rewrites itself.",
        checklist: [
          "I notice and soften self-criticism",
          "I keep small promises to myself",
          "I write down one thing I did well each day",
        ],
      },
    ],
  },
  {
    slug: "energirik-morgon",
    title: "Energirik morgonrutin",
    category: "Wellness",
    level: "Beginner",
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
    category: "Beauty",
    level: "Beginner",
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
    category: "Beauty",
    level: "Beginner",
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
    category: "Wellness",
    level: "Beginner",
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
    category: "Health",
    level: "Beginner",
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
    category: "Style",
    level: "Intermediate",
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
    category: "Health",
    level: "Beginner",
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
    category: "Wellness",
    level: "Beginner",
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
    category: "Personal growth",
    level: "Beginner",
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
    category: "Beauty",
    level: "Beginner",
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
    category: "Health",
    level: "Intermediate",
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
  const c = courses.find((x) => x.slug === slug);
  return c ? mergeBunnyVideos(c) : undefined;
}

/** Apply Bunny GUIDs from data/course-videos.ts onto a course's modules. */
function mergeBunnyVideos(c: Course): Course {
  const map = courseVideos[c.slug];
  if (!map || !c.modules) return c;
  return {
    ...c,
    modules: c.modules.map((mod, mi) => ({
      ...mod,
      lessons: mod.lessons.map((l, li) => {
        const hit = map.find((x) => x.m === mi && x.l === li);
        return hit ? { ...l, videoId: hit.videoId } : l;
      }),
    })),
  };
}

/** Total number of lessons regardless of whether the course is video, PDF, or text. */
export function getLessonCount(c: Course): number {
  if (c.modules) return c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  if (c.videoLessons) return c.videoLessons.length;
  return c.lessons?.length ?? 0;
}

export const categories = Array.from(new Set(courses.map((c) => c.category)));
