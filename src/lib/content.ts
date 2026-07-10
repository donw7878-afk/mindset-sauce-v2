/**
 * All landing-page content in one place.
 * Module titles and signature lines are taken verbatim from the
 * uploaded cover artwork (assets/modules/) — never invent copy for them.
 */

export const CHAPTERS = [
  "I. Opening",
  "II. The Core Teaching",
  "III. The Practice",
  "IV. The Close",
] as const;

export interface ChapterInfo {
  title: string;
  desc: string;
  meta: string;
}

export interface Module {
  n: number;
  numeral: string;
  title: string;
  subtitle: string;
  line: string;
  image: string;
  /** Museum-plaque hover copy for the four chapters, in order. */
  chapters: ChapterInfo[];
}

export const MODULES: Module[] = [
  {
    n: 1,
    numeral: "01",
    title: "The Soil",
    subtitle: "Before the Seed",
    line: "Before anything can grow, the ground must be prepared.",
    image: "/images/modules/module1.png",
    chapters: [
      {
        title: "Prepare the Ground",
        desc: "Every Builder begins here. This chapter clears the mental clutter, exposes the beliefs you’ve been carrying, and prepares the ground before anything new can grow.",
        meta: "12 Minutes • Audio + Workbook",
      },
      {
        title: "The Soil Determines the Harvest",
        desc: "Most people believe better goals create better lives. In this lesson, you discover why the quality of your internal soil determines the outcome of every opportunity, relationship, and ambition long before action begins.",
        meta: "27 Minutes • Audio",
      },
      {
        title: "Condition the Soil",
        desc: "This guided Builder practice begins rebuilding your internal operating system through written reflection, visualization, and practical conditioning. Transformation starts with deliberate action, not passive learning.",
        meta: "18 Minutes • Workbook + Daily Executable",
      },
      {
        title: "Plant the First Seed",
        desc: "You finish this module with a focused conditioning sequence that prepares your mind to enter Module Two from an entirely new foundation.",
        meta: "8 Minutes • Audio",
      },
    ],
  },
  {
    n: 2,
    numeral: "02",
    title: "The Assumption",
    subtitle: "Assume It. See It. Feel It. Live It.",
    line: "What you assume to be true, you experience as reality.",
    image: "/images/modules/module2.png",
    chapters: [
      {
        title: "The Invisible Script",
        desc: "Every Builder carries assumptions they didn’t consciously choose. This opening chapter reveals how those hidden beliefs quietly shape your decisions, your confidence, and the future you expect before life ever confirms it.",
        meta: "10 Minutes • Audio + Workbook",
      },
      {
        title: "Assumptions Become Reality",
        desc: "Discover why your mind is constantly searching for evidence that supports what you already believe. Once you understand this principle, you’ll begin choosing assumptions that build your future instead of repeating your past.",
        meta: "24 Minutes • Audio",
      },
      {
        title: "Install New Assumptions",
        desc: "Through guided visualization, written conditioning, and deliberate repetition, you’ll begin replacing limiting assumptions with beliefs that support the Builder you’re becoming.",
        meta: "18 Minutes • Workbook + Daily Executable",
      },
      {
        title: "A New Lens",
        desc: "You’ll leave this module seeing opportunity differently because you’ve begun changing the assumptions through which you interpret your world.",
        meta: "7 Minutes • Audio",
      },
    ],
  },
  {
    n: 3,
    numeral: "03",
    title: "Burning Desire",
    subtitle: "The Fire Within",
    line: "The fire that survives doubt becomes destiny.",
    image: "/images/modules/module3.png",
    chapters: [
      {
        title: "Motion Creates Momentum",
        desc: "Ideas create inspiration. Action creates transformation. This chapter helps you break the cycle of overthinking by proving that momentum is built one deliberate step at a time.",
        meta: "9 Minutes • Audio",
      },
      {
        title: "Execution Changes Everything",
        desc: "Most people wait until they feel motivated. Builders understand that consistent action creates motivation—not the other way around. This lesson changes your relationship with discipline forever.",
        meta: "26 Minutes • Audio",
      },
      {
        title: "Build Momentum",
        desc: "Complete a series of practical Builder exercises designed to eliminate hesitation and create daily evidence that you are becoming someone who follows through.",
        meta: "20 Minutes • Workbook + Daily Executable",
      },
      {
        title: "Become Reliable",
        desc: "The goal isn’t perfection. It’s becoming the kind of person who keeps promises to themselves, one action at a time.",
        meta: "8 Minutes • Audio",
      },
    ],
  },
  {
    n: 4,
    numeral: "04",
    title: "Feeling Is the Secret",
    subtitle: "The Wish Fulfilled",
    line: "The body believes before the world confirms.",
    image: "/images/modules/module4.png",
    chapters: [
      {
        title: "Feel the Future",
        desc: "Your emotions aren’t just reactions—they’re signals shaping what your mind believes is possible. This chapter teaches you how Builders learn to feel success before they see it.",
        meta: "11 Minutes • Audio",
      },
      {
        title: "Emotion Drives Identity",
        desc: "Your nervous system is always learning. Discover how emotional conditioning reinforces identity and why repeated emotional states become the foundation for lasting transformation.",
        meta: "27 Minutes • Audio",
      },
      {
        title: "Condition Success",
        desc: "Use guided visualization, emotional rehearsal, and intentional repetition to train your mind to expect the future you’re creating instead of fearing it.",
        meta: "18 Minutes • Workbook + Visualization",
      },
      {
        title: "Carry the Feeling",
        desc: "You’ll leave this module with a repeatable process for intentionally choosing the emotional state you bring into every day.",
        meta: "8 Minutes • Audio",
      },
    ],
  },
  {
    n: 5,
    numeral: "05",
    title: "The Mirror and the Mouth",
    subtitle: "Speak It Into Being",
    line: "Your words are not describing your life. They are creating it.",
    image: "/images/modules/module5.png",
    chapters: [
      {
        title: "Words Build Worlds",
        desc: "Every sentence you repeat becomes another brick in your identity. This chapter reveals why the conversations you have with yourself are quietly shaping your future.",
        meta: "10 Minutes • Audio",
      },
      {
        title: "Identity Speaks First",
        desc: "Builders don’t use words to describe who they are. They use words to reinforce who they’re becoming. Learn how intentional language changes thought, behavior, and expectation.",
        meta: "23 Minutes • Audio",
      },
      {
        title: "Rewrite the Script",
        desc: "Create your own Builder declarations and daily language patterns that strengthen your new identity every time they’re spoken or written.",
        meta: "19 Minutes • Workbook + Declaration",
      },
      {
        title: "Speak Like a Builder",
        desc: "You’ll finish this module with a language framework that supports confidence, consistency, and long-term identity transformation.",
        meta: "7 Minutes • Audio",
      },
    ],
  },
  {
    n: 6,
    numeral: "06",
    title: "The Mastermind and the Environment",
    subtitle: "The Alliance That Multiplies Everything",
    line: "Your environment is either building your future or eroding it.",
    image: "/images/modules/module6.png",
    chapters: [
      {
        title: "Design Your Future",
        desc: "Your environment is always shaping you, whether you realize it or not. This opening chapter helps you recognize the invisible influences that either reinforce or undermine your growth.",
        meta: "10 Minutes • Audio",
      },
      {
        title: "Build an Environment That Builds You",
        desc: "Learn why lasting transformation rarely depends on willpower alone. Builders intentionally shape their surroundings so success becomes the natural outcome rather than a daily struggle.",
        meta: "25 Minutes • Audio",
      },
      {
        title: "Engineer Your Environment",
        desc: "Audit your physical space, digital inputs, routines, and relationships, then make practical adjustments that support the identity you’ve been building throughout the Institute.",
        meta: "20 Minutes • Workbook + Builder Exercise",
      },
      {
        title: "Walk Forward",
        desc: "This is not the end of your journey. It’s the beginning of living as the Builder you’ve intentionally created. The work continues—but now, so does the person capable of doing it.",
        meta: "9 Minutes • Audio",
      },
    ],
  },
];

