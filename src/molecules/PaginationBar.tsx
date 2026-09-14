const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total?: number;
  noun?: string;
  onPrev(): void;
  onNext(): void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function PaginationBar({
  page,
  totalPages,
  total,
  noun,
  onPrev,
  onNext,
  pageSize,
  onPageSizeChange,
  className,
}: PaginationBarProps) {
  return (
    <div className={`mt-3.5 flex items-center justify-between gap-3 ${className ?? ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-zinc-500">
          Page {page + 1} of {totalPages}
          {total != null && noun ? ` · ${total.toLocaleString()} ${noun}` : ''}
        </span>
        {onPageSizeChange && pageSize !== undefined && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-[13px] text-zinc-600 hover:bg-zinc-50"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={page === 0}
          onClick={onPrev}
          className="rounded-md border border-zinc-200 px-3 py-1.5 text-[13px] text-zinc-600 disabled:text-zinc-300 hover:bg-zinc-50"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={onNext}
          className="rounded-md border border-zinc-200 px-3 py-1.5 text-[13px] text-zinc-900 disabled:text-zinc-300 hover:bg-zinc-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
