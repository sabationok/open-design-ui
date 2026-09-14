import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const BASE =
  'inline-flex items-center rounded-[4px] bg-vui-accent-bg px-1.5 py-0.5 font-mono text-[11px] text-vui-accent-text';

export function MonoChip({
  children,
  className,
  onClick,
  to,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  to?: string;
}) {
  const cls = cn(BASE, (onClick || to) && 'cursor-pointer hover:underline', className);

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} style={{ whiteSpace: 'nowrap' }}>
        {children}
      </Link>
    );
  }

  return (
    <span className={cls} onClick={onClick}>
      {children}
    </span>
  );
}
