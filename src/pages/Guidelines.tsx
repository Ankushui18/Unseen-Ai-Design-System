import { useState } from 'react';
import { Accessibility, ArrowUpRight, Check, Code2, Figma, GitBranch, Layers, ShieldCheck, Sparkles, X } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/AI';
import { motion } from '../design/tokens';

const dos = [
  'Use one primary action per view; everything else is secondary or ghost.',
  'Compose surfaces from tokens — bg-surface, border-line, text-muted.',
  'Keep 13px as the default UI size; reserve 11px for metadata only.',
  'Pair every status color with an icon or label.',
  'Show streaming state inline so the composer stays usable.',
];

const donts = [
  'Hard-code hex values or arbitrary spacing in product code.',
  'Use gradients as page backgrounds or behind body copy.',
  'Stack more than one shadow on a surface.',
  'Rely on color alone to communicate model health.',
  'Bury destructive actions in a dropdown without a confirm step.',
];

const a11y = [
  { label: 'Body text contrast ≥ 4.5:1', value: 'Pass', note: 'ink on surface · 16.4:1' },
  { label: 'Large text contrast ≥ 3:1', value: 'Pass', note: 'muted on canvas · 5.1:1' },
  { label: 'Visible focus ring on every control', value: 'Pass', note: '2px brand outline + 2px offset' },
  { label: 'Keyboard reachable overlays', value: 'Pass', note: 'Esc closes, focus trapped' },
  { label: 'Target size ≥ 44px on touch', value: 'Pass', note: 'mobile CTAs use size lg' },
  { label: 'Motion respects preference', value: 'Pass', note: 'transitions collapse to 0.01ms' },
  { label: 'Status never color-only', value: 'Pass', note: 'dot + label + icon' },
];

const naming = [
  { token: '--ds-brand', role: 'Primary accent', example: 'Buttons, focus, links' },
  { token: '--ds-surface', role: 'Card background', example: 'Cards, panels, menus' },
  { token: '--ds-surface-2', role: 'Recessed background', example: 'Table heads, inputs (alt)' },
  { token: '--ds-ink', role: 'Primary copy', example: 'Headings, values' },
  { token: '--ds-muted', role: 'Secondary copy', example: 'Descriptions, meta' },
  { token: '--ds-line', role: 'Default border', example: 'Dividers, card edges' },
  { token: '--ds-line-strong', role: 'Control border', example: 'Inputs, buttons' },
  { token: '--ds-danger', role: 'Destructive', example: 'Delete, failures' },
];

const changelog = [
  { version: 'v2.1', date: 'October 2026', tag: 'Current', changes: ['69 new primitives: charts, navigation, data display, advanced inputs, AI surfaces', '111 components across 15 sections', 'Eleven new screens including docs, token export, playground and mobile', 'Token export pipeline for CSS, JSON, Tailwind and Figma', 'Full empty / error / loading state library'] },
  { version: 'v2.0', date: 'October 2026', tag: '', changes: ['Semantic token layer with light + dark themes', 'AI pattern library: chat, prompts, models, agents, usage', 'Production screens: dashboard, copilot, settings', 'Command palette (⌘K) and theme shortcut (⌘J)'] },
  { version: 'v1.4', date: 'September 2026', tag: '', changes: ['Prompt builder with variable chips', 'Model selector cards', 'Streaming, reasoning and tool-call states', 'Data table with pagination'] },
  { version: 'v1.0', date: 'August 2026', tag: '', changes: ['Foundations: color, type, spacing, elevation', '14-section component sheet', 'Kigen palette + AlignUI precision baseline'] },
];

