import { type Sender } from "./resend";
import { type LeadRecord, checkoutUrl } from "./coupon";
import {
  vaultEmail,
  overline,
  heading,
  p,
  goldLine,
  cta,
  codeSeal,
  signoff,
  firstNameOf,
  emailStyles,
} from "./template";

/**
 * The Builder Letters — the 12-email nurture sequence.
 *
 * Cadence: every other day, days 1–23 after the Builder Assessment
 * (within Resend's 30-day scheduling window, so the entire sequence is
 * scheduled at capture time and cancelled by the Stripe webhook on
 * purchase).
 *
 * Voice: institutional, measured, identity-first. Letters from
 * institute@ speak as the Institute; letters from don@ are personal.
 * House rule: no fake scarcity, no countdowns, no expiring bonuses —
 * the invitation stands, and letter 11 says so out loud.
 */

export type NurtureEmail = {
  /** Days after capture this letter is scheduled for. */
  day: number;
  from: Sender;
  subject: (lead: LeadRecord) => string;
  preheader: string;
  html: (lead: LeadRecord) => string;
};

const soft = (href: string, label: string) =>
  `<p style="margin:26px 0 0;font-family:${emailStyles.SANS};font-size:14px;"><a href="${href}" style="color:${emailStyles.GOLD};">${label} &rarr;</a></p>`;

const letterHead = (no: number) =>
  overline(`The Builder Letters — Nº ${String(no).padStart(2, "0")} of 12`);

