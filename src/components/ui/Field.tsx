import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, Copy, Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const base =
  'w-full rounded-[10px] border bg-surface text-[13px] text-ink placeholder:text-faint transition duration-150 ' +
  'border-line-strong hover:border-line-strong/80 focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15 ' +
  'disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-faint';

export function Field({
  label,
  hint,
  error,
  required,
  action,
  children,
  className,
  htmlFor,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || action) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <label htmlFor={htmlFor} className="text-xs font-semibold text-ink-soft">
              {label}
              {required && <span className="ml-0.5 text-pink">*</span>}
            </label>
          )}
          {action}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-danger">{error}</p>
      ) : (
        hint && <p className="text-[11px] leading-4 text-muted">{hint}</p>
      )}
    </div>
  );
}

export function Input({
  icon,
  trailing,
  invalid,
  valid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  valid?: boolean;
}) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">{icon}</span>}
      <input
        className={cn(
          base,
          'h-10 px-3',
          icon && 'pl-9',
          trailing && 'pr-10',
          invalid && 'border-danger/60 focus:border-danger focus:ring-danger/15',
          valid && 'border-success/60',
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
      {trailing && <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">{trailing}</span>}
      {valid && !trailing && <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />}
    </div>
  );
}

export function SearchInput({
  placeholder = 'Search…',
  shortcut,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { shortcut?: string }) {
  return (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      trailing={
        shortcut ? (
          <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-faint">
            {shortcut}
          </kbd>
        ) : undefined
      }
      className={cn('bg-surface-2/60', className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'min-h-[96px] resize-none px-3 py-2.5 leading-6', className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className="relative">
      <select className={cn(base, 'h-10 appearance-none pl-3 pr-9', className)} {...props}>
        {children}
      </select>
      <svg
        viewBox="0 0 12 12"
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-faint"
      >
        <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="grid h-7 w-7 place-items-center rounded-md text-faint transition hover:bg-surface-3 hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
      {...props}
    />
  );
}

export function CopyField({ value, label, masked = false }: { value: string; label?: string; masked?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!masked);
  return (
    <div className="space-y-1.5">
      {label && <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{label}</div>}
      <div className="flex items-center gap-2 rounded-[10px] border border-line bg-surface-2 px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink-soft">
          {revealed ? value : value.replace(/[^\s-]/g, '•')}
        </code>
        {masked && (
          <button
            type="button"
            onClick={() => setRevealed(r => !r)}
            className="text-[11px] font-semibold text-muted transition hover:text-ink"
          >
            {revealed ? 'Hide' : 'Reveal'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value).catch(() => undefined);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
          aria-label="Copy value"
          className="grid h-7 w-7 place-items-center rounded-md border border-line bg-surface text-muted transition hover:border-brand/40 hover:text-brand"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
