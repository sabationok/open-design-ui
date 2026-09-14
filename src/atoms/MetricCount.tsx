import { cn } from '../lib/utils';

export function MetricCount({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-[18px] font-bold text-zinc-900', className)}>
      {children}
    </span>
  );
}
