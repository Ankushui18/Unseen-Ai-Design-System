# Unseen — AI Design System

A token-driven design system and reference product for AI interfaces. It pairs **AlignUI's surgical component precision** with **Kigen's vivid, color-forward energy**, then extends both with the patterns AI products actually need: streaming, prompting, model choice, agent runs and token cost.

> v2.2 · 111 components · 15 sections · 20 pages · light + dark · WCAG 2.2 AA · Figma token package

---

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run verify    # types + lint + token/contrast gate + production build
npm run tokens    # regenerate the Figma/JSON/CSS token artefacts
```

`npm run tokens` fails if any text pair drops below 4.5:1, so the docs, the app and the
Figma library cannot drift apart.

Navigate the app with the sidebar, or press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> for the command palette. Toggle themes with <kbd>⌘J</kbd> or the sun/moon buttons.

---

## What's inside

| Page | Route | Purpose |
| --- | --- | --- |
| Overview | `#/overview` | System home: principles, quality bar, changelog |
| Foundations | `#/foundations` | Color ramps, semantic mapping, type, spacing, radius, elevation, motion |
| Components | `#/components` | 15 filterable sections of primitives |
| AI patterns | `#/ai-patterns` | Chat, prompt builder, model selector, streaming, agents, usage, dev surfaces |
| Component docs | `#/docs` | Anatomy, props, do / don't and accessibility notes per component |
| Token export | `#/tokens` | CSS, JSON, Tailwind and Figma variable output from one source |
| Dashboard | `#/dashboard` | Shipped analytics screen with KPIs, charts, model table, activity |
| Analytics | `#/analytics` | Traffic, spend and quality breakdowns with cohorts and funnels |
| Models | `#/models` | Registry, routing rules and deployment state per model |
| Playground | `#/playground` | Prompt A/B testing across two models with traces and cost |
| Copilot | `#/copilot` | Chat playground with live parameter panel |
| Datasets | `#/datasets` | Golden sets, eval runs, rubric scoring and human review queue |
| Agents | `#/agents` | Run traces, tool calls, guardrail checks and human-in-loop steps |
| Developers | `#/developers` | API reference, params, error codes, webhooks and log viewer |
| Team | `#/team` | Members, RBAC matrix, audit log and invitations |
| Settings | `#/settings` | Profile, workspace, API keys, billing, notifications |
| Templates | `#/templates` | Sign in, 4-step onboarding, invite flow, first-run empty state |
| Mobile | `#/mobile` | Phone-frame chat, dashboard and sheet patterns |
| Guidelines | `#/guidelines` | Do / don't, accessibility, token naming, handoff, changelog |
| States | `#/states` | Empty, error, loading and permission states, in full and inline |

---

## Architecture

```
src/
├── index.css                 # token layer: raw palette → semantic vars, @theme mapping, motion utilities
├── design/tokens.ts          # documented token source of truth (palette, type, spacing, radii, shadows, motion)
├── components/
│   ├── layout/               # Shell, Sidebar, Topbar, Page primitives, command palette, nav config
│   └── ui/                   # primitives
│       ├── Button.tsx        # primary / secondary / outline / ghost / soft / danger / link
│       ├── Field.tsx         # Input, Textarea, Select, PasswordInput, CopyField, SearchInput
│       ├── Controls.tsx      # Checkbox, Radio, Switch, Segmented, Slider
│       ├── Badge.tsx         # tones, variants, GradientBadge, StatusDot, Kbd
│       ├── Card.tsx          # Card, headers, dividers
│       ├── Avatar.tsx        # tones, sizes, presence, stacking
│       ├── Tabs.tsx          # underline, pill, segment
│       ├── Feedback.tsx      # Alert, Toast, Progress, ProgressRing, Skeleton, EmptyState
│       ├── Overlay.tsx       # Tooltip, Modal, Drawer, ConfirmDialogCard
│       ├── AI.tsx            # Sparkline, AreaChart, BarChart, ChatMessage, CodeBlock, AgentStep…
│       ├── DataDisplay.tsx   # Table, TableToolbar, DataBar, Pagination, StatCard, Timeline, TreeView, DiffView, JsonView, LogViewer
│       ├── Charts.tsx        # Donut, Funnel, Gauge, Heatmap, StackedBar, Scatter, MiniBars, Legend, ChartCard
│       ├── Navigation.tsx    # Breadcrumbs, Stepper, DropdownMenu, NavList, AnchorNav, MobileTabs, SegmentedTabs
│       ├── Advanced.tsx      # Accordion, Combobox, TagInput, NumberStepper, FileDrop, Calendar, Rating, Banner, OptionCards
│       └── AIExtra.tsx       # PromptCard, RunTrace, ToolCallCard, TokenCounter, EvalRubric, GuardrailBanner, Citations…
├── pages/                    # the twenty surfaces above
└── App.tsx                   # hash router, theme persistence, shortcuts
```

### Token layers

1. **Raw palette** — fixed ramps: blue `#0E91F0`, pink `#F72685`, amber `#FF7A0D`, neutral, plus semantic hues.
2. **Semantic tokens** — `--ds-surface`, `--ds-ink`, `--ds-muted`, `--ds-line`, `--ds-brand`, `--ds-danger`… defined for light and re-mapped under `.dark`.
3. **Tailwind theme** — `@theme inline` exposes them as utilities: `bg-surface`, `text-ink`, `border-line`, `bg-brand-soft`, `shadow-card`.

