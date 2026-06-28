# Architect Lab — Design System

> **Design. Build. Protect.**
> The visual identity of Architect Lab — an association founded by **Morphaius** & **Bunkerity**, where AI and cybersecurity train the next generation. Open-source by DNA.

This system crosses two worlds: the **architect's blueprint** (a dark construction grid, technical cartouches, the rigour of the builder) and the **Morphaius spectrum** (a green → blue → violet → magenta gradient inherited from the founding company's logo). The dark grid tells the story of the bunker and the method; the spectrum tells the story of transformation — the idea passing through every colour before it becomes real. The lineage to Morphaius is immediately legible; the Lab's identity stays its own.

---

## Sources

- **Brand charter** — `uploads/Charte_Graphique_Architect_Lab.html` (Charte graphique v2.0, June 2026). The canonical source for this system.
- **Logo** — `assets/logo-spectre.png` (the Morphaius spectrum bowtie). **This PNG is the official mark.** The `Logo` component reproduces it as a crisp, scalable SVG.
- **Website repo** — `github.com/Fox-Morphaius/Architect-Lab-WebSite` — currently a placeholder (README only, tagline *"Build Future, Be An Architect"*). No production UI existed to recreate, so the website UI kit here is a **forward design** built from the brand charter. See the CAVEATS at the end.

---

## Index — what's in this folder

- **`styles.css`** — the one stylesheet consumers link. `@import`s the token layers below; defines base element styles + identity utilities (`.al-blueprint`, `.al-spectrum-text`, `.al-tag`, `.al-rule`, `.al-eyebrow`, `.al-cursor`, `.al-card`).
- **`tokens/`** — `colors.css`, `typography.css`, `layout.css` (spacing/radii/shadow/grid), `fonts.css` (the three OFL families via Google Fonts).
- **`components/`** — reusable React primitives: `Button` (with animated `fx` accents), `IconButton`, `Tag`, `Card`, `GradientRule`, `Eyebrow`, `Input`, `Logo`, and controls `Switch`, `Checkbox`, `Radio`, `SegmentedControl`. Each has `.jsx`, `.d.ts`, and a `@dsCard` showcase.
- **`interactions.css`** — global, plain-HTML-usable classes that back the animated buttons (`.al-fx--sweep/glow/scanline/draw`) and the controls (`.al-switch`, `.al-check`, `.al-radio`, `.al-seg`, `.al-iconbtn`). Imported by `styles.css`.
- **`foundations/`** — specimen cards for the Design System tab: `brand.html`, `colour.html`, `typography.html`.
- **`ui_kits/website/`** — a full-screen recreation of the Architect Lab marketing site, composed from the primitives.
- **`motion/`** — the signature scroll system (`al-scroll.css` + `al-scroll.js`) and its showcase (`scroll-signature.html`).
- **`assets/`** — `logo-spectre.png`.
- **`SKILL.md`** — makes this folder usable as a downloadable Agent Skill.

Namespace for `@dsCard` HTML: `window.ArchitectLabDesignSystem_61bf68`.

---

## Content fundamentals — how Architect Lab writes

**Bilingual, French-first heritage, English-fluent.** The charter is French; product copy may run in either language. Keep a sentence in one language — don't code-switch mid-phrase.

**Voice: the engineer-builder.** Confident, precise, a little terminal-flavoured. The brand speaks like someone who ships: short declaratives, verbs first. The baseline is the whole ethos in three words — **"Design. Build. Protect."** (FR: *"Concevoir. Construire. Protéger."*).

**Casing.**
- **Titles** — sentence case or natural case, never ALL-CAPS for long headings. Tight and declarative: *"Build free, protect strong."*
- **Tags / eyebrows / labels** — ALWAYS UPPERCASE, mono, letter-tracked: `// OPEN SOURCE`, `02 — LE LOGO`, `DESIGN · BUILD · PROTECT`.
- **Body** — normal sentence case.

**Signature devices.**
- The **`//` comment prefix** on eyebrow tags — borrowed from code: `// charte graphique — v2.0`.
- The **trailing underscore `_`** after the wordmark and on hero titles — a blinking terminal cursor, always in **magenta** (the spark): `Architect Lab_`.
- The **`$` / `>` prompt** for anything command-like: `$ git clone …`.

