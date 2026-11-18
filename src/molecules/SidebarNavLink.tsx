import type { ElementType, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export type SidebarNavLinkProps = {
  to: string;
  end?: boolean;
  /** Optional leading icon (any component taking `className`). */
  icon?: ElementType;
  disabled?: boolean;
  /** Label; may include trailing extras (badge, count) — they lay out in a flex row. */
  children: ReactNode;
  className?: string;
};

const BASE = 'flex min-h-8 items-center gap-2.5 rounded-md px-2.5 py-[7px] text-sm';

// Sidebar link: gray pill when active, no accent colour (Geist navigation).
export function SidebarNavLink({ to, end, icon: Icon, disabled, children, className }: SidebarNavLinkProps) {
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      <span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
    </>
  );
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(BASE, 'cursor-not-allowed select-none text-ds-gray-700', className)}>
        {content}
      </span>
    );
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          BASE,
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-ds-gray-100 font-medium text-foreground'
            : 'text-muted-foreground hover:bg-ds-gray-alpha-100 hover:text-foreground',
          className,
        )
      }
    >
      {content}
    </NavLink>
  );
}

/** App-facing alias (fintrack `NavItem`): identical component and props. */
export const NavItem = SidebarNavLink;
export type NavItemProps = SidebarNavLinkProps;
