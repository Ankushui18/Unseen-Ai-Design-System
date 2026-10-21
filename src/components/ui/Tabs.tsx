import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  count?: number;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'underline',
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (next: T) => void;
  variant?: 'underline' | 'pill' | 'segment';
  className?: string;
}) {
  if (variant === 'pill') {
    return (
      <div role="tablist" className={cn('flex flex-wrap items-center gap-1', className)}>
        {items.map(item => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                active
                  ? 'bg-inverse text-on-inverse shadow-xs'
                  : 'text-muted hover:bg-surface-3 hover:text-ink',
              )}
            >
              {item.icon}
              {item.label}
              {typeof item.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none',
                    active ? 'bg-white/20' : 'bg-surface-3 text-faint',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'segment') {
    return (
      <div role="tablist" className={cn('inline-flex items-center gap-1 rounded-md border border-line bg-surface-3 p-1', className)}>
        {items.map(item => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                active ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink',
              )}
            >
              {item.icon}
              {item.label}
              {typeof item.count === 'number' && (
                <span className="rounded-full bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] leading-none text-faint">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" className={cn('flex items-center gap-5 overflow-x-auto border-b border-line', className)}>
      {items.map(item => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative inline-flex shrink-0 items-center gap-1.5 pb-3 pt-1 text-[13px] font-semibold transition',
              active ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {item.icon}
            {item.label}
            {typeof item.count === 'number' && (
              <span className="rounded-full bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] leading-none text-faint">
                {item.count}
              </span>
            )}
            <span
              className={cn(
                'absolute inset-x-0 -bottom-px h-[2px] rounded-full transition',
                active ? 'bg-[linear-gradient(90deg,#38AEFA,#0272C6)]' : 'bg-transparent',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
