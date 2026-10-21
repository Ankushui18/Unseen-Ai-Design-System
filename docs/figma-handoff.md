# Unseen → Figma handoff

Everything needed to rebuild Unseen as a Figma library that matches the code, plus the
checks to prove it matches. Written against **v2.2** of the system (source of truth:
`src/index.css` + `src/design/tokens.ts`, verified build `d86188e` + this branch).

---

## 0. What's in the package

| File | What it is | Use it for |
| --- | --- | --- |
| `tokens/unseen.tokens.json` | Tokens Studio format, W3C DTCG shape. Two theme sets (`Light`, `Dark`) over one palette + one scale set. | Import with the **Tokens Studio** plugin, then push to Figma Variables. |
| `tokens/figma-variables.json` | Figma Variables REST payload — 2 collections, 2 modes, 212 variables. | Programmatic import (`POST /v1/files/:key/variables`) or a reference when creating variables by hand. |
| `tokens/unseen.tokens.css` | The same values as CSS custom properties. | Standalone mocks, Storybook, or diffing against the running app. |
| `tokens/CONTRAST.md` | Measured WCAG + colour-vision report. | Sign-off. Regenerate with `npm run tokens`. |
| `src/design/contrast-report.ts` | The same numbers as typed data, rendered on the Foundations screen. | Doc screens that can never drift. |

The pipeline is one command:

```bash
npm run tokens          # node scripts/build-tokens.mjs
```

It rewrites every file above, prints a summary, and **exits non-zero if any text pair
drops below AA**. Run it in CI before publishing the Figma library.

---

## 1. Importing the tokens

### Option A — Tokens Studio (recommended)

1. Install **Tokens Studio for Figma**.
2. `Plugins → Tokens Studio → Tools → Import → Import file` and pick `tokens/unseen.tokens.json`.
3. Switch the plugin's **Themes** dropdown to `Light`, then `Dark` — the file ships both
   theme definitions, so one import gives you both modes.
4. `Export → Figma Variables` and choose:
   - Collection: `Unseen — Color`, modes `Light` / `Dark`
   - Collection: `Unseen — Scale` (radius, space, size, breakpoints, z-index, motion, type)
5. Rename the imported collections if you like, but **keep the variable names**. Code
   references them: `color/brand` → `--ds-brand`.

### Option B — native Variables

`tokens/figma-variables.json` is shaped as:

```json
{ "variableCollections": [{ "name": "Unseen — Color", "modes": [...] }],
  "variables": [{ "name": "color/brand", "resolvedType": "COLOR",
                  "valuesByMode": { "mode:light": {r,g,b,a}, "mode:dark": {...} } }] }
```

The `mode:*` ids are stable so you can map them to the ids the Figma API returns after
creating the collections. Colours are normalised 0–1; `FLOAT` variables carry px values
(radius, spacing, sizes, breakpoints) and unitless numbers (weights, z-index, durations).

### Naming law

```
color/<semantic>            color/brand, color/surface, color/on-brand
palette/<family>/<step>     palette/brand/600, palette/red/700
radius/<step>               radius/md
space/<step>                space/4
size/<token>                size/control-md, size/touch-target
type/<style>/<prop>         type/h3/size, type/h3/weight
motion/duration/<token>     motion/duration/fast
```

Palette steps are **never** used directly in components — they exist so the semantic layer
can be re-pointed without touching a single component.

---

## 2. Colour architecture (the important part)

Each accent has **three** roles. Getting this wrong is the single easiest way to break AA.

| Role | Example | Contrast guarantee | Use for |
| --- | --- | --- | --- |
| Base | `color/brand` = `#0272C6` (L) / `#38AEFA` (D) | ≥ 4.5:1 on surface **and** canvas | Text, icons, links, focus rings, 1px strokes |
| `-vivid` | `color/brand-vivid` = `#0E91F0` / `#38AEFA` | none (exempt) | Gradients, chart marks, decorative dots, illustration |
| `-fill` + `on-*` | `color/brand-fill` + `color/on-brand` | the pair is ≥ 4.5:1 by construction | Solid buttons, solid badges, selected calendar day, active dots |