**Person.** "We" for the association, "you" for the member/visitor. Warm but not casual — these are builders, not customers.

**Emoji: never.** Not part of the brand. Iconography and the spectrum carry all the colour. Unicode glyphs used as *typographic* marks (`▌` cursor, `·` separators, `→` arrows, `//`, `$`, `_`) are encouraged; pictographic emoji are not.

**Vibe.** Open-source lab meets architecture studio meets security bunker. Rigorous, optimistic, technical. Never corporate, never playful-for-its-own-sake.

---

## Visual foundations

### The two motifs
1. **The blueprint** — a 48px construction grid (`--al-line` hairlines on `--al-void`), technical cartouches (corner brackets), dashed construction lines, crisp corners. Apply with `.al-blueprint` or `<Card blueprint>`.
2. **The spectrum** — the green→blue→violet→magenta gradient. **Rule of gold: the spectrum stays under ~10% of any composition.** It lives on strokes, bars, rules, underlines, clipped text and the logo — **never as a massive flat fill.** The tension between the quiet grid and the vibrating spectrum *is* the identity.

### Colour
- **Grounds are dark and neutral:** Deep Void `#0B1220` (primary), Panel `#111A2C` (raised), Grid Line `#1E2A40` (borders/grid).
- **Text:** Paper `#F5F7FA` (primary), Slate `#8B97A8` (secondary).
- **The spectrum (signal only):** Green `#2ECC9A` (start/success) · Blue `#2A6BF2` (links/primary actions) · Violet `#8A2BE2` (hover/second accent) · Magenta `#E612D9` (the spark, the cursor, focus accents).
- **Print-safe ends** for light grounds: green `#1FA87C`, magenta `#D012C8`.
- The canonical gradient direction on the logo is **diagonal, bottom-left → top-right** (green → magenta). Bars and rules may run horizontal.

### Type
- **Space Grotesk** — display/titles. Bold, tracking −2%, 28→56px. Tight, geometric, technical.
- **Inter** — body. Regular 16px, SemiBold for emphasis. Carries all long-form.
- **JetBrains Mono** — code, tags, baselines, data. Tags always uppercase.
- All three are **OFL / open source** — coherent with the Lab's DNA. Office fallbacks: Arial (body), Consolas (mono).

### Space, radii, borders
- Spacing built on the **48px grid module** (scale: 4/8/12/16/24/32/48/64/96).
- **Radii are restrained** — this is a blueprint, corners stay crisp. Cards/panels 12px, buttons/inputs 6px, pills 999px. Never large playful rounding.
- **Borders** are 1px hairlines in Grid Line `#1E2A40`; stronger cartouche lines use `#3A4A66`.

### Cards
Panel `#111A2C` on the void, 1px `#1E2A40` border, 12px radius, no/low shadow. Depth comes from the **grid and the spectrum accent**, not from blur. The signature card carries a 3px spectrum hairline along its top (or left) edge — the construction-line motif.

### Shadows & glow
Shadows are subtle (`0 8px 24px rgba(0,0,0,.45)`). The expressive elevation is **spectrum glow**: a blue focus ring `0 0 0 3px rgba(42,107,242,.35)` and an occasional magenta glow for active accents. Use glow sparingly.

### Backgrounds
Dark, never white-by-default (light/Paper grounds are the exception, for print and inverse lockups). The hero/empty-state background is the **blueprint grid on Deep Void**. No photographic backgrounds, no noise, no decorative gradient washes — the only gradient is *the* spectrum, kept to a sliver.

### Motion & states
- **Easing:** quick and mechanical — `ease`, 120–180ms. No bounce, no spring; this is a precise instrument.
- **Hover:** links shift blue→violet; buttons brighten/lift 1px; secondary buttons reveal a brighter border. Never opacity-only fades.
- **Press:** translateY(1px) — a physical tap. No scale-down.
- **The one looping animation:** the **magenta cursor blink** (`.al-cursor`, 1s steps). Everything else is transition-driven and respects `prefers-reduced-motion`.

