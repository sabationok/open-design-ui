import { cn } from '../lib/utils';

export function MonoId({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('font-mono text-[16px] font-semibold text-zinc-900', className)}>
      {children}
    </span>
  );
}