Amber and warning fills are **light** hues, so their `on-*` token is near-black
(`#0F0F1E`), not white. Never put white on `amber/500`, `warning/500`, `green/400` or any
`-vivid` token.

**Light vs dark pairs to memorise**

| Token | Light | Dark |
| --- | --- | --- |
| `surface` | `#FFFFFF` | `#101019` |
| `canvas` | `#F6F6FA` | `#07070D` |
| `ink` | `#0F0F1E` | `#F4F5FA` |
| `muted` | `#5E5E78` | `#A7A8BC` |
| `faint` | `#6C6C89` | `#8A8BA1` |
| `brand` | `#0272C6` | `#38AEFA` |
| `brand-fill` | `#0272C6` | `#38AEFA` |
| `on-brand` | `#FFFFFF` | `#061320` |

In dark mode the semantic names stay identical and only the values change — that is what
makes one component set serve both themes.

### Chart palette

Eight categorical series (`chart/1…8`), checked pairwise with a Viénot/Brettel LMS
simulation. Current floors: **protanopia ΔE₇₆ 21.7 (light) / 19.5 (dark)**,
**deuteranopia 20.6 / 19.1** — well above the ΔE 10 floor. Series must always carry a
legend label; colour is never the only channel. Build charts as Figma components with a
`series` variant that swaps the fill variable, so a designer cannot pick an off-palette hue.

---

## 3. Figma file structure

```
📄 00 · Cover                     logo, version, contact, link to this doc
📄 01 · Foundations/Color         ramps, semantic table, contrast table, chart palette
📄 02 · Foundations/Type          text styles, specimens, tabular-figure notes
📄 03 · Foundations/Shape         radius ladder, spacing, elevation, motion
📄 04 · Components                every component set, one per row, documented
📄 05 · Patterns                  chat, prompt, tool call, run trace, empty/error states
📄 06 · Screens                   the product screens as frames (desktop + 390 mobile)
📄 07 · Handoff                   changelog, a11y checklist, this doc's checklist
```

Rules for the file:

- Component sets live on `04` only. Screens **instance** them — no detached copies.
- Every component set sits in a frame named for the component, with a one-line description
  (what it is for) and a link to the docs page.
- Nothing uses raw hex. If the fill picker doesn't show a variable, the layer is wrong.

---

## 4. Text, effect and grid styles

Create these as **text styles** (all Geist; mono for data):

| Style | Size / line-height | Weight | Tracking |
| --- | --- | --- | --- |
| Display | 60 / 61 | 800 | −4.5% |
| H1 | 40 / 43 | 700 | −3.5% |
| H2 | 28 / 32 | 700 | −3% |
| H3 | 20 / 26 | 600 | −2% |
| H4 | 16 / 22 | 600 | −1% |
| Body L | 16 / 26 | 400 | 0 |
| Body M | 14 / 22 | 400 | 0 |
| Body S | 13 / 20 | 400 | 0 |
| Caption | 11 / 16 | 500 | +2% |
| Overline | 10 / 14 | 700 | +16%, uppercase |

**Effect styles** — `shadow/xs`, `shadow/card`, `shadow/pop`, `shadow/float`, `shadow/brand`
(one per surface, never stacked). **Grid styles** — 12 columns / 24 gutter / 1240 max for
desktop, 4 columns / 16 gutter / 390 for mobile.

**Numeric text** (table cells, KPIs, token counts) uses Geist **Mono** with tabular figures.

---

## 5. Component build spec

Each entry: frame → auto-layout → tokens → variants/properties → states.

### Button
- Auto layout horizontal, gap `space/1.5`–`space/2`, padding-inline from size, height fixed.
- Radius `radius/md` (8). Type: semibold, 11–14px.
- Sizes: `xs` 28 · `sm` 32 · `md` 40 · `lg` 44. Padding-x: 10 / 12 / 16 / 20.
- Variants: `variant` = primary · secondary · outline · ghost · soft · danger · link.
- Properties: `size`, `iconLeft` (bool), `iconRight` (bool), `label` (text), `state`
  (default · hover · focus · active · disabled · loading).
