import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Button,
  Skeleton,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '..';
import { EmptyState } from '../molecules/EmptyState';
import type { DataTableCell, DataTableColumn, DataTableFilterKind } from './DataTable';
import { excelFilter, isFilterActive, valueKey, type ColumnFilterValue } from './features/filterFns';
import { FILTER_LABELS, FilterPopover, type FilterLabels } from './features/FilterPopover';
import { useStoredSizing } from './features/useStoredSizing';
import { useVirtualRows } from './features/useVirtualRows';

export const DATA_TABLE_LABELS = {
  count: (shown: number, total: number) => (shown === total ? `${total} rows` : `Showing ${shown} of ${total}`),
  resetFilters: 'Reset filters',
  noMatches: 'No rows match the filters',
  filterButton: 'Filter column',
  resize: 'Drag to resize, double-click to reset',
};
export type DataTableLabels = typeof DATA_TABLE_LABELS;

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
  /** Sort by a header click on every column with a value (`column.sortable` overrides). */
  sortable?: boolean;
  /** Excel-style funnel on every column with a value (`column.filter` picks the kind or turns it off). */
  filterable?: boolean;
  /** Drag a header edge to resize, double-click to reset. Default: on when `storageKey` is set. */
  resizable?: boolean;
  /** Remembers column widths in localStorage under `<storageKey>:sizing`. */
  storageKey?: string;
  /** Renders only the rows in view: rows get a fixed `rowHeight` and the body scrolls inside `height`. */
  virtual?: boolean;
  rowHeight?: number;
  /** Height of the scrolling body (default 70vh with `virtual`). */
  height?: CSSProperties['height'];
  rowClassName?: (row: T) => string | undefined;
  /** Content of the bar above the table, next to the row count (the bar shows with `filterable` or `toolbar`). */
  toolbar?: ReactNode;
  labels?: Partial<DataTableLabels> & { filter?: Partial<FilterLabels> };
}

type ColumnMeta<T extends { id: string }> = { col: DataTableColumn<T>; filter?: DataTableFilterKind };

