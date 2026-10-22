import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
};

const gradients = {
  blue: 'bg-[linear-gradient(140deg,#38AEFA,#0272C6)] text-white',
  pink: 'bg-[linear-gradient(140deg,#FF56A0,#F72685)] text-white',
  amber: 'bg-[linear-gradient(140deg,#FFC06D,#FF7A0D)] text-white',
  violet: 'bg-[linear-gradient(140deg,#A394FF,#6D5BE8)] text-white',
  mint: 'bg-[linear-gradient(140deg,#6EE7B7,#0E9F6E)] text-white',
  ink: 'bg-inverse text-on-inverse',
  soft: 'bg-brand-soft text-brand-strong dark:text-brand',
};

export type AvatarTone = keyof typeof gradients;

export function Avatar({
  initials,
  src,
  alt,
  size = 'md',
  tone = 'blue',
  status,
  ring = false,
  className,
}: {
  initials?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  status?: 'online' | 'away' | 'offline';
  ring?: boolean;
  className?: string;
}) {
  const dot = { online: 'bg-success', away: 'bg-amber', offline: 'bg-faint' }[status ?? 'online'];
  const dotSize: Record<AvatarSize, string> = {
    xs: 'h-1.5 w-1.5 border',
    sm: 'h-2 w-2 border',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-4 w-4 border-2',
  };
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt ?? ''}
          className={cn(
            'rounded-full object-cover',
            sizes[size],
            ring && 'ring-2 ring-surface shadow-xs',
          )}
        />
      ) : (
        <span
          className={cn(
            'inline-grid place-items-center rounded-full font-bold tracking-tight',
            sizes[size],
            gradients[tone],
            ring && 'ring-2 ring-surface',
          )}
        >
          {initials}
        </span>
      )}
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-surface',
            dot,
            dotSize[size],
          )}
        />
      )}
    </span>
  );
}

export function AvatarStack({
  people,
  size = 'md',
  max = 4,
  extraLabel,
}: {
  people: { id: string; initials: string; tone?: AvatarTone; src?: string }[];
  size?: AvatarSize;
  max?: number;
  extraLabel?: ReactNode;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((person, index) => (
        <span key={person.id} className={cn(index > 0 && '-ml-2')}>
          <Avatar initials={person.initials} tone={person.tone} src={person.src} size={size} ring />
        </span>
      ))}
      {rest > 0 && (
        <span
          className={cn(
            '-ml-2 inline-grid place-items-center rounded-full bg-surface-3 font-bold text-muted ring-2 ring-surface',
            sizes[size],
          )}
        >
          +{rest}
        </span>
      )}
      {extraLabel && <span className="ml-2 text-[11px] text-muted">{extraLabel}</span>}
    </div>
  );
}
