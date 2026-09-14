import { cn } from '../lib/utils';

export function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[12px] font-semibold text-zinc-600">{label}</label>
      {children}
    </div>
  );
}