- Primary = `brand-fill` + `on-brand`, one inner highlight `rgba(255,255,255,.22)` and
  `shadow/brand`. Danger = `danger-fill` + `on-danger`. Never white on `-vivid`.
- Focus: 2px `brand` outline, offset 2.

### Icon button
- Square, `radius/md`, sizes 28 / 32 / 36 / 44. Icon 14–16px.
- Hit area must be 44×44 at phone breakpoints even when the visual is 28 —
  draw it as an invisible 44 frame, exactly like the web `data-touch` rule.

### Input / Textarea / Select
- Frame: label (12px semibold, `ink-soft`, 6px gap) → field → hint/error (11px).
- Field: height 40, radius `md`, 1px `line-strong`, padding-x 12, text 13.
- Focus: border `brand` + 3px `brand-ring`. Invalid: `danger` border + `danger` hint.
- Icons at 16px, 12px inset. Trailing slot right 8px.

### Checkbox / Radio / Switch
- Checkbox 18×18, radius `sm`, 1.5px border; checked = `brand-fill` + check 10px.
- Radio 18×18 circle, 2px dot.
- Switch: track 28×16 / 36×20 / 44×24, radius full, padding 3.
  **Knob travel = width − 2×3 − knob** → 12 / 16 / 22 px. (This is the bug that clipped
  knobs in the earlier sheet; use these exact numbers.)
  Knob: 10 / 14 / 16, white, 1px shadow.

### Badge
- Height 20, radius full, padding 6/2, type 10 semibold.
- Variants: `tone` (brand · pink · amber · success · danger · warning · violet · neutral) ×
  `style` (soft · solid · outline · dot). Solid uses `-fill` + `on-*`.

### Avatar
- 24 / 32 / 40 / 48, radius full. Initials 9–14px semibold on tone-soft.
- Presence dot 6–10px with 2px surface ring; `success` = online, `warning` = away.

### Card / Section / Panel
- Radius `xl` (16), 1px `line`, `surface`, `shadow/card`, padding 16–20.
- Section header: overline 10 + index, title 15–17 bold, optional aside.

### Tabs / Segmented
- Tabs: underline (2px `brand`), pill (`surface` + `shadow-xs`), segment (`surface-3` track).
- Height 28–32; label 11–12 semibold; active colour `ink`, inactive `muted`.

### Table
- Header: 9.5 uppercase, `faint`, `surface-2`, 8/10 padding.
- Row: min-height 48, padding 12/12, 1px `line` divider, hover `surface-2`,
  selected `brand-soft` with a 2px `brand` left inset.
- Numeric cells right-aligned, mono 10.5, tabular figures.
- Mobile: below 640 the table is replaced by a card list — build both as variants.

### Pagination
- Prev / Next 32×24, numbered chips 24×24 radius `sm`; current = `brand-fill` + `on-brand`.

### Modal / Drawer / Sheet
- Desktop modal: max-width 384 / 512 / 672, radius 16, padding 24, footer 14/24, scrim
  `#08080F` at 55% + 3px blur.
- Mobile: bottom sheet, radius 24 top corners only, max-height 92% viewport, sticky footer,
  safe-area padding 16.
- Drawer: right, width 400, full-bleed under 640.

### Toast / Alert
- Toast: radius 12, padding 12, icon 14, title 11.5 semibold, description 10.5.
- Alert: radius 8, 1px tinted border, soft background, optional dismiss 14.

### Stat card
- Radius 16, padding 14. Overline label 9.5, value 19 mono extrabold, delta 9.5, sparkline
  height 28. Variants for tone (brand · pink · amber · success).

### AI patterns
- **Chat message**: avatar 32 (gradient mark for assistant), meta row 11, bubble max 86%
  width, user = `brand-soft`, assistant = `surface` + 1px `line`, radius 16 (8 on the
  tail corner). Streaming = 2px caret, blinking at 1s steps.
- **Tool call card**: mono name, args in `surface-2`, status chip (pending / success /
  error), duration right-aligned.
