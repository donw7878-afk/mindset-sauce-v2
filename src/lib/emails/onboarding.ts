import { type Sender, SITE_URL } from "./resend";
import {
  vaultEmail,
  overline,
  heading,
  p,
  goldLine,
  cta,
  signoff,
  firstNameOf,
  emailStyles,
} from "./template";

/**
 * The Builder Path — the 7-email post-purchase onboarding drip.
 *
 * Scheduled in full by the Stripe webhook at purchase (days 0–21, inside
 * Resend's 30-day window). Email 1 goes out two hours after the Access
 * Granted receipt so day zero doesn't stack two emails in one minute.
 *
 * Voice: the Builder is already inside — no selling, no urgency. vault@
 * speaks as the Institute; don@ letters (Nº 3, 5, 6) are personal.
 * Every destination is the Builder Portal.
 */

export type BuilderLike = {
  email: string;
  name: string;
  builderNumber?: string | null;
};

export type OnboardingEmail = {
  /** Days after purchase (0 = purchase day). */
  day: number;
  /** Extra offset within the day, in hours. */
  hours?: number;
  from: Sender;
  subject: (b: BuilderLike) => string;
  preheader: string;
  html: (b: BuilderLike) => string;
};

const VAULT_URL = `${SITE_URL}/vault`;
const REASON = "You are receiving this because you are a Builder inside the Institute.";

const pathHead = (no: number) =>
  overline(`The Builder Path — Nº ${String(no).padStart(2, "0")} of 07`);

const soft = (href: string, label: string) =>
  `<p style="margin:26px 0 0;font-family:${emailStyles.SANS};font-size:14px;"><a href="${href}" style="color:${emailStyles.GOLD};">${label} &rarr;</a></p>`;

