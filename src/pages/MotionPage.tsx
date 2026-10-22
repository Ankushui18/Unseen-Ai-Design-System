import { useState } from 'react';
import { Accessibility, ArrowDown, Check, MousePointerClick, Pause, Play, RotateCcw, Sparkles, Timer } from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd } from '../components/ui/Badge';
import { Segmented, Switch } from '../components/ui/Controls';
import { Progress, Skeleton } from '../components/ui/Feedback';
import { motion } from '../design/tokens';
import { cn } from '@/lib/utils';

/** Draws a cubic-bezier curve with its control handles. */
function BezierCurve({ value, active }: { value: string; active: boolean }) {
  const nums = value.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const [x1, y1, x2, y2] = nums.length === 4 ? nums : [0.4, 0, 0.2, 1];
  const size = 92;
  const pad = 8;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const px = (x: number) => pad + x * w;
  const py = (y: number) => pad + (1 - y) * h;
  const d = `M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${px(1)} ${py(1)}`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[92px] w-[92px]" aria-hidden>
      <rect x={pad} y={pad} width={w} height={h} rx="3" className="fill-none stroke-line" strokeDasharray="2 3" />
      <line x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} className="stroke-line-strong" strokeWidth="1" />
      <line x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} className="stroke-line-strong" strokeWidth="1" />
      <path d={d} fill="none" className={cn('transition-[stroke]', active ? 'stroke-brand' : 'stroke-brand/45')} strokeWidth="2" strokeLinecap="round" />
      <circle cx={px(x1)} cy={py(y1)} r="2.5" className="fill-surface stroke-brand" strokeWidth="1.5" />
      <circle cx={px(x2)} cy={py(y2)} r="2.5" className="fill-surface stroke-brand" strokeWidth="1.5" />
    </svg>
  );
}

