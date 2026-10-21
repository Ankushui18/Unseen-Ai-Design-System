import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BookOpen,
  Check,
  Gauge,
  Layers,
  MessageSquare,
  Palette,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { AreaChart, Sparkline, TokenMeter } from '../components/ui/AI';
import { AvatarStack } from '../components/ui/Avatar';
import { PageHeader } from '../components/layout/Page';
import type { PageKey } from '../components/layout/nav';

const stats = [
  { value: '42', label: 'Components' },
  { value: '10', label: 'Sections' },
  { value: '9', label: 'Pages' },
  { value: 'AA', label: 'Contrast' },
];

const principles = [
  {
    icon: Layers,
    title: 'Token-first, never hard-coded',
    body: 'Every color, radius and shadow resolves to a semantic token. Change the brand once, and 42 components follow — in light and dark.',
  },
  {
    icon: Zap,
    title: 'Quiet density',
    body: 'Tight 4px rhythm and 13px workhorse type keep data-dense AI surfaces scannable without ever feeling cramped.',
  },
  {
    icon: Sparkles,
    title: 'Show the model’s work',
    body: 'Streaming, reasoning steps, sources and token cost are first-class components — not afterthoughts bolted on.',
  },
  {
    icon: ShieldCheck,
    title: 'Accessible by default',
    body: 'Visible focus rings, 4.5:1 body contrast, 44px touch targets on mobile, and motion that respects reduced-motion settings.',
  },
];

const inside: { key: PageKey; label: string; description: string; count: string; icon: typeof Blocks }[] = [
  { key: 'foundations', label: 'Foundations', description: 'Palette, type ramp, spacing, elevation, motion', count: '6 groups', icon: Palette },
  { key: 'components', label: 'Components', description: 'Primitives from buttons to data tables', count: '10 sections', icon: Blocks },
  { key: 'ai-patterns', label: 'AI patterns', description: 'Chat, prompts, models, streaming, agents', count: '9 patterns', icon: Sparkles },
  { key: 'dashboard', label: 'Dashboard', description: 'Usage, cost and model health analytics', count: 'Screen', icon: Gauge },
  { key: 'copilot', label: 'Copilot', description: 'Chat playground with live parameters', count: 'Screen', icon: MessageSquare },
  { key: 'templates', label: 'Templates', description: 'Sign in, onboarding and empty states', count: 'Screen', icon: Wand2 },
  { key: 'guidelines', label: 'Guidelines', description: 'Do / don’t, a11y, naming and changelog', count: 'Reference', icon: BookOpen },
];

const changelog = [
  { version: 'v2.0', tag: 'Latest', date: 'Oct 2026', items: ['Full dark theme across every screen', 'Semantic token layer + Tailwind v4 theme', 'Command palette, drawer and modal primitives'] },
  { version: 'v1.4', tag: '', date: 'Sep 2026', items: ['AI patterns: prompt builder and model selector', 'Data table with selection and pagination', 'Streaming and reasoning states'] },
  { version: 'v1.0', tag: '', date: 'Aug 2026', items: ['Initial foundations and 14-section component sheet'] },
];

