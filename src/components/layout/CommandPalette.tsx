import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CornerDownLeft, Moon, Search, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allNavItems, type PageKey } from './nav';
import { Kbd } from '../ui/Badge';

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onToggleTheme,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: PageKey) => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const pages = allNavItems.map(item => ({
      type: 'page' as const,
      key: item.key,
      label: item.label,
      hint: item.description,
      icon: item.icon,
      run: () => onNavigate(item.key),
    }));
    const actions = [
      {
        type: 'action' as const,
        key: 'theme',
        label: theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
        hint: 'Appearance',
        icon: theme === 'light' ? Moon : Sun,
        run: onToggleTheme,
      },
    ];
    const all = [...pages, ...actions];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(item => `${item.label} ${item.hint}`.toLowerCase().includes(q));
  }, [query, onNavigate, onToggleTheme, theme]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(i => (i + 1) % Math.max(results.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(i => (i - 1 + results.length) % Math.max(results.length, 1));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = results[active];
        if (item) {
          item.run();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-[#08080F]/55 backdrop-blur-[3px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-float ds-rise"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-brand" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search pages and actions…"
            className="h-6 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-faint"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[360px] overflow-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-[12px] text-muted">No matches for “{query}”</p>
          )}
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  item.run();
                  onClose();
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  active === i ? 'bg-brand-soft' : 'hover:bg-surface-2',
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-md border',
                    active === i
                      ? 'border-brand/25 bg-surface text-brand'
                      : 'border-line bg-surface-2 text-muted',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-ink">{item.label}</span>
                  <span className="block truncate text-[11px] text-muted">{item.hint}</span>
                </span>
                {active === i && <ArrowRight className="h-3.5 w-3.5 text-brand" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 border-t border-line bg-surface-2 px-4 py-2.5 text-[10px] font-medium text-faint">
          <span className="inline-flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> select
          </span>
          <span className="ml-auto">Unseen DS · v2.0</span>
        </div>
      </div>
    </div>
  );
}
