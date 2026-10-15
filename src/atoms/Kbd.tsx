import { cn } from '../lib/utils';

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn('rounded border border-border bg-ds-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground', className)}>
      {children}
    </kbd>
  );
}
