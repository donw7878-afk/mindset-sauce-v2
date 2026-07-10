# THE MINDSET SAUCE INSTITUTE™
## DESIGN SYSTEM SPECIFICATION
### Version 2.0 — Source of Truth

> This document is the definitive design language for every screen, component,
> animation, and interaction across the website, Builder Portal, and future
> mobile application. Every decision has already been made. Build from this.

---

## 1. COLOR SYSTEM

### Primary Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-void` | Void | `#080808` | Page background, deepest layer |
| `--color-onyx` | Onyx | `#121212` | Card backgrounds, elevated surfaces |
| `--color-graphite` | Graphite | `#1A1A1A` | Secondary surfaces, nav background |
| `--color-steel` | Steel | `#2A2A2A` | Borders, dividers, subtle containers |
| `--color-ash` | Ash | `#3A3A3A` | Muted borders, inactive states |

### Gold Ramp (Rolex Deep Gold)

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--gold-primary` | Deep Gold | `#DAA520` | Primary accent, CTAs, headlines |
| `--gold-rich` | Rich Gold | `#B8860B` | Secondary accent, hover states, borders |
| `--gold-shadow` | Shadow Gold | `#7A6520` | Muted text, inactive gold elements |
| `--gold-glow` | Soft Gold | `#E8D5A0` | Light text, glow effects, highlights |
| `--gold-dark` | Dark Gold | `#1A1408` | Gold-tinted dark backgrounds |
| `--gold-gradient` | Gold Gradient | `linear-gradient(135deg, #DAA520, #B8860B, #7A6520)` | Progress bars, premium accents |
| `--gold-light-gradient` | Light Gold Gradient | `linear-gradient(135deg, #E8D5A0, #DAA520)` | Volumetric light, glow effects |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#EDE8DD` | Cream — primary body text |
| `--text-heading` | `#F5F0E8` | Near-white — headlines |
| `--text-gold` | `#DAA520` | Gold text — emphasized words, labels |
| `--text-muted` | `#666666` | De-emphasized text, captions |
| `--text-subtle` | `#444444` | Disabled, placeholder text |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#4A9E6E` | Completed modules, wins, streaks |
| `--color-warning` | `#D4A029` | Reminders, attention needed |
| `--color-error` | `#C0392B` | Errors, failed states |
| `--color-info` | `#5B8DB8` | Informational, neutral highlights |

---

## 2. TYPOGRAPHY

### Font Families

| Token | Font | Role |
|-------|------|------|
| `--font-display` | Cormorant Garamond, serif | Headlines, section titles, hero text |
| `--font-body` | Outfit, sans-serif | Body copy, UI text, navigation, buttons |
| `--font-sauce` | (Brush/Script — TBD) | Used ONLY for the word "Sauce" |
| `--font-mono` | JetBrains Mono, monospace | Builder Score, stats, code-like data |

### Type Scale

| Token | Size | Weight | Line Height | Font | Usage |
|-------|------|--------|-------------|------|-------|
| `--text-hero` | 72px / 4.5rem | 600 | 1.05 | Display | Hero headlines |
| `--text-h1` | 56px / 3.5rem | 600 | 1.1 | Display | Section headlines |
| `--text-h2` | 40px / 2.5rem | 600 | 1.15 | Display | Sub-section headlines |
| `--text-h3` | 28px / 1.75rem | 600 | 1.2 | Display | Card titles, feature headers |
| `--text-h4` | 20px / 1.25rem | 500 | 1.3 | Body | Component headers, labels |
| `--text-body` | 16px / 1rem | 300 | 1.7 | Body | Body copy |
| `--text-body-sm` | 14px / 0.875rem | 300 | 1.6 | Body | Secondary body text |
| `--text-caption` | 12px / 0.75rem | 400 | 1.5 | Body | Captions, metadata, timestamps |
| `--text-overline` | 12px / 0.75rem | 500 | 1.5 | Body | Overlines, labels (letter-spacing: 3px, uppercase) |
| `--text-stat` | 32px / 2rem | 500 | 1.0 | Mono | Builder Score, numbers, stats |

### Typography Rules

