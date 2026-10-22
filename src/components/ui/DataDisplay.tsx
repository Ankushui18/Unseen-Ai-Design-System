import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, File, Folder, MoreHorizontal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeTone } from './Badge';
import { Button, IconButton } from './Button';
import { Checkbox } from './Controls';

/* --------------------------------- table --------------------------------- */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-left', className)}>{children}</table>
    </div>
  );
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <thead className={cn('bg-surface-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint', className)}>
      {children}
    </thead>
  );
}

export function Th({
  children,
  sortable = false,
  align = 'left',
  className,
  onClick,
  active = false,
  direction = 'asc',
}: {
  children?: ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  className?: string;
  onClick?: () => void;
  active?: boolean;
  direction?: 'asc' | 'desc';
}) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-3 py-2.5 font-bold',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {sortable ? (
        <button
          onClick={onClick}
          className={cn(
            'inline-flex items-center gap-1 transition hover:text-ink',
            active && 'text-ink',
            align === 'right' && 'flex-row-reverse',
          )}
        >
          {children}
          {active ? (
            direction === 'asc' ? (
              <ChevronUp className="h-2.5 w-2.5" />
            ) : (
              <ChevronDown className="h-2.5 w-2.5" />
            )
          ) : (
            <ChevronDown className="h-2.5 w-2.5 opacity-40" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function Tr({
  children,
  selected = false,
  className,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-t border-line transition',
        selected ? 'bg-brand-soft/60' : 'hover:bg-surface-2/70',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  align = 'left',
  className,
  mono = false,
}: {
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  mono?: boolean;
}) {
  return (
    <td
      className={cn(
        'px-3 py-3 text-[11.5px] text-ink-soft',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        mono && 'font-mono text-[10.5px] tabular-nums',
        className,
      )}
    >
      {children}
    </td>
  );
}

export function TableToolbar({
  search,
  onSearch,
  placeholder = 'Search…',
  filters,
  count,
  actions,
}: {
  search?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  filters?: ReactNode;
  count?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
      {onSearch && (
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-9 w-full rounded-md border border-line bg-surface pl-8 pr-2 text-[12px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/15 sm:h-8 sm:w-44 sm:text-[11.5px]"
          />
        </div>
      )}
      {filters}
      {count && <span className="ml-1 font-mono text-[10px] text-faint">{count}</span>}
      <div className="ml-auto flex items-center gap-1.5">{actions}</div>
    </div>
  );
}

export function DataBar({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'pink' | 'amber' | 'success' }) {
  const fill = {
    brand: 'bg-[linear-gradient(90deg,#38AEFA,#0272C6)]',
    pink: 'bg-[linear-gradient(90deg,#FF56A0,#F72685)]',
    amber: 'bg-[linear-gradient(90deg,#FFC06D,#FF7A0D)]',
    success: 'bg-success',
  }[tone];
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
        <span className={cn('block h-full rounded-full', fill)} style={{ width: `${Math.min(value, 100)}%` }} />
      </span>
      <span className="font-mono text-[10px] text-muted">{value}%</span>
    </span>
  );
}

/* ------------------------------- pagination ------------------------------- */
export function Pagination({
  page,
  pages,
  onChange,
  total,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  total?: string;
}) {
  const visible = Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2/60 px-3 py-2.5">
      <span className="font-mono text-[10px] text-faint">{total ?? `page ${page} of ${pages}`}</span>
      <div className="flex items-center gap-1">
        <Button size="xs" variant="secondary" disabled={page === 1} onClick={() => onChange(page - 1)}>
          Prev
        </Button>
        {visible.map((p, i) => {
          const prev = visible[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && <span className="px-0.5 text-[10px] text-faint">…</span>}
              <button
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  'h-6 min-w-6 rounded-sm px-1.5 font-mono text-[10.5px] font-semibold transition',
                  p === page ? 'bg-brand-fill text-on-brand shadow-xs' : 'border border-line bg-surface text-muted hover:text-ink',
                )}
              >
                {p}
              </button>
            </span>
          );
        })}
        <Button size="xs" variant="secondary" disabled={page === pages} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------- stat card ------------------------------- */
