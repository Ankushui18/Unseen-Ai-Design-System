import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, FileJson, Figma, Palette, Terminal } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/AI';
import { KeyValue } from '../components/ui/DataDisplay';
import { Segmented } from '../components/ui/Controls';
import { JsonView } from '../components/ui/DataDisplay';
import { motion, radii, shadows, spacing, typeScale } from '../design/tokens';

type Format = 'css' | 'json' | 'tailwind' | 'figma';

const cssVars = `:root {
  /* surfaces */
  --ds-canvas: #f6f6fa;
  --ds-surface: #ffffff;
  --ds-surface-2: #fbfbfd;

  /* text */
  --ds-ink: #0f0f1e;
  --ds-muted: #6f6f8c;

  /* brand */
  --ds-brand: #0e91f0;
  --ds-brand-strong: #0272c6;
  --ds-pink: #f72685;
  --ds-amber: #ff7a0d;

  /* shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
}

.dark {
  --ds-canvas: #07070d;
  --ds-surface: #101019;
  --ds-ink: #f4f5fa;
  --ds-brand: #38aefa;
}`;

const jsonTokens = {
  color: {
    brand: { value: '#0E91F0', dark: '#38AEFA', type: 'color' },
    pink: { value: '#F72685', dark: '#FF56A0', type: 'color' },
    amber: { value: '#FF7A0D', dark: '#FF9A33', type: 'color' },
    ink: { value: '#0F0F1E', dark: '#F4F5FA', type: 'color' },
    surface: { value: '#FFFFFF', dark: '#101019', type: 'color' },
  },
  radius: { sm: { value: '4px' }, md: { value: '8px' }, xl: { value: '16px' }, '2xl': { value: '24px' } },
  font: { sans: { value: 'Geist' }, mono: { value: 'Geist Mono' } },
  shadow: { card: { value: '0 1px 2px rgba(15,15,30,.04), 0 8px 24px -12px rgba(15,15,30,.12)' } },
};

