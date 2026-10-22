import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronRight, Circle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------- breadcrumbs ------------------------------ */
export function Breadcrumbs({ items, className }: { items: { label: string; icon?: ReactNode }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1.5 text-[11.5px]', className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-faint" />}
            <span
              className={cn(
                'inline-flex items-center gap-1 transition',
                last ? 'font-semibold text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {item.icon}
              {item.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

/* --------------------------------- stepper -------------------------------- */
export function Stepper({
  steps,
  current,
  onSelect,
  orientation = 'horizontal',
}: {
  steps: { label: string; description?: string }[];
  current: number;
  onSelect?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}) {
  if (orientation === 'vertical') {
    return (
      <ol className="space-y-1">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
              {i < steps.length - 1 && <span className={cn('absolute bottom-0 left-[11px] top-6 w-px', done ? 'bg-success/40' : 'bg-line')} />}
              <button
                onClick={() => onSelect?.(i)}
                className={cn(
                  'z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold transition',
                  done
                    ? 'border-success/30 bg-success-soft text-success'
                    : active
                      ? 'border-brand-fill bg-brand-fill text-on-brand shadow-brand'
                      : 'border-line bg-surface-2 text-faint',
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </button>
              <div className="min-w-0">
                <div className={cn('text-[11.5px] font-semibold', active ? 'text-ink' : done ? 'text-ink-soft' : 'text-faint')}>
                  {step.label}
                </div>
                {step.description && <div className="text-[10px] leading-4 text-muted">{step.description}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <button onClick={() => onSelect?.(i)} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold transition',
                  done
                    ? 'border-success/30 bg-success-soft text-success'
                    : active
                      ? 'border-brand-fill bg-brand-fill text-on-brand shadow-brand'
                      : 'border-line bg-surface-2 text-faint',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn('whitespace-nowrap text-[9.5px] font-semibold', active ? 'text-ink' : 'text-faint')}>{step.label}</span>
            </button>
            {i < steps.length - 1 && <span className={cn('mb-4 h-px flex-1', done ? 'bg-success/40' : 'bg-line')} />}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- dropdown menu ----------------------------- */
export function DropdownMenu({
  trigger,
  items,
  align = 'start',
}: {
  trigger: ReactNode;
  items: { label: string; icon?: ReactNode; shortcut?: string; danger?: boolean; onSelect?: () => void }[];
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="menu" className="inline-flex">
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute top-full z-40 mt-1.5 min-w-[196px] ds-rise rounded-lg border border-line bg-surface p-1 shadow-pop',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map(item => (
            <div key={item.label}>
              {item.danger && <div className="my-1 h-px bg-line" />}
              <button
                role="menuitem"
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[11.5px] font-medium transition',
                  item.danger ? 'text-danger hover:bg-danger-soft' : 'text-ink-soft hover:bg-surface-2',
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && <span className="font-mono text-[9px] text-faint">{item.shortcut}</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- nav list -------------------------------- */
export function NavList<T extends string>({
  items,
  value,
  onChange,
  dense = false,
}: {
  items: { value: T; label: string; icon?: ReactNode; badge?: ReactNode; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  dense?: boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label="Section navigation">
      {items.map(item => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-2.5 text-left transition',
              dense ? 'py-1.5 text-[11px]' : 'py-2 text-[12px]',
              active ? 'bg-surface text-ink shadow-xs ring-1 ring-line' : 'text-muted hover:bg-surface-2 hover:text-ink',
            )}
          >
            <span className={cn(active ? 'text-brand' : 'text-faint')}>{item.icon}</span>
            <span className="flex-1 font-medium">{item.label}</span>
            {typeof item.count === 'number' && (
              <span className="rounded-full bg-surface-3 px-1.5 py-0.5 font-mono text-[9px] leading-none text-faint">{item.count}</span>
            )}
            {item.badge}
          </button>
        );
      })}
    </nav>
  );
}

/* -------------------------------- anchor nav ------------------------------ */
export function AnchorNav({ items, active }: { items: { id: string; label: string }[]; active?: string }) {
  return (
    <ul className="space-y-1 border-l border-line">
      {items.map(item => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              '-ml-px block border-l-2 px-3 py-1 text-[11px] transition',
              active === item.id
                ? 'border-brand font-semibold text-ink'
                : 'border-transparent text-muted hover:border-line-strong hover:text-ink',
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------- tab bar (mobile) ------------------------ */
export function MobileTabs({
  items,
  value,
  onChange,
}: {
  items: { value: string; label: string; icon: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <nav className="flex items-center justify-around border-t border-line bg-surface px-2 pb-1.5 pt-2">
      {items.map(item => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn('flex flex-col items-center gap-1 rounded-md px-3 py-1 transition', active ? 'text-brand' : 'text-faint')}
          >
            {item.icon}
            <span className="text-[8.5px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------ page switcher ----------------------------- */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-line bg-surface-3 p-0.5">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-sm px-2.5 py-1 text-[10.5px] font-semibold transition',
            value === option.value ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink',
          )}
        >
          {option.label}
          {typeof option.count === 'number' && <span className="ml-1 font-mono text-[9px] text-faint">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function HomeCrumb() {
  return <Home className="h-3 w-3" />;
}

export function Dot() {
  return <Circle className="h-1.5 w-1.5 fill-current" />;
}