- Headlines always use Cormorant Garamond. Always.
- Body text always uses Outfit at weight 300 (light). Never bold body text.
- The word "Sauce" in the brand name uses the brush/script font. Nowhere else.
- Overlines and labels are Outfit uppercase with 3px letter-spacing.
- Stats, scores, and numerical data use monospace for the numbers only.
- Headlines must breathe — never crowd them. Minimum 48px margin below any headline.
- Maximum body text width: 640px. Never wider.

---

## 3. SPACING SYSTEM

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight internal gaps (icon-to-text) |
| `--space-2` | 8px | Compact component padding |
| `--space-3` | 12px | Default internal gaps |
| `--space-4` | 16px | Standard component padding |
| `--space-5` | 24px | Card padding, group spacing |
| `--space-6` | 32px | Section internal padding |
| `--space-7` | 48px | Between components in a section |
| `--space-8` | 64px | Between sections |
| `--space-9` | 96px | Major section breaks |
| `--space-10` | 128px | Hero-level breathing room |
| `--space-11` | 160px | Maximum section gap |

### Spacing Rules

- Luxury brands are never crowded. When in doubt, add more space.
- Minimum section gap: 96px (`--space-9`)
- Headline to body: 24px (`--space-5`)
- Body to CTA: 32px (`--space-6`)
- Card internal padding: 24px (`--space-5`)
- Content max-width: 1200px centered
- Body text max-width: 640px

---

## 4. SHAPE LANGUAGE

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Sections, containers, hero blocks, dividers |
| `--radius-sm` | 4px | Buttons, input fields, small interactive elements |
| `--radius-md` | 6px | Cards, modals, dropdowns |
| `--radius-lg` | 8px | Featured cards, dashboard panels |
| `--radius-full` | 9999px | Pills, tags, badges, avatars |

### Shape Rules

- Sections and large containers: sharp corners (0px). Always.
- Buttons: 4px radius. Subtle, confident, not playful.
- Cards: 6px radius. Refined, not bubbly.
- Never use rounded corners above 8px except pills/badges.
- Borders are 1px `--color-steel` by default.
- Gold borders use 1px `--gold-rich` for emphasis.

---

## 5. SHADOW & DEPTH

