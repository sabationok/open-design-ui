import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

export type ErrorMessageVariant = 'card' | 'inline';

export interface ErrorMessageProps {
  /** Short headline. Alias of `msg`; wins when both are set. */
  title?: ReactNode;
  msg?: ReactNode;
  /** Detail under the headline, e.g. the server's message. */
  error?: ReactNode;
  /** Status code shown above the headline (card variant). */
  code?: number;
  /** Shows a retry button when set. */
  onRetry?: () => void;
  retryLabel?: string;
  /** "card" fills a page area with a centered card; "inline" is a danger note inside a list or panel. */
  variant?: ErrorMessageVariant;
  className?: string;
}

export function ErrorMessage({
  title,
  msg,
  error,
  code,
  onRetry,
  retryLabel = 'Retry',
  variant = 'card',
  className,
}: ErrorMessageProps) {
  const heading = title ?? msg ?? 'Something went wrong';
  const retry = onRetry && (
    <Button type="button" variant="destructive" size="sm" onClick={onRetry}>
      {retryLabel}
    </Button>
  );

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={cn(
          'flex items-start gap-2.5 rounded-md border border-vui-danger-border bg-vui-danger-bg px-3 py-2.5 text-[13px] text-vui-danger-text',
          className,
        )}
      >
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-medium">{heading}</p>
          {error && <div className="mt-0.5 opacity-90">{error}</div>}
        </div>
        {retry && <div className="shrink-0">{retry}</div>}
      </div>
    );
  }

  return (
    <div role="alert" className={cn('flex w-full flex-1 items-center justify-center p-6', className)}>
      <div className="rounded-xl border border-ds-red-400 bg-background px-10 py-8 text-center shadow-ds-small">
        {code != null && <div className="mb-1 font-mono text-[13px] text-ds-gray-700">{code}</div>}
        <span className="text-sm text-ds-red-900">{heading}</span>
        {error && <div className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">{error}</div>}
        {retry && <div className="mt-3">{retry}</div>}
      </div>
    </div>
  );
}
