import { useState, type ReactNode } from 'react';
import { Check, Copy, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

/* -------------------------------- charts -------------------------------- */
export function Sparkline({
  data,
  tone = 'brand',
  className,
  height = 40,
}: {
  data: number[];
  tone?: 'brand' | 'pink' | 'amber' | 'success';
  className?: string;
  height?: number;
}) {
  const color = { brand: 'var(--ds-brand)', pink: 'var(--ds-pink)', amber: 'var(--ds-amber)', success: 'var(--ds-success)' }[tone];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - 6 - ((d - min) / span) * (height - 12);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className={cn('h-10 w-full', className)} aria-hidden>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function AreaChart({
  data,
  labels,
  tone = 'brand',
  height = 168,
  showGrid = true,
}: {
  data: number[];
  labels?: string[];
  tone?: 'brand' | 'pink';
  height?: number;
  showGrid?: boolean;
}) {
  const color = { brand: 'var(--ds-brand)', pink: 'var(--ds-pink)' }[tone];
  const id = `area-${tone}`;
  const max = Math.max(...data) * 1.12;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d / max) * 100;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <div className="w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showGrid &&
          [18, 40, 62, 84].map(y => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--ds-line)" strokeWidth="0.5" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          ))}
        <polygon points={`0,100 ${line} 100,100`} fill={`url(#${id})`} />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map(([x, y], i) =>
          i === pts.length - 1 ? (
            <circle key={i} cx={x} cy={y} r="3" fill="var(--ds-surface)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          ) : null,
        )}
      </svg>
      {labels && (
        <div className="mt-2 flex justify-between font-mono text-[10px] text-faint">
          {labels.map(l => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function BarChart({
  data,
  labels,
  highlight = 3,
}: {
  data: number[];
  labels?: string[];
  highlight?: number;
}) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex h-32 items-end gap-2">
        {data.map((d, i) => (
          <div key={i} className="group flex h-full flex-1 flex-col justify-end">
            <div
              className={cn(
                'w-full rounded-md transition-all duration-200 group-hover:opacity-80',
                i === highlight
                  ? 'bg-[linear-gradient(180deg,#38AEFA,#0272C6)]'
                  : 'bg-surface-3 dark:bg-line',
              )}
              style={{ height: `${Math.max((d / max) * 100, 6)}%` }}
              title={`${d}`}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex gap-2 font-mono text-[10px] text-faint">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- chat parts ------------------------------ */
export function TypingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} aria-label="Assistant is typing">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-brand ds-pulse"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

export function ChatMessage({
  role,
  children,
  time,
  name,
  streaming = false,
  actions,
}: {
  role: 'user' | 'assistant' | 'system';
  children: ReactNode;
  time?: string;
  name?: string;
  streaming?: boolean;
  actions?: ReactNode;
}) {
  if (role === 'system') {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
          {children}
        </span>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {isUser ? (
        <Avatar initials="RK" tone="ink" size="sm" className="mt-0.5" />
      ) : (
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white shadow-[0_4px_12px_-4px_rgba(247,38,133,.7)]">
          <Sparkles className="h-4 w-4" />
        </span>
      )}
      <div className={cn('min-w-0 max-w-[86%]', isUser && 'flex flex-col items-end')}>
        <div className="mb-1 flex items-center gap-2 text-[11px] text-faint">
          <span className="font-semibold text-ink-soft">{name ?? (isUser ? 'You' : 'Unseen')}</span>
          {time && <span className="font-mono">{time}</span>}
        </div>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-[13px] leading-6',
            isUser
              ? 'rounded-br-md bg-brand-soft text-ink'
              : 'rounded-bl-md border border-line bg-surface text-ink-soft shadow-xs',
          )}
        >
          <span className={streaming ? 'ds-caret' : undefined}>{children}</span>
        </div>
        {actions && <div className={cn('mt-1.5 flex items-center gap-1', isUser && 'justify-end')}>{actions}</div>}
      </div>
    </div>
  );
}

export function MessageAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="grid h-6 w-6 place-items-center rounded-md text-faint transition hover:bg-surface-3 hover:text-ink"
    >
      {icon}
    </button>
  );
}

/* ------------------------------- code block ------------------------------ */
export function CodeBlock({
  code,
  language = 'bash',
  title,
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#0C0C15] shadow-card">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
          </span>
          <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{title ?? language}</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code).catch(() => undefined);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-6 text-[#C7D2E5]">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-4">
              {showLineNumbers && <span className="w-4 select-none text-right text-white/25">{i + 1}</span>}
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ----------------------------- prompt / agents --------------------------- */
export function PromptVariable({ name, value }: { name: string; value?: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-brand/30 bg-brand-soft px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-brand-strong dark:text-brand">
      {`{${name}}`}
      {value && <span className="ml-1.5 border-l border-brand/30 pl-1.5 font-sans font-normal text-muted">{value}</span>}
    </span>
  );
}

export function SourceChip({ index, label, host }: { index: number; label: string; host: string }) {
  return (
    <a
      href="#ai-patterns"
      className="group flex min-w-0 items-center gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-1.5 transition hover:border-brand/40 hover:bg-brand-soft"
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded bg-surface text-[9px] font-bold text-muted group-hover:text-brand">
        {index}
      </span>
      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink-soft">{label}</span>
      <span className="shrink-0 font-mono text-[10px] text-faint">{host}</span>
    </a>
  );
}

export function AgentStep({
  index,
  title,
  detail,
  state = 'done',
  children,
}: {
  index: number;
  title: string;
  detail?: string;
  state?: 'done' | 'active' | 'pending';
  children?: ReactNode;
}) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      <span className="absolute bottom-0 left-[11px] top-6 w-px bg-line last:hidden" />
      <span
        className={cn(
          'z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold',
          state === 'done' && 'border-success/30 bg-success-soft text-success',
          state === 'active' && 'border-brand/40 bg-brand-soft text-brand',
          state === 'pending' && 'border-line bg-surface-2 text-faint',
        )}
      >
        {state === 'done' ? <Check className="h-3 w-3" strokeWidth={3} /> : index}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('text-[12.5px] font-semibold', state === 'pending' ? 'text-faint' : 'text-ink')}>
            {title}
          </span>
          {state === 'active' && <Badge tone="brand">running</Badge>}
        </div>
        {detail && <p className="mt-0.5 text-[11px] leading-5 text-muted">{detail}</p>}
        {children}
      </div>
    </li>
  );
}

export function TokenMeter({
  used,
  total,
  label = 'Tokens',
  tone = 'brand',
}: {
  used: number;
  total: number;
  label?: string;
  tone?: 'brand' | 'pink' | 'amber';
}) {
  const pct = Math.min((used / total) * 100, 100);
  const bar = {
    brand: 'bg-[linear-gradient(90deg,#38AEFA,#0272C6)]',
    pink: 'bg-[linear-gradient(90deg,#FF56A0,#F72685)]',
    amber: 'bg-[linear-gradient(90deg,#FFC06D,#FF7A0D)]',
  }[tone];
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="font-semibold text-ink-soft">{label}</span>
        <span className="font-mono text-muted">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className={cn('h-full rounded-full', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ModelCard({
  name,
  provider,
  description,
  context,
  price,
  badge,
  selected = false,
  onSelect,
}: {
  name: string;
  provider: string;
  description: string;
  context: string;
  price: string;
  badge?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group w-full rounded-xl border p-3.5 text-left transition',
        selected
          ? 'border-brand/50 bg-brand-soft shadow-[0_0_0_3px_var(--ds-brand-ring)]'
          : 'border-line bg-surface hover:border-brand/35 hover:bg-surface-2',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-md text-[11px] font-black',
              selected ? 'bg-brand text-white' : 'bg-surface-3 text-muted',
            )}
          >
            {provider.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
              {name}
              {badge}
            </div>
            <div className="text-[10.5px] text-muted">{provider}</div>
          </div>
        </div>
        {selected && <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} />}
      </div>
      <p className="mt-2 text-[11.5px] leading-5 text-muted">{description}</p>
      <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2 font-mono text-[10px] text-faint">
        <span>{context} context</span>
        <span>{price}</span>
      </div>
    </button>
  );
}

export function StreamingResponse() {
  return (
    <div className="space-y-2">
      <p className="text-[13px] leading-6 text-ink-soft ds-caret">
        Based on your workspace telemetry, latency rose 14% after the router change —
      </p>
      <div className="flex items-center gap-2 text-[11px] text-faint">
        <TypingDots />
        <span className="font-mono">streaming · 42 tok/s</span>
      </div>
    </div>
  );
}

export function AvatarPrompt({ initials = 'RK' }: { initials?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-2 py-1">
      <Avatar initials={initials} size="xs" tone="pink" />
      <span className="text-[11px] font-medium text-muted">Rania K.</span>
      <User className="h-3 w-3 text-faint" />
    </span>
  );
}