/* ============ S2 — The Mirror ============ */

export interface Segment {
  t: string;
  gold?: boolean;
}

/** One beat = one internal realization. Lines of segments; `gold` marks antique-gold words. */
export type Beat = Segment[][];

export const MIRROR_BEATS: Beat[] = [
  [
    [{ t: "You’ve caught glimpses..." }],
    [{ t: "of the person you’re " }, { t: "capable", gold: true }, { t: " of becoming." }],
  ],
  [
    [{ t: "In your quietest moments..." }],
    [
      { t: "you’ve already seen the life you were " },
      { t: "meant", gold: true },
      { t: " to live." },
    ],
  ],
  [
    [{ t: "Then morning comes." }],
    [{ t: "The same ceiling." }],
    [{ t: "The same habits." }],
  ],
  [
    [{ t: "It was never the plan." }],
    [{ t: "It was the " }, { t: "person", gold: true }, { t: " trying to execute it." }],
  ],
  [
    [{ t: "Every new goal keeps landing in the same soil." }],
    [{ t: "Change the soil.", gold: true }],
    [{ t: "Everything changes." }],
  ],
  [
    [{ t: "The vault was never locked to keep you out." }],
    [{ t: "It was built to protect something " }, { t: "valuable", gold: true }, { t: "." }],
  ],
];

