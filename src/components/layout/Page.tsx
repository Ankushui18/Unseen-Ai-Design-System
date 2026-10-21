import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  gradient = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  gradient?: boolean;
}) {
  return (
    <header className="relative mb-8 border-b border-line pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{eyebrow}</span>
          </div>
          <h1
            className={cn(
              'text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[42px]',
              gradient && 'ds-gradient-text',
            )}
          >
            {title}
          </h1>
          {description && <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted">{description}</p>}
          {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Section({
  id,
  index,
  title,
  description,
  aside,
  children,
  className,
  flush = false,
}: {
  id?: string;
  index?: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 overflow-hidden rounded-[20px] border border-line bg-surface shadow-card',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          {index && (
            <span className="grid h-6 min-w-6 place-items-center rounded-md bg-brand-soft px-1.5 font-mono text-[10px] font-bold text-brand">
              {index}
            </span>
          )}
          <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          {description && <p className="text-[11.5px] text-muted sm:text-right">{description}</p>}
          {aside}
        </div>
      </div>
      <div className={flush ? undefined : 'p-5 sm:p-6'}>{children}</div>
    </section>
  );
}

export function DemoRow({
  label,
  note,
  children,
  className,
}: {
  label?: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {(label || note) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">{label}</span>
          )}
          {note && <span className="font-mono text-[10px] text-faint">{note}</span>}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function SubGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>{children}</div>;
}

export function SurfacePanel({
  label,
  children,
  className,
  padded = true,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn('rounded-xl border border-line bg-surface-2', className)}>
      {label && (
        <div className="border-b border-line px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
          {label}
        </div>
      )}
      <div className={padded ? 'p-4' : undefined}>{children}</div>
    </div>
  );
}

export function SpecLine({ children }: { children: ReactNode }) {
  return <p className="mt-6 border-t border-line-soft pt-3 font-mono text-[10px] leading-5 text-faint">{children}</p>;
}
