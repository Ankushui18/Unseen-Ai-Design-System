import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Layers, MoveHorizontal, Palette, Type } from 'lucide-react';
import { gradients, motion, radii, ramps, semanticColors, shadows, spacing, typeScale } from '../design/tokens';
import { PageHeader, Section } from '../components/layout/Page';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function Swatch({ step, hex, token, onCopy, copied }: { step: string; hex: string; token: string; onCopy: () => void; copied: string | null }) {
  const isCopied = copied === `${token}-${step}`;
  return (
    <button onClick={onCopy} className="group text-left" aria-label={`Copy ${token}-${step} ${step}`}>
      <div
        className="relative h-16 w-full overflow-hidden rounded-md border border-black/5 ring-1 ring-inset ring-black/[0.03] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-card dark:border-white/5"
        style={{ backgroundColor: hex }}
      >
        <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition group-hover:opacity-100">
          {isCopied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-3.5 w-3.5 text-white/90" />}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-[9.5px] font-semibold text-ink-soft">{step}</div>
      <div className="font-mono text-[9px] uppercase text-faint">{hex}</div>
    </button>
  );
}

export function Foundations() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Foundations · 6 groups"
        title="The visual language."
        description="A calm neutral base, three vivid accents and a typographic scale tuned for data-dense AI surfaces. Every value below is a semantic token — switch themes to see the mapping flip."
        meta={
          <>
            <Badge tone="brand" variant="soft">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Tokens live in index.css
            </Badge>
            <Badge tone="neutral" variant="outline">
              60 · 40 · 28 · 20 type ramp
            </Badge>
            <Badge tone="neutral" variant="outline">
              4px spacing grid
            </Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<Layers className="h-4 w-4" />}>Export tokens</Button>}
      />

      <Section
        id="color"
        index="01"
        title="Color"
        description="Click any swatch to copy its hex"
        aside={<span className="hidden font-mono text-[10px] text-faint sm:inline">4 ramps · 40 steps</span>}
      >
        <div className="space-y-7">
          {ramps.map(ramp => (
            <div key={ramp.token}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{ramp.label}</span>
                <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[9px] text-faint">{ramp.token}-*</span>
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[9px] text-faint">50 → 900</span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
                {ramp.steps.map(step => (
                  <Swatch
                    key={step.name}
                    step={step.name}
                    hex={step.hex}
                    token={ramp.token}
                    copied={copied}
                    onCopy={() => copy(`${ramp.token}-${step.name}`, step.hex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border-t border-line pt-6 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Semantic mapping</div>
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full text-left">
                <thead className="bg-surface-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">
                  <tr>
                    <th className="px-3 py-2">Token</th>
                    <th className="px-3 py-2">Light</th>
                    <th className="px-3 py-2">Dark</th>
                    <th className="hidden px-3 py-2 sm:table-cell">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {semanticColors.map(color => (
                    <tr key={color.name} className="text-[11px] transition hover:bg-surface-2">
                      <td className="px-3 py-2 font-mono text-[10px] font-semibold text-ink-soft">{color.name}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded border border-black/10 dark:border-white/10" style={{ background: color.light }} />
                          <span className="hidden font-mono text-[9.5px] text-muted sm:inline">{color.light}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded border border-black/10 dark:border-white/10" style={{ background: color.dark }} />
                          <span className="hidden font-mono text-[9.5px] text-muted sm:inline">{color.dark}</span>
                        </span>
                      </td>
                      <td className="hidden px-3 py-2 text-muted sm:table-cell">{color.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Gradients</div>
            <div className="space-y-2.5">
              {gradients.map(gradient => (
                <button
                  key={gradient.name}
                  onClick={() => copy(gradient.name, gradient.value)}
                  className="group flex w-full items-center gap-3 text-left"
                >
                  <span
                    className="h-10 flex-1 rounded-md border border-black/5 shadow-xs transition group-hover:shadow-card dark:border-white/10"
                    style={{ background: gradient.value }}
                  />
                  <span className="w-[112px] shrink-0 font-mono text-[9.5px] text-muted">{gradient.name}</span>
                  <span className="grid h-6 w-6 place-items-center rounded-md border border-line bg-surface text-faint opacity-0 transition group-hover:opacity-100">
                    {copied === gradient.name ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-line bg-surface-2 p-3.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-soft">
                <Palette className="h-3.5 w-3.5 text-brand" /> Usage rule
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted">
                Gradients belong to accents — one per surface. Never place body copy on a gradient; pair it with a solid
                token instead.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="type" index="02" title="Typography" description="Geist · 400–800 · tabular figures for data">
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="divide-y divide-line-soft">
            {typeScale.map(token => (
              <div key={token.name} className="grid grid-cols-[86px_1fr] items-baseline gap-4 py-3 sm:grid-cols-[86px_1fr_120px]">
                <div>
                  <div className="font-mono text-[10px] font-semibold text-ink-soft">{token.name}</div>
                  <div className="font-mono text-[9px] text-faint">{token.size}px</div>
                </div>
                <p
                  className="truncate text-ink"
                  style={{
                    fontSize: `clamp(${Math.min(token.size, 22)}px, ${Math.min(token.size / 9, 4)}vw, ${token.size}px)`,
                    fontWeight: token.weight,
                    lineHeight: token.lineHeight,
                    letterSpacing: token.tracking,
                  }}
                >
                  {token.sample}
                </p>
                <div className="hidden text-right sm:block">
                  <div className="font-mono text-[9.5px] text-muted">
                    {token.weight} / {token.lineHeight}
                  </div>
                  <div className="text-[9.5px] text-faint">{token.usage}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-[#0F0F1E] p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7DCBFC]">Typeface</span>
                <Type className="h-4 w-4 text-white/40" />
              </div>
              <div className="mt-3 text-[38px] font-extrabold leading-none tracking-[-0.04em]">Geist</div>
              <p className="mt-2 text-[11px] leading-5 text-white/50">
                Variable, screen-first, superbly tight at display sizes. Geist Mono covers code, keys and token values.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 font-mono text-[9px] text-white/60">
                <span>400 Regular</span>
                <span>600 Semibold</span>
                <span>800 Extrabold</span>
              </div>
            </div>
            <Card className="p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Rules</div>
              <ul className="mt-2 space-y-2 text-[11px] leading-5 text-muted">
                <li>· Display sizes track tighter as they grow (−0.045em at 60px).</li>
                <li>· Body copy never drops below 12px; default UI is 13px.</li>
                <li>· Numbers use <span className="font-mono text-[10px] text-ink-soft">tabular-nums</span> in tables and metrics.</li>
                <li>· One accent color per title; hierarchy comes from weight, not color.</li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section id="spacing" index="03" title="Spacing" description="4px base grid">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[440px] items-end gap-2.5">
              {spacing.map(space => (
                <div key={space.name} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-[3px] bg-[linear-gradient(180deg,#38AEFA,#0272C6)] opacity-90 transition hover:opacity-100"
                    style={{ height: `${Math.max(space.value * 0.72, 5)}px` }}
                    title={`${space.value}px`}
                  />
                  <span className="font-mono text-[8.5px] font-semibold text-ink-soft">{space.name}</span>
                  <span className="font-mono text-[8px] text-faint">{space.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2 text-[10.5px] text-muted">
            <MoveHorizontal className="h-3.5 w-3.5 text-brand" /> Layout gaps use 6 / 8 / 12 / 16 / 24 — never arbitrary values.
          </div>
        </Section>

        <Section id="radius" index="04" title="Radius" description="Softer surfaces, sharper controls">
          <div className="grid grid-cols-4 gap-3">
            {radii.map(radius => (
              <div key={radius.name} className="text-center">
                <div
                  className="mx-auto h-12 w-12 border border-brand/25 bg-[linear-gradient(135deg,#EAF6FF,#BAE0FD)] dark:border-brand/30 dark:bg-[linear-gradient(135deg,rgba(56,174,250,.28),rgba(2,114,198,.18))]"
                  style={{ borderRadius: radius.value }}
                />
                <div className="mt-1.5 font-mono text-[9.5px] font-semibold text-ink-soft">{radius.name}</div>
                <div className="font-mono text-[8.5px] text-faint">{radius.value}px</div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 rounded-md bg-surface-2 p-3">
            {radii.slice(0, 5).map(r => (
              <div key={r.name} className="flex items-center justify-between text-[10.5px]">
                <span className="font-mono text-ink-soft">{r.name}</span>
                <span className="text-faint">{r.use}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section id="elevation" index="05" title="Elevation" description="Depth communicates interactivity, not decoration">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {shadows.map(shadow => (
            <div
              key={shadow.name}
              className="flex min-h-[132px] flex-col justify-between rounded-xl border border-line bg-surface p-4"
              style={{ boxShadow: shadow.value }}
            >
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#38AEFA,#0272C6)]" />
              <div>
                <div className="font-mono text-[11px] font-semibold text-ink">{shadow.name}</div>
                <div className="mt-0.5 text-[10px] text-muted">{shadow.use}</div>
                <code className="mt-2 block break-words font-mono text-[8px] leading-3 text-faint">{shadow.value}</code>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-md bg-surface-2 px-3 py-2 text-[10.5px] text-muted">
          Rule: a surface gets one shadow. Cards use <span className="font-mono text-ink-soft">shadow-card</span>;
          floating layers use <span className="font-mono text-ink-soft">shadow-float</span> and never stack.
        </p>
      </Section>

      <Section id="motion" index="06" title="Motion" description="Fast, purposeful, interruptible">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-left">
              <thead className="bg-surface-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">
                <tr>
                  <th className="px-3 py-2">Token</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Easing</th>
                  <th className="hidden px-3 py-2 sm:table-cell">Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {motion.map(token => (
                  <tr key={token.name} className="text-[11px] transition hover:bg-surface-2">
                    <td className="px-3 py-2.5 font-mono text-[10px] font-semibold text-ink-soft">{token.name}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted">{token.duration}ms</td>
                    <td className="px-3 py-2.5 font-mono text-[9px] text-faint">{token.easing}</td>
                    <td className="hidden px-3 py-2.5 text-muted sm:table-cell">{token.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Hover to preview</div>
            <div className="space-y-2.5">
              {[
                { label: 'Lift', cls: 'hover:-translate-y-1 hover:shadow-card' },
                { label: 'Tint', cls: 'hover:bg-brand-soft hover:border-brand/30' },
                { label: 'Scale', cls: 'hover:scale-[1.02]' },
                { label: 'Slide', cls: 'hover:translate-x-2' },
              ].map(item => (
                <div
                  key={item.label}
                  className={`flex cursor-pointer items-center justify-between rounded-md border border-line bg-surface px-3 py-2.5 transition duration-200 ${item.cls}`}
                >
                  <span className="text-[11.5px] font-medium text-ink-soft">{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-faint" />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-faint">
              All transitions collapse to 0.01ms under <span className="font-mono">prefers-reduced-motion</span>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