### Elevation Levels

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-ambient` | `0 1px 2px rgba(0,0,0,0.4)` | Subtle lift, default cards |
| `--shadow-elevated` | `0 4px 16px rgba(0,0,0,0.5)` | Hovered cards, active panels |
| `--shadow-floating` | `0 8px 32px rgba(0,0,0,0.6)` | Modals, floating product displays |
| `--shadow-gold` | `0 0 40px rgba(218,165,32,0.15)` | Gold glow on featured elements |
| `--shadow-gold-strong` | `0 0 80px rgba(218,165,32,0.25)` | Vault light, hero glow effects |

### Glass Effect

```css
--glass: {
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(218, 165, 32, 0.1);
}
```

Used for: navigation overlays, dashboard panels, modal backgrounds.

### Depth Rules

- Every floating product must cast `--shadow-floating`
- Gold elements get `--shadow-gold` on hover
- The vault scene uses `--shadow-gold-strong` for volumetric light
- Never use white or light shadows. All shadows are black/dark with opacity.
- Glass effect is used sparingly — navigation and modals only.

---

## 6. BUTTONS

### Primary Button

```
Background: --gold-primary (#DAA520)
Text: --color-void (#080808)
Font: --font-body (Outfit), 14px, weight 500
Letter-spacing: 1px
Text-transform: uppercase
Padding: 14px 40px
Border-radius: --radius-sm (4px)
Border: none
Transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)

Hover:
  Background: --gold-rich (#B8860B)
  Transform: translateY(-1px)
  Box-shadow: --shadow-gold

Active:
  Transform: translateY(0)
  Background: --gold-shadow (#7A6520)
```

### Secondary Button

```
Background: transparent
Text: --gold-primary (#DAA520)
Border: 1px solid --gold-rich (#B8860B)
Font: --font-body (Outfit), 14px, weight 400
Letter-spacing: 1px
Text-transform: uppercase
Padding: 14px 40px
Border-radius: --radius-sm (4px)
Transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)

Hover:
  Background: rgba(218, 165, 32, 0.08)
  Border-color: --gold-primary (#DAA520)
  Transform: translateY(-1px)

Active:
  Transform: translateY(0)
  Background: rgba(218, 165, 32, 0.12)
```

### Ghost Button

```
Background: transparent
Text: --gold-glow (#E8D5A0)
Border: none
Font: --font-body (Outfit), 14px, weight 300
Letter-spacing: 0.5px
Padding: 14px 24px
Transition: color 0.3s ease

Hover:
  Color: --gold-primary (#DAA520)

Active:
  Color: --gold-rich (#B8860B)
```

### Button Rules

- Never use rounded pill buttons (no border-radius: 9999px on buttons).
- Primary buttons are gold background, dark text. Always.
- Secondary buttons are outlined gold. Always.
- Maximum one primary button visible per viewport.
- Button text is always uppercase Outfit with letter-spacing.
- Motion on buttons should feel heavy — no bounce, no spring. Use cubic-bezier(0.16, 1, 0.3, 1).

---

## 7. CARDS

### Vault Card (Featured/Module Card)

```
Background: --color-onyx (#121212)
Border: 1px solid --color-steel (#2A2A2A)
Border-radius: --radius-md (6px)
Padding: --space-5 (24px)
Box-shadow: --shadow-ambient
Transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1)

Hover:
  Border-color: --gold-rich (#B8860B)
  Box-shadow: --shadow-elevated, --shadow-gold
  Transform: translateY(-4px)
```

### Module Card

```
Background: --color-onyx (#121212)
Border: 1px solid --color-steel (#2A2A2A)
Border-radius: --radius-md (6px)
Padding: 0 (image bleeds to top edge)
Overflow: hidden

Image container: aspect-ratio 16/10, overflow hidden
Image hover: scale(1.05) over 0.8s cubic-bezier(0.16, 1, 0.3, 1)

Content area:
  Padding: --space-5 (24px)

Active/Current module:
  Border-color: --gold-primary (#DAA520)
  Box-shadow: --shadow-gold
```

### Builder Card (Dashboard)

```
Background: --color-onyx (#121212)
Border: 1px solid --color-steel (#2A2A2A)
Border-radius: --radius-lg (8px)
Padding: --space-5 (24px)

Header: Outfit 12px uppercase, letter-spacing 2px, --text-muted
Value: JetBrains Mono 32px weight 500, --text-gold
```

### Card Rules

- Cards never have white or light backgrounds.
- Cards always have subtle borders that brighten on hover.
- Gold glow appears on hover, never by default (except active/current states).
- Card hover transform is always translateY(-4px). Not 2px (too subtle). Not 8px (too playful).
- Image hover zoom is always scale(1.05). Slow. Mechanical. 0.8s.

---

## 8. NAVIGATION

### Primary Navigation

```
Position: fixed top
Background: --glass (rgba(18, 18, 18, 0.7) + backdrop-filter: blur(20px))
Border-bottom: 1px solid rgba(218, 165, 32, 0.1)
Height: 72px
Padding: 0 48px
Z-index: 1000

Logo: left-aligned
Nav links: center-aligned, Outfit 13px weight 400, --text-muted
  Hover: --text-gold, transition 0.3s
Active link: --gold-primary
CTA button: right-aligned, Primary Button (small variant, padding 10px 24px)

Scroll behavior:
  On scroll > 100px: background opacity increases to 0.9
  Transition: 0.4s ease
```

### Authenticated Navigation (Builder Portal)

```
Same glass effect
Left: Logo
Center: Dashboard | Modules | Audio | Resources | Community
Right: Builder avatar + Builder Score (monospace, gold)
```

---

## 9. AUDIO PLAYER

### Built-in Audio Player

```
Background: --color-onyx (#121212)
Border: 1px solid --color-steel (#2A2A2A)
Border-radius: --radius-md (6px)
Padding: --space-4 (16px) --space-5 (24px)

Track title: Cormorant Garamond 18px weight 600, --text-heading
Track subtitle: Outfit 12px weight 300, --text-muted

Progress bar:
  Track: --color-steel (#2A2A2A), height 4px, radius 2px
  Fill: --gold-gradient
  Scrubber: 12px circle, --gold-primary, --shadow-gold on hover

Controls:
  Play/Pause: 48px circle, border 1px --gold-rich, icon --gold-primary
  Skip: 32px, icon --text-muted, hover --text-gold
  Volume: same style as progress bar, width 80px

Time display: JetBrains Mono 12px, --text-muted

Playback must remember position per track across sessions.
```

---

## 10. PROGRESS INDICATORS

### Transformation Progress Bar

```
Container: full width, height 8px, --color-steel background, radius 4px
Fill: --gold-gradient, animated width transition 1s cubic-bezier(0.16, 1, 0.3, 1)
Glow: --shadow-gold on the fill edge
```

### Builder Score

```
Display: JetBrains Mono 48px weight 500
Color: --gold-primary
Animate on change: counter rolls up/down, 0.8s ease
Subtle gold pulse on milestone achievements
```

### Builder Streak

```
Display: JetBrains Mono 32px weight 500
Color: --gold-primary
Flame icon adjacent (if streak > 7 days)
Counter animates on increment
```

### Module Completion

```
Incomplete: circle outline, 1px --color-steel, 20px
In progress: circle outline, 1px --gold-rich, gold fill proportional to progress
Complete: solid --gold-primary circle with check icon, --shadow-gold
```

---

## 11. MOTION SYSTEM

### Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-heavy` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary easing — buttons, cards, reveals |
| `--ease-mechanical` | `cubic-bezier(0.7, 0, 0.3, 1)` | Vault mechanisms, locking animations |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Scroll-linked animations, parallax |
| `--ease-subtle` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Hover states, micro-interactions |

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 200ms | Hover states, color changes |
| `--duration-base` | 400ms | Button transforms, card lifts |
| `--duration-slow` | 800ms | Image zooms, card reveals |
| `--duration-cinematic` | 1500ms | Section reveals, vault animations |
| `--duration-ceremony` | 3000ms | Vault opening, post-purchase ceremony |

### Motion Rules

- Motion should NEVER feel playful, bouncy, or springy.
- Motion should feel heavy, mechanical, elegant, confident.
- No bounce easing. No elastic easing. No overshoot.
- Use `--ease-heavy` for 90% of interactions.
- Use `--ease-mechanical` only for vault/locking/gear animations.
- Scroll-triggered animations use GSAP ScrollTrigger with `--ease-smooth`.
- Every hover has a transition. No instant state changes.
- Stagger delays for sequential reveals: 100ms between items.

---

## 12. SCROLL BEHAVIOR

### Lenis Smooth Scroll Configuration

```
Smoothing: 0.08 (heavy, cinematic feel)
Direction: vertical
Lerp: 0.08
Duration: 1.2
Orientation: vertical
Gestureorientation: vertical
TouchMultiplier: 2
```

### GSAP ScrollTrigger Defaults

```
All sections: start "top 80%", end "top 20%"
Scrub: 1.5 (smooth, not instant)
Markers: false (production)
```

### Parallax Depths

| Layer | Speed | Usage |
|-------|-------|-------|
| Background | 0.3x scroll speed | Deep environment, particles |
| Midground | 0.6x scroll speed | Secondary elements, text |
| Foreground | 1.0x scroll speed | Primary content, cards |
| Floating | 1.2x scroll speed | Accent elements, small particles |

---

## 13. FLOATING PRODUCT DISPLAYS

### 3D Product Presentation

```
Products float in Three.js scene
Subtle rotation: Y-axis, ±5 degrees, linked to scroll or mouse
Subtle float: Y-axis, 8px amplitude, 4s cycle, sine wave
Shadow: dynamic ground shadow beneath, opacity 0.3
Lighting: warm gold point light (#DAA520) + soft ambient (#1A1408)

Reveal animation:
  Start: opacity 0, translateY(40px), scale(0.9)
  End: opacity 1, translateY(0), scale(1)
  Duration: --duration-cinematic (1500ms)
  Easing: --ease-heavy
  Stagger: 200ms between products
```

### Product Rules

- Use uploaded artwork. Never redraw. Never replace with generic graphics.
- Products always float. Never sit flat on a surface.
- Products always cast shadows. Shadows move with the product.
- Products reveal in sequence, never all at once.
- Subtle mouse-follow parallax on product rotation (max ±5 degrees).

---

## 14. VAULT VISUAL LANGUAGE

### Vault Door

```
Based on uploaded vault artwork — do not redesign
Scale: fills 80% of viewport on desktop
Material: dark metal with gold mechanical details
Ambient state: subtle breathing motion, tiny particle drift, faint light flicker

Locking mechanisms:
  Gear rotation speed: 2 degrees per scroll pixel
  Pin retraction: linear, tied to scroll progress
  Sound: Web Audio API — metallic click, gear grind, heavy lock release
```

### Gold Light (Volumetric)

```
Source: from within the vault, through seams and door crack
Color: --gold-glow to --gold-primary gradient
Spread: increases as vault opens
Implementation: WebGL or CSS radial-gradient with animated opacity
Particle interaction: particles brighten as they pass through light
```

---

## 15. AUDIO CUES

### Sound Design

| Trigger | Sound | Duration | Volume |
|---------|-------|----------|--------|
| Vault breathing (idle) | Low mechanical hum | Loop, 8s | 15% |
| Vault gear rotation | Metal grinding, slow | Tied to scroll | 30% |
| Vault pin retraction | Heavy metallic click | 0.5s | 40% |
| Vault opening | Deep resonant unlock | 2s | 50% |
| Gold light flood | Warm harmonic tone | 3s fade in | 25% |
| Button hover | Subtle mechanical tick | 0.1s | 10% |
| Post-purchase ceremony | Cinematic tension + release | 8s sequence | 60% |
| Builder Score update | Subtle chime | 0.3s | 20% |

### Audio Rules

- All audio is opt-in. Muted by default with a visible unmute toggle.
- Audio uses Web Audio API, not HTML5 audio elements.
- No music. Only designed sound effects and ambience.
- Sound should feel mechanical and metallic, never digital or synthetic.
- Vault sounds are the signature. Every other sound is secondary.

---

## 16. RESPONSIVE BREAKPOINTS

| Token | Width | Behavior |
|-------|-------|----------|
| `--bp-mobile` | 0–639px | Single column, reduced spacing, simplified animations |
| `--bp-tablet` | 640–1023px | Two columns where appropriate, full animations |
| `--bp-desktop` | 1024–1439px | Full layout, all effects |
| `--bp-wide` | 1440px+ | Max-width container, increased spacing |

### Mobile Rules

- Reduce hero headline to `--text-h1` (56px → 36px on mobile)
- Single column for all card grids
- Simplify Three.js scenes (fewer particles, simpler geometry)
- Disable parallax on mobile (performance)
- Touch gestures replace hover states
- Audio player becomes sticky bottom bar
- Vault animation simplified but still present

---

## 17. DARK ENVIRONMENT RULES

- This website is ALWAYS dark. There is no light mode. Ever.
- The darkest background is `--color-void` (#080808), not pure black (#000000).
- Pure black (#000000) is never used. It creates too harsh a contrast.
- White (#FFFFFF) is never used for text. Use `--text-heading` (#F5F0E8) or `--text-primary` (#EDE8DD).
- Gold is the only color that "pops." Everything else stays muted.
- The environment should feel like a premium film set, not a website.

---

## 18. COMPONENT CHECKLIST

Every component built must be verified against this list:

- [ ] Uses only tokens from this spec (no hardcoded values)
- [ ] Typography follows the scale exactly
- [ ] Spacing uses the 8px grid
- [ ] Motion uses approved easing curves
- [ ] Hover states are defined and transitioned
- [ ] Works at all four breakpoints
- [ ] Gold is used sparingly and intentionally
- [ ] Negative space is generous
- [ ] Feels heavy and mechanical, not playful
- [ ] Could exist in a Rolex ad without looking out of place

---

*This document is the single source of truth for The Mindset Sauce Institute™.
Every design decision references this spec. No exceptions.*