export function Overview({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Unseen design system"
        title={
          <>
            Precision UI for <span className="ds-gradient-text">AI products</span>.
          </>
        }
        description="A complete, token-driven system that pairs AlignUI’s surgical component craft with Kigen’s vivid, color-forward energy — built for chat, agents and analytics."
        meta={
          <>
            <Badge tone="success" variant="soft">
              <StatusDot tone="success" pulse /> v2.0 stable
            </Badge>
            <Badge tone="neutral" variant="outline">
              Tailwind v4
            </Badge>
            <Badge tone="neutral" variant="outline">
              React + TypeScript
            </Badge>
            <GradientBadge>
              <Sparkles className="h-3 w-3" /> AI-native
            </GradientBadge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<Palette className="h-4 w-4" />} onClick={() => onNavigate('foundations')}>
              Foundations
            </Button>
            <Button iconRight={<ArrowRight className="h-4 w-4" />} onClick={() => onNavigate('components')}>
              Browse components
            </Button>
          </>
        }
      />

      {/* hero */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="absolute inset-0 ds-mesh opacity-[0.22]" />
        <div className="absolute inset-0 ds-grid-lines opacity-60" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:p-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Design once, ship everywhere
            </span>
            <h2 className="mt-4 text-[30px] font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[38px]">
              The system behind
              <br />
              intelligent interfaces.
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-6 text-muted">
              One shared language for design and engineering: 1 base token set, 6 color families, 10 component
              sections and the AI-native patterns your product actually needs.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button size="sm" iconLeft={<Sparkles className="h-3.5 w-3.5" />} onClick={() => onNavigate('ai-patterns')}>
                Explore AI patterns
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onNavigate('dashboard')}>
                See the dashboard
              </Button>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-4 gap-4 border-t border-line pt-5">
              {stats.map(stat => (
                <div key={stat.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">{stat.label}</dt>
                  <dd className="mt-0.5 text-xl font-extrabold tracking-tight text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* mini app preview */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-[linear-gradient(120deg,rgba(14,145,240,.18),rgba(247,38,133,.14),rgba(255,122,13,.16))] blur-xl" />
            <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface shadow-pop">
              <div className="flex items-center justify-between border-b border-line bg-surface-2 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger/60" />
                  <span className="h-2 w-2 rounded-full bg-amber/70" />
                  <span className="h-2 w-2 rounded-full bg-success/60" />
                  <span className="ml-2 font-mono text-[9px] text-faint">unseen.ai / overview</span>
                </div>
                <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-brand">
                  live
                </span>
              </div>
              <div className="grid grid-cols-[68px_1fr]">
                <div className="space-y-2 border-r border-line bg-surface-2/60 p-2">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-4 rounded ${i === 0 ? 'bg-brand/15 ring-1 ring-brand/20' : 'bg-surface-3'}`} />
                  ))}
                  <div className="mt-6 h-4 rounded bg-surface-3" />
                </div>
                <div className="space-y-2.5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-ink">Workspace overview</div>
                    <div className="rounded border border-line px-1.5 py-0.5 font-mono text-[8px] text-faint">Last 7d</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: 'Requests', v: '1.2M' },
                      { l: 'Tokens', v: '48.2M' },
                      { l: 'Spend', v: '$1.8k' },
                    ].map(s => (
                      <div key={s.l} className="rounded-md border border-line bg-surface p-2">
                        <div className="text-[8px] text-faint">{s.l}</div>
                        <div className="text-[12px] font-extrabold tracking-tight text-ink">{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-line bg-surface p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-semibold text-ink-soft">Token usage</span>
                      <span className="font-mono text-[8px] text-success">↗ 12.4%</span>
                    </div>
                    <AreaChart data={[18, 26, 22, 34, 30, 44, 39, 56, 48, 62, 58, 72]} height={58} showGrid={false} />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-line bg-surface-2 px-2 py-1.5">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[linear-gradient(140deg,#0E91F0,#F72685)]">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </span>
                    <span className="text-[8.5px] text-muted">Copilot summarised 3 model regressions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden w-[190px] rounded-xl border border-line bg-surface p-3 shadow-pop sm:block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-faint">Live</span>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-success">
                  <StatusDot tone="success" pulse /> gpt-4o
                </span>
              </div>
              <Sparkline data={[8, 12, 9, 16, 14, 21, 18, 26, 24, 31, 28, 36]} height={30} />
              <div className="mt-1 font-mono text-[8px] text-faint">latency 412ms · 62 tok/s</div>
            </div>

            <div className="absolute -right-2 -top-5 hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 shadow-pop sm:flex">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-success-soft text-success">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <span className="text-[9px] font-semibold text-ink-soft">Deployed to production</span>
            </div>
          </div>
        </div>
      </section>

      {/* principles */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-ink">Design principles</h2>
            <p className="mt-0.5 text-[12px] text-muted">The rules that keep 42 components feeling like one product.</p>
          </div>
          <Button variant="link" size="sm" onClick={() => onNavigate('guidelines')} iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}>
            Full guidelines
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} className="group p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] text-faint">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-[13px] font-semibold leading-5 text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-5 text-muted">{p.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* inside the system */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-ink">Inside the system</h2>
          <p className="mt-0.5 text-[12px] text-muted">Four documentation surfaces and four shipped product screens.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className="group flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-card"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-ink-soft transition group-hover:border-brand/30 group-hover:bg-brand-soft group-hover:text-brand">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">{item.label}</span>
                    <span className="rounded-full bg-surface-3 px-1.5 py-0.5 font-mono text-[9px] text-faint">{item.count}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted">{item.description}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition group-hover:text-brand" />
              </button>
            );
          })}
        </div>
      </section>

      {/* quality bar + changelog */}
      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[15px] font-bold text-ink">The quality bar</h2>
            <p className="mt-0.5 text-[12px] text-muted">Two references, one standard — we match the craft, not the pixels.</p>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-2">
            <div className="bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[#171925] text-[9px] font-black text-white">A</span>
                <span className="text-[12.5px] font-semibold text-ink">AlignUI · precision</span>
              </div>
              <ul className="mt-3 space-y-2 text-[11.5px] leading-5 text-muted">
                {['1px borders, exactly one shadow per surface', 'Token naming that reads like an API', 'Component states documented, not implied'].map(t => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-1 h-3 w-3 shrink-0 text-brand" strokeWidth={3} /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-[linear-gradient(135deg,#38AEFA,#F72685_55%,#FF7A0D)]" />
                <span className="text-[12.5px] font-semibold text-ink">Kigen · energy</span>
              </div>
              <ul className="mt-3 space-y-2 text-[11.5px] leading-5 text-muted">
                {['Vivid gradients used as accents, never wallpaper', 'Expressive display type, disciplined body type', 'Color-forward moments in otherwise calm layouts'].map(t => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-1 h-3 w-3 shrink-0 text-pink" strokeWidth={3} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-3">
            <div className="flex items-center gap-3">
              <AvatarStack
                size="xs"
                people={[
                  { id: 'a', initials: 'RK', tone: 'pink' },
                  { id: 'b', initials: 'MN', tone: 'blue' },
                  { id: 'c', initials: 'JL', tone: 'amber' },
                  { id: 'd', initials: 'SC', tone: 'violet' },
                  { id: 'e', initials: 'YT', tone: 'mint' },
                ]}
              />
              <span className="text-[11px] text-muted">Shared by design + engineering</span>
            </div>
            <TokenMeter used={48200} total={100000} label="Token budget" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">Changelog</h2>
            <Badge tone="brand" variant="soft">
              v2.0
            </Badge>
          </div>
          <ol className="mt-4 space-y-4">
            {changelog.map(entry => (
              <li key={entry.version} className="relative border-l border-line pl-4">
                <span className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-ink">{entry.version}</span>
                  {entry.tag && <Badge tone="pink" variant="soft">{entry.tag}</Badge>}
                  <span className="ml-auto font-mono text-[10px] text-faint">{entry.date}</span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {entry.items.map(item => (
                    <li key={item} className="text-[11px] leading-5 text-muted">
                      · {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <Button variant="secondary" size="sm" className="mt-5 w-full" onClick={() => onNavigate('guidelines')}>
            Read the release notes
          </Button>
        </Card>
      </section>

      {/* closing strip */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-[#0F0F1E] p-6 text-white sm:p-8">
        <div className="absolute inset-0 ds-mesh opacity-40" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">For design + code</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.025em]">Every token ships as CSS, Tailwind and Figma variables.</h2>
            <p className="mt-1 text-[12.5px] text-white/55">Copy the variable sheet, hand off to Figma, or import the React primitives.</p>
          </div>
          <Button
            variant="secondary"
            className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:bg-white/10 dark:text-white"
            iconRight={<ArrowUpRight className="h-4 w-4" />}
            onClick={() => onNavigate('guidelines')}
          >
            Handoff guide
          </Button>
        </div>
      </section>
    </div>
  );
}
