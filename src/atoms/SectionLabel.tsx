import { cn } from '../lib/utils';

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-3.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-zinc-400', className)}>
      {children}
    </div>
  );
}
