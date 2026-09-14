import { cn } from '../lib/utils';

export function TabButton({ active, onClick, children }: { active: boolean; onClick(): void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3.5 py-2.5 text-[13px] capitalize transition-colors',
        active
          ? 'font-semibold text-zinc-900 shadow-[inset_0_-2px_0_#18181b]'
          : 'text-zinc-500 hover:text-zinc-900',
      )}
    >
      {children}
    </button>
  );
}
