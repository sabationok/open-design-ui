import { cn } from '../lib/utils';

export function UrlBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('break-all rounded-[4px] border border-border bg-background px-2.5 py-2 font-mono text-[12px] text-foreground', className)}>
      {children}
    </div>
  );
}