export const ONBOARDING_SEQUENCE: OnboardingEmail[] = [
  {
    day: 0,
    hours: 2,
    from: "vault",
    subject: (b) => `Welcome inside, ${firstNameOf(b.name)} — start with the Owner's Manual`,
    preheader: "Ten minutes. Then everything else makes sense.",
    html: (b) => {
      const first = firstNameOf(b.name);
      return vaultEmail({
        preheader: "Ten minutes. Then everything else makes sense.",
        reason: REASON,
        body: [
          pathHead(1),
          heading(`The vault is yours now, ${first}.`),
          p(
            `Everything is on the other side of your dashboard: six chambers, twenty-four audio sessions, the Workbook, the Tracker, the Executables, and every sealed bonus in the inventory.`
          ),
          p(
            `Do not binge it. The Institute is a combination, not a library — and the first number on the dial is the smallest artifact in the vault: the <strong style="color:${emailStyles.GOLD};">Owner's Manual</strong>. Ten minutes. It explains how the six modules interlock, and how to run the system on the days motivation doesn't show up.`
          ),
          goldLine(`Read the manual before you touch the machine. Builders maintain what they own.`),
          p(
            `Your dashboard is already keeping score — your Builder Score, your streak, today's mission. It knows where you are. All you have to do is show up to it.`
          ),
          cta("Enter the Builder Dashboard", VAULT_URL),
        ].join(""),
      });
    },
  },
  {
    day: 1,
    from: "vault",
    subject: () => `How to use the Workbook — your transformation starts on paper`,
    preheader: "What your hand writes, your identity keeps.",
    html: () =>
      vaultEmail({
        preheader: "What your hand writes, your identity keeps.",
        reason: REASON,
        body: [
          pathHead(2),
          heading(`Ink is the technology.`),
          p(
            `Every chamber in the Institute runs in four movements, and the third — <strong style="color:${emailStyles.GOLD};">The Practice</strong> — is where listening becomes commitment. The audio pairs with Workbook pages on purpose: the teaching enters through the ears, but it installs through the hand.`
          ),
          p(
            `Print the pages or write alongside them, but write. Badly is fine. Honestly is required. Nobody grades the Workbook; the Workbook grades the day.`
          ),
          goldLine(`Information you consume decays in days. What your hand writes, your identity keeps.`),
          p(
            `Open the Archive from your dashboard and put the written instruments where you'll actually use them — desk, bag, bedside. The vault travels.`
          ),
          cta("Open the Vault", VAULT_URL),
        ].join(""),
      }),
  },
  {
    day: 3,
    from: "don",
    subject: (b) => `${firstNameOf(b.name)}, Module 1 is unlocked — here's what to expect`,
    preheader: "The Soil. Slower than you want. Exactly as fast as it works.",
    html: (b) => {
      const first = firstNameOf(b.name);
      return vaultEmail({
        preheader: "The Soil. Slower than you want. Exactly as fast as it works.",
        reason: REASON,
        body: [
          pathHead(3),
          heading(`${first}, a word before the first chamber.`),
          p(
            `Module One is called The Soil, and I'll be straight with you: it is not the flashy one. No tactics, no hacks. It clears the ground — the beliefs you've been carrying, the clutter underneath every plan you've ever started.`
          ),
          p(
            `Here's what to expect: four movements. The Opening sets the frame. The Core Teaching installs the principle. The Practice makes you do it in ink. The Close locks it in and the chamber seals behind you. You will feel the urge to rush to Module Two. That urge is the old operating system talking.`
          ),
          goldLine(`Before anything can grow, the ground must be prepared. That's not a slogan. It's the whole reason people relapse into their old selves.`),
          p(
            `One chapter, fully done, beats three chapters skimmed. I built the door to open in sequence for exactly that reason.`
          ),
          signoff("Don", "Founder, The Mindset Sauce Institute™"),
          soft(VAULT_URL, "Enter Chamber One"),
        ].join(""),
      });
    },
  },
  {
    day: 5,
    from: "vault",
    subject: () => `Your first audio session — the Audio Vault is open`,
    preheader: "Twenty-four sessions that travel with you. The player never forgets your place.",
    html: () =>
      vaultEmail({
        preheader: "Twenty-four sessions that travel with you. The player never forgets your place.",
        reason: REASON,
        body: [
          pathHead(4),
          heading(`The Institute, in your ears.`),
          p(
            `Twenty-four sessions — four movements for each of the six chambers — recorded so the work attaches to a life already in motion. In the car. On the walk. Between sets.`
          ),
          p(
            `The player remembers exactly where you stopped, on any device. Pause on the commute, resume at the kitchen table — the vault holds your place. And when a session reaches its end, the chapter seals itself and your dashboard moves with you.`
          ),
          goldLine(`Repetition is not review. Repetition is installation.`),
          p(
            `Builders don't find time to train the mind. They attach it. Pick the slot in your day that already exists — and give the Opening of your current chapter its twelve minutes.`
          ),
          cta("Open the Audio Vault", `${VAULT_URL}/audio`),
        ].join(""),
      }),
  },
  {
    day: 7,
    from: "don",
    subject: (b) => `One week in, ${firstNameOf(b.name)} — how's your Builder Streak?`,
    preheader: "Seven days lights the flame. Here's what actually keeps it lit.",
    html: (b) => {
      const first = firstNameOf(b.name);
      return vaultEmail({
        preheader: "Seven days lights the flame. Here's what actually keeps it lit.",
        reason: REASON,
        body: [
          pathHead(5),
          heading(`${first}, check the flame.`),
          p(
            `One week inside. Open your dashboard and look at one number — not the score, the streak. Seven consecutive days lights the flame next to it, and I want you to understand what that flame actually measures.`
          ),
          p(
            `A day counts when you do one real thing: seal a chapter, sit with a session, or run the day's Executable and mark it done. That's the whole bar. The streak isn't asking for heroics — it's asking whether the new identity showed up today, even for ten minutes.`
          ),
          goldLine(`The streak is not the point. The person who keeps it is.`),
          p(
            `And if you've already missed a day this week — good. Now you know the stakes are real. Don't count the days you missed. Mark the one in front of you.`
          ),
          signoff("Don"),
          soft(VAULT_URL, "See your streak"),
        ].join(""),
      });
    },
  },
  {
    day: 14,
    from: "don",
    subject: () => `Midpoint — you're deeper than most people ever go`,
    preheader: "Two weeks of evidence. Most people never collect any.",
    html: (b) => {
      const first = firstNameOf(b.name);
      return vaultEmail({
        preheader: "Two weeks of evidence. Most people never collect any.",
        reason: REASON,
        body: [
          pathHead(6),
          heading(`${first}, look how far in you are.`),
          p(
            `Two weeks. I've watched a lot of people buy a lot of things, and here is the uncomfortable statistic nobody prints: most courses are abandoned before the second login. You are past the point where most people have ever gone — not in the Institute, in anything.`
          ),
          p(
            `Somewhere in these two weeks, the question quietly changed. It stops being &ldquo;will this work?&rdquo; and becomes &ldquo;who am I becoming?&rdquo; When Builders tell me about that shift, they always say the same thing — it didn't feel dramatic. It felt like evidence, stacking.`
          ),
          goldLine(`Nobody drifts into the person they meant to become.`),
          p(
            `Whatever chamber you're standing in right now, stand in it fully. The back half of the combination turns faster — everything you've installed starts turning together.`
          ),
          signoff("Don", "Founder, The Mindset Sauce Institute™"),
          soft(VAULT_URL, "Return to your chamber"),
        ].join(""),
      });
    },
  },
  {
    day: 21,
    from: "vault",
    subject: () => `The Certificate is within reach — finish strong`,
    preheader: "24 of 24. Generated with your name and your Builder Number.",
    html: (b) =>
      vaultEmail({
        preheader: "24 of 24. Generated with your name and your Builder Number.",
        reason: REASON,
        body: [
          pathHead(7),
          heading(`Earned at completion. Not before.`),
          p(
            `In the Archive there is one artifact that cannot be opened, downloaded, or bought: the Certificate. It unlocks at 24 of 24 chapters — and only then — generated with your name${b.builderNumber ? ` and Builder ${b.builderNumber}` : " and your Builder Number"} on it.`
          ),
          p(
            `It is not a participation trophy. It certifies the one thing the Institute actually teaches: that you are now a person who sees things through — to the end. Your dashboard knows exactly how many chapters stand between you and it.`
          ),
          goldLine(`Everything worth having is on the other side of seeing it through.`),
          p(
            `Finish the combination. Seal the last chamber. Then print the document, put it somewhere visible, and let it argue with the old voice on the hard days.`
          ),
          cta("Finish the Combination", VAULT_URL),
        ].join(""),
      }),
  },
];