/** The seventh beat — stands alone, immediately before the modules appear. */
export const INTERLUDE_BEATS: Beat[] = [
  [
    [{ t: "Transformation doesn’t begin when your life changes." }],
    [{ t: "It begins when your " }, { t: "identity", gold: true }, { t: " does." }],
  ],
];

/* ============ S3 — The Institution ============ */

/** The parallel proof-statements, revealed one at a time. */
export const INSTITUTION_LINES = [
  "Every diet plan you have ever tried… works.",
  "Every exercise plan you’ve ever tried… works.",
  "Every girl you wanted to ask out but didn’t, would have said yes.",
  "Every business idea you ever had and lost, don’t fret, you’ll have more.",
  "Every different route your GPS gives you, will get you where you’re going.",
];

/** The interactive line — the flashing word cycles; the answer stays static. */
export const INSTITUTION_QUESTION_PREFIX =
  "What’s the secret to a successful relationship with your";
export const INSTITUTION_ANSWER = "Seeing it through… to the end.";

/** The flashing word: < 1s each, but Purpose and Time linger at 1.5s. */
export const FLASH_WORDS: { word: string; ms: number }[] = [
  { word: "Spouse", ms: 800 },
  { word: "God", ms: 800 },
  { word: "Career", ms: 800 },
  { word: "Kids", ms: 800 },
  { word: "Education", ms: 800 },
  { word: "Business", ms: 800 },
  { word: "Diet", ms: 800 },
  { word: "Money", ms: 800 },
  { word: "Body", ms: 800 },
  { word: "Past", ms: 800 },
  { word: "Purpose", ms: 1500 },
  { word: "Time", ms: 1500 },
];

export const INSTITUTION_QUOTE =
  "‘If you want to be somewhere on time, leave.’ — Papa";

export const INSTITUTION_CLOSING =
  "The common denominator is you. Unlock the vault today that allows everything locked up inside you to open up.";

export const PILLARS = [
  {
    title: "The System",
    copy: "Six modules in a deliberate sequence. Each one prepares the ground for the next. Nothing is filler. Nothing is optional.",
  },
  {
    title: "The Practice",
    copy: "Every module ends in practice, not notes. Daily executables, a workbook that demands ink, and a tracker that keeps score.",
  },
  {
    title: "The Proof",
    copy: "Progress is measured, streaks are counted, and completion is certified. What gets witnessed gets finished.",
  },
];