export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  icon,
  footer,
  data,
  tone = 'brand',
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: ReactNode;
  footer?: ReactNode;
  data?: number[];
  tone?: 'brand' | 'pink' | 'amber' | 'success';
}) {
  const color = {
    brand: 'var(--ds-brand)',
    pink: 'var(--ds-pink)',
    amber: 'var(--ds-amber)',
    success: 'var(--ds-success)',
  }[tone];
  const trendTone = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-faint';
  return (
    <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs transition hover:border-brand/30 hover:shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">{label}</span>
        {icon && <span className="text-faint">{icon}</span>}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-mono text-[19px] font-extrabold tracking-tight text-ink tabular-nums">{value}</span>
        {delta && <span className={cn('text-[9.5px] font-semibold', trendTone)}>{delta}</span>}
      </div>
      {data && (
        <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="mt-1.5 h-7 w-full" aria-hidden>
          <polyline
            points={data
              .map((d, i) => {
                const max = Math.max(...data);
                const min = Math.min(...data);
                return `${(i / (data.length - 1)) * 100},${26 - ((d - min) / (max - min || 1)) * 22}`;
              })
              .join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {footer && <div className="mt-2 border-t border-line-soft pt-2 text-[10px] text-faint">{footer}</div>}
    </div>
  );
}

/* --------------------------------- timeline ------------------------------- */
export function Timeline({
  items,
}: {
  items: { id: string; title: string; description?: string; time: string; tone?: BadgeTone; icon?: ReactNode }[];
}) {
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < items.length - 1 && <span className="absolute bottom-0 left-[13px] top-6 w-px bg-line" />}
          <span
            className={cn(
              'z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border bg-surface text-[10px]',
              item.tone === 'success'
                ? 'border-success/30 text-success'
                : item.tone === 'danger'
                  ? 'border-danger/30 text-danger'
                  : item.tone === 'warning'
                    ? 'border-warning/30 text-warning'
                    : 'border-brand/30 text-brand',
            )}
          >
            {item.icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[11.5px] font-semibold text-ink">{item.title}</span>
              <span className="ml-auto font-mono text-[9.5px] text-faint">{item.time}</span>
            </div>
            {item.description && <p className="mt-0.5 text-[10.5px] leading-5 text-muted">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------- tree ---------------------------------- */
export interface TreeItem {
  id: string;
  label: string;
  kind?: 'folder' | 'file';
  meta?: string;
  children?: TreeItem[];
}

export function TreeView({ items, defaultOpen = ['root'] }: { items: TreeItem[]; defaultOpen?: string[] }) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) => setOpen(list => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]));

  const render = (nodes: TreeItem[], depth = 0): ReactNode =>
    nodes.map(node => {
      const isOpen = open.includes(node.id);
      const hasChildren = !!node.children?.length;
      return (
        <div key={node.id}>
          <div
            className={cn(
              'group flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] transition hover:bg-surface-2',
              depth > 0 && 'ml-3 border-l border-line pl-2',
            )}
          >
            <button
              onClick={() => hasChildren && toggle(node.id)}
              aria-label={hasChildren ? (isOpen ? `Collapse ${node.label}` : `Expand ${node.label}`) : undefined}
              className="grid h-3.5 w-3.5 place-items-center text-faint"
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )
              ) : null}
            </button>
            {node.kind === 'folder' ? (
              <Folder className="h-3.5 w-3.5 text-brand" />
            ) : (
              <File className="h-3.5 w-3.5 text-faint" />
            )}
            <span className="flex-1 truncate text-ink-soft">{node.label}</span>
            {node.meta && <span className="font-mono text-[9px] text-faint">{node.meta}</span>}
          </div>
          {hasChildren && isOpen && <div className="mt-0.5">{render(node.children!, depth + 1)}</div>}
        </div>
      );
    });

  return <div className="rounded-lg border border-line bg-surface p-1.5">{render(items)}</div>;
}

