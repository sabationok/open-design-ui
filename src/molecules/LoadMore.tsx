import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Note } from './Note';

export const LOAD_MORE_LABELS = {
  loading: 'Loading',
  retry: 'Try again',
  failed: "Couldn't load the next page",
};

export type LoadMoreLabels = typeof LOAD_MORE_LABELS;

/** Shape-compatible with a react-query `useInfiniteQuery` result — spread it in directly. */
export interface LoadMoreProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
  /** false pauses auto-loading (e.g. a search view that loads everything at once). */
  enabled?: boolean;
  labels?: Partial<LoadMoreLabels>;
  className?: string;
}

// Infinite-scroll footer: loads the next page when it scrolls into view, shows a spinner while
// loading and a retry note on failure. A failed page is not retried automatically.
export function LoadMore({
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
  enabled = true,
  labels,
  className,
}: LoadMoreProps) {
  const text = { ...LOAD_MORE_LABELS, ...labels };
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) void fetchNextPage();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  return (
    <div ref={ref} className={cn('flex min-h-8 items-center justify-center py-3', className)}>
      {enabled && isFetchingNextPage && (
        <Loader2 role="status" className="size-4 animate-spin text-ds-gray-700" aria-label={text.loading} />
      )}
      {enabled && isFetchNextPageError && (
        <Note
          tone="danger"
          className="w-full"
          action={
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              className="rounded-md border border-vui-danger-border px-2 py-0.5 text-xs transition-colors hover:bg-ds-gray-alpha-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {text.retry}
            </button>
          }
        >
          {text.failed}
        </Note>
      )}
    </div>
  );
}
