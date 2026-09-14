import { cn } from '../lib/utils';

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-[16px] font-semibold text-zinc-900', className)}>
      {children}
    </span>
  );
}