export function TokensPage() {
  const [format, setFormat] = useState<Format>('css');
  const [copied, setCopied] = useState(false);

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Resources · tokens"
        title="Token export"
        description="One source of truth, four export formats. Copy straight into CSS, a token pipeline, a Tailwind theme, or Figma variables."
        meta={
          <>
            <Badge tone="brand" variant="soft">248 tokens</Badge>
            <Badge tone="neutral" variant="outline">light + dark</Badge>
            <Badge tone="neutral" variant="outline">W3C design-tokens shape</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<Figma className="h-4 w-4" />}>Open Figma</Button>
            <Button iconLeft={<Download className="h-4 w-4" />} onClick={() => copy(cssVars)}>
              {copied ? 'Copied' : 'Copy all'}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Color tokens', value: '96', icon: Palette },
          { label: 'Shape tokens', value: '14', icon: Terminal },
          { label: 'Type tokens', value: '10', icon: Terminal },
          { label: 'Theme modes', value: '2', icon: FileJson },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-line bg-surface p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">{item.label}</span>
                <Icon className="h-3.5 w-3.5 text-faint" />
              </div>
              <div className="mt-1 font-mono text-[19px] font-extrabold text-ink">{item.value}</div>
            </div>
          );
        })}
      </div>

      <Section
        index="01"
        title="Export"
        description="Pick a format, copy, ship"
        aside={
          <Segmented
            size="sm"
            value={format}
            onChange={setFormat}
            options={[
              { value: 'css', label: 'CSS' },
              { value: 'json', label: 'JSON' },
              { value: 'tailwind', label: 'Tailwind' },
              { value: 'figma', label: 'Figma' },
            ]}
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {format === 'css' && <CodeBlock title="tokens.css" language="css" code={cssVars} />}
            {format === 'json' && <JsonView className="max-h-[380px]" data={jsonTokens} />}
            {format === 'tailwind' && (
              <CodeBlock
                title="tailwind.theme.css"
                language="css"
                code={`@import 'tailwindcss';

@theme inline {
  --color-canvas: var(--ds-canvas);
  --color-surface: var(--ds-surface);
  --color-ink: var(--ds-ink);
  --color-muted: var(--ds-muted);
  --color-line: var(--ds-line);
  --color-brand: var(--ds-brand);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-xl: 16px;

  --font-sans: 'Geist', system-ui, sans-serif;
  --shadow-card: 0 1px 2px rgba(15,15,30,.04),
                 0 8px 24px -12px rgba(15,15,30,.12);
}`}
              />
            )}
            {format === 'figma' && (
              <CodeBlock
                title="figma-variables.json"
                language="json"
                code={`{
  "collections": [
    {
      "name": "Unseen DS",
      "modes": ["Light", "Dark"],
      "variables": [
        { "name": "brand/500", "type": "COLOR",
          "Light": "#0E91F0", "Dark": "#38AEFA" },
        { "name": "surface", "type": "COLOR",
          "Light": "#FFFFFF", "Dark": "#101019" },
        { "name": "radius/md", "type": "FLOAT", "value": 8 },
        { "name": "font/sans", "type": "STRING", "value": "Geist" }
      ]
    }
  ]
}`}
              />
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button size="xs" variant="secondary" iconLeft={copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} onClick={() => copy(format === 'css' ? cssVars : JSON.stringify(jsonTokens, null, 2))}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button size="xs" variant="ghost" iconLeft={<Download className="h-3 w-3" />}>Download file</Button>
              <span className="ml-auto font-mono text-[9.5px] text-faint">{format === 'json' || format === 'figma' ? 'JSON' : 'CSS'} · generated from src/design/tokens.ts</span>
            </div>
          </div>

          <div className="space-y-3">
            <SurfacePanel label="Naming rules">
              <ul className="space-y-1.5 text-[10px] leading-4 text-muted">
                <li>· <span className="font-mono text-ink-soft">--ds-[role]-[modifier]</span> — role first, never a raw value.</li>
                <li>· Palette steps use 50–900, identical across families.</li>
                <li>· Dark mode remaps roles, not names.</li>
                <li>· A component may only consume semantic tokens.</li>
              </ul>
            </SurfacePanel>
            <SurfacePanel label="Pipeline">
              <ol className="space-y-2">
                {[
                  ['tokens.ts', 'typed source of truth'],
                  ['index.css', 'CSS variables + @theme'],
                  ['Figma', 'variables via Tokens Studio'],
                  ['Product', 'utilities only'],
                ].map(([step, note], i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-soft font-mono text-[8px] font-bold text-brand">{i + 1}</span>
                    <span className="font-mono text-[10px] text-ink">{step}</span>
                    <span className="ml-auto text-[9px] text-faint">{note}</span>
                  </li>
                ))}
              </ol>
            </SurfacePanel>
            <SurfacePanel label="Version">
              <KeyValue
                columns={1}
                items={[
                  { label: 'Semver', value: '2.0.0', mono: true },
                  { label: 'Breaking changes', value: 'radius + type scale', mono: true },
                  { label: 'Last published', value: 'Oct 2026', mono: true },
                ]}
              />
            </SurfacePanel>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section index="02" title="Shape" description="Radius + spacing">
          <div className="space-y-2">
            {radii.map(radius => (
              <div key={radius.name} className="flex items-center gap-2">
                <span
                  className="h-6 w-6 shrink-0 border border-brand/25 bg-brand-soft"
                  style={{ borderRadius: radius.value }}
                />
                <span className="w-10 font-mono text-[10px] text-ink">{radius.name}</span>
                <span className="font-mono text-[9px] text-faint">{radius.value === 9999 ? '9999' : radius.value}px</span>
                <span className="ml-auto truncate text-[9px] text-faint">{radius.use}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Spacing</div>
            <div className="flex flex-wrap gap-1.5">
              {spacing.map(space => (
                <span key={space.name} className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[8.5px] text-muted" title={`${space.value}px`}>
                  {space.value}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Section index="03" title="Type" description="Geist · 400–800">
          <div className="space-y-1.5">
            {typeScale.map(token => (
              <div key={token.name} className="flex items-baseline justify-between gap-2 border-b border-line-soft pb-1 last:border-0">
                <span className="font-mono text-[9.5px] text-ink-soft">{token.name}</span>
                <span className="font-mono text-[9px] text-faint">
                  {token.size}/{token.weight} · {token.tracking}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-surface-2 p-2.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Family</div>
            <div className="mt-1 text-[15px] font-semibold tracking-tight text-ink">Geist</div>
            <div className="font-mono text-[10px] text-muted">Geist Mono</div>
          </div>
        </Section>

        <Section index="04" title="Elevation & motion" description="Depth + timing">
          <div className="space-y-2">
            {shadows.map(shadow => (
              <div key={shadow.name} className="flex items-center gap-2">
                <span className="h-6 w-10 shrink-0 rounded-sm border border-line bg-surface" style={{ boxShadow: shadow.value }} />
                <span className="font-mono text-[9.5px] text-ink-soft">{shadow.name}</span>
                <span className="ml-auto truncate text-[9px] text-faint">{shadow.use}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Motion</div>
            <div className="space-y-1">
              {motion.map(token => (
                <div key={token.name} className="flex items-baseline justify-between text-[9.5px]">
                  <span className="font-mono text-ink-soft">{token.name}</span>
                  <span className="font-mono text-faint">{token.duration}ms</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <GradientBadge>automation</GradientBadge>
          <span className="text-[10.5px] text-muted">Tokens publish on every merge to main — no manual Figma sync.</span>
        </div>
        <Button size="xs" variant="secondary" iconRight={<ArrowUpRight className="h-3 w-3" />}>View pipeline</Button>
      </div>
    </div>
  );
}
