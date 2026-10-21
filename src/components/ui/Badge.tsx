import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'brand' | 'pink' | 'amber' | 'success' | 'danger' | 'warning' | 'violet' | 'neutral';
export type BadgeVariant = 'soft' | 'solid' | 'outline' | 'dot';

const tones: Record<BadgeTone, { soft: string; solid: string; outline: string; dot: string }> = {
  brand: {
    soft: 'bg-brand-soft text-brand-strong dark:text-brand',
    solid: 'bg-brand text-white dark:text-[#08131F]',
    outline: 'border-brand/35 text-brand-strong dark:text-brand',
    dot: 'bg-brand',
  },
  pink: {
    soft: 'bg-pink-soft text-pink-strong dark:text-pink',
    solid: 'bg-pink text-white dark:text-[#15040C]',
    outline: 'border-pink/35 text-pink-strong dark:text-pink',
    dot: 'bg-pink',
  },
  amber: {
    soft: 'bg-amber-soft text-amber-strong dark:text-amber',
    solid: 'bg-amber text-white dark:text-[#170C02]',
    outline: 'border-amber/40 text-amber-strong dark:text-amber',
    dot: 'bg-amber',
  },
  success: {
    soft: 'bg-success-soft text-success',
    solid: 'bg-success text-white dark:text-[#04140D]',
    outline: 'border-success/35 text-success',
    dot: 'bg-success',
  },
  danger: {
    soft: 'bg-danger-soft text-danger',
    solid: 'bg-danger text-white dark:text-[#1A0405]',
    outline: 'border-danger/35 text-danger',
    dot: 'bg-danger',
  },
  warning: {
    soft: 'bg-warning-soft text-warning',
    solid: 'bg-warning text-white dark:text-[#170F00]',
    outline: 'border-warning/40 text-warning',
    dot: 'bg-warning',
  },
  violet: {
    soft: 'bg-violet-soft text-violet',
    solid: 'bg-violet text-white dark:text-[#0B0818]',
    outline: 'border-violet/35 text-violet',
    dot: 'bg-violet',
  },
  neutral: {
    soft: 'bg-surface-3 text-muted',
    solid: 'bg-inverse text-on-inverse',
    outline: 'border-line-strong text-muted',
    dot: 'bg-faint',
  },
};

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  children,
  className,
}: {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold leading-none',
        variant === 'dot' ? 'px-0' : 'px-2.5 py-1',
        variant === 'outline' && 'border bg-transparent',
        t[variant],
        className,
      )}
    >
      {variant === 'dot' && <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      {children}
    </span>
  );
}

export function StatusDot({ tone = 'success', pulse = false }: { tone?: BadgeTone; pulse?: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && <span className={cn('absolute inset-0 rounded-full opacity-60 ds-pulse', tones[tone].dot)} />}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', tones[tone].dot)} />
    </span>
  );
}

export function GradientBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-[linear-gradient(100deg,#0E91F0,#F72685_58%,#FF7A0D)] px-2.5 py-1 text-[11px] font-bold leading-none tracking-wide text-white shadow-[0_4px_14px_-6px_rgba(247,38,133,.8)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-line bg-surface px-1.5 font-mono text-[10px] font-semibold text-muted shadow-xs">
      {children}
    </kbd>
  );
}
