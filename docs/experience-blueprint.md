# THE MINDSET SAUCE INSTITUTE™
## EXPERIENCE BLUEPRINT
### Version 1.0 — Awaiting Approval

> Companion to `design-system-spec.md` (the visual law). This document is the
> experiential law: page architecture, animation map, emotional arc, and the
> authenticated Builder Portal. No code is written until this is approved.

**Governing metaphor:** The visitor is not browsing a website. They are standing
outside a vault that contains the version of themselves they haven't built yet.
The public site is the approach to the vault. The purchase is the combination.
The member portal is life inside it.

---

## PART 1 — PAGE ARCHITECTURE

### Route Map

| Route | Name | Access |
|---|---|---|
| `/` | The Approach (cinematic landing) | Public |
| `/checkout` | The Combination (Stripe Embedded Checkout, dark-themed) | Public |
| `/welcome` | The Ceremony (post-purchase, shown exactly once) | Auth, first login |
| `/login` | The Door | Public |
| `/vault` | Builder Dashboard | Auth |
| `/vault/modules/[1-6]` | Module Chambers | Auth |
| `/vault/audio` | The Audio Vault | Auth |
| `/vault/resources` | The Archive (downloadable files) | Auth |
| `/vault/account` | Account & billing | Auth |

### Landing Page Sections

**S1 — The Threshold (Hero).** Near-total darkness. `assets/vault/vault-door-front.png`
fills ~80% of viewport, breathing (subtle scale pulse, particle drift, faint gold
seam-light flicker). Garamond headline; "Sauce" in brush script. One body line.
Ghost scroll cue: "The vault is sealed. Scroll to approach." No CTA in the hero —
curiosity first. Glass nav carries the single primary CTA ("Enter the Institute")
for return visitors.

**S2 — The Mirror (Problem).** Vault recedes to 0.3x parallax background.
Typography-only: short devastating lines of the visitor's internal monologue,
revealed one at a time on scroll. One gold-emphasized word per line.

**S3 — The Institution (Reframe).** Not a course — an institution. Logo lockup +
three engraved plaques (Vault Cards): The System. The Practice. The Proof.

**S4 — The Six Chambers (Module Reveal).** Six module covers
(`assets/modules/module{1-6}/`) as floating products: monospace module number,
Garamond title, one transformation sentence, and the four audio chapters listed
as engraved line items (Opening / The Core Teaching / The Practice / The Close).

**S5 — The Unlocking (Signature Set Piece).** Pinned ~400vh scroll-scrubbed
sequence: gears turn → pins retract → door cracks → gold light floods → camera
passes through into `assets/vault/vault-interior.png`. Full spec in Part 2.

**S6 — Inside the Vault (Inventory).** Warm `--gold-dark` ambiance. Sequential
floating reveals: Course Book (mockup), Workbook, Audio Vault (24 tracks),
Transformation Tracker, Daily Executables, Owner's Manual, and four bonuses —
Emergency Cards, The Declaration, Clear the Cache, and the **Certificate shown
locked**, labeled "Earned at completion."

**S7 — The Builders (Proof).** Testimonials as engraved plates. Editorial, restrained.

**S8 — The Ledger (Offer).** Value stack itemized like an appraisal — monospace
values, tallied total, price revealed under a single gold rule. One primary CTA:
"Unlock the Vault." Guarantee seal beneath.

**S9 — The Decision (Final Frame).** Vault door ajar, light spilling. "The vault
is open. It won't stay open." (enrollment framing only — no fake scarcity).
Final CTA. Footer = The Foundation.

### Checkout & Ceremony

- `/checkout`: Stripe Embedded Checkout inside the dark environment. Left: the
  Ledger summary. Right: payment. No white-page redirect.
- `/welcome`: vault swings fully open (3s, `--ease-mechanical`, full sound if
  enabled), gold flood, name engraved in Garamond: "Welcome to the Institute,
  [Name]. You are Builder №[member number]." Sequential Builder numbers are a
  permanent status artifact. Then password setup → Dashboard.

---

## PART 2 — ANIMATION & SCROLL INTERACTION MAP

Global: Lenis lerp 0.08, ScrollTrigger scrub 1.5, spec easing tokens only,
no bounce ever. Sound opt-in via persistent nav mute toggle.