/* ============ S6 — Inside the Vault ============ */

export interface InventoryItem {
  title: string;
  copy: string;
  image?: string;
  sealed?: boolean;
  locked?: boolean;
  /** Artifact identity — keys the signature hover movement and sound. */
  slug?: string;
  /** Real cover artwork (rendered from the PDF), revealed on hover. */
  cover?: string;
  /** Museum-plaque tooltip: what it is, why it exists, when Builders use it. */
  tip?: string;
}

export const INVENTORY: InventoryItem[] = [
  {
    title: "The Course Book",
    copy: "The complete six-module system, written to be studied — not skimmed.",
    image: "/images/course-book.png",
  },
  {
    title: "The Audio Vault",
    copy: "Twenty-four chapters of guided transmission. Opening, teaching, practice, and close — for every module.",
    image: "/images/audio-vault.png",
    slug: "audio",
    tip: "The spoken spine of the Institute. Builders listen on walks, commutes, and quiet mornings — each chapter conditions the mind the written work then makes permanent.",
  },
  {
    title: "The Workbook",
    copy: "Where the teaching becomes handwriting, and handwriting becomes identity.",
    image: "/images/workbook.png",
    slug: "workbook",
    tip: "Where listening becomes commitment. Builders open it during every Practice chapter — what your hand writes, your identity keeps.",
  },
  {
    title: "The Transformation Tracker",
    copy: "A visible record of the person under construction.",
    slug: "tracker",
    cover: "/images/artifacts/tracker.png",
    tip: "Your progress, made visible. Builders mark it daily — a single unbroken line of evidence that the new identity is holding.",
  },
  {
    title: "Daily Executables",
    copy: "The non-negotiables. Small enough to do today. Heavy enough to matter.",
    slug: "executables",
    cover: "/images/artifacts/executables.png",
    tip: "The day's non-negotiables, distilled to one page. Builders run them every morning — transformation compounds through small, kept promises.",
  },
  {
    title: "The Owner's Manual",
    copy: "How to run the system — and yourself — for life.",
    slug: "manual",
    cover: "/images/artifacts/owners-manual.png",
    tip: "Read first, kept forever. It explains how the six modules fit together and how to run the system on the days motivation doesn't show up.",
  },
];

export const BONUSES: InventoryItem[] = [
  {
    title: "The Emergency Cards",
    copy: "For the moments the old mind comes back loud.",
    sealed: true,
    slug: "emergency",
    cover: "/images/artifacts/emergency-cards.png",
    tip: "Pocket-sized interventions for the hard moments. Builders reach for one when the old voice gets loud — each card interrupts a spiral and reinstalls the new pattern.",
  },
  {
    title: "The Declaration",
    copy: "Signed once. Binding forever.",
    sealed: true,
    slug: "declaration",
    cover: "/images/artifacts/declaration.png",
    tip: "A written commitment to the person you're becoming, signed in Module Five. Builders keep it visible — spoken word becomes standing order.",
  },
  {
    title: "Clear the Cache",
    copy: "The reset protocol for a cluttered inner ground.",
    sealed: true,
    slug: "cache",
    cover: "/images/artifacts/clear-cache.png",
    tip: "An evening reset protocol for a crowded mind. Builders run it at the end of loud days — clearing the residue so tomorrow starts on prepared ground.",
  },
  {
    title: "The Certificate",
    copy: "Earned at completion. Not before.",
    sealed: true,
    locked: true,
    slug: "certificate",
    cover: "/images/artifacts/certificate.png",
    tip: "Issued only at 24 of 24 chapters complete, bearing your name and Builder number. It certifies the work — and the person who did it.",
  },
];

