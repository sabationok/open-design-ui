import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { IconTile } from '../atoms/IconTile';

export interface ListRowProps {
  icon?: ComponentType<{ className?: string }>;
  /** Custom leading slot instead of an icon tile. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned value (amount, status). */
  trailing?: ReactNode;
  /** Controls that stay independently clickable above the row's hit area. */
  actions?: ReactNode;
  /** Makes the whole row a router link. */
  to?: string;
  /** Makes the whole row a button (ignored when `to` is set). */
  onClick?: () => void;
  className?: string;
}

// Generic row for entity lists: icon · title/subtitle · trailing · actions.
// `to` or `onClick` makes the whole row a target via a stretched pseudo-element on the title.
export function ListRow({ icon, leading, title, subtitle, trailing, actions, to, onClick, className }: ListRowProps) {
  const interactive = !!(to || onClick);
  const hit = 'outline-none after:absolute after:inset-0 focus-visible:underline';
  const titleEl = <span className="truncate text-sm font-medium text-foreground">{title}</span>;
  return (
    <div
      className={cn(
        'relative flex min-h-14 items-center gap-3 px-4 py-2.5',
        interactive && 'transition-colors hover:bg-ds-gray-alpha-100',
        className,
      )}
    >
      {leading ?? (icon && <IconTile icon={icon} className="shrink-0" />)}
      <div className="flex min-w-0 flex-1 flex-col">
        {to ? (
          <Link to={to} className={cn('flex min-w-0', hit)}>
            {titleEl}
          </Link>
        ) : onClick ? (
          <button type="button" onClick={onClick} className={cn('flex min-w-0 text-left', hit)}>
            {titleEl}
          </button>
        ) : (
          titleEl
        )}
        {subtitle && <span className="truncate text-[13px] text-muted-foreground">{subtitle}</span>}
      </div>
      {trailing && <div className="shrink-0 text-right">{trailing}</div>}
      {actions && <div className="relative z-[1] flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}
