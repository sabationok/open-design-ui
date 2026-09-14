import { cn } from '../lib/utils';

export function PageHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 border-b border-zinc-200 px-6 py-4', className)}>
      {children}
    </div>
  );
}
