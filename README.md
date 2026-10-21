# Unseen — AI Design System

A token-driven design system and reference product for AI interfaces. It pairs **AlignUI's surgical component precision** with **Kigen's vivid, color-forward energy**, then extends both with the patterns AI products actually need: streaming, prompting, model choice, agent runs and token cost.

> v2.0 · 42 components · 10 sections · 9 pages · light + dark · WCAG 2.2 AA

---

## Run it

```bash
yarn install     # or npm install
yarn dev         # http://localhost:5173
yarn build       # tsc -b && vite build
yarn lint
```

Navigate the app with the sidebar, or press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> for the command palette. Toggle themes with <kbd>⌘J</kbd> or the sun/moon buttons.

---

## What's inside

| Page | Route | Purpose |
| --- | --- | --- |
| Overview | `#/overview` | System home: principles, quality bar, changelog |
| Foundations | `#/foundations` | Color ramps, semantic mapping, type, spacing, radius, elevation, motion |
| Components | `#/components` | 10 filterable sections of primitives |
| AI patterns | `#/ai-patterns` | Chat, prompt builder, model selector, streaming, agents, usage, dev surfaces |
| Dashboard | `#/dashboard` | Shipped analytics screen with KPIs, charts, model table, activity |
| Copilot | `#/copilot` | Chat playground with live parameter panel |
| Settings | `#/settings` | Profile, workspace, API keys, billing, notifications |
| Templates | `#/templates` | Sign in, 4-step onboarding, invite flow, first-run empty state |
| Guidelines | `#/guidelines` | Do / don't, accessibility, token naming, handoff, changelog |

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
│       └── AI.tsx            # Sparkline, AreaChart, BarChart, ChatMessage, CodeBlock, AgentStep…
├── pages/                    # the nine surfaces above
└── App.tsx                   # hash router, theme persistence, shortcuts
```

### Token layers

1. **Raw palette** — fixed ramps: blue `#0E91F0`, pink `#F72685`, amber `#FF7A0D`, neutral, plus semantic hues.
2. **Semantic tokens** — `--ds-surface`, `--ds-ink`, `--ds-muted`, `--ds-line`, `--ds-brand`, `--ds-danger`… defined for light and re-mapped under `.dark`.
3. **Tailwind theme** — `@theme inline` exposes them as utilities: `bg-surface`, `text-ink`, `border-line`, `bg-brand-soft`, `shadow-card`.

Product code should never use raw hex or arbitrary spacing. Change `--ds-brand` in one place and all 42 components follow, in both themes.

### Type & shape

- **Geist** (variable, self-hosted in `src/assets/fonts`, SIL OFL 1.1) for UI, **Geist Mono** for code, keys and token values. No network request at runtime.
- Type scale: 60 / 40 / 28 / 20 / 16, body 16 / 14 / 13, caption 11, overline 10.
- Radius ladder: **4 / 8 / 12 / 16 / 24 / full** — `sm` chips, `md` buttons + inputs, `lg` rows, `xl` cards, `2xl` modals and shells.

### Rules of the system

- **One primary action per view.** Everything else is secondary, outline or ghost.
- **13px workhorse type.** 11px is metadata only; display sizes track tighter as they grow.
- **One shadow per surface.** `shadow-card` for cards, `shadow-pop` for menus, `shadow-float` for dialogs.
- **Color is never the only signal.** Every status pairs color with a dot, icon or label.
- **Motion is fast and optional.** 90–360ms, and everything collapses to 0.01ms under `prefers-reduced-motion`.
- **AI surfaces show their work.** Streaming, reasoning steps, sources and token estimates are components, not copy.

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

## Roadmap

- Component test suite + visual regression with Playwright
- Evaluation / dataset components (rubric scoring, diff views)
- Density switch (comfortable / compact) driven by the same tokens
- Token export pipeline (Tailwind config + Figma JSON + CSS)

---

Built as a working reference, not a screenshot: every state on every page is interactive.