/* ---------------------------------- diff ---------------------------------- */
export function DiffView({
  removed,
  added,
  filename = 'prompt.ts',
}: {
  removed: string[];
  added: string[];
  filename?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#0C0C15]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-[9.5px] text-white/40">{filename}</span>
        <span className="flex items-center gap-2 font-mono text-[9px]">
          <span className="text-[#FF7B7F]">−{removed.length}</span>
          <span className="text-[#4ADE9F]">+{added.length}</span>
        </span>
      </div>
      <pre className="overflow-x-auto py-2 font-mono text-[10.5px] leading-5">
        {removed.map((line, i) => (
          <div key={`r${i}`} className="flex gap-2 bg-[#FF7B7F]/10 px-3 text-[#FFB4B6]">
            <span className="select-none text-[#FF7B7F]/50">−</span>
            <span>{line}</span>
          </div>
        ))}
        {added.map((line, i) => (
          <div key={`a${i}`} className="flex gap-2 bg-[#4ADE9F]/10 px-3 text-[#9BEBC4]">
            <span className="select-none text-[#4ADE9F]/50">+</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* -------------------------------- json view ------------------------------- */
export function JsonView({ data, className }: { data: unknown; className?: string }) {
  const render = (value: unknown, depth = 0): ReactNode => {
    if (value === null) return <span className="text-[#7C6CF6]">null</span>;
    if (typeof value === 'string') return <span className="text-[#4ADE9F]">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-[#FFC06D]">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-[#7C6CF6]">{String(value)}</span>;
    if (Array.isArray(value)) {
      return (
        <span>
          <span className="text-white/40">[</span>
          {value.map((v, i) => (
            <div key={i} style={{ paddingLeft: 12 }}>
              {render(v, depth + 1)}
              {i < value.length - 1 && <span className="text-white/40">,</span>}
            </div>
          ))}
          <span className="text-white/40">]</span>
        </span>
      );
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <span>
          <span className="text-white/40">{'{'}</span>
          {entries.map(([k, v], i) => (
            <div key={k} style={{ paddingLeft: 12 }}>
              <span className="text-[#7DCBFC]">"{k}"</span>
              <span className="text-white/40">: </span>
              {render(v, depth + 1)}
              {i < entries.length - 1 && <span className="text-white/40">,</span>}
            </div>
          ))}
          <span className="text-white/40">{'}'}</span>
        </span>
      );
    }
    return null;
  };

  return (
    <pre className={cn('overflow-auto rounded-lg border border-line bg-[#0C0C15] p-3 font-mono text-[10.5px] leading-5 text-white/70', className)}>
      {render(data)}
    </pre>
  );
}

/* -------------------------------- log viewer ------------------------------ */
export function LogViewer({ lines }: { lines: { level: 'info' | 'warn' | 'error' | 'debug'; time: string; message: string }[] }) {
  const tone = {
    info: 'text-[#7DCBFC]',
    warn: 'text-[#FFC06D]',
    error: 'text-[#FF7B7F]',
    debug: 'text-white/35',
  };
  return (
    <div className="max-h-56 overflow-auto rounded-lg border border-line bg-[#0C0C15] p-2.5 font-mono text-[10px] leading-5">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span className="shrink-0 text-white/25">{line.time}</span>
          <span className={cn('w-10 shrink-0 uppercase', tone[line.level])}>{line.level}</span>
          <span className="text-white/65">{line.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- key / value ------------------------------ */
export function KeyValue({
  items,
  columns = 2,
  className,
}: {
  items: { label: string; value: ReactNode; mono?: boolean }[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-2.5', columns === 1 ? '' : columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3', className)}>
      {items.map(item => (
        <div key={item.label} className="flex items-baseline justify-between gap-3 border-b border-line-soft pb-1.5">
          <dt className="text-[10.5px] text-muted">{item.label}</dt>
          <dd className={cn('truncate text-[11px] font-medium text-ink', item.mono && 'font-mono text-[10.5px]')}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------ table actions ----------------------------- */
export function RowActions({ label = 'Row actions' }: { label?: string }) {
  return (
    <IconButton label={label} size="xs" variant="ghost">
      <MoreHorizontal className="h-3.5 w-3.5" />
    </IconButton>
  );
}

export function SelectAllCell({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return <Checkbox checked={checked} indeterminate={indeterminate} />;
}

export function StatusCell({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <Badge tone={tone} variant="soft">
      {children}
    </Badge>
  );
}
