import { cn } from '../lib/utils';

export function LoadingMessage({ msg, className }: { msg?: string; className?: string }) {
  return (
    <div className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-zinc-100 bg-white px-10 py-8 text-center shadow-[0_1px_4px_0_rgb(0,0,0,0.04)]">
        <span className="text-sm text-zinc-400">{msg ?? 'Loading…'}</span>
      </div>
    </div>
  );
}
