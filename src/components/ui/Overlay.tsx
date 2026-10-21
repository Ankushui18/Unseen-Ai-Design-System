import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

/* -------------------------------- tooltip -------------------------------- */
export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const pos = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  }[side];
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-inverse px-2.5 py-1.5 text-[11px] font-semibold text-on-inverse opacity-0 shadow-pop transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100',
          pos,
        )}
      >
        {content}
      </span>
    </span>
  );
}

/* --------------------------------- modal --------------------------------- */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[#08080F]/55 backdrop-blur-[3px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full ds-rise overflow-hidden rounded-xl border border-line bg-surface shadow-float',
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
            {description && <p className="mt-1 text-[13px] leading-5 text-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid h-8 w-8 place-items-center rounded-md text-faint transition hover:bg-surface-3 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children && <div className="px-6 py-5">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- drawer --------------------------------- */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close panel" onClick={onClose} className="absolute inset-0 bg-[#08080F]/50 backdrop-blur-[2px]" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-[400px] flex-col border-l border-line bg-surface shadow-float ds-rise"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[15px] font-bold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-faint transition hover:bg-surface-3 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 space-y-5 overflow-auto p-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-line p-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ------------------------- confirm dialog preview ------------------------ */
export function ConfirmDialogCard({
  icon,
  title,
  description,
  confirmLabel = 'Delete',
  tone = 'danger',
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: 'danger' | 'brand';
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-pop">
      {icon && (
        <div
          className={cn(
            'mb-4 grid h-10 w-10 place-items-center rounded-xl',
            tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand',
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-5 text-muted">{description}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
        <Button size="sm" variant={tone === 'danger' ? 'danger' : 'primary'}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
