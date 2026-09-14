import {cn} from '../lib/utils';

export function ErrorMessage({ code, msg, className }: { code?: number; msg?: string; className?: string }) {
  return (
    <div className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-red-100 bg-white px-10 py-8 text-center shadow-[0_1px_4px_0_rgb(0,0,0,0.04)]">
        {code != null && (
          <div className="mb-1 font-mono text-[13px] text-zinc-400">{code}</div>
        )}
        <span className="text-sm text-red-500">{msg ?? 'Something went wrong'}</span>
      </div>
    </div>
  );
}
