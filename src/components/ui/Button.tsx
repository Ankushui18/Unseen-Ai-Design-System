import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const sizes: Record<ButtonSize, string> = {
  xs: 'h-7 gap-1.5 rounded-md px-2.5 text-[11px]',
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
  md: 'h-10 gap-2 rounded-[10px] px-4 text-[13px]',
  lg: 'h-11 gap-2 rounded-xl px-5 text-sm',
};

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#38AEFA_0%,#0272C6_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.28)_inset,0_8px_20px_-10px_rgba(2,114,198,.65)] hover:brightness-[1.06] active:brightness-95',
  secondary:
    'bg-surface text-ink border border-line-strong shadow-xs hover:bg-surface-2 hover:border-brand/40 dark:bg-surface-2',
  outline: 'bg-transparent text-ink-soft border border-line-strong hover:border-brand/50 hover:text-ink hover:bg-brand-soft/50',
  ghost: 'bg-transparent text-muted hover:bg-surface-3 hover:text-ink',
  soft: 'bg-brand-soft text-brand-strong hover:bg-brand/15 dark:text-brand',
  danger:
    'bg-[linear-gradient(135deg,#F0656A_0%,#D63A40_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.24)_inset,0_8px_20px_-10px_rgba(214,58,64,.6)] hover:brightness-105',
  link: 'bg-transparent px-0 text-brand underline decoration-brand/30 decoration-2 underline-offset-4 hover:decoration-brand',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold transition-[background,box-shadow,transform,color,border-color,filter] duration-150 active:translate-y-px',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        'disabled:pointer-events-none disabled:opacity-45',
        variant === 'link' ? 'h-auto gap-1 p-0 text-[13px]' : sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 ds-spin" aria-hidden /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export function IconButton({
  label,
  className,
  children,
  variant = 'secondary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  const square: Record<ButtonSize, string> = {
    xs: 'h-7 w-7 rounded-md',
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 rounded-[10px]',
    lg: 'h-11 w-11 rounded-xl',
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid place-items-center transition active:translate-y-px disabled:opacity-45',
        square[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('inline-flex items-center gap-2', className)}>{children}</div>;
}