| Section | Motion | Trigger | Emotional purpose |
|---|---|---|---|
| S1 | Vault breathes (scale 1.00→1.015, 8s sine); dust drift; seam flicker; headline words rise, 100ms stagger; mouse parallax ±5° | Load + idle | Stillness with life in it — something is behind this door |
| S1→S2 | Vault drops to 0.3x parallax layer; darkness deepens | Scroll | Stepping back from the door |
| S2 | Lines fade up from 40px, 1500ms `--ease-heavy`; prior line dims to muted | Line at top 80% | Thoughts surfacing one at a time |
| S3 | Plaques stagger in 200ms; gold borders draw via SVG stroke-dashoffset | Section enter | Engraving = permanence = authority |
| S4 | Per spec §13: opacity 0/y+40/scale 0.9 → full, 1500ms, 200ms stagger; 8px/4s idle float; dynamic shadow; scroll-linked ±5° Y rotation | Card at top 80% | Watches on velvet — desire through reverence |
| **S5** | **Pinned ~400vh.** A (0–30%): gears 2°/scroll-px + grind. B (30–55%): five pins retract sequentially, heavy click each. C (55–75%): door cracks, volumetric gold widens, particles ignite crossing the beam. D (75–100%): Three.js camera dollies through opening; resonant unlock + harmonic tone | Scroll-scrubbed | Visitor opens the vault with their own hands — effort becomes ownership. The memory they leave with |
| S6 | Ambient shifts void → `--gold-dark`; sequential product reveals; locked Certificate pulses `--shadow-gold` once | Scroll | A treasury revealed, not a features grid |
| S7 | Plates slide from alternating sides, 800ms | Enter | Human rhythm after spectacle |
| S8 | Line items type on, monospace counters roll; total tallies; gold rule draws L→R; CTA sheen sweeps once | Enter + 60% visible | Accumulating value makes price a relief |
| S9 | Light shaft widens with dwell time; CTA breathes 1.5%/4s | Enter + dwell | Patient pressure — the room waits |
| Nav | Glass 0.7→0.9 past 100px; links tick to gold on hover | Scroll/hover | Premium frame at every depth |

**Mobile:** S5 becomes a shorter (~200vh) scrubbed canvas/video sequence;
parallax off; particles reduced; every reveal preserved. Story survives, expense cut.

---

## PART 3 — EMOTIONAL JOURNEY ARC

1. **Intrigue** (S1) — "What is this place?" Withholding creates pull.
2. **Recognition** (S2) — "This is about me." The Mirror earns trust.
3. **Reframe** (S3) — "Not another course." Institution, standards, membership.
4. **Desire** (S4) — "I want what's in these chambers."
5. **Agency** (S5) — "I opened it." Spectator → participant; invested effort
   deepens commitment (IKEA effect, played straight).
6. **Abundance** (S6) — inventory lands after the emotional peak → reads as reward.
7. **Belonging** (S7) — "People like me are already inside."
8. **Conviction** (S8) — obvious math, covered risk.
9. **Commitment → Ceremony** (S9 → checkout → /welcome) — buying framed as
   entering. Name + Builder number = the screenshot-and-share moment.

**Banned:** countdown timers, exit popups, fake scarcity, red urgency. This
brand's urgency is gravity, not noise.

---

## PART 4 — BUILDER PORTAL (Authenticated Experience)

### /vault — Dashboard
- Time-aware Garamond greeting ("Evening, [Name]").
- **Continue Where You Left Off**: current module cover + chapter, resumes at exact audio timestamp.
- **Builder Score** (mono 48px gold, roll-up counter): chapter completions, practice check-ins, streak days.
- **Builder Streak** with flame at 7+ days.
- **Transformation Progress** bar across all 24 chapters.
- **Module rail**: completed = gold check seal; current = glow; future = visible but sequentially locked (drip pacing).
- **Certificate state**: locked emblem + % remaining.

### /vault/modules/[n] — Module Chamber
Cinematic header (module cover floating over `--gold-dark`). Four chapters as a
vertical ritual path: **I. Opening → II. The Core Teaching → III. The Practice →
IV. The Close**, each with the spec §10 completion ring. The Practice pairs audio
with workbook pages + "Mark practice complete" action (feeds Builder Score).
Completing The Close triggers a seal animation and unlocks the next chamber.

### Audio Player
Persistent bottom mini-player (sticky bar on mobile) surviving navigation.
Full player per spec §9. **Per-track position saved server-side** — resume on
any device. Progress rows stream to Supabase (`user × track`: seconds_played,
completed_at). Audio served via short-TTL Supabase signed URLs only.

### /vault/resources — The Archive
Floating artifact cards for every PDF: Workbook, Tracker, Daily Executables,
Owner's Manual, Emergency Cards, Declaration, Clear the Cache. Certificate
locked until 24/24 chapters → unlock ceremony → generated with name + Builder №.

### Production Architecture
- **Auth:** NextAuth v5, JWT strategy, Supabase adapter.
- **Payments:** Stripe Checkout; **webhook = single source of truth** for
  entitlements (idempotent handler + event dedupe table). Success page never
  grants access.
- **Data:** `users`, `entitlements`, `modules`, `tracks`, `progress`,
  `builder_scores`, `stripe_events`. Supabase RLS: users read only their own rows.
- **Content protection:** private Storage buckets; access only via short-TTL
  signed URLs issued by an entitlement-checking route handler.
- **Delivery:** static/ISR marketing page (animation is client-side + CDN-cached);
  edge middleware gating `/vault/*`. Scales to tens of thousands of concurrent members.

---

*Awaiting approval. On approval: project scaffold → design tokens → landing
sections S1–S9 → vault sequence → checkout/webhook → portal.*