export function MotionPage() {
  const [easing, setEasing] = useState('enter');
  const [duration, setDuration] = useState<'instant' | 'fast' | 'base' | 'slow'>('base');
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [key, setKey] = useState(0);
  const [hover, setHover] = useState(false);

  const ease = motion.find(m => m.name === easing) ?? motion[2];
  const ms = motion.find(m => m.name === duration)?.duration ?? 220;
  const curve = ease.easing;

  const restart = () => setKey(k => k + 1);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Foundations · motion"
        title="Motion with a job."
        description="Every animation either explains where something came from or confirms that something happened. Nothing loops for decoration, and all of it collapses to 0.01ms when the user asks for less movement."
        meta={
          <>
            <Badge tone="brand" variant="soft">5 durations</Badge>
            <Badge tone="neutral" variant="outline">4 curves</Badge>
            <Badge tone="neutral" variant="outline">reduced-motion safe</Badge>
          </>
        }
        actions={
          <Button variant="secondary" iconLeft={<RotateCcw className="h-4 w-4" />} onClick={restart}>
            Replay
          </Button>
        }
      />

      <Section
        index="01"
        title="Live playground"
        description="Change the curve and duration, then replay everything at once"
        aside={
          <div className="flex flex-wrap items-center gap-1.5">
            <Segmented
              size="sm"
              value={duration}
              onChange={setDuration}
              options={[
                { value: 'instant', label: '90' },
                { value: 'fast', label: '150' },
                { value: 'base', label: '220' },
                { value: 'slow', label: '360' },
              ]}
            />
            <Button size="xs" variant="secondary" onClick={restart} iconLeft={<Play className="h-3 w-3" />}>Run</Button>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {/* entrance */}
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ArrowDown className="h-3 w-3 text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Entrance · rise</span>
              </div>
              <div className="flex h-14 items-end gap-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={`${key}-${i}`}
                    className="flex-1 rounded-md bg-[linear-gradient(180deg,#38AEFA,#0272C6)]"
                    style={{
                      height: 44,
                      animation: playing && !reduced ? `ds-rise ${ms}ms ${curve} ${i * 60}ms both` : undefined,
                      opacity: i * 0.18 + 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="mt-1.5 font-mono text-[8.5px] text-faint">stagger 60ms · {ms}ms</p>
            </div>

            {/* transition */}
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <MousePointerClick className="h-3 w-3 text-pink" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Hover · lift</span>
              </div>
              <div className="grid h-14 place-items-center">
                <div
                  key={`h-${key}`}
                  className="w-32 rounded-lg border border-line bg-surface px-3 py-2 text-center text-[10px] font-semibold text-ink shadow-xs"
                  style={{
                    transform: hover && !reduced ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hover && !reduced ? 'var(--ds-shadow-card)' : 'var(--ds-shadow-xs)',
                    transition: reduced ? 'none' : `transform ${ms}ms ${curve}, box-shadow ${ms}ms ${curve}`,
                  }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  Hover me
                </div>
              </div>
              <p className="mt-1.5 font-mono text-[8.5px] text-faint">translateY −4px · shadow-xs → card</p>
            </div>

            {/* progress */}
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Timer className="h-3 w-3 text-amber" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Determinate</span>
              </div>
              <div className="grid h-14 place-items-center">
                <div className="w-full">
                  <Progress value={64} size="sm" />
                  <div className="mt-1.5 flex justify-between font-mono text-[8.5px] text-faint">
                    <span>uploading</span>
                    <span>64%</span>
                  </div>
                </div>
              </div>
              <p className="mt-1.5 font-mono text-[8.5px] text-faint">width transition · never fake progress</p>
            </div>

            {/* skeleton */}
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-violet" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Loading · shimmer</span>
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-3/4" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
              <p className="mt-2 font-mono text-[8.5px] text-faint">1.6s ease-in-out · matches final layout</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-lg border border-line bg-surface p-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Curve</div>
              <div className="flex items-start gap-2.5">
                <BezierCurve value={curve} active />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] font-semibold text-ink">{ease.name}</div>
                  <p className="text-[9.5px] leading-4 text-muted">{ease.use}</p>
                  <div className="mt-1 break-all font-mono text-[8px] text-faint">{curve}</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {motion.map(m => (
                  <button
                    key={m.name}
                    onClick={() => setEasing(m.name)}
                    className={cn(
                      'rounded-sm border px-1.5 py-1 font-mono text-[8.5px] transition',
                      easing === m.name ? 'border-brand/40 bg-brand-soft text-brand' : 'border-line bg-surface-2 text-muted hover:text-ink',
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <Switch checked={playing} onChange={setPlaying} label="Play animations" description="Turn off to inspect end states." size="sm" />
            <Switch checked={reduced} onChange={setReduced} label="Simulate reduced motion" description="Strips every transition in the playground." size="sm" />

            <div className="rounded-lg border border-line bg-surface-2 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
                <Accessibility className="h-3 w-3 text-brand" /> Real users get this automatically
              </div>
              <p className="mt-0.5 text-[9px] leading-4 text-muted">
                <span className="font-mono">prefers-reduced-motion</span> collapses duration and iteration in <span className="font-mono">index.css</span> — the switch above only previews it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Section index="02" title="Tokens" description="Name it, don’t inline it" flush>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left">
              <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                <tr>
                  <th className="px-3 py-2">Token</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Easing</th>
                  <th className="hidden px-3 py-2 sm:table-cell">Use for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {motion.map(token => (
                  <tr
                    key={token.name}
                    onClick={() => setEasing(token.name)}
                    className={cn('cursor-pointer text-[10.5px] transition hover:bg-surface-2', easing === token.name && 'bg-brand-soft/50')}
                  >
                    <td className="px-3 py-2 font-mono text-[9.5px] font-semibold text-ink-soft">{token.name}</td>
                    <td className="px-3 py-2 font-mono text-[9.5px] text-muted">{token.duration}ms</td>
                    <td className="px-3 py-2 font-mono text-[8.5px] text-faint">{token.easing === 'linear' ? 'linear' : 'cubic-bezier'}</td>
                    <td className="hidden px-3 py-2 text-muted sm:table-cell">{token.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section index="03" title="Rules" description="What motion may and may not do">
          <ul className="space-y-2">
            {[
              ['Motion explains, never decorates', 'If an animation doesn’t show origin, hierarchy, or confirmation, delete it.'],
              ['Under 400ms', 'Anything longer feels broken on repeat use. Only shimmer may run longer.'],
              ['Transform and opacity only', 'Animating width, height or top causes layout work on every frame.'],
              ['Interruptible', 'A second click must not wait for an easing curve to finish.'],
              ['Never the only signal', 'A pulse dot always comes with a label; a shake always comes with an error message.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" strokeWidth={3} />
                <span className="text-[10.5px] leading-4">
                  <strong className="font-semibold text-ink">{title}</strong>
                  <span className="text-muted"> — {body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section index="04" title="Entrance choreography" description="What happens when a page or panel appears">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: 'Page change', body: 'Content fades up 6px over 220ms. The shell never animates — it would make navigation feel slow.', demo: 'rise' },
            { title: 'Popover', body: 'Scales 0.98 → 1 with enter easing, 150ms. Origin is the trigger, not the centre.', demo: 'pop' },
            { title: 'Drawer', body: 'Slides from the edge over 360ms. Scrim fades in parallel; content does not resize.', demo: 'slide' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-line bg-surface p-3">
              <div className="mb-2 flex h-12 items-center justify-center overflow-hidden rounded-md bg-surface-2">
                <div
                  key={`${item.demo}-${key}`}
                  className={cn(
                    'rounded-md bg-brand-soft px-3 py-1.5 text-[9px] font-semibold text-brand',
                    !reduced && 'ds-rise',
                  )}
                  style={{ animationDuration: `${ms}ms` }}
                >
                  {item.title}
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink">{item.title}</div>
              <p className="mt-0.5 text-[10px] leading-4 text-muted">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2">
          <div className="flex items-center gap-2">
            <Pause className="h-3 w-3 text-muted" />
            <span className="text-[10px] text-muted">Playing</span>
            <Badge tone="brand" variant="soft">{ease.name} · {ms}ms</Badge>
            <span className="font-mono text-[8.5px] text-faint">{curve}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>J</Kbd>
            <span className="text-[9px] text-faint">theme · motion is theme-independent</span>
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <GradientBadge>motion</GradientBadge>
          <span className="text-[10.5px] text-muted">Tokens live in <span className="font-mono">--ds-duration-*</span> and <span className="font-mono">--ds-ease-*</span>; Figma gets them as number variables.</span>
        </div>
        <Button size="xs" variant="secondary" onClick={restart} iconLeft={<RotateCcw className="h-3 w-3" />}>Replay all</Button>
      </div>
    </div>
  );
}
