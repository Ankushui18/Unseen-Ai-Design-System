import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileUp,
  Minus,
  Plus,
  Star,
  UploadCloud,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';

/* -------------------------------- accordion ------------------------------- */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { id: string; title: string; content: ReactNode; meta?: string }[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-surface-2"
            >
              <span className="flex-1 text-[11.5px] font-semibold text-ink">{item.title}</span>
              {item.meta && <span className="font-mono text-[9.5px] text-faint">{item.meta}</span>}
              <ChevronDown className={cn('h-3.5 w-3.5 text-faint transition-transform', isOpen && 'rotate-180')} />
            </button>
            {isOpen && <div className="border-t border-line-soft px-3.5 py-3 text-[11px] leading-5 text-muted ds-rise">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- combobox ------------------------------- */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
}: {
  options: { value: string; label: string; meta?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o => `${o.label} ${o.meta ?? ''}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={label}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-surface px-2.5 text-left text-[11.5px] transition',
          open ? 'border-brand ring-[3px] ring-brand/15' : 'border-line-strong hover:border-brand/40',
        )}
      >
        <span className={cn('truncate', selected ? 'text-ink' : 'text-faint')}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-faint transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-pop ds-rise">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter…"
            className="h-8 w-full border-b border-line bg-surface-2 px-2.5 text-[11px] text-ink outline-none placeholder:text-faint"
          />
          <div className="max-h-48 overflow-auto p-1">
            {filtered.length === 0 && <p className="px-2 py-3 text-center text-[10.5px] text-faint">No matches</p>}
            {filtered.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                  setQuery('');
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition',
                  option.value === value ? 'bg-brand-soft text-brand-strong dark:text-brand' : 'text-ink-soft hover:bg-surface-2',
                )}
              >
                <span className="flex-1">{option.label}</span>
                {option.meta && <span className="font-mono text-[9px] text-faint">{option.meta}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- tag input ------------------------------- */
export function TagInput({ initial = [], placeholder = 'Add tag…' }: { initial?: string[]; placeholder?: string }) {
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState('');
  const add = () => {
    const value = draft.trim().replace(/^#/, '');
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setDraft('');
  };
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-line-strong bg-surface px-2 py-1.5 transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/15">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-sm bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-strong dark:text-brand">
          #{tag}
          <button onClick={() => setTags(tags.filter(t => t !== tag))} aria-label={`Remove ${tag}`} className="opacity-60 hover:opacity-100">
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
          if (e.key === 'Backspace' && !draft && tags.length) setTags(tags.slice(0, -1));
        }}
        onBlur={add}
        placeholder={placeholder}
        className="min-w-[90px] flex-1 bg-transparent text-[11.5px] text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}

/* ------------------------------- number input ----------------------------- */
export function NumberStepper({
  value: initial = 0,
  min = 0,
  max = 100,
  step = 1,
  suffix,
}: {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(initial);
  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  return (
    <div className="inline-flex h-9 items-center overflow-hidden rounded-md border border-line-strong bg-surface">
      <button onClick={() => setValue(clamp(value - step))} aria-label="Decrease" className="grid h-full w-8 place-items-center text-muted transition hover:bg-surface-2 hover:text-ink">
        <Minus className="h-3 w-3" />
      </button>
      <div className="flex h-full min-w-[52px] items-center justify-center gap-0.5 border-x border-line px-2 font-mono text-[11.5px] font-semibold text-ink">
        {value}
        {suffix && <span className="text-[9px] font-normal text-faint">{suffix}</span>}
      </div>
      <button onClick={() => setValue(clamp(value + step))} aria-label="Increase" className="grid h-full w-8 place-items-center text-muted transition hover:bg-surface-2 hover:text-ink">
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

/* --------------------------------- file drop ------------------------------ */
export function FileDrop({ hint = 'CSV, JSONL or Parquet — up to 512 MB' }: { hint?: string }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => {
        e.preventDefault();
        setDragging(false);
      }}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center transition',
        dragging ? 'border-brand bg-brand-soft' : 'border-line-strong bg-surface-2/60 hover:border-brand/40',
      )}
    >
      <span className={cn('grid h-9 w-9 place-items-center rounded-full', dragging ? 'bg-brand-fill text-on-brand' : 'bg-surface text-brand shadow-xs')}>
        {dragging ? <FileUp className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
      </span>
      <p className="mt-2 text-[11.5px] font-medium text-ink">
        {dragging ? 'Drop to upload' : 'Drag a file here, or browse'}
      </p>
      <p className="mt-0.5 text-[10px] text-faint">{hint}</p>
      <Button size="xs" variant="secondary" className="mt-3">Choose file</Button>
    </div>
  );
}

/* --------------------------------- calendar ------------------------------- */
export function Calendar({ selected = 21 }: { selected?: number }) {
  const [day, setDay] = useState(selected);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const offset = 3; // Oct 2026 starts on a Thursday
  return (
    <div className="w-[228px] rounded-lg border border-line bg-surface p-2.5 shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <button aria-label="Previous month" className="grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-surface-2">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink">
          <CalendarIcon className="h-3 w-3 text-brand" /> October 2026
        </span>
        <button aria-label="Next month" className="grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-surface-2">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center font-mono text-[8.5px] uppercase text-faint">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={`${d}${i}`} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`pad${i}`} />
        ))}
        {days.map(d => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={cn(
              'grid h-6 place-items-center rounded-sm font-mono text-[10.5px] transition',
              d === day ? 'bg-brand-fill font-bold text-on-brand shadow-xs' : 'text-ink-soft hover:bg-surface-2',
            )}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-[9.5px] text-faint">
        <span>Range picker</span>
        <span className="font-mono">Oct {day}, 2026</span>
      </div>
    </div>
  );
}

/* --------------------------------- rating --------------------------------- */
export function Rating({ value: initial = 4, max = 5, showLabel = false }: { value?: number; max?: number; showLabel?: boolean }) {
  const [value, setValue] = useState(initial);
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: max }, (_, i) => i + 1).map(star => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onClick={() => setValue(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className="transition hover:scale-110"
          >
            <Star
              className={cn('h-3.5 w-3.5', (hover || value) >= star ? 'fill-amber text-amber' : 'text-line-strong')}
              strokeWidth={1.8}
            />
          </button>
        ))}
      </div>
      {showLabel && <span className="font-mono text-[10px] text-muted">{value.toFixed(1)} / {max}</span>}
    </div>
  );
}

/* -------------------------------- inline edit ----------------------------- */
export function InlineEdit({ value: initial = 'Unseen Labs' }: { value?: string }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setValue(draft);
              setEditing(false);
            }
            if (e.key === 'Escape') setEditing(false);
          }}
          className="h-7 rounded-md border border-brand bg-surface px-2 text-[11.5px] text-ink outline-none ring-[3px] ring-brand/15"
        />
        <Button
          size="xs"
          onClick={() => {
            setValue(draft);
            setEditing(false);
          }}
        >
          Save
        </Button>
      </div>
    );
  }
  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className="group inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-[11.5px] font-medium text-ink transition hover:border-line hover:bg-surface-2"
    >
      {value}
      <span className="text-[9px] text-faint opacity-0 transition group-hover:opacity-100">edit</span>
    </button>
  );
}

/* --------------------------------- banner --------------------------------- */
export function Banner({
  title,
  description,
  action,
  onDismiss,
  tone = 'brand',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  onDismiss?: () => void;
  tone?: 'brand' | 'pink' | 'ink';
}) {
  const style =
    tone === 'pink'
      ? 'bg-[linear-gradient(100deg,var(--ds-pink-soft),var(--ds-surface))] border-pink/25'
      : tone === 'ink'
        ? 'bg-inverse border-transparent text-on-inverse'
        : 'bg-[linear-gradient(100deg,var(--ds-brand-soft),var(--ds-surface))] border-brand/25';
  return (
    <div className={cn('flex flex-wrap items-center gap-3 rounded-lg border px-3.5 py-2.5', style)}>
      <div className="min-w-0 flex-1">
        <div className={cn('text-[11.5px] font-semibold', tone === 'ink' ? 'text-on-inverse' : 'text-ink')}>{title}</div>
        {description && <div className={cn('text-[10.5px] leading-4', tone === 'ink' ? 'text-on-inverse/60' : 'text-muted')}>{description}</div>}
      </div>
      {action}
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss banner" className={cn('text-faint transition hover:text-ink', tone === 'ink' && 'hover:text-on-inverse')}>
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* -------------------------------- popover --------------------------------- */
export function Popover({
  trigger,
  children,
  align = 'start',
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="inline-flex">
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full z-40 mt-2 w-64 rounded-xl border border-line bg-surface p-3 shadow-pop ds-rise',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- color swatch ----------------------------- */
export function ColorSwatchRow({ label, colors }: { label: string; colors: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 font-mono text-[9.5px] text-faint">{label}</span>
      <div className="flex flex-1 gap-1">
        {colors.map(color => (
          <span
            key={color}
            title={color}
            className="h-6 flex-1 rounded-sm border border-black/5 transition hover:scale-y-125 dark:border-white/10"
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ segmented field --------------------------- */
export function OptionCards<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: { value: T; label: string; description?: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={cn('grid gap-2', columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
      {options.map(option => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-lg border p-2.5 text-left transition',
              active ? 'border-brand/45 bg-brand-soft shadow-[0_0_0_2px_var(--ds-brand-ring)]' : 'border-line bg-surface hover:border-brand/30',
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('text-[11px] font-semibold', active ? 'text-brand-strong dark:text-brand' : 'text-ink')}>{option.label}</span>
              {option.icon}
              {active && <Badge tone="brand" variant="solid">on</Badge>}
            </div>
            {option.description && <p className="mt-0.5 text-[9.5px] leading-4 text-muted">{option.description}</p>}
          </button>
        );
      })}
    </div>
  );
}