export function Guidelines() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources · guidelines"
        title="How to use the system."
        description="The rules that keep the system coherent as it scales: token usage, interaction patterns, accessibility and contribution."
        meta={
          <>
            <Badge tone="success" variant="soft"><StatusDot tone="success" /> v2.0</Badge>
            <Badge tone="neutral" variant="outline">WCAG 2.2 AA</Badge>
            <Badge tone="neutral" variant="outline">Figma + code parity</Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<Figma className="h-4 w-4" />}>Open Figma library</Button>}
      />

      <Section id="rules" index="01" title="Core rules" description="Do this, not that">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-success/25 bg-success-soft/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-success-fill text-on-success"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              <span className="text-[12px] font-bold text-success">Do</span>
            </div>
            <ul className="space-y-2.5">
              {dos.map(item => (
                <li key={item} className="flex gap-2 text-[11.5px] leading-5 text-ink-soft">
                  <Check className="mt-1 h-3 w-3 shrink-0 text-success" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-danger/25 bg-danger-soft/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-danger-fill text-on-danger"><X className="h-3.5 w-3.5" strokeWidth={3} /></span>
              <span className="text-[12px] font-bold text-danger">Don’t</span>
            </div>
            <ul className="space-y-2.5">
              {donts.map(item => (
                <li key={item} className="flex gap-2 text-[11.5px] leading-5 text-ink-soft">
                  <X className="mt-1 h-3 w-3 shrink-0 text-danger" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SurfacePanel label="Do — one primary action">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Deploy model</Button>
              <Button size="sm" variant="secondary">Preview</Button>
              <Button size="sm" variant="ghost">Cancel</Button>
            </div>
            <p className="mt-3 text-[10.5px] leading-4 text-muted">Hierarchy is obvious in under a second.</p>
          </SurfacePanel>
          <SurfacePanel label="Don’t — competing primaries">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Deploy model</Button>
              <Button size="sm" className="bg-[linear-gradient(135deg,#FF56A0,#F72685)]">Upgrade</Button>
              <Button size="sm" variant="danger">Delete</Button>
            </div>
            <p className="mt-3 text-[10.5px] leading-4 text-muted">Three loud CTAs flatten the hierarchy and raise error risk.</p>
          </SurfacePanel>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Section id="a11y" index="02" title="Accessibility" description="Checked against WCAG 2.2 AA">
          <ul className="space-y-2">
            {a11y.map(item => (
              <li key={item.label} className="flex items-center gap-3 rounded-md border border-line bg-surface-2/60 px-3 py-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-medium text-ink">{item.label}</span>
                  <span className="block font-mono text-[9.5px] text-faint">{item.note}</span>
                </span>
                <Badge tone="success" variant="soft">{item.value}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-start gap-2 rounded-md bg-brand-soft px-3 py-2.5 text-[10.5px] leading-5 text-brand-strong dark:text-brand">
            <Accessibility className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Every interactive demo in this system is reachable by keyboard. Try tabbing through the buttons, tabs and
            dialog triggers.
          </div>
        </Section>

        <Section id="naming" index="03" title="Token naming" description="Read like an API">
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-left">
              <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                <tr>
                  <th className="px-3 py-2">Variable</th>
                  <th className="px-3 py-2">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {naming.map(row => (
                  <tr key={row.token} className="transition hover:bg-surface-2">
                    <td className="px-3 py-2 font-mono text-[9.5px] text-ink-soft">{row.token}</td>
                    <td className="px-3 py-2">
                      <div className="text-[10.5px] font-medium text-ink">{row.role}</div>
                      <div className="text-[9.5px] text-faint">{row.example}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10.5px] leading-5 text-muted">
            Pattern: <span className="font-mono text-ink-soft">--ds-[role]-[modifier]</span>. Never encode a raw value in
            a semantic token name.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2">
            <Kbd>⌘</Kbd><Kbd>J</Kbd>
            <span className="text-[10.5px] text-muted">toggles every token mapping in place — proof the UI is token-driven.</span>
          </div>
        </Section>
      </div>

      <Section id="implementation" index="04" title="Implementation" description="Copy-paste ready">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">1 · Token layer</div>
            <CodeBlock
              title="index.css"
              language="css"
              code={`@theme inline {
  --color-surface: var(--ds-surface);
  --color-ink: var(--ds-ink);
  --color-line: var(--ds-line);
  --color-brand: var(--ds-brand);
}

:root { --ds-surface: #fff; --ds-brand: #0e91f0; }
.dark { --ds-surface: #101019; --ds-brand: #38aefa; }`}
            />
          </div>
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">2 · Components</div>
            <CodeBlock
              title="deploy.tsx"
              language="tsx"
              code={`import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';

<Button iconLeft={<Sparkles />}>Generate</Button>

<Field label="Model name" hint="Lowercase, hyphenated.">
  <Input placeholder="support-copilot" />
</Field>

<Badge tone="success"><StatusDot /> Live</Badge>`}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Layers, title: 'Tokens first', body: 'Add a semantic token before adding a component variant.' },
            { icon: Code2, title: 'Props over classes', body: 'Variants live in the primitive, not the call site.' },
            { icon: GitBranch, title: 'Versioned', body: 'Breaking token changes ship as a major version with a codemod.' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-xl border border-line bg-surface-2 p-3.5">
                <Icon className="h-4 w-4 text-brand" />
                <div className="mt-2 text-[11.5px] font-semibold text-ink">{item.title}</div>
                <p className="mt-0.5 text-[10.5px] leading-5 text-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <Section id="figma" index="05" title="Figma handoff" description="Parity with code">
          <ol className="space-y-3">
            {[
              { title: 'Import the token sheet', body: 'Use the Tokens Studio JSON export. Names map 1:1 to --ds-* variables.' },
              { title: 'Use component properties', body: 'Variant, tone, size and state mirror the React props exactly.' },
              { title: 'Publish the library', body: 'Ship light and dark collections together; never as separate files.' },
              { title: 'Annotate AI states', body: 'Streaming, thinking, tool call and failure are documented variants.' },
            ].map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand">{i + 1}</span>
                <div>
                  <div className="text-[11.5px] font-semibold text-ink">{step.title}</div>
                  <div className="text-[10.5px] leading-5 text-muted">{step.body}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2.5">
            <Figma className="h-4 w-4 text-brand" />
            <span className="text-[10.5px] text-muted">Library: <span className="font-mono text-ink-soft">unseen-ds / v2.0</span></span>
            <Button size="xs" variant="ghost" className="ml-auto" iconRight={<ArrowUpRight className="h-3 w-3" />}>Open</Button>
          </div>
        </Section>

        <Section id="changelog" index="06" title="Changelog" description="Every release, in reverse order">
          <ol className="space-y-5">
            {changelog.map(entry => (
              <li key={entry.version} className="relative border-l border-line pl-4">
                <span className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-ink">{entry.version}</span>
                  {entry.tag && <GradientBadge><Sparkles className="h-2.5 w-2.5" /> {entry.tag}</GradientBadge>}
                  <span className="ml-auto font-mono text-[9.5px] text-faint">{entry.date}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {entry.changes.map(change => (
                    <li key={change} className="text-[11px] leading-5 text-muted">· {change}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section id="checklist" index="07" title="Before you ship" description="A six-item review gate">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            'Uses tokens only — no raw hex or arbitrary px.',
            'Light and dark modes both reviewed.',
            'One primary action per view.',
            'Empty, loading and error states exist.',
            'Keyboard path and focus order verified.',
            'AI states show provenance and cost.',
          ].map(item => (
            <label
              key={item}
              className="flex cursor-pointer items-start gap-2.5 rounded-md border border-line bg-surface-2/60 px-3 py-2.5 transition hover:border-brand/35"
            >
              <input
                type="checkbox"
                checked={!!checked[item]}
                onChange={e => setChecked(c => ({ ...c, [item]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 accent-[var(--ds-brand)]"
              />
              <span className="text-[11.5px] leading-5 text-ink-soft">{item}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <ShieldCheck className="h-4 w-4 text-success" />
            {Object.values(checked).filter(Boolean).length} of 6 checks complete
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral" variant="outline">motion · {motion[2].duration}ms base</Badge>
            <Button size="sm" variant="secondary">Download checklist</Button>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-line bg-[#0F0F1E] p-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Contribute</div>
              <div className="mt-1 text-[13px] font-semibold">Propose a component or token change</div>
              <p className="mt-0.5 text-[11px] text-white/50">Include light + dark screenshots and the accessibility notes.</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:bg-white/10 dark:text-white"
              iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              Open a request
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
