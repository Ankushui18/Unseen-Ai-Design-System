import { useState, type ReactNode } from 'react';
import { ChevronRight, Command, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allNavItems, navGroups, pageMeta, type PageKey } from './nav';
import { Kbd } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

function BrandMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md bg-[linear-gradient(140deg,#0E91F0,#F72685_62%,#FF7A0D)] shadow-[0_6px_16px_-6px_rgba(247,38,133,.7)]">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" aria-hidden>
        <path
          d="M12 3c.9 4.4 3.6 7.1 8 8-4.4.9-7.1 3.6-8 8-.9-4.4-3.6-7.1-8-8 4.4-.9 7.1-3.6 8-8Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function SidebarContent({
  page,
  onNavigate,
  theme,
  onToggleTheme,
}: {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <button onClick={() => onNavigate('overview')} className="group flex items-center gap-2.5 px-4 pb-5 pt-5 text-left">
        <BrandMark />
        <span className="leading-tight">
          <span className="block text-[13px] font-bold tracking-[-0.02em] text-ink">Unseen</span>
          <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">Design system</span>
        </span>
      </button>

      <div className="px-3">
        <button
          onClick={() => onToggleTheme()}
          className="group flex w-full items-center gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-2 text-left transition hover:border-brand/35 hover:bg-surface"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-surface text-muted shadow-xs transition group-hover:text-brand">
            {theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </span>
          <span className="flex-1 text-[11.5px] font-medium text-muted">{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
          <span className="font-mono text-[9.5px] text-faint">⌘J</span>
        </button>
      </div>

      <nav aria-label="Design system" className="mt-5 flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 pb-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="mb-1.5 px-2 text-[9.5px] font-bold uppercase tracking-[0.16em] text-faint">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = item.key === page;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-left transition',
                      active
                        ? 'bg-surface text-ink shadow-xs ring-1 ring-line'
                        : 'text-muted hover:bg-surface-2 hover:text-ink',
                    )}
                  >
                    <Icon
                      className={cn('h-4 w-4 shrink-0 transition', active ? 'text-brand' : 'text-faint group-hover:text-muted')}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    <span className="flex-1 text-[12.5px] font-medium">{item.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                    {item.key === 'ai-patterns' && !active && (
                      <span className="rounded-full bg-[linear-gradient(100deg,#0E91F0,#F72685)] px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="rounded-xl border border-line bg-surface-2 p-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[10.5px] font-semibold text-ink-soft">v2.3 · 111 components</span>
          </div>
          <p className="mt-1 text-[10.5px] leading-4 text-faint">Light &amp; dark, WCAG AA checked, token-driven.</p>
        </div>
        <div className="mt-3 flex items-center gap-2 px-1">
          <Avatar initials="RK" size="sm" tone="pink" status="online" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[11.5px] font-semibold text-ink">Rania K.</div>
            <div className="truncate text-[10px] text-faint">Design lead</div>
          </div>
          <Kbd>⌘K</Kbd>
        </div>
      </div>
    </div>
  );
}

export function Shell({
  page,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenSearch,
  children,
}: {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = pageMeta[page];
  const index = allNavItems.findIndex(i => i.key === page);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-[12px] focus:font-semibold focus:text-ink focus:shadow-pop"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[320px] bg-[radial-gradient(70%_100%_at_20%_0%,var(--ds-brand-soft),transparent_70%),radial-gradient(50%_100%_at_85%_0%,rgba(247,38,133,.06),transparent_70%)]" />

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-line bg-surface/85 backdrop-blur-xl lg:block">
        <SidebarContent page={page} onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-[#08080F]/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-[82vw] max-w-[300px] border-r border-line bg-surface shadow-float ds-rise sm:w-[264px]">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-2"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              page={page}
              onNavigate={p => {
                onNavigate(p);
                setMobileOpen(false);
              }}
              theme={theme}
              onToggleTheme={onToggleTheme}
            />
          </aside>
        </div>
      )}

      <div className="relative z-10 lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface text-muted lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[11.5px]">
              <span className="hidden text-faint sm:inline">{meta.group}</span>
              <ChevronRight className="hidden h-3 w-3 text-faint sm:inline" />
              <span className="truncate font-semibold text-ink">{meta.title}</span>
              <span className="ml-1 hidden rounded-full border border-line bg-surface px-1.5 py-0.5 font-mono text-[9.5px] text-faint sm:inline">
                {String(index + 1).padStart(2, '0')}
              </span>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="group hidden h-8 items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-[11.5px] text-faint shadow-xs transition hover:border-brand/35 hover:text-muted sm:flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="w-24 text-left">Search system…</span>
                <span className="flex items-center gap-0.5 rounded border border-line bg-surface-2 px-1 py-0.5 font-mono text-[9px]">
                  <Command className="h-2.5 w-2.5" />K
                </span>
              </button>
              <button
                onClick={onOpenSearch}
                aria-label="Search"
                className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface text-muted sm:hidden"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface text-muted shadow-xs transition hover:border-brand/35 hover:text-ink"
              >
                {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              </button>
              <span className="mx-0.5 hidden h-5 w-px bg-line sm:block" />
              <button className="hidden items-center gap-2 rounded-md pl-1 pr-2 py-1 transition hover:bg-surface sm:flex">
                <Avatar initials="RK" size="sm" tone="pink" />
                <span className="text-[11.5px] font-semibold text-ink">Rania</span>
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1240px] px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>

        <footer className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-2 border-t border-line px-4 py-6 text-[11px] text-faint sm:flex-row sm:px-6 lg:px-10">
          <span>Unseen Design System · v2.0 · Built for AI product teams</span>
          <span className="font-mono">AlignUI precision · Kigen energy</span>
        </footer>
      </div>
    </div>
  );
}