Product code should never use raw hex or arbitrary spacing. Change `--ds-brand` in one place and all 111 components follow, in both themes.

### Type & shape

- **Geist** (variable, self-hosted in `src/assets/fonts`, SIL OFL 1.1) for UI, **Geist Mono** for code, keys and token values. No network request at runtime.
- Type scale: 60 / 40 / 28 / 20 / 16, body 16 / 14 / 13, caption 11, overline 10.
- Radius ladder: **4 / 8 / 12 / 16 / 24 / full** — `sm` chips, `md` buttons + inputs, `lg` rows, `xl` cards, `2xl` modals and shells.

### Colour roles

Every accent is published as three tokens, because one hue cannot serve text and fills at once:

| Role | Token | Use | Guarantee |
| --- | --- | --- | --- |
| base | `--ds-brand` | links, icons, focus rings | ≥ 4.5:1 on surface + canvas |
| vivid | `--ds-brand-vivid` | gradients, chart marks | decorative, never carries text |
| solid | `--ds-brand-fill` + `--ds-on-brand` | buttons, solid badges | the pair passes by construction |

Amber and warning fills are light, so their on-colour is near-black — white on
`amber/500` is 2.6:1 and never ships. The measured table (42 pairs, both modes) is on the
Foundations screen and in `tokens/CONTRAST.md`.

### Rules of the system

- **One primary action per view.** Everything else is secondary, outline or ghost.
- **13px workhorse type.** 11px is metadata only; display sizes track tighter as they grow.
- **One shadow per surface.** `shadow-card` for cards, `shadow-pop` for menus, `shadow-float` for dialogs.
- **Color is never the only signal.** Every status pairs color with a dot, icon or label.
- **Motion is fast and optional.** 90–360ms, and everything collapses to 0.01ms under `prefers-reduced-motion`.
- **AI surfaces show their work.** Streaming, reasoning steps, sources and token estimates are components, not copy.
- **Charts are hand-rolled SVG.** Every mark reads its colour from a CSS variable, so charts theme with the rest of the page instead of shipping a second palette.
- **Every state is designed.** Empty, loading, error, offline and permission states are first-class screens (`#/states`), not leftovers.

---

## Theming

Theme is stored in `localStorage` (`unseen-ds-theme`) and applied as `.dark` on `<html>`. The toggle lives in the sidebar, the top bar, and the command palette. No flash-of-wrong-theme: the app sets the class during the first render.

## Accessibility

- 2px visible focus ring with 2px offset on every interactive element.
- Body contrast checked against WCAG AA in both themes.
- All overlays close on `Esc`; dialogs use `aria-modal` and scroll locking.
- Tabs, switches and radios expose proper roles and selected/checked state.
- Icons are decorative unless labelled (`aria-label` / visually hidden text).

---

## Figma handoff

1. Import `design/tokens.ts` values (or the CSS variables) into the Figma variable collection — light and dark in one file.
2. Mirror component props: `variant`, `tone`/`status`, `size`, `state`.
3. Publish the library; document AI states (streaming, thinking, tool call, failure) as variants.
4. Keep names identical to code: `brand/500`, `surface`, `line-strong`, `danger`.

## Token export & Figma

`npm run tokens` (source: `scripts/build-tokens.mjs`) emits:

| File | Contents |
| --- | --- |
| `tokens/unseen.tokens.json` | Tokens Studio format, Light + Dark theme sets, W3C DTCG shape |
| `tokens/figma-variables.json` | 212 Figma variables across 2 collections (`Unseen — Color`, `Unseen — Scale`) |
| `tokens/unseen.tokens.css` | the same values as CSS custom properties |
| `tokens/CONTRAST.md` | measured WCAG + colour-vision report |
| `src/design/contrast-report.ts` | the same measurements, typed, rendered on Foundations |

**The complete Figma rebuild spec — import steps, variable naming, text/effect styles,
per-component anatomy with sizes and states, page structure and a verification checklist —
is in [`docs/figma-handoff.md`](docs/figma-handoff.md).**

### Chart palette

Eight categorical series, checked pairwise under protanopia and deuteranopia with a
Viénot/Brettel LMS simulation: min ΔE₇₆ **20.6** (light) and **19.1** (dark), against a
floor of 10, and min 4.61:1 / 7.10:1 contrast against the surface.

## Mobile

Breakpoints are documented in `#/foundations` and the phone patterns live in `#/mobile`.
The 390px pass fixed: toggle knob travel (was clipping 2px), 44px hit areas for icon
buttons, modals becoming bottom sheets, the team table becoming cards, and the drawer
sizing. `overflow-x: clip` on the root prevents accidental page-level horizontal scroll.

## Roadmap

- A real 390px visual pass in a browser (this sandbox has no rendering engine)
- Component test suite + visual regression with Playwright
- Density switch (comfortable / compact) driven by the same tokens
- Per-page code splitting (the demo bundle is intentionally single-chunk)

---

Built as a working reference, not a screenshot: every state on every page is interactive.
