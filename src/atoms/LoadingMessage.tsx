import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export type LoadingMessageVariant = 'card' | 'inline';

export interface LoadingMessageProps {
  /** Alias of `msg`; wins when both are set. */
  label?: ReactNode;
  msg?: ReactNode;
  /** "card" fills a page area with a centered card; "inline" is a spinner row inside a list or panel. */
  variant?: LoadingMessageVariant;
  className?: string;
}

export function LoadingMessage({ label, msg, variant = 'card', className }: LoadingMessageProps) {
  const text = label ?? msg ?? 'Loading…';
  if (variant === 'inline') {
    return (
      <div role="status" className={cn('flex items-center justify-center gap-2 py-10 text-[13px] text-ds-gray-700', className)}>
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {text}
      </div>
    );
  }
  return (
    <div role="status" className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-ds-gray-alpha-200 bg-background px-10 py-8 text-center shadow-ds-small">
        <span className="text-sm text-ds-gray-700">{text}</span>
      </div>
    </div>
  );
}
