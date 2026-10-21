import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const chartTones = {
  brand: 'var(--ds-brand)',
  pink: 'var(--ds-pink)',
  amber: 'var(--ds-amber)',
  violet: 'var(--ds-violet)',
  success: 'var(--ds-success)',
  muted: 'var(--ds-line-strong)',
} as const;

export type ChartTone = keyof typeof chartTones;

export function Legend({ items, className }: { items: { label: string; tone: ChartTone; value?: string }[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {items.map(item => (
        <li key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: chartTones[item.tone] }} />
          {item.label}
          {item.value && <span className="font-mono text-[9.5px] text-faint">{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- donut --------------------------------- */
export function Donut({
  segments,
  size = 148,
  thickness = 16,
  centerLabel,
  centerValue,
  gap = 2,
}: {
  segments: { label: string; value: number; tone: ChartTone }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  gap?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ds-surface-3)" strokeWidth={thickness} />
        {segments.map(segment => {
          const fraction = segment.value / total;
          const length = Math.max(fraction * circumference - gap, 0);
          const dash = `${length} ${circumference - length}`;
          const dashOffset = -offset;
          offset += fraction * circumference;
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={chartTones[segment.tone]}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
      <div className="absolute text-center">
        {centerValue && <div className="font-mono text-[17px] font-extrabold tracking-tight text-ink">{centerValue}</div>}
        {centerLabel && <div className="text-[9.5px] uppercase tracking-[0.1em] text-faint">{centerLabel}</div>}
      </div>
    </div>
  );
}

/* --------------------------------- funnel --------------------------------- */
export function Funnel({ steps, unit = '' }: { steps: { label: string; value: number; tone?: ChartTone }[]; unit?: string }) {
  const max = Math.max(...steps.map(s => s.value)) || 1;
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        const dropoff = i > 0 ? Math.round((1 - step.value / steps[i - 1].value) * 100) : null;
        return (
          <div key={step.label}>
            <div className="mb-1 flex items-baseline justify-between text-[10.5px]">
              <span className="font-medium text-ink-soft">{step.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ink">{step.value.toLocaleString()}{unit}</span>
                {dropoff !== null && <span className="font-mono text-[9px] text-danger">−{dropoff}%</span>}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-sm bg-surface-3">
              <div
                className="h-full rounded-sm transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: step.tone
                    ? chartTones[step.tone]
                    : `linear-gradient(90deg, ${chartTones.brand}, ${chartTones.pink})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- gauge ---------------------------------- */
export function Gauge({
  value,
  max = 100,
  label,
  sublabel,
  tone = 'brand',
  size = 132,
}: {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  tone?: ChartTone;
  size?: number;
}) {
  const pct = Math.min(value / max, 1);
  const radius = size / 2 - 12;
  const circumference = Math.PI * radius;
  const dash = pct * circumference;
  return (
    <div className="inline-flex flex-col items-center">
      <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`} aria-hidden>
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke="var(--ds-surface-3)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke={chartTones[tone]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="fill-[var(--ds-ink)] font-mono text-[17px] font-extrabold">
          {value}
          {max === 100 ? '%' : ''}
        </text>
      </svg>
      <div className="-mt-1 text-center">
        <div className="text-[10.5px] font-semibold text-ink-soft">{label}</div>
        {sublabel && <div className="text-[9px] text-faint">{sublabel}</div>}
      </div>
    </div>
  );
}

/* -------------------------------- heatmap --------------------------------- */
export function Heatmap({
  rows,
  columns,
  values,
  labels,
}: {
  rows: string[];
  columns: string[];
  values: number[][];
  labels?: boolean;
}) {
  const max = Math.max(...values.flat()) || 1;
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {values.map((row, r) => (
          <div key={rows[r]} className="flex items-center gap-1">
            <span className="w-8 shrink-0 text-right font-mono text-[9px] text-faint">{rows[r]}</span>
            {row.map((value, c) => {
              const intensity = value / max;
              return (
                <span
                  key={c}
                  title={`${rows[r]} · ${columns[c]}: ${value}`}
                  className="h-4 flex-1 rounded-sm transition hover:ring-2 hover:ring-brand/40"
                  style={{
                    background:
                      intensity < 0.04
                        ? 'var(--ds-surface-3)'
                        : `color-mix(in oklab, var(--ds-brand) ${Math.round(12 + intensity * 78)}%, var(--ds-surface-3))`,
                    minWidth: 14,
                  }}
                />
              );
            })}
          </div>
        ))}
        {labels && (
          <div className="mt-1 flex items-center gap-1">
            <span className="w-8 shrink-0" />
            {columns.map(c => (
              <span key={c} className="flex-1 text-center font-mono text-[8.5px] text-faint">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ stacked bars ------------------------------ */
export function StackedBar({
  segments,
  height = 10,
  className,
}: {
  segments: { label: string; value: number; tone: ChartTone }[];
  height?: number;
  className?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className={cn('flex w-full gap-0.5 overflow-hidden rounded-full bg-surface-3', className)} style={{ height }}>
      {segments.map(segment => (
        <span
          key={segment.label}
          title={`${segment.label}: ${segment.value}`}
          className="h-full transition-all"
          style={{ width: `${(segment.value / total) * 100}%`, background: chartTones[segment.tone] }}
        />
      ))}
    </div>
  );
}

/* -------------------------------- scatter --------------------------------- */
export function Scatter({
  points,
  height = 200,
  axisLabels = ['dim 1', 'dim 2'],
}: {
  points: { x: number; y: number; tone: ChartTone; label?: string }[];
  height?: number;
  axisLabels?: [string, string];
}) {
  return (
    <div className="relative rounded-lg border border-line bg-surface-2/50" style={{ height }}>
      <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-line" />
      {points.map((p, i) => (
        <span
          key={i}
          title={p.label}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface transition hover:scale-150"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: chartTones[p.tone] }}
        />
      ))}
      <span className="absolute bottom-1 right-2 font-mono text-[8.5px] text-faint">{axisLabels[1]}</span>
      <span className="absolute left-2 top-1 font-mono text-[8.5px] text-faint">{axisLabels[0]}</span>
    </div>
  );
}

/* ------------------------------- mini bars -------------------------------- */
export function MiniBars({ values, tone = 'brand', height = 32 }: { values: number[]; tone?: ChartTone; height?: number }) {
  const max = Math.max(...values) || 1;
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {values.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-sm"
          style={{ height: `${Math.max((v / max) * 100, 8)}%`, background: chartTones[tone], opacity: 0.35 + (v / max) * 0.65 }}
        />
      ))}
    </div>
  );
}

/* -------------------------------- tooltip hook ---------------------------- */
export function ChartCard({
  title,
  description,
  action,
  legend,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  legend?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-line bg-surface p-4 shadow-xs', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold text-ink">{title}</div>
          {description && <div className="text-[10.5px] text-muted">{description}</div>}
        </div>
        {action}
      </div>
      {legend && <div className="mt-2">{legend}</div>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { chartTones };