/** S7 — The Builders. Swap entries here as real Builder testimonials arrive. */
export const BUILDERS = [
  {
    quote:
      "I’ve started more diets, businesses, morning routines, and personal development programs than I can count. I always believed I just needed a better plan. This was the first time someone showed me that the problem wasn’t the plan—it was the person trying to execute it. Everything clicked. For the first time in years, I’m actually following through.",
    name: "Sarah M.",
    detail: "Builder #014",
  },
  {
    quote:
      "My biggest problem wasn’t motivation. It was mental noise. My mind always had twenty tabs open. I could never focus long enough to build momentum. The Clear the Cache protocol alone changed the way I end every day. I wake up feeling like my brain finally belongs to me again.",
    name: "Jason R.",
    detail: "Builder #031",
  },
  {
    quote:
      "I didn’t buy another course. I joined an institution. Somewhere around Module Three I stopped asking, ‘Will this work?’ and started asking, ‘Who am I becoming?’ That question changed everything. I’m proud to call myself a Builder.",
    name: "Melissa T.",
    detail: "Builder #007",
  },
  {
    quote:
      "For years my life felt like I was running on a treadmill. I was busy all the time, but somehow never getting anywhere. The Mindset Sauce didn’t give me another productivity system. It rebuilt the operating system underneath everything else. My business is growing. I’ve lost twenty-three pounds. My marriage is better. None of those were the real transformation. I was.",
    name: "David L.",
    detail: "Builder #002",
  },
];

/* ============ S8 — The Ledger ============ */

export const LEDGER_ITEMS = [
  { label: "The Six-Module System", value: 697 },
  { label: "The Audio Vault™", value: 197 },
  { label: "The Workbook + Transformation Tracker", value: 197 },
  { label: "Daily Executables + Owner's Manual", value: 97 },
  { label: "The Sealed Bonus Resources", value: 197 },
];

export const LEDGER_TOTAL = LEDGER_ITEMS.reduce((s, i) => s + i.value, 0); // $1,385

export const REGULAR_PRICE = 397;
export const EARLY_PRICE = 97;
export const COUPON_CODE = "BUILDER97";

/* ============ The Builder Assessment ============ */

export interface AssessmentQuestion {
  q: string;
  /** Options ordered lowest → highest builder energy; index scores 1–4. */
  options: string[];
}

export const ASSESSMENT: AssessmentQuestion[] = [
  {
    q: "When you set a new goal, what usually happens after week one?",
    options: [
      "It's already fading.",
      "I push until life interrupts.",
      "I keep going, but inconsistently.",
      "I follow through to the end.",
    ],
  },
  {
    q: "The first thirty minutes of your morning are…",
    options: [
      "Phone, noise, other people's priorities.",
      "Rushed and reactive.",
      "Some intention, some drift.",
      "Deliberate. Almost ritual.",
    ],
  },
  {
    q: "When no one is watching, your standards…",
    options: [
      "Drop completely.",
      "Loosen more than I'd like to admit.",
      "Mostly hold.",
      "Are non-negotiable.",
    ],
  },
  {
    q: "The voice in your head speaks mostly in…",
    options: [
      "Doubt and criticism.",
      "Worry about what could go wrong.",
      "Neutral commentary.",
      "Conviction about who I'm becoming.",
    ],
  },
  {
    q: "Your environment — people, spaces, inputs — is…",
    options: [
      "Actively working against me.",
      "Mostly distracting me.",
      "Mixed. Some builds me, some drains me.",
      "Engineered to build me.",
    ],
  },
  {
    q: "When you picture the person you're becoming…",
    options: [
      "It's blurry.",
      "I see it, then dismiss it.",
      "I see it clearly and I want it.",
      "I already act from it.",
    ],
  },
  {
    q: "Looking at the last twelve months, what did you finish?",
    options: [
      "Honestly — very little.",
      "A few small things.",
      "Some things that mattered.",
      "Almost everything I started.",
    ],
  },
];

/* ============ Hidden scoring — the visitor only ever sees the interpretation ============ */

export type Dimension =
  | "identity"
  | "discipline"
  | "vision"
  | "emotionalControl"
  | "environment"
  | "momentum";