export const NURTURE_SEQUENCE: NurtureEmail[] = [
  {
    day: 1,
    from: "institute",
    subject: (l) => `${firstNameOf(l.name)}, read your Builder Report again — slowly`,
    preheader: "Most people take the assessment. Few sit with what it said.",
    html: (l) => {
      const first = firstNameOf(l.name);
      return vaultEmail({
        preheader: "Most people take the assessment. Few sit with what it said.",
        body: [
          letterHead(1),
          heading(`The mirror doesn't blink, ${first}.`),
          p(
            `Yesterday you answered seven questions as the person you are today — not the person you intend to be. That distinction is why your report means something.`
          ),
          p(
            `The Institute recorded you as <strong style="color:${emailStyles.GOLD};">${l.archetype ?? "a Builder"}</strong> with a Builder Readiness&trade; of ${l.score}/100. Neither number is a grade. They are coordinates — where the work begins.`
          ),
          goldLine(`A report is a mirror. A mirror is only useful to someone willing to look twice.`),
          p(
            `Over the next few weeks, the Institute will send you eleven more letters. Some explain what waits inside the vault. Some are personal, from the man who built it. None of them will pressure you. The vault has no timer on its door.`
          ),
          p(`Your Private Builder Tuition&trade; of $97 is already unlocked under your Builder Number&trade;${l.builderNumber ? ` (${l.builderNumber})` : ""}.`),
          cta("Enter the Institute", checkoutUrl(l)),
        ].join(""),
      });
    },
  },
  {
    day: 3,
    from: "institute",
    subject: (l) => `Your Primary Obstacle™ is not what you think it is`,
    preheader: "The wall isn't the enemy. The wall is the address.",
    html: (l) =>
      vaultEmail({
        preheader: "The wall isn't the enemy. The wall is the address.",
        body: [
          letterHead(2),
          heading(`The wall is the address.`),
          p(
            `Your report named <strong style="color:${emailStyles.GOLD};">${l.obstacle ?? "your Primary Obstacle™"}</strong> as the thing standing between the person you are and the person you described in question seven.`
          ),
          p(
            `Here is what the Institute has observed across every Builder Profile on record: the obstacle is never random. It is always the exact skill your next identity requires. Dormant builders need ignition. Visionaries need structure. Catalysts need endurance. The wall you keep hitting is not in your way — it is the way.`
          ),
          goldLine(`You don't go around your Primary Obstacle™. You are rebuilt by going through it.`),
          p(
            `Each of the six chambers inside the vault targets one dimension of the Builder Profile. One of them was built for your obstacle specifically. That is not a coincidence — it is the reason the assessment exists.`
          ),
          soft(checkoutUrl(l), "See the six chambers"),
        ].join(""),
      }),
  },
  {
    day: 5,
    from: "don",
    subject: () => `Why I built the Institute (a letter from Don)`,
    preheader: "My grandfather never used the word mindset in his life.",
    html: (l) => {
      const first = firstNameOf(l.name);
      return vaultEmail({
        preheader: "My grandfather never used the word mindset in his life.",
        body: [
          letterHead(3),
          heading(`${first}, this one's personal.`),
          p(
            `My grandfather never used the word &ldquo;mindset&rdquo; in his life. But he taught me the only lesson the Institute is built on: <em>everything worth having is on the other side of seeing it through.</em>`
          ),
          p(
            `Every marriage that works, works because somebody saw it through. Every business that survives, survives because somebody saw it through. Every body, every craft, every purpose — same law, no exceptions. The common denominator is never the method. It is the person holding it.`
          ),
          goldLine(`What's the secret to a successful relationship with your purpose? Seeing it through — to the end.`),
          p(
            `I built the Institute because I got tired of watching brilliant people collect starting lines. Six chambers, one combination, and a single promise: build your mind, and the results will follow.`
          ),
          p(`No pitch today. Just the reason the vault exists.`),
          signoff("Don", "Founder, The Mindset Sauce Institute™"),
        ].join(""),
      });
    },
  },
  {
    day: 7,
    from: "institute",
    subject: () => `Inside Chamber One: where the foundation is poured`,
    preheader: "Four movements: Opening, Core Teaching, Practice, Close.",
    html: (l) =>
      vaultEmail({
        preheader: "Four movements: Opening, Core Teaching, Practice, Close.",
        body: [
          letterHead(4),
          heading(`What actually happens in a chamber.`),
          p(
            `Each of the six modules inside the vault runs in four movements — Opening, Core Teaching, Practice, Close. You don't watch a chamber. You move through it.`
          ),
          p(
            `The <strong style="color:${emailStyles.GOLD};">Opening</strong> sets the frame. The <strong style="color:${emailStyles.GOLD};">Core Teaching</strong> installs the principle. The <strong style="color:${emailStyles.GOLD};">Practice</strong> makes you do it — the Workbook and Executables leave nowhere to hide. The <strong style="color:${emailStyles.GOLD};">Close</strong> locks it in before the next chamber opens.`
          ),
          goldLine(`Information you consume decays in days. Structure you walk through becomes yours.`),
          p(
            `Twenty-four audio sessions. One workbook. One tracker. Six chambers in a fixed order, because a combination only works in sequence.`
          ),
          cta("Open the first chamber", checkoutUrl(l)),
        ].join(""),
      }),
  },
  {
    day: 9,
    from: "institute",
    subject: () => `Motivation is weather. Systems are climate.`,
    preheader: "The Owner's Manual philosophy, in one letter.",
    html: (l) =>
      vaultEmail({
        preheader: "The Owner's Manual philosophy, in one letter.",
        body: [
          letterHead(5),
          heading(`Motivation is weather. Systems are climate.`),
          p(
            `Every Builder arrives motivated. Motivation got you through the assessment; it will not get you through February. Weather changes daily. Climate is what you can build a life on.`
          ),
          p(
            `That is why the first artifact inside the vault is the Owner's Manual — ten minutes on how to run the system, and yourself, for life. It assumes your motivation will fail, and it is built so that when it does, nothing stops.`
          ),
          goldLine(`The Institute doesn't ask you to feel like building. It asks you to know the combination.`),
          p(
            `The Transformation Tracker exists for the same reason: what is recorded, persists. What persists, compounds.`
          ),
          soft(checkoutUrl(l), "See everything in the inventory"),
        ].join(""),
      }),
  },
  {
    day: 11,
    from: "don",
    subject: (l) => `${firstNameOf(l.name)}, the version of you that stopped`,
    preheader: "There are two versions of you. Only one of them reads letter twelve.",
    html: (l) => {
      const first = firstNameOf(l.name);
      return vaultEmail({
        preheader: "There are two versions of you. Only one of them reads letter twelve.",
        body: [
          letterHead(6),
          heading(`Two versions of you.`),
          p(
            `${first}, somewhere behind you there is a version of you that stopped. The course they didn't finish. The plan that lasted eleven days. The gym membership that outlived the habit. I have a museum of those myself.`
          ),
          p(
            `I don't bring this up to shame you — I bring it up because your Builder Report already told both of us where you stall. That is a gift. Most people quit in the dark. You have a map with the exact spot marked.`
          ),
          goldLine(`The vault doesn't need you to be different. It was built to make you different.`),
          p(
            `Whatever you decide about the Institute, decide it on purpose. Drifting past a decision is still a decision — it is just the one made by the version of you that stopped.`
          ),
          signoff("Don"),
        ].join(""),
      });
    },
  },
  {
    day: 13,
    from: "institute",
    subject: () => `Twenty-four sessions. The Audio Vault, explained.`,
    preheader: "Builders don't find time to train the mind. They attach it.",
    html: (l) =>
      vaultEmail({
        preheader: "Builders don't find time to train the mind. They attach it.",
        body: [
          letterHead(7),
          heading(`The Audio Vault.`),
          p(
            `Twenty-four sessions — four movements for each of the six chambers — recorded so the Institute travels with you. In the car. On the walk. Between sets.`
          ),
          p(
            `The Builders who transform are rarely the ones with the most free time. They are the ones who attach the work to a life already in motion. The Audio Vault exists so that &ldquo;I didn't have time to sit down&rdquo; stops being a place to hide.`
          ),
          goldLine(`Repetition is not review. Repetition is installation.`),
          p(
            `The Listening Map — one of the bonus artifacts — shows you exactly which session belongs to which mile of the journey.`
          ),
          cta("Unlock the Audio Vault", checkoutUrl(l)),
        ].join(""),
      }),
  },
  {
    day: 15,
    from: "institute",
    subject: () => `Builder #014 said it better than we can`,
    preheader: "They made the same decision you're making now.",
    html: (l) =>
      vaultEmail({
        preheader: "They made the same decision you're making now.",
        body: [
          letterHead(8),
          heading(`They made the same decision you're making now.`),
          p(
            `Sarah M. — Builder #014 — arrived the way most Builders do: successful on paper, stalled in private. Her words, from the Institute record:`
          ),
          goldLine(
            `&ldquo;I'd bought courses before. This was the first thing that felt less like content and more like a door. I did the work, chamber by chamber, and somewhere around the fourth one I realized I wasn't the person who bought it anymore.&rdquo;`
          ),
          p(
            `Every testimony in the Institute reads the same way eventually — not &ldquo;the videos were great,&rdquo; but &ldquo;I am not who I was.&rdquo; That is the only metric the vault respects.`
          ),
          p(`Your chamber is waiting. Your Builder Number&trade; is already on it.`),
          soft(checkoutUrl(l), "Read what the Builders unlocked"),
        ].join(""),
      }),
  },
  {
    day: 17,
    from: "don",
    subject: () => `What the 45-day guarantee actually means (from Don)`,
    preheader: "It isn't a marketing device. It's a filter.",
    html: (l) => {
      const first = firstNameOf(l.name);
      return vaultEmail({
        preheader: "It isn't a marketing device. It's a filter.",
        body: [
          letterHead(9),
          heading(`${first}, about the guarantee.`),
          p(
            `The 45-Day Builder Guarantee is simple: complete the work, and if you genuinely believe the Institute wasn't worth your investment, one email returns every dollar. No questions, no forms, no retention specialist.`
          ),
          p(
            `People assume that's a marketing device. It isn't. It's a filter — it means the only risk you carry through the vault door is the one the Institute can't remove: whether you'll do the work. I can guarantee the system. I can't guarantee you. Nobody honest can.`
          ),
          goldLine(`I'd rather refund a hundred tourists than owe one Builder an excuse.`),
          p(
            `So the math on your desk is: $97, forty-five days, and a system with the risk stripped out of it. What remains is the only question that ever mattered.`
          ),
          signoff("Don"),
        ].join(""),
      });
    },
  },
  {
    day: 19,
    from: "institute",
    subject: () => `Six chambers. One combination.`,
    preheader: "Why the order matters, and what assembles at the end.",
    html: (l) =>
      vaultEmail({
        preheader: "Why the order matters, and what assembles at the end.",
        body: [
          letterHead(10),
          heading(`Six chambers. One combination.`),
          p(
            `A vault does not open because you know the numbers. It opens because you turn them in order. The Institute is built the same way — each chamber sets the dial for the next.`
          ),
          p(
            `Foundation before vision. Vision before discipline. Discipline before momentum. Skip a turn and the mechanism resets; anyone who has ever &ldquo;known what to do&rdquo; and still not done it has felt that reset.`
          ),
          goldLine(`You've collected pieces your whole life. The Institute is where they interlock.`),
          p(
            `By the sixth chamber, nothing new is being added. Everything already installed is turning together. That is the combination — and it is why the modules are sequenced, not browsed.`
          ),
          cta("Begin the sequence", checkoutUrl(l)),
        ].join(""),
      }),
  },
  {
    day: 21,
    from: "institute",
    subject: (l) => `Builder ${l.builderNumber ?? ""} — your invitation stands`.replace("  ", " "),
    preheader: "No timer. No expiring bonus. Just a door, and your name on file.",
    html: (l) =>
      vaultEmail({
        preheader: "No timer. No expiring bonus. Just a door, and your name on file.",
        body: [
          letterHead(11),
          heading(`Your invitation stands.`),
          p(
            `You have received ten letters from the Institute. You may have noticed what none of them contained: a countdown. A &ldquo;doors closing.&rdquo; A bonus that evaporates at midnight.`
          ),
          p(
            `That is deliberate. The Institute does not manufacture urgency, because manufactured urgency builds buyers, not Builders. Your Builder Number&trade;${l.builderNumber ? ` — ${l.builderNumber} —` : ""} is permanent. Your Private Builder Tuition&trade; of $97 is unlocked. The door does not close.`
          ),
          goldLine(`The only clock running is the one on your side of the door.`),
          p(
            `Every week that passes is a week the compound interest of the work isn't running. That is not our urgency. It is arithmetic, and it is yours.`
          ),
          codeSeal("BUILDER97"),
          cta("Enter the Institute", checkoutUrl(l)),
        ].join(""),
      }),
  },
  {
    day: 23,
    from: "don",
    subject: (l) => `The last letter, ${firstNameOf(l.name)}`,
    preheader: "The vault doesn't chase. This is where the letters end.",
    html: (l) => {
      const first = firstNameOf(l.name);
      return vaultEmail({
        preheader: "The vault doesn't chase. This is where the letters end.",
        body: [
          letterHead(12),
          heading(`The vault doesn't chase.`),
          p(
            `${first}, this is the twelfth letter, and the last. Not because the Institute gave up on you — because respect has a shape, and part of that shape is knowing when to stop writing.`
          ),
          p(
            `Here is where everything stands, permanently: your Builder Report is on file. Your Builder Number&trade; is reserved. Your Private Builder Tuition&trade; of $97 remains unlocked under the code <strong style="color:${emailStyles.GOLD};">BUILDER97</strong>. Whenever you are ready — next week or next year — the Exchange will recognize you.`
          ),
          goldLine(`There are two versions of you. One closes this email. The other opens the door.`),
          p(
            `My grandfather would have said it plainer: you already know what to do. See it through.`
          ),
          signoff("Don", "Founder, The Mindset Sauce Institute™"),
          soft(checkoutUrl(l), "Enter the Institute"),
        ].join(""),
      });
    },
  },
];
