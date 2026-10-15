import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export type SidebarNavLinkProps = {
  to: string;
  end?: boolean;
  icon: React.ElementType;
  disabled?: boolean;
  children: React.ReactNode;
};

export function SidebarNavLink({ to, end, icon: Icon, disabled, children }: SidebarNavLinkProps) {
  if (disabled) {
    return (
      <span className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-sm text-ds-gray-700">
        <Icon className="h-4 w-4 shrink-0" />
        {children}
      </span>
    );
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-ds-gray-100 font-medium text-foreground'
            : 'text-muted-foreground hover:bg-ds-gray-alpha-100 hover:text-foreground',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {children}
    </NavLink>
  );
}
