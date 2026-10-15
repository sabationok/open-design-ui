import {cn} from '../lib/utils';

export function ErrorMessage({ code, msg, className }: { code?: number; msg?: string; className?: string }) {
  return (
    <div className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-ds-red-400 bg-background px-10 py-8 text-center shadow-ds-small">
        {code != null && (
          <div className="mb-1 font-mono text-[13px] text-ds-gray-700">{code}</div>
        )}
        <span className="text-sm text-ds-red-900">{msg ?? 'Something went wrong'}</span>
      </div>
    </div>
  );
}
