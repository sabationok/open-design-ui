import { cn } from '../lib/utils';

export function MetaLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <dt className={cn('text-[11px] text-muted-foreground', className)}>
      {children}
    </dt>
  );
}
