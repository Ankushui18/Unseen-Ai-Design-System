import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedbackTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const toneStyles: Record<FeedbackTone, { wrap: string; icon: string; Icon: typeof Info }> = {
  brand: { wrap: 'border-brand/25 bg-brand-soft text-brand-strong dark:text-brand', icon: 'text-brand', Icon: Info },
  success: { wrap: 'border-success/25 bg-success-soft text-success', icon: 'text-success', Icon: CheckCircle2 },
  warning: { wrap: 'border-warning/30 bg-warning-soft text-warning', icon: 'text-warning', Icon: TriangleAlert },
  danger: { wrap: 'border-danger/25 bg-danger-soft text-danger', icon: 'text-danger', Icon: AlertCircle },
  neutral: { wrap: 'border-line bg-surface-2 text-ink-soft', icon: 'text-muted', Icon: Info },
};

export function Alert({
  tone = 'brand',
  title,
  children,
  action,
  onDismiss,
  className,
}: {
  tone?: FeedbackTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const t = toneStyles[tone];
  const Icon = t.Icon;
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border p-3.5', t.wrap, className)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', t.icon)} />
      <div className="min-w-0 flex-1">
        {title && <p className="text-[13px] font-semibold">{title}</p>}
        {children && <div className="text-[12px] leading-5 opacity-90">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export type ToastTone = 'success' | 'danger' | 'warning' | 'brand';
const toastTones: Record<ToastTone, { icon: typeof Info; color: string; bar: string; label: string }> = {
  success: { icon: CheckCircle2, color: 'text-success', bar: 'bg-success', label: 'Success' },
  danger: { icon: AlertCircle, color: 'text-danger', bar: 'bg-danger', label: 'Error' },
  warning: { icon: TriangleAlert, color: 'text-warning', bar: 'bg-warning', label: 'Warning' },
  brand: { icon: Info, color: 'text-brand', bar: 'bg-brand', label: 'Info' },
};

export function Toast({
  tone = 'success',
  title,
  description,
  action,
}: {
  tone?: ToastTone;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const t = toastTones[tone];
  const Icon = t.icon;
  return (
    <div className="relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-line bg-surface p-3.5 shadow-pop">
      <span className={cn('absolute inset-y-0 left-0 w-[3px]', t.bar)} />
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', t.color)} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        {description && <p className="mt-0.5 text-[12px] leading-5 text-muted">{description}</p>}
      </div>
      {action}
      <button aria-label="Dismiss notification" className="text-faint transition hover:text-ink">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Progress({
  value,
  tone = 'brand',
  size = 'md',
  label,
  showValue = false,
}: {
  value: number;
  tone?: 'brand' | 'success' | 'danger' | 'pink';
  size?: 'sm' | 'md';
  label?: ReactNode;
  showValue?: boolean;
}) {
  const fill = {
    brand: 'bg-[linear-gradient(90deg,#38AEFA,#0272C6)]',
    success: 'bg-success',
    danger: 'bg-danger',
    pink: 'bg-[linear-gradient(90deg,#FF56A0,#F72685)]',
  }[tone];
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          {label && <span className="font-medium text-muted">{label}</span>}
          {showValue && <span className="font-mono text-[11px] font-semibold text-ink-soft">{value}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-surface-3', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', fill)}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 108,
  stroke = 9,
  tone = 'brand',
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: 'brand' | 'pink' | 'success';
  label?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const strokeColor = { brand: 'var(--ds-brand)', pink: 'var(--ds-pink)', success: 'var(--ds-success)' }[tone];
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ds-surface-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-extrabold tracking-tight text-ink">{value}%</div>
        {label && <div className="text-[10px] font-medium text-muted">{label}</div>}
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('ds-shimmer rounded-md', className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'brand',
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'brand' | 'amber' | 'neutral';
}) {
  const bg = {
    brand: 'bg-brand-soft text-brand',
    amber: 'bg-amber-soft text-amber',
    neutral: 'bg-surface-3 text-muted',
  }[tone];
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface-2/60 px-6 py-10 text-center">
      <div className={cn('mb-4 grid h-12 w-12 place-items-center rounded-2xl', bg)}>{icon}</div>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-[13px] leading-5 text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
