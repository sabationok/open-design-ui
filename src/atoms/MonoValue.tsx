import { cn } from '../lib/utils';

export function MonoValue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('font-mono text-[12px] text-muted-foreground', className)}>
      {children}
    </span>
  );
}
