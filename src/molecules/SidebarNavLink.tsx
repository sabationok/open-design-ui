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
      <span className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] text-zinc-400">
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
          'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors',
          isActive
            ? 'mx-[-2px] bg-[#ecebff] font-medium text-[#4338ca] shadow-[inset_2px_0_0_#635BFF]'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {children}
    </NavLink>
  );
}
