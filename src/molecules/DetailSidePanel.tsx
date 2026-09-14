import { cn } from '../lib/utils';

export function DetailSidePanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-r border-zinc-200 bg-zinc-50 p-6', className)}>
      {children}
    </div>
  );
}
