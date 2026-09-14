import { type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { EmptyState } from '../molecules/EmptyState';

export type RowDataBase = Record<string, any>;
export type TableDataBase<D extends RowDataBase = RowDataBase> = D[];
export type SharedCtx = {
  isVisible?: boolean;
  isNested?: boolean;
  idx?: number;
  isSelected?: boolean;
  className?: string;
};
export type RowSharedCtx<D extends RowDataBase = RowDataBase> = Record<string, any> &
  SharedCtx & {
    data: D;
  };
export type BaseColumnSizing = {
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
};
export interface DataTableColumn<T> extends SharedCtx, BaseColumnSizing {
  key: string;
  header: string;
  /** false → column is skipped at render time; call site keeps the full columns array intact */
  visible?: boolean;
  render: (cell: DataTableCell<T>) => ReactNode;
  getValue?: (cell: DataTableCell<T>) => unknown;
  ancestor?: keyof T;
}

export type DataTableCell<D extends RowDataBase = RowDataBase> = {
  row: RowSharedCtx<D>;
  coll: DataTableColumn<D>;
  value?: unknown;
};

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  skeletonRows?: number;
  selectedId?: string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3.5 py-[13px]">
          <span
            className="block h-2.5 rounded-[3px] animate-wy-shimmer"
            style={{ width: `${60 + (i % 3) * 15}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading = false,
  skeletonRows = 4,
  selectedId,
  onRowClick,
  emptyTitle = 'No results',
  emptyDescription,
  className,
  stickyHeader = true,
  stickyFirstColumn = true,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col) => col.visible !== false);

  const colStyle = (col: DataTableColumn<T>) => ({
    width: col.width,
    minWidth: col.minWidth,
    maxWidth: col.maxWidth,
  });

  return (
    <div className={cn('overflow-auto rounded-md border border-zinc-200', className)}>
      <table className="w-full">
        <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            {visibleColumns.map((col, i) => (
              <th
                key={col.key}
                style={colStyle(col)}
                className={cn(
                  'px-3.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-zinc-500 bg-zinc-50',
                  stickyFirstColumn && i === 0 && 'sticky left-0 z-[1] shadow-[1px_0_0_#e4e4e7]',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} cols={visibleColumns.length} />
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const isSelected = row.id === selectedId;
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-zinc-100 last:border-0 text-[13px] transition-colors',
                    i % 2 === 1 ? 'bg-zinc-50' : 'bg-white',
                    onRowClick && 'cursor-pointer hover:bg-zinc-100',
                    isSelected && 'bg-zinc-100',
                  )}
                  style={isSelected ? { boxShadow: 'inset 2px 0 0 #18181b' } : undefined}
                >
                  {visibleColumns.map((col, ci) => {
                    const cellCtx: DataTableCell<T> = {
                      row: { data: row, idx: i, isSelected },
                      coll: col,
                    };
                    cellCtx.value = col.getValue?.(cellCtx);
                    return (
                      <td
                        key={col.key}
                        style={colStyle(col)}
                        className={cn(
                          'px-3.5 py-[11px]',
                          stickyFirstColumn && ci === 0 && 'sticky left-0 bg-inherit shadow-[1px_0_0_#e4e4e7]',
                          col.className,
                        )}
                      >
                        {col.render(cellCtx)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