- **Run trace**: 6px vertical rail, one row per step, kind chip (llm · tool · guard ·
  human) at 8.5 mono.
- **Confidence meter**: 4px track, `brand` fill, value right.
- **Prompt card**: icon tile 28, title 12 semibold, description 10.5, footer tags + run
  button; hover lifts 2px and swaps border to `brand` 35%.
- **Guardrail banner**: `danger-soft`, shield icon, rule in mono, action right.

### Shell
- Sidebar 248 fixed, radius 0, `surface` 85% + 24px blur, 1px right border.
- Top bar 56, sticky, `canvas` 80% + blur, breadcrumb 11.5.
- Content max 1240, padding 16 / 24 / 40 at `xs` / `sm` / `lg`.
- Mobile: sidebar becomes a left drawer 82vw (max 300), backdrop 50% + 4px blur.

---

## 6. Mapping the screens

Build screens on `06` at two widths: **1440** (sidebar visible) and **390** (drawer
closed). Instance everything. For each screen include: default, empty, loading (skeletons
that match final layout), and error where the screen can fail.

Screens shipped in code (`#/route`):
`overview` · `foundations` · `components` · `ai-patterns` · `docs` · `tokens` ·
`dashboard` · `analytics` · `models` · `playground` · `copilot` · `datasets` · `agents` ·
`developers` · `team` · `settings` · `templates` · `mobile` · `guidelines` · `states`.

---

## 7. Verification checklist

Run before publishing the library. Every item is checkable by eye or by the inspector.

**Tokens**
- [ ] Both modes exist on the colour collection; switching modes changes only values.
- [ ] No component layer has a raw hex fill or stroke.
- [ ] `radius/*` shows 4, 8, 12, 16, 24, 32 — no 6/10/14/18/20 anywhere.
- [ ] Text nodes are bound to text styles, not manual sizes.

**Contrast** (matches `tokens/CONTRAST.md`)
- [ ] Body text ≥ 4.5:1 in both modes.
- [ ] `on-brand` on `brand-fill` = 4.97 (L) / 7.67 (D).
- [ ] `on-amber` on `amber-fill` = 7.26 (L) / 8.87 (D) — i.e. dark text, never white.
- [ ] `faint` text is still legible: 5.07 (L) / 5.66 (D).
- [ ] Chart series are distinguishable in a protanopia simulator (Figma plugin or
      `Sim Daltonism`).

**Components**
- [ ] Every interactive component has default / hover / focus / disabled variants.
- [ ] Toggles: knob sits flush inside the track at all three sizes (12 / 16 / 22 travel).
- [ ] Icon buttons expose a 44×44 hit area at mobile size.
- [ ] Tables have a mobile card variant.
- [ ] Modals and drawers render at 390 width without horizontal scroll.

**Screens**
- [ ] 1440 and 390 frames exist for each screen.
- [ ] Empty / loading / error frames exist where the screen can fail.
- [ ] Nothing overlaps the safe area at the bottom of the mobile frames.

---

## 8. Known exceptions

- **White text on gradients** (logo, hero mesh, AI badges) is intentional and exempt: the
  gradient is decoration behind bold, large text, and it is never used for body copy.
- **`-vivid` tokens** are exempt from contrast — they never carry text.
- **Chart marks** need 3:1 against surface, which the palette meets (min 4.61 light /
  7.10 dark).
- Sample model names, prices and figures in the screens are placeholders.
- The app's "Download tokens.json" affordance is blocked in sandboxed previews; the files
  in this repo are the source of truth.

---

## 9. Keeping it in sync

| When | Do |
| --- | --- |
| A colour, radius, shadow or type value changes | edit `scripts/build-tokens.mjs`, run `npm run tokens`, commit the regenerated files |
| A component's anatomy changes | update §5 here **and** the Component docs screen (`#/docs`) |
| A new token is added | add it to the script, then re-import into Figma — never hand-edit the Figma variables |
| Before a release | `npm run tokens && npm run verify` (tsc + eslint + build) |

The contrast gate is the contract: if `npm run tokens` fails, the branch is not shippable
and the Figma library must not be republished.
