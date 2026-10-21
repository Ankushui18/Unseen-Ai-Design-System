import { useState, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------- checkbox ------------------------------- */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  tone = 'brand',
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  disabled?: boolean;
  tone?: 'brand' | 'pink';
}) {
  const active = checked || indeterminate;
  return (
    <label className={cn('group flex cursor-pointer items-start gap-2.5', disabled && 'cursor-not-allowed opacity-45')}>
      <span className="relative mt-0.5 grid place-items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
        />
        <span
          className={cn(
            'grid h-[18px] w-[18px] place-items-center rounded-[5px] border transition duration-150',
            active
              ? tone === 'pink'
                ? 'border-pink bg-pink text-white'
                : 'border-brand bg-brand text-white'
              : 'border-line-strong bg-surface group-hover:border-brand/60',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/25 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface',
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3" strokeWidth={3} />
          ) : (
            checked && <Check className="h-3 w-3" strokeWidth={3.4} />
          )}
        </span>
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-[13px] font-medium leading-5 text-ink">{label}</span>}
          {description && <span className="block text-[11px] leading-4 text-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

/* -------------------------------- radio --------------------------------- */
export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  name,
}: {
  checked: boolean;
  onChange?: () => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2.5', disabled && 'cursor-not-allowed opacity-45')}>
      <span className="relative mt-0.5 grid place-items-center">
        <input
          type="radio"
          name={name}
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.()}
        />
        <span
          className={cn(
            'grid h-[18px] w-[18px] place-items-center rounded-full border transition',
            checked ? 'border-brand' : 'border-line-strong group-hover:border-brand/60',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/25',
          )}
        >
          {checked && <span className="h-2 w-2 rounded-full bg-brand" />}
        </span>
      </span>
      {(label || description) && (
        <span>
          {label && <span className="block text-[13px] font-medium leading-5 text-ink">{label}</span>}
          {description && <span className="block text-[11px] leading-4 text-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

/* -------------------------------- switch -------------------------------- */
export function Switch({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  tone = 'brand',
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  tone?: 'brand' | 'pink';
}) {
  const track = { sm: 'h-4 w-7', md: 'h-5 w-9', lg: 'h-6 w-11' }[size];
  const knob = { sm: 'h-2.5 w-2.5', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' }[size];
  const travel = { sm: 'translate-x-3.5', md: 'translate-x-4.5', lg: 'translate-x-5.5' }[size];
  return (
    <label className={cn('flex items-start gap-3', disabled && 'cursor-not-allowed opacity-45')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === 'string' ? label : 'Toggle'}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative mt-0.5 shrink-0 rounded-full p-[3px] transition duration-200',
          track,
          checked ? (tone === 'pink' ? 'bg-pink' : 'bg-brand') : 'bg-line-strong',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        )}
      >
        <span
          className={cn(
            'block rounded-full bg-white shadow-[0_1px_2px_rgba(15,15,30,.35)] transition-transform duration-200',
            knob,
            checked ? travel : 'translate-x-0',
          )}
        />
      </button>
      {(label || description) && (
        <span className="-mt-0.5">
          {label && <span className="block text-[13px] font-medium leading-5 text-ink">{label}</span>}
          {description && <span className="block text-[11px] leading-4 text-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

/* ------------------------------ segmented ------------------------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-[10px] border border-line bg-surface-3 p-1',
        className,
      )}
    >
      {options.map(option => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[7px] font-semibold transition',
            size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
            value === option.value
              ? 'bg-surface text-ink shadow-xs'
              : 'text-muted hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------- slider -------------------------------- */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix,
  showTicks = false,
}: {
  value: number;
  onChange?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
  suffix?: string;
  showTicks?: boolean;
}) {
  const [local, setLocal] = useState(value);
  const current = onChange ? value : local;
  const set = (n: number) => {
    if (onChange) onChange(n);
    else setLocal(n);
  };
  const display = onChange ? value : current;
  const displayPct = ((display - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      {(label || suffix) && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-soft">{label}</span>
          <span className="font-mono text-[11px] text-muted">
            {display}
            {suffix}
          </span>
        </div>
      )}
      <div className="relative flex h-5 items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-surface-3" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-[linear-gradient(90deg,#38AEFA,#0272C6)]"
          style={{ width: `${displayPct}%` }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-white bg-brand shadow-[0_2px_8px_rgba(14,145,240,.45)] dark:border-surface"
          style={{ left: `${displayPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={display}
          onChange={e => set(Number(e.target.value))}
          aria-label={typeof label === 'string' ? label : 'Slider'}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      {showTicks && (
        <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
          <span>{min}</span>
          <span>{Math.round((min + max) / 2)}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
