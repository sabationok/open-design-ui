import { cn } from '../lib/utils';

export function DetailSidePanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-r border-border bg-ds-background-200 p-6', className)}>
      {children}
    </div>
  );
}
