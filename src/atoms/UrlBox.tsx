import { cn } from '../lib/utils';

export function UrlBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('break-all rounded-[4px] border border-zinc-200 bg-white px-2.5 py-2 font-mono text-[12px] text-zinc-900', className)}>
      {children}
    </div>
  );
}