/** Which internal dimensions each of the seven questions feeds. */
const QUESTION_DIMENSIONS: Dimension[][] = [
  ["momentum", "discipline"], // Q1 — follow-through after week one
  ["discipline"], // Q2 — the first thirty minutes
  ["identity", "discipline"], // Q3 — standards when no one is watching
  ["identity", "emotionalControl"], // Q4 — the inner voice
  ["environment"], // Q5 — people, spaces, inputs
  ["vision", "identity"], // Q6 — picturing the person you're becoming
  ["momentum", "vision"], // Q7 — what you finished this year
];

const OBSTACLES: Record<Dimension, string> = {
  identity: "Identity Drift",
  discipline: "Inconsistent Standards",
  vision: "A Blurred Blueprint",
  emotionalControl: "The Loud Mind",
  environment: "An Eroding Environment",
  momentum: "Stalled Momentum",
};

export interface Archetype {
  key: string;
  title: string;
  strength: string;
  obstacle: string;
  recommendation: string;
  /** The emotional interpretation, revealed line by line. */
  interpretation: string[];
}

export const ARCHETYPES: Record<string, Archetype> = {
  dormant: {
    key: "dormant",
    title: "The Dormant Builder",
    strength: "Untouched capacity. Nothing has been spent.",
    obstacle: "An unprepared foundation.",
    recommendation: "Begin at Module One and stay there until the ground turns.",
    interpretation: [
      "Nothing in this report says you lack ability.",
      "It says your ability has been waiting on ground that was never prepared.",
      "That is not a flaw. It is a starting line.",
      "The Institute begins exactly where you are — at the soil.",
    ],
  },
  rebuilder: {
    key: "rebuilder",
    title: "The Rebuilder",
    strength: "Proven willingness to begin again.",
    obstacle: "Identity Drift.",
    recommendation: "Module One will feel like it was written about you. Start there. Slowly.",
    interpretation: [
      "You don’t lack potential.",
      "You’ve simply built inconsistent patterns around extraordinary ability.",
      "Nothing in this report says you’re incapable.",
      "It says you’ve been building from the wrong identity.",
      "That is exactly why Module One exists.",
    ],
  },
  vision: {
    key: "vision",
    title: "The Vision Builder",
    strength: "You see the finished structure before anyone else does.",
    obstacle: "The bridge between seeing and building.",
    recommendation: "Modules Three and Four convert what you see into what you build.",
    interpretation: [
      "Your mind already holds the blueprint. That part was never the problem.",
      "What this report shows is a gap between the vision and the hands.",
      "Vision without conditioning stays a beautiful picture.",
      "The Institute was built to close exactly that distance.",
    ],
  },
  disciplined: {
    key: "disciplined",
    title: "The Disciplined Builder",
    strength: "Your standards hold when no one is watching.",
    obstacle: "Structure without a compelling blueprint.",
    recommendation: "Module Two will aim your discipline at an identity worthy of it.",
    interpretation: [
      "You already do the hardest thing: you keep promises to yourself.",
      "What this report shows is discipline serving a blueprint too small for it.",
      "You don’t need more willpower.",
      "You need a vision that deserves the engine you’ve already built.",
    ],
  },
  catalyst: {
    key: "catalyst",
    title: "The Catalyst",
    strength: "You generate momentum other people borrow.",
    obstacle: "Sustaining the fire between sparks.",
    recommendation: "Module Four will teach your nervous system to hold what you ignite.",
    interpretation: [
      "Starting has never been your problem. You ignite easily and often.",
      "What this report shows is fire that burns bright, then unattended.",
      "The work ahead is not about more sparks.",
      "It is about becoming the kind of person the fire can live in.",
    ],
  },
  craftsman: {
    key: "craftsman",
    title: "The Craftsman",
    strength: "Patient, deliberate, compounding work.",
    obstacle: "Underestimating your own trajectory.",
    recommendation: "Module Five will give language to what your hands already know.",
    interpretation: [
      "You build quietly, carefully, and better than you admit.",
      "What this report shows is craft that outpaces the story you tell about yourself.",
      "The structure is sound. The narration is behind.",
      "The Institute will bring your words up to the level of your work.",
    ],
  },
  architect: {
    key: "architect",
    title: "The Architect",
    strength: "You design systems, not just efforts.",
    obstacle: "Carrying blueprints alone.",
    recommendation: "Module Six — the mastermind and the environment — is your multiplier.",
    interpretation: [
      "You think in structures. Most people around you think in tasks.",
      "What this report shows is a builder operating without a site crew.",
      "Alone, you will keep building well.",
      "Aligned, you will build things that outlast you.",
    ],
  },
  master: {
    key: "master",
    title: "The Master Builder",
    strength: "Identity, discipline, and vision already aligned.",
    obstacle: "Protecting what you’ve built from drift.",
    recommendation: "The Institute will sharpen and certify what you already practice.",
    interpretation: [
      "This report found something rare: alignment.",
      "Your identity, your standards, and your vision already point the same direction.",
      "Your work now is protection — because drift arrives quietly, and it arrives for everyone.",
      "The Institute exists to make what you practice permanent.",
    ],
  },
};