### Transparency & blur
Used rarely — a faint void-tinted scrim over the grid for overlays. No frosted-glass everywhere; the grid should read through, sharp.

---

## Iconography & motifs

**No emoji, ever.** The brand's pictography is **technical line iconography** — thin (1.5–2px), geometric, matching Space Grotesk's drafting feel.

- **Recommended set:** [**Lucide**](https://lucide.dev) (open-source, MIT, 1.5px stroke) — load from CDN: `<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()`. Chosen for its open-source licence (on-brand) and clean drafting-line weight. **This is a substitution** — the brand has no bespoke icon set yet; flag if a custom set arrives.
- Icons are **monochrome** (Paper or Slate), never multi-colour. Reserve the spectrum for the logo, rules and accents — not for icons.
- **Brand motifs** (use these before reaching for an icon): the **48px grid**, **corner brackets / cartouche** (┐└ framing a figure), **dashed construction lines** bisecting a shape, the **`//` `$` `>` `_` `▌`** typographic marks. These carry more brand meaning than any icon.
- **Logo:** always the `Logo` component or `assets/logo-spectre.png`. Favicon = the **mark alone** (no wordmark), min 24px. Never tilt, stretch, or reverse the spectrum; in single-colour contexts use the mono lockup (white on dark, Deep Void on light).

---

## Motion — the signature scroll system: “La Matérialisation”

The brand’s differentiating motion, drop-in for the website **and** presentations. Files live in `motion/` (`al-scroll.css`, `al-scroll.js`); the scrollable showcase is `motion/scroll-signature.html`.

**The idea** (straight from the charter — *l’idée traverse le spectre avant de devenir réelle*): as the reader scrolls, each section arrives as a **blueprint wireframe**, a **spectrum scan-line** sweeps through it, and it **materialises** into the finished design — cartouche brackets and dimension cotes snap in, a **rail-spectre** tracks progress down the left edge. The grid *constructs*, the content *materialises*: Design → Build, animated.

**Usage** — link the two files, add data-attributes, done:
```html
<link rel="stylesheet" href="motion/al-scroll.css">
<!-- …content with data-al="…" attributes… -->
<script src="motion/al-scroll.js"></script>  <!-- near </body> -->
```
- `data-al="rise | wipe | materialize | draw | build"` — the reveal kind.
- `data-al-stagger="120"` on a parent — children reveal in sequence.
- `data-al-parallax="0.1"`, `data-al-count="1440"`, `data-al-type`, `data-al-repeat` — depth, count-ups, typing, replay.
- Personality on `<html data-al-motion="materialize | scan | draft | calm">`; intensity via `--al-amp` (0.5–1.5); spectrum vividness via `--al-charge` (0–1 — dials rail/bead/scan glow and the materialisation’s colour pop).

**Robustness (important).** The visible, finished state is always the DEFAULT — hidden “start” states apply only under `prefers-reduced-motion: no-preference` once the engine arms the page. So **print, PDF, reduced-motion and static captures always show the real content**, never a blank `opacity:0`. Hidden states use `transform` / `clip-path` / `filter` (not opacity) so a frozen frame stays visible. Where the page can’t be scrolled (embedded/auto-height hosts), the engine **auto-plays the materialisation section-by-section** so the effect is never lost.

**On slides:** call `AL.motion.reveal(slideEl)` when a slide becomes active (and `AL.motion.reset(slideEl)` on leave) to replay the materialisation per slide.

**Tweakable showcase.** `scroll-signature.html` ships an in-page **motion console** (always visible, bottom-right) and a host-toggled **Tweaks** panel exposing three expressive axes — *Caractère* (the reveal personality), *Intensité* (amplitude, Sobre→Spectaculaire) and *Ambiance* (charge, Plan→Spectre). Both surfaces share one state and persist via the Tweaks host protocol; the calm, low-amplitude feel is the saved default.

## Using the system

Link the stylesheet, then mount components from the namespace:

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Logo, Card, Tag, GradientRule, Eyebrow, Input } = window.ArchitectLabDesignSystem_61bf68;
</script>
```

Or in production, copy the token CSS + `@font-face` and follow the rules above.