const DEFAULT_SIZE = 150;

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
  sortable = false,
  filterable = false,
  resizable,
  storageKey,
  virtual = false,
  rowHeight = 40,
  height,
  rowClassName,
  toolbar,
  labels,
}: ShadcnDataTableProps<T>) {
  const canResize = resizable ?? !!storageKey;
  const text = { ...DATA_TABLE_LABELS, ...labels };
  const filterText = useMemo(() => ({ ...FILTER_LABELS, ...labels?.filter }), [labels?.filter]);
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible !== false),
    [columns],
  );

  const tanstackColumns = useMemo(
    (): ColumnDef<T>[] =>
      visibleColumns.map((col) => {
        // A plain `ancestor` column (not built by TableColumn) still gets a value to sort/filter on.
        const accessor =
          col.getValue ?? (col.ancestor ? ({ row }: DataTableCell<T>) => (row.data as Record<string, unknown>)[col.ancestor as string] : undefined);
        const filter = col.filter === false ? undefined : (col.filter ?? (filterable ? 'values' : undefined));
        return {
          id: col.key,
          header: col.header,
          ...(accessor && {
            accessorFn: (row, idx) => {
              const cellCtx: DataTableCell<T> = {
                row: { data: row, idx, isSelected: row.id === selectedId },
                coll: col,
              };
              return accessor(cellCtx);
            },
          }),
          enableSorting: !!accessor && (col.sortable ?? sortable),
          enableColumnFilter: !!accessor && !!filter,
          filterFn: excelFilter,
          size: col.size ?? (typeof col.width === 'number' ? col.width : DEFAULT_SIZE),
          meta: { col, filter } satisfies ColumnMeta<T>,
          cell: ({ row, getValue }) => {
            const cellCtx: DataTableCell<T> = {
              row: { data: row.original, idx: row.index, isSelected: row.original.id === selectedId },
              coll: col,
              value: getValue(),
            };
            return col.render(cellCtx);
          },
        };
      }),
    [visibleColumns, selectedId, sortable, filterable],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const sizing = useStoredSizing(storageKey);

  const table = useReactTable({
    data: loading ? [] : rows,
    columns: tanstackColumns,
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, ...sizing.state },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: sizing.onColumnSizingChange,
    onColumnSizingInfoChange: sizing.onColumnSizingInfoChange,
    enableColumnResizing: canResize,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const tableRows = table.getRowModel().rows;
  const scrollRef = useRef<HTMLDivElement>(null);
  const range = useVirtualRows(scrollRef, tableRows.length, rowHeight, virtual && !loading);
  const filtered = columnFilters.length > 0;
  // Resizable: a fixed layout from TanStack sizes; otherwise the columns' own CSS widths.
  const widthOf = (col: DataTableColumn<T> | undefined, size: number) =>
    canResize ? { width: size } : col ? colStyle(col) : undefined;
  const clip = canResize || virtual;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(filterable || toolbar) && (
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="tabular-nums text-muted-foreground">{text.count(tableRows.length, rows.length)}</span>
          {filtered && (
            <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
              {text.resetFilters}
            </Button>
          )}
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}
      <div
        ref={scrollRef}
        style={{ height: height ?? (virtual ? '70vh' : undefined) }}
        // A resizable table is as wide as its columns: the frame hugs it instead of leaving a blank strip.
        className={cn('overflow-auto rounded-md border border-border', canResize && 'w-fit max-w-full')}
      >
        <table
          className={cn(!canResize && 'w-full')}
          style={canResize ? { width: table.getTotalSize(), tableLayout: 'fixed' } : undefined}
        >
          <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10')}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border bg-ds-background-200 hover:bg-ds-gray-alpha-100"
              >
                {headerGroup.headers.map((header, i) => (
                  <HeaderCell
                    key={header.id}
                    header={header}
                    style={widthOf(visibleColumns[i], header.getSize())}
                    sticky={stickyFirstColumn && i === 0}
                    labels={text}
                    filterLabels={filterText}
                  />
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i} className={i % 2 === 1 ? 'bg-ds-background-200' : 'bg-background'}>
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
            ) : tableRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="p-0">
                  <EmptyState
                    title={filtered ? text.noMatches : emptyTitle}
                    description={filtered ? undefined : emptyDescription}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {range.padTop > 0 && <tr aria-hidden style={{ height: range.padTop }} />}
                {tableRows.slice(range.start, range.end).map((row, vi) => {
                  const i = range.start + vi;
                  const isSelected = row.original.id === selectedId;
                  return (
                    <TableRow
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      data-selected={isSelected || undefined}
                      className={cn(
                        'group border-b border-ds-gray-alpha-200 last:border-0 text-[13px] transition-colors',
                        i % 2 === 1 ? 'bg-ds-background-200' : 'bg-background',
                        onRowClick && 'cursor-pointer hover:bg-ds-gray-alpha-200',
                        isSelected && 'bg-ds-gray-100',
                        rowClassName?.(row.original),
                      )}
                      style={{
                        ...(virtual && { height: rowHeight }),
                        ...(isSelected && { boxShadow: 'inset 2px 0 0 var(--ds-gray-1000)' }),
                      }}
                    >
                      {row.getVisibleCells().map((cell, ci) => {
                        const col = visibleColumns[ci];
                        return (
                          <TableCell
                            key={cell.id}
                            style={widthOf(col, cell.column.getSize())}
                            title={clip ? valueKey(cell.getValue()) || undefined : undefined}
                            className={cn(
                              'px-3.5',
                              virtual ? 'py-0' : 'py-[11px]',
                              clip && 'overflow-hidden text-ellipsis',
                              col?.align === 'right' && 'text-right font-mono tabular-nums',
                              stickyFirstColumn && ci === 0 && cn(
                                'sticky left-0 z-[1] shadow-[1px_0_0_var(--ds-gray-alpha-400)]',
                                i % 2 === 1 ? 'bg-ds-background-200' : 'bg-background',
                                // Sticky cells sit over scrolled content — hover bg must be opaque, not an alpha tint.
                                'group-hover:bg-ds-gray-100',
                                isSelected && 'bg-ds-gray-100',
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
                })}
                {range.padBottom > 0 && <tr aria-hidden style={{ height: range.padBottom }} />}
              </>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}

function HeaderCell<T extends { id: string }>({ header, style, sticky, labels, filterLabels }: {
  header: Header<T, unknown>;
  style: CSSProperties | undefined;
  sticky: boolean;
  labels: DataTableLabels;
  filterLabels: FilterLabels;
}) {
  const { column } = header;
  const { col, filter } = column.columnDef.meta as ColumnMeta<T>;
  const sorted = column.getIsSorted();
  const active = isFilterActive(column.getFilterValue() as ColumnFilterValue | undefined);
  const right = col.align === 'right';
  const funnel = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<DOMRect | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const label = flexRender(column.columnDef.header, header.getContext());

  return (
    <TableHead
      style={style}
      className={cn(
        'relative h-auto px-3.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground bg-ds-background-200',
        sticky && 'sticky left-0 z-[1] shadow-[1px_0_0_var(--ds-gray-alpha-400)]',
        col.className,
      )}
    >
      <div className={cn('flex items-center gap-1', right && 'flex-row-reverse')}>
        {column.getCanSort() ? (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className={cn('flex min-w-0 cursor-pointer items-center gap-1 uppercase hover:text-foreground', right && 'flex-row-reverse')}
          >
            <span className="truncate">{label}</span>
            {sorted === 'asc' && <ArrowUp className="size-3 shrink-0" />}
            {sorted === 'desc' && <ArrowDown className="size-3 shrink-0" />}
          </button>
        ) : (
          <span className="truncate">{label}</span>
        )}
        {column.getCanFilter() && filter && (
          <button
            ref={funnel}
            type="button"
            aria-label={labels.filterButton}
            title={labels.filterButton}
            aria-expanded={!!open}
            onClick={(e) => setOpen(open ? null : e.currentTarget.getBoundingClientRect())}
            className={cn(
              'grid size-5 shrink-0 cursor-pointer place-items-center rounded-sm transition-colors hover:bg-ds-gray-alpha-200',
              right ? 'mr-auto' : 'ml-auto',
              active ? 'bg-ds-blue-200 text-ds-blue-900' : 'text-ds-gray-700',
            )}
          >
            <Filter className="size-3" fill={active ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      {open && filter && (
        <FilterPopover column={column} kind={filter} anchor={funnel} anchorRect={open} labels={filterLabels} onClose={close} />
      )}
      {column.getCanResize() && (
        <div
          role="separator"
          aria-orientation="vertical"
          title={labels.resize}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => column.resetSize()}
          className={cn(
            'absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none select-none hover:bg-ds-gray-alpha-400',
            column.getIsResizing() && 'bg-ds-gray-1000',
          )}
        />
      )}
    </TableHead>
  );
}
