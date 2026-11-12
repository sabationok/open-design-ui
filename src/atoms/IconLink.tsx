import type { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CONTROL_SQUARE, type ComponentSize } from '../lib/componentSize';

export interface IconLinkProps {
  to: string;
  /** The link's only name: `aria-label` and tooltip. */
  label: string;
  /** Any icon component taking `className` (lucide). */
  icon: ElementType;
  /** Mark it only on this exact path (react-router `end`). */
  end?: boolean;
  size?: ComponentSize;
  className?: string;
}

const ICON: Record<ComponentSize, string> = { xs: 'size-3.5', sm: 'size-4', md: 'size-4' };

// A quiet square icon-only link, filled while its route is open: shortcuts in a top bar. A button is `IconButton`.
export function IconLink({ to, label, icon: Icon, end, size = 'sm', className }: IconLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      title={label}
      className={({ isActive }) =>
        cn(
          'grid shrink-0 place-items-center rounded-md transition-colors hover:bg-ds-gray-100 hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          CONTROL_SQUARE[size],
          isActive ? 'bg-ds-gray-100 text-foreground' : 'text-muted-foreground',
          className,
        )
      }
    >
      <Icon className={ICON[size]} aria-hidden />
    </NavLink>
  );
}
