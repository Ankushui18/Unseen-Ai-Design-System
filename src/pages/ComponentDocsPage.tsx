import { useState } from 'react';
import { Accessibility, ArrowRight, Check, Code2, Layers, Sparkles, X } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, Kbd } from '../components/ui/Badge';
import { Input, Field } from '../components/ui/Field';
import { Switch } from '../components/ui/Controls';
import { ChatMessage } from '../components/ui/AI';
import { Table, TableHead, Td, Th, Tr } from '../components/ui/DataDisplay';
import { AnchorNav } from '../components/ui/Navigation';
import { CodeBlock } from '../components/ui/AI';
import { cn } from '@/lib/utils';

type DocKey = 'button' | 'input' | 'chat' | 'table' | 'badge';

const docs: Record<
  DocKey,
  {
    name: string;
    summary: string;
    status: 'stable' | 'beta';
    anatomy: { part: string; note: string }[];
    props: { name: string; type: string; def: string; note: string }[];
    preview: () => React.ReactNode;
    do: string[];
    dont: string[];
    a11y: string[];
    code: string;
    usedIn: string[];
  }
> = {
  button: {
    name: 'Button',
    summary: 'The primary action primitive. Seven variants, four sizes, loading and icon slots.',
    status: 'stable',
    anatomy: [
      { part: 'Container', note: 'h-28 → h-44, radius md (8px), one shadow max' },
      { part: 'Icon slot', note: '16px, 8px gap, inherits text color' },
      { part: 'Label', note: 'Semibold, 11–14px, never wraps' },
      { part: 'Focus ring', note: '2px brand outline, 2px offset' },
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'link'", def: "'primary'", note: 'Visual weight' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", def: "'md'", note: 'Height + type size' },
      { name: 'loading', type: 'boolean', def: 'false', note: 'Swaps icon for spinner, blocks clicks' },
      { name: 'iconLeft / iconRight', type: 'ReactNode', def: '—', note: 'Decorative icons' },
      { name: 'disabled', type: 'boolean', def: 'false', note: '45% opacity, pointer-events none' },
    ],
    preview: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
        <Button size="sm" variant="outline">Outline</Button>
        <Button size="sm" variant="ghost">Ghost</Button>
        <Button size="sm" variant="soft">Soft</Button>
        <Button size="sm" variant="danger">Danger</Button>
        <Button size="sm" loading>Loading</Button>
      </div>
    ),
    do: ['One primary button per view', 'Use danger only for destructive actions', 'Keep labels to 1–3 words'],
    dont: ['Stack two primaries side by side', 'Use a button for navigation without an href affordance', 'Put a long sentence in a button'],
    a11y: ['Renders a native <button type="button">', 'Loading sets disabled and keeps width stable', 'Focus ring never removed, only restyled'],
    code: `<Button size="sm" variant="secondary" iconLeft={<Plus />}>
  New model
</Button>`,
    usedIn: ['Components', 'Dashboard', 'Copilot', 'Settings'],
  },
  input: {
    name: 'Text field',
    summary: 'A labelled input with hint, error, icon and trailing slots. Built on a native input.',
    status: 'stable',
    anatomy: [
      { part: 'Label', note: '12px semibold, optional required marker' },
      { part: 'Control', note: 'h-40, radius md, 1px border → brand on focus + 3px ring' },
      { part: 'Hint', note: '11px muted, replaced by error when invalid' },
      { part: 'Icon slot', note: '16px left icon with 12px inset' },
    ],
    props: [
      { name: 'label', type: 'ReactNode', def: '—', note: 'Rendered by Field' },
      { name: 'hint', type: 'ReactNode', def: '—', note: 'Helper copy under the control' },
      { name: 'error', type: 'ReactNode', def: '—', note: 'Turns the control red, replaces hint' },
      { name: 'invalid', type: 'boolean', def: 'false', note: 'Border + aria-invalid' },
      { name: 'valid', type: 'boolean', def: 'false', note: 'Success border + check icon' },
    ],
    preview: () => (
      <div className="grid max-w-md gap-3">
        <Field label="Model name" hint="Lowercase, hyphenated.">
          <Input placeholder="support-copilot" />
        </Field>
        <Field label="Endpoint" error="Already in use.">
          <Input invalid defaultValue="api.unseen.ai/v1" />
        </Field>
        <Field label="Workspace">
          <Input valid defaultValue="workspace-prod" />
        </Field>
        <Field label="Disabled">
          <Input disabled defaultValue="Managed by SSO" />
        </Field>
      </div>
    ),
    do: ['Always pair an input with a label', 'Write hints as instructions, not restatements', 'Reserve error space so layout never jumps'],
    dont: ['Use placeholder as a label', 'Show an error before the user blurs the field', 'Use a text input for 2–5 choices'],
    a11y: ['Label is bound with htmlFor', 'aria-invalid is set when error is present', 'Focus ring visible at 3:1 against the surface'],
    code: `<Field label="Model name" hint="Lowercase, hyphenated." error={error}>
  <Input placeholder="support-copilot" invalid={!!error} />
</Field>`,
    usedIn: ['Components', 'Settings', 'Models', 'Developers'],
  },
  chat: {
    name: 'Chat message',
    summary: 'Role-aware message bubble with avatar, timestamp, streaming caret and action row.',
    status: 'beta',
    anatomy: [
      { part: 'Avatar', note: '32px; assistant uses the gradient mark' },
      { part: 'Meta row', note: 'Name + time, 11px, above the bubble' },
      { part: 'Bubble', note: 'max 86% width; user = brand-soft, assistant = surface + border' },
      { part: 'Actions', note: 'Copy / regenerate / rate, 24px targets' },
    ],
    props: [
      { name: 'role', type: "'user' | 'assistant' | 'system'", def: '—', note: 'system renders a centred chip' },
      { name: 'streaming', type: 'boolean', def: 'false', note: 'Adds a blinking inline caret' },
      { name: 'time', type: 'string', def: '—', note: 'Monospace timestamp' },
      { name: 'actions', type: 'ReactNode', def: '—', note: 'Icon buttons under the bubble' },
    ],
    preview: () => (
      <div className="space-y-3">
        <ChatMessage role="system">Context: production · last 24h</ChatMessage>
        <ChatMessage role="user" time="09:41">Why did p95 latency rise after the router change?</ChatMessage>
        <ChatMessage role="assistant" time="09:41" streaming>
          The regression is isolated to streaming completions on the eu-central pool…
        </ChatMessage>
      </div>
    ),
    do: ['Keep the assistant mark consistent across every surface', 'Show sources inline with the answer', 'Keep the composer usable while streaming'],
    dont: ['Animate layout while tokens arrive', 'Use more than two bubble tints', 'Hide the model name'],
    a11y: ['Role is announced via accessible name', 'Streaming state is not conveyed by animation alone', 'Copy actions have aria-labels'],
    code: `<ChatMessage role="assistant" streaming time="09:41">
  The regression is isolated to streaming completions…
</ChatMessage>`,
    usedIn: ['AI patterns', 'Copilot', 'Mobile'],
  },
  table: {
    name: 'Data table',
    summary: 'Composable table primitives with sorting, selection, sticky toolbars and pagination.',
    status: 'stable',
    anatomy: [
      { part: 'Toolbar', note: 'Search, filters, count, actions' },
      { part: 'Header', note: '9.5px uppercase, sortable affordance' },
      { part: 'Row', note: '48px min, hover tint, selected state' },
      { part: 'Footer', note: 'Pagination + range copy' },
    ],
    props: [
      { name: 'sortable', type: 'boolean', def: 'false', note: 'On Th; shows direction chevron' },
      { name: 'align', type: "'left' | 'right' | 'center'", def: "'left'", note: 'Numeric columns right-align' },
      { name: 'mono', type: 'boolean', def: 'false', note: 'Tabular figures for numbers' },
      { name: 'selected', type: 'boolean', def: 'false', note: 'Row tint for bulk selection' },
    ],
    preview: () => (
      <div className="overflow-hidden rounded-lg border border-line">
        <Table>
          <TableHead>
            <tr>
              <Th>Model</Th>
              <Th align="right" sortable active>Sessions</Th>
              <Th align="right">Retention</Th>
            </tr>
          </TableHead>
          <tbody>
            {[
              { name: 'GPT-4o', sessions: '42,180', retention: '92%' },
              { name: 'Claude 3.5', sessions: '28,442', retention: '88%' },
              { name: 'Gemini 1.5', sessions: '19,860', retention: '74%' },
            ].map(row => (
              <Tr key={row.name}>
                <Td className="font-semibold text-ink">{row.name}</Td>
                <Td align="right" mono>{row.sessions}</Td>
                <Td align="right" mono>{row.retention}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    ),
    do: ['Right-align every numeric column', 'Keep one primary row action', 'Show a range and total in the footer'],
    dont: ['Use colour alone for status', 'Hide pagination when there are 3 pages', 'Let a table scroll horizontally on mobile without a card fallback'],
    a11y: ['Header cells are real <th>', 'Sortable headers are buttons with state', 'Row click has a keyboard equivalent'],
    code: `<Table>
  <TableHead><tr><Th sortable>Model</Th></TableHead>
  <tbody>{rows.map(r => <Tr key={r.id}><Td>{r.name}</Td></Tr>)}</tbody>
</Table>`,
    usedIn: ['Analytics', 'Models', 'Datasets', 'Team'],
  },
  badge: {
    name: 'Badge',
    summary: 'Compact status and metadata. Eight tones, four variants, optional pulse dot.',
    status: 'stable',
    anatomy: [
      { part: 'Pill', note: 'h-20, radius full, 10px semibold type' },
      { part: 'Dot', note: '6px, inherits tone; pulse for live states' },
      { part: 'Icon', note: '12px, optional leading glyph' },
    ],
    props: [
      { name: 'tone', type: "'brand' | 'pink' | 'amber' | 'success' | 'danger' | 'warning' | 'violet' | 'neutral'", def: "'neutral'", note: 'Semantic meaning' },
      { name: 'variant', type: "'soft' | 'solid' | 'outline' | 'dot'", def: "'soft'", note: 'Emphasis level' },
    ],
    preview: () => (
      <div className="flex flex-wrap gap-2">
        <Badge tone="success" variant="soft">Live</Badge>
        <Badge tone="warning" variant="soft">Degraded</Badge>
        <Badge tone="danger" variant="soft">Failed</Badge>
        <Badge tone="brand" variant="solid">Pro</Badge>
        <Badge tone="violet" variant="outline">Beta</Badge>
        <Badge tone="neutral" variant="outline">v2.0</Badge>
      </div>
    ),
    do: ['Pair colour with a word', 'Use one badge per status cell', 'Keep labels under 12 characters'],
    dont: ['Use a badge for a clickable filter (use a chip/tab)', 'Invent new tones per feature', 'Stack 4 badges in one row'],
    a11y: ['Meaning is always in the text', 'Contrast checked in both themes', 'Pulse is decorative only'],
    code: `<Badge tone="success" variant="soft">
  <StatusDot tone="success" /> Live
</Badge>`,
    usedIn: ['Everywhere'],
  },
};

const order: DocKey[] = ['button', 'input', 'chat', 'table', 'badge'];

export function ComponentDocsPage() {
  const [active, setActive] = useState<DocKey>('button');
  const doc = docs[active];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Resources · component docs"
        title="Anatomy & props"
        description="The documentation half of the system: what a component is made of, which props it accepts, when to use it and how it behaves for keyboard and screen-reader users."
        meta={
          <>
            <Badge tone="brand" variant="soft">5 documented</Badge>
            <Badge tone="neutral" variant="outline">props · states · a11y</Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<Code2 className="h-4 w-4" />}>Open source</Button>}
      />

      <div className="grid gap-5 xl:grid-cols-[184px_1fr]">
        <aside>
          <div className="sticky top-20">
            <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-faint">Components</div>
            <AnchorNav
              active={active}
              items={order.map(key => ({ id: key, label: docs[key].name }))}
            />
            <div className="mt-4 space-y-1 px-3">
              <button
                onClick={() => setActive('button')}
                className="block w-full text-left"
                aria-hidden
                tabIndex={-1}
              >
                <span className="sr-only">Select</span>
              </button>
              {order.map(key => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={cn(
                    'w-full rounded-md px-2 py-1 text-left text-[10.5px] transition',
                    active === key ? 'bg-brand-soft font-semibold text-brand-strong dark:text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  {docs[key].name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">{doc.name}</h2>
                  <Badge tone={doc.status === 'stable' ? 'success' : 'warning'} variant="soft">{doc.status}</Badge>
                </div>
                <p className="mt-1 max-w-xl text-[11.5px] leading-5 text-muted">{doc.summary}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="xs" variant="secondary">Storybook</Button>
                <Button size="xs" variant="ghost">Figma</Button>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-line bg-surface-2 p-4">{doc.preview()}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[9.5px] text-faint">
              <span className="font-mono">used in:</span>
              {doc.usedIn.map(place => (
                <Badge key={place} tone="neutral" variant="outline">{place}</Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section index="01" title="Anatomy" description="Parts and measurements">
              <ol className="space-y-2">
                {doc.anatomy.map((part, i) => (
                  <li key={part.part} className="flex gap-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[8px] font-bold text-muted">{i + 1}</span>
                    <span className="text-[10.5px] leading-4">
                      <strong className="font-semibold text-ink">{part.part}</strong>
                      <span className="text-muted"> — {part.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section index="02" title="Props" description={`${doc.props.length} accepted`} flush>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                    <tr>
                      <th className="px-3 py-2">Prop</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Default</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {doc.props.map(prop => (
                      <tr key={prop.name} className="transition hover:bg-surface-2">
                        <td className="px-3 py-2 align-top">
                          <div className="font-mono text-[10px] font-semibold text-ink">{prop.name}</div>
                          <div className="text-[9px] text-faint">{prop.note}</div>
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-[9px] leading-4 text-brand">{prop.type}</td>
                        <td className="px-3 py-2 align-top font-mono text-[9px] text-muted">{prop.def}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-success/25 bg-success-soft/40 p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success-fill text-on-success"><Check className="h-3 w-3" strokeWidth={3} /></span>
                <span className="text-[11.5px] font-bold text-success">Do</span>
              </div>
              <ul className="space-y-1.5">
                {doc.do.map(item => (
                  <li key={item} className="flex gap-1.5 text-[10.5px] leading-4 text-ink-soft">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" strokeWidth={3} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-danger/25 bg-danger-soft/40 p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-danger-fill text-on-danger"><X className="h-3 w-3" strokeWidth={3} /></span>
                <span className="text-[11.5px] font-bold text-danger">Don’t</span>
              </div>
              <ul className="space-y-1.5">
                {doc.dont.map(item => (
                  <li key={item} className="flex gap-1.5 text-[10.5px] leading-4 text-ink-soft">
                    <X className="mt-0.5 h-3 w-3 shrink-0 text-danger" strokeWidth={3} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <Section index="03" title="Accessibility" description="Checked, not assumed">
              <ul className="space-y-2">
                {doc.a11y.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[10.5px] leading-4 text-ink-soft">
                    <Accessibility className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2 rounded-md bg-surface-2 px-2.5 py-2 text-[9.5px] text-muted">
                <Kbd>Tab</Kbd> to reach · <Kbd>⏎</Kbd> to activate · <Kbd>Esc</Kbd> to dismiss
              </div>
            </Section>
            <Section index="04" title="Usage" description="Copy-paste">
              <CodeBlock title={`${doc.name.toLowerCase().replace(/\s+/g, '-')}.tsx`} language="tsx" code={doc.code} />
              <div className="mt-2 flex items-center gap-2">
                <Button size="xs" variant="secondary" iconLeft={<Layers className="h-3 w-3" />}>View source</Button>
                <Button size="xs" variant="ghost" iconRight={<ArrowRight className="h-3 w-3" />}>Next: {docs[order[(order.indexOf(active) + 1) % order.length]].name}</Button>
              </div>
            </Section>
          </div>

          <SurfacePanel label="Design notes">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Token-only styling', body: 'No raw hex, no arbitrary pixel values — every measurement comes from a token.' },
                { title: 'Both themes at once', body: 'A component is not done until it has been reviewed in light and dark.' },
                { title: 'States are part of the spec', body: 'Default, hover, focus, active, disabled, loading and error are documented.' },
              ].map(note => (
                <div key={note.title}>
                  <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-ink">
                    <Sparkles className="h-3 w-3 text-brand" /> {note.title}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted">{note.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
              <Switch checked label="Show measurement grid" size="sm" onChange={() => undefined} />
              <span className="ml-auto text-[9.5px] text-faint">Toggle applies to the preview above</span>
            </div>
          </SurfacePanel>
        </div>
      </div>
    </div>
  );
}
