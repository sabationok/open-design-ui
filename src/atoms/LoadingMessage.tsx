import { cn } from '../lib/utils';

export function LoadingMessage({ msg, className }: { msg?: string; className?: string }) {
  return (
    <div className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-ds-gray-alpha-200 bg-background px-10 py-8 text-center shadow-ds-small">
        <span className="text-sm text-ds-gray-700">{msg ?? 'Loading…'}</span>
      </div>
    </div>
  );
}
