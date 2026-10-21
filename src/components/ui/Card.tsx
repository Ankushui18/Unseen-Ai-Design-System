import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-[18px] border border-line bg-surface shadow-card',
        'transition-[box-shadow,border-color,transform] duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', compact ? 'p-4' : 'p-5 pb-0', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{eyebrow}</div>
        )}
        <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
        {description && <p className="mt-1 text-[13px] leading-5 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 border-t border-line px-5 py-3', className)}>
      {children}
    </div>
  );
}

export function Divider({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return <div className={cn('h-px w-full bg-line', className)} />;
}
