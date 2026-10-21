import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Mic,
  Play,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeTone } from './Badge';
import { Button, IconButton } from './Button';

/* -------------------------------- voice ---------------------------------- */
export function VoiceWave({
  active = false,
  bars = 28,
  label = 'Listening…',
  duration = '00:12',
}: {
  active?: boolean;
  bars?: number;
  label?: string;
  duration?: string;
}) {
  const heights = Array.from({ length: bars }, (_, i) => 18 + Math.abs(Math.sin(i * 0.6)) * 62);
  return (
    <div className="rounded-xl border border-line bg-surface p-3.5">
      <div className="flex items-center gap-2">
        <span className={cn('relative grid h-7 w-7 place-items-center rounded-full', active ? 'bg-pink text-white' : 'bg-surface-3 text-muted')}>
          <Mic className="h-3.5 w-3.5" />
          {active && <span className="absolute inset-0 rounded-full bg-pink/40 ds-pulse" />}
        </span>
        <span className="text-[11px] font-semibold text-ink">{active ? label : 'Push to talk'}</span>
        <span className="ml-auto font-mono text-[10px] text-faint">{duration}</span>
      </div>
      <div className="mt-3 flex h-12 items-center gap-[2px]">
        {heights.map((h, i) => (
          <span
            key={i}
            className={cn('flex-1 rounded-full', active ? 'bg-brand' : 'bg-line-strong')}
            style={{
              height: `${active ? h : 22}%`,
              opacity: active ? 0.4 + (h / 100) * 0.6 : 0.5,
              animation: active ? `ds-pulse ${1 + (i % 5) * 0.16}s ease-in-out infinite` : undefined,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-line pt-2">
        {active ? (
          <>
            <Button size="xs">Stop &amp; transcribe</Button>
            <Button size="xs" variant="ghost">Cancel</Button>
          </>
        ) : (
          <>
            <Button size="xs" variant="secondary" iconLeft={<Mic className="h-3 w-3" />}>Record</Button>
            <span className="text-[9.5px] text-faint">Whisper v3 · 8 languages</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- image generation -------------------------- */
export function ImageGenCard({
  prompt,
  style = 'editorial',
  seed = '4821',
  progress,
}: {
  prompt: string;
  style?: string;
  seed?: string;
  progress?: number;
}) {
  const generating = typeof progress === 'number';
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 90% at 20% 15%, #FF9A33 0%, transparent 55%), radial-gradient(80% 80% at 85% 25%, #F72685 0%, transparent 60%), radial-gradient(90% 90% at 45% 95%, #0E91F0 0%, transparent 65%), linear-gradient(160deg,#1B1B33,#0F0F1E)',
            filter: generating ? 'saturate(.5) blur(8px)' : 'saturate(1)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(0,0,0,.45))]" />
        {generating ? (
          <div className="absolute inset-x-4 bottom-3">
            <div className="mb-1 flex justify-between font-mono text-[9px] text-white/70">
              <span>generating · {style}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5">
            <Badge tone="neutral" variant="solid" className="bg-black/40 backdrop-blur">seed {seed}</Badge>
            <Badge tone="neutral" variant="solid" className="bg-black/40 backdrop-blur">{style}</Badge>
            <div className="ml-auto flex gap-1">
              <IconButton label="Regenerate" size="xs" className="border-transparent bg-black/40 text-white backdrop-blur hover:bg-black/60">
                <RefreshCw className="h-3 w-3" />
              </IconButton>
              <IconButton label="Open full size" size="xs" className="border-transparent bg-black/40 text-white backdrop-blur hover:bg-black/60">
                <ArrowUpRight className="h-3 w-3" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 text-[10.5px] leading-4 text-muted">{prompt}</p>
      </div>
    </div>
  );
}

/* ------------------------------ citations -------------------------------- */
export function CitationList({
  items,
}: {
  items: { index: number; title: string; source: string; snippet?: string; score?: number }[];
}) {
  return (
    <ol className="space-y-2">
      {items.map(item => (
        <li key={item.index} className="group rounded-lg border border-line bg-surface-2/60 p-2.5 transition hover:border-brand/35 hover:bg-brand-soft/40">
          <div className="flex items-start gap-2">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded bg-surface font-mono text-[9px] font-bold text-muted group-hover:text-brand">
              {item.index}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-[11px] font-semibold text-ink">{item.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[9px] text-faint">{item.source}</span>
              </div>
              {item.snippet && <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-muted">“{item.snippet}”</p>}
              {typeof item.score === 'number' && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1 w-12 overflow-hidden rounded-full bg-surface-3">
                    <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.round(item.score * 100)}%` }} />
                  </span>
                  <span className="font-mono text-[8.5px] text-faint">relevance {item.score.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------- model comparison --------------------------- */
export function ModelCompareTable({
  criteria,
  models,
}: {
  criteria: { label: string; values: (string | number)[] }[];
  models: { name: string; provider: string; best?: boolean }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">Criteria</th>
            {models.map(model => (
              <th key={model.name} className="px-2 py-2">
                <div className={cn('rounded-md px-2 py-1', model.best && 'bg-brand-soft')}>
                  <div className="text-[10.5px] font-semibold text-ink">{model.name}</div>
                  <div className="font-mono text-[8.5px] text-faint">{model.provider}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {criteria.map(row => (
            <tr key={row.label} className="transition hover:bg-surface-2">
              <td className="px-2 py-2 text-[10.5px] text-muted">{row.label}</td>
              {row.values.map((value, i) => (
                <td key={i} className="px-2 py-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 font-mono text-[10.5px]',
                      models[i]?.best ? 'font-bold text-brand' : 'text-ink-soft',
                    )}
                  >
                    {models[i]?.best && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    {value}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------- rubric --------------------------------- */
export function EvalRubric({
  criteria,
}: {
  criteria: { name: string; score: number; max: number; weight: string; note?: string }[];
}) {
  const total = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.max, 0);
  const pct = Math.round((total / maxTotal) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-3 py-2">
        <span className="text-[10.5px] font-semibold text-ink-soft">Weighted score</span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-extrabold text-ink">{pct}%</span>
          <Badge tone={pct > 80 ? 'success' : pct > 60 ? 'warning' : 'danger'} variant="soft">
            {pct > 80 ? 'pass' : pct > 60 ? 'review' : 'fail'}
          </Badge>
        </span>
      </div>
      <ul className="space-y-2.5">
        {criteria.map(criterion => {
          const ratio = criterion.score / criterion.max;
          return (
            <li key={criterion.name}>
              <div className="flex items-baseline justify-between gap-2 text-[10.5px]">
                <span className="font-medium text-ink-soft">{criterion.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-faint">w {criterion.weight}</span>
                  <span className="font-mono text-[10px] font-semibold text-ink">
                    {criterion.score}/{criterion.max}
                  </span>
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={cn('h-full rounded-full', ratio > 0.8 ? 'bg-success' : ratio > 0.5 ? 'bg-brand' : 'bg-danger')}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              {criterion.note && <p className="mt-0.5 text-[9.5px] leading-4 text-faint">{criterion.note}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------- guardrail ------------------------------- */
export function GuardrailBanner({
  title = 'Response blocked by guardrail',
  description = 'The request contained instructions that attempt to bypass system policy (prompt injection). No model tokens were billed.',
  rule = 'prompt_injection · severity high',
  tone = 'danger',
  action,
}: {
  title?: string;
  description?: string;
  rule?: string;
  tone?: 'danger' | 'warning' | 'success';
  action?: ReactNode;
}) {
  const styles = {
    danger: { wrap: 'border-danger/30 bg-danger-soft', icon: 'text-danger', Icon: ShieldAlert },
    warning: { wrap: 'border-warning/30 bg-warning-soft', icon: 'text-warning', Icon: ShieldAlert },
    success: { wrap: 'border-success/30 bg-success-soft', icon: 'text-success', Icon: ShieldCheck },
  }[tone];
  const Icon = styles.Icon;
  return (
    <div className={cn('rounded-lg border p-3', styles.wrap)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', styles.icon)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11.5px] font-semibold text-ink">{title}</span>
            <span className="font-mono text-[9px] text-muted">{rule}</span>
          </div>
          <p className="mt-1 text-[10.5px] leading-5 text-muted">{description}</p>
          {action && <div className="mt-2 flex gap-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ token counter ---------------------------- */
export function TokenCounter({
  tokens,
  limit,
  breakdown,
}: {
  tokens: number;
  limit: number;
  breakdown?: { label: string; value: number; tone: BadgeTone }[];
}) {
  const pct = Math.round((tokens / limit) * 100);
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Tokens</span>
        <span className="font-mono text-[10.5px] text-ink">
          {tokens.toLocaleString()}<span className="text-faint"> / {limit.toLocaleString()}</span>
        </span>
      </div>
      <div className="mt-1.5 flex h-1.5 gap-px overflow-hidden rounded-full bg-surface-3">
        {(breakdown ?? [{ label: 'used', value: pct, tone: 'brand' }]).map(item => (
          <span
            key={item.label}
            title={`${item.label}: ${item.value}%`}
            className={cn(
              'h-full',
              item.tone === 'pink' ? 'bg-pink' : item.tone === 'amber' ? 'bg-amber' : 'bg-brand',
            )}
            style={{ width: `${item.value}%` }}
          />
        ))}
      </div>
      {breakdown && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
          {breakdown.map(item => (
            <span key={item.label} className="font-mono text-[8.5px] text-faint">
              {item.label} {item.value}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ tool call card --------------------------- */
export function ToolCallCard({
  name,
  args,
  result,
  status = 'success',
  duration = '84ms',
}: {
  name: string;
  args: string;
  result?: string;
  status?: 'pending' | 'success' | 'error';
  duration?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-2.5 py-1.5">
        <Wrench className="h-3 w-3 text-violet" />
        <span className="font-mono text-[10px] font-semibold text-ink-soft">{name}</span>
        <span
          className={cn(
            'ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[8.5px]',
            status === 'success' ? 'bg-success-soft text-success' : status === 'error' ? 'bg-danger-soft text-danger' : 'bg-surface-3 text-muted',
          )}
        >
          {status === 'success' ? <Check className="h-2.5 w-2.5" /> : status === 'error' ? <X className="h-2.5 w-2.5" /> : null}
          {status === 'success' ? `200 · ${duration}` : status}
        </span>
      </div>
      <div className="p-2.5">
        <div className="font-mono text-[9.5px] leading-4 text-muted">{args}</div>
        {result && (
          <div className="mt-1.5 rounded border border-line-soft bg-surface-2 p-1.5 font-mono text-[9px] leading-4 text-ink-soft">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- confidence meter --------------------------- */
export function ConfidenceMeter({ value, label = 'confidence' }: { value: number; label?: string }) {
  const segments = 10;
  const filled = Math.round(value * segments);
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex gap-[2px]">
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-2.5 w-1 rounded-sm',
              i < filled ? (value > 0.75 ? 'bg-success' : value > 0.45 ? 'bg-amber' : 'bg-danger') : 'bg-surface-3',
            )}
          />
        ))}
      </div>
      <span className="font-mono text-[9.5px] text-muted">
        {Math.round(value * 100)}% {label}
      </span>
    </div>
  );
}

/* ------------------------------ prompt card ------------------------------ */
export function PromptCard({
  title,
  description,
  model,
  uses,
  tags,
  onUse,
}: {
  title: string;
  description: string;
  model: string;
  uses: string;
  tags?: string[];
  onUse?: () => void;
}) {
  return (
    <div className="group flex flex-col rounded-xl border border-line bg-surface p-3.5 transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-card">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[9px] text-faint">{uses} runs</span>
      </div>
      <h4 className="mt-2.5 text-[12px] font-semibold text-ink">{title}</h4>
      <p className="mt-1 flex-1 text-[10.5px] leading-4 text-muted">{description}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-1">
        <Badge tone="neutral" variant="outline">{model}</Badge>
        {tags?.map(tag => (
          <span key={tag} className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-[8.5px] text-faint">#{tag}</span>
        ))}
      </div>
      <Button size="xs" variant="secondary" className="mt-2.5 w-full" onClick={onUse} iconRight={<Play className="h-3 w-3" />}>
        Run prompt
      </Button>
    </div>
  );
}

/* -------------------------------- run trace ------------------------------ */
export function RunTrace({
  steps,
}: {
  steps: { id: string; label: string; kind: 'llm' | 'tool' | 'guard' | 'human'; duration: string; tokens?: string; status?: 'ok' | 'warn' | 'error' }[];
}) {
  const kindTone = {
    llm: { cls: 'bg-brand-soft text-brand border-brand/20', Icon: Sparkles, label: 'llm' },
    tool: { cls: 'bg-violet-soft text-violet border-violet/20', Icon: Wrench, label: 'tool' },
    guard: { cls: 'bg-amber-soft text-amber border-amber/25', Icon: ShieldAlert, label: 'guard' },
    human: { cls: 'bg-success-soft text-success border-success/20', Icon: Bot, label: 'human' },
  };
  return (
    <div className="space-y-1.5">
      {steps.map((step, i) => {
        const tone = kindTone[step.kind];
        return (
          <div key={step.id} className="flex items-center gap-2">
            <span className={cn('inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[8.5px]', tone.cls)}>
              <tone.Icon className="h-2.5 w-2.5" />
              {tone.label}
            </span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] text-ink-soft">{step.label}</span>
            {step.tokens && <span className="font-mono text-[8.5px] text-faint">{step.tokens} tok</span>}
            <span
              className={cn(
                'w-12 shrink-0 text-right font-mono text-[9px]',
                step.status === 'error' ? 'text-danger' : step.status === 'warn' ? 'text-warning' : 'text-muted',
              )}
            >
              {step.duration}
            </span>
            {i < steps.length - 1 && <span className="w-0" />}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- copy action row --------------------------- */
export function MessageActions({ onCopy }: { onCopy?: () => void }) {
  return (
    <div className="flex items-center gap-0.5">
      <IconButton label="Copy" size="xs" variant="ghost" onClick={onCopy}>
        <Copy className="h-3 w-3" />
      </IconButton>
      <IconButton label="Regenerate" size="xs" variant="ghost">
        <RefreshCw className="h-3 w-3" />
      </IconButton>
    </div>
  );
}