export interface BuilderReport {
  readiness: number; // Builder Readiness™, 0–100
  archetype: Archetype; // Builder Archetype™
  obstacle: string; // Primary Obstacle™ — from the weakest dimension
  dimensions: Record<Dimension, number>;
}

/** The visitor only ever sees the finished interpretation. Never the math. */
export function computeReport(answers: number[]): BuilderReport {
  const sums: Record<Dimension, { total: number; n: number }> = {
    identity: { total: 0, n: 0 },
    discipline: { total: 0, n: 0 },
    vision: { total: 0, n: 0 },
    emotionalControl: { total: 0, n: 0 },
    environment: { total: 0, n: 0 },
    momentum: { total: 0, n: 0 },
  };

  answers.forEach((a, qi) => {
    const score = ((a + 1) / 4) * 100; // option index 0–3 → 25–100
    (QUESTION_DIMENSIONS[qi] ?? []).forEach((d) => {
      sums[d].total += score;
      sums[d].n += 1;
    });
  });

  const dimensions = Object.fromEntries(
    (Object.keys(sums) as Dimension[]).map((d) => [
      d,
      sums[d].n ? Math.round(sums[d].total / sums[d].n) : 50,
    ])
  ) as Record<Dimension, number>;

  const readiness = Math.round(
    answers.reduce((s, a) => s + a + 1, 0) / (answers.length * 4) * 100
  );

  const dims = Object.entries(dimensions) as [Dimension, number][];
  const weakest = dims.reduce((min, d) => (d[1] < min[1] ? d : min))[0];
  const strongest = dims.reduce((max, d) => (d[1] > max[1] ? d : max))[0];

  let key: string;
  if (readiness < 35) key = "dormant";
  else if (readiness < 50) key = "rebuilder";
  else if (readiness < 65) {
    key =
      strongest === "vision"
        ? "vision"
        : strongest === "discipline"
          ? "disciplined"
          : "catalyst";
  } else if (readiness < 80) {
    key =
      strongest === "discipline"
        ? "craftsman"
        : strongest === "vision"
          ? "architect"
          : "catalyst";
  } else if (readiness < 92) {
    key = strongest === "discipline" ? "craftsman" : "architect";
  } else {
    key = "master";
  }

  return {
    readiness,
    archetype: ARCHETYPES[key],
    obstacle: OBSTACLES[weakest],
    dimensions,
  };
}

/** Builder Number™ — the member's permanent Institute identity (deterministic per email). */
export function builderNumberFor(email: string): string {
  let h = 0;
  for (const c of email.toLowerCase().trim()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 1000 + (h % 9000);
  return `#${String(n).padStart(6, "0")}`;
}
