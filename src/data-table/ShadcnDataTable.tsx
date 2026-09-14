import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { cn } from '../lib/utils';
import {
  Skeleton,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '..';
import { EmptyState } from '../molecules/EmptyState';
import type { DataTableCell, DataTableColumn } from './DataTable';

export interface ShadcnDataTableProps<T extends { id: string }> {
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

function colStyle(col: DataTableColumn<any>) {
  return { width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth };
}

export function ShadcnDataTable<T extends { id: string }>({
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
}: ShadcnDataTableProps<T>) {
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns],
  );

  const tanstackColumns = useMemo(
    (): ColumnDef<T>[] =>
      visibleColumns.map((col) => ({
        id: col.key,
        header: col.header,
        ...(col.getValue && {
          accessorFn: (row, idx) => {
            const cellCtx: DataTableCell<T> = {
              row: { data: row, idx, isSelected: row.id === selectedId },
              coll: col,
            };
            return col.getValue!(cellCtx);
          },
        }),
        cell: ({ row, getValue }) => {
          const cellCtx: DataTableCell<T> = {
            row: { data: row.original, idx: row.index, isSelected: row.original.id === selectedId },
            coll: col,
            value: getValue(),
          };
          return col.render(cellCtx);
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns, selectedId],
  );

  const table = useReactTable({
    data: loading ? [] : rows,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn('overflow-auto rounded-md border border-zinc-200', className)}>
      <table className="w-full">
        <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-zinc-200 bg-zinc-50 hover:bg-zinc-50"
            >
              {headerGroup.headers.map((header, i) => {
                const col = visibleColumns[i];
                return (
                  <TableHead
                    key={header.id}
                    style={colStyle(col)}
                    className={cn(
                      'h-auto px-3.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-zinc-500 bg-zinc-50',
                      stickyFirstColumn && i === 0 && 'sticky left-0 z-[1] shadow-[1px_0_0_#e4e4e7]',
                      col?.className,
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i} className={i % 2 === 1 ? 'bg-zinc-50' : 'bg-white'}>
                {visibleColumns.map((col, ci) => (
                  <TableCell key={col.key} style={colStyle(col)} className="px-3.5 py-[13px]">
                    <Skeleton
                      className="h-2.5 rounded-[3px]"
                      style={{ width: `${60 + (ci % 3) * 15}%` }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="p-0">
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, i) => {
              const isSelected = row.original.id === selectedId;
              return (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  data-selected={isSelected || undefined}
                  className={cn(
                    'group border-b border-zinc-100 last:border-0 text-[13px] transition-colors',
                    i % 2 === 1 ? 'bg-zinc-50' : 'bg-white',
                    onRowClick && 'cursor-pointer hover:bg-zinc-100',
                    isSelected && 'bg-zinc-100',
                  )}
                  style={isSelected ? { boxShadow: 'inset 2px 0 0 #18181b' } : undefined}
                >
                  {row.getVisibleCells().map((cell, ci) => {
                    const col = visibleColumns[ci];
                    return (
                      <TableCell
                        key={cell.id}
                        style={colStyle(col)}
                        className={cn(
                          'px-3.5 py-[11px]',
                          stickyFirstColumn && ci === 0 && cn(
                            'sticky left-0 shadow-[1px_0_0_#e4e4e7]',
                            i % 2 === 1 ? 'bg-zinc-50' : 'bg-white',
                            onRowClick ? 'group-hover:bg-zinc-100' : 'group-hover:bg-muted/50',
                            isSelected && 'bg-zinc-100',
                          ),
                          col?.className,
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </table>
    </div>
  );
}
