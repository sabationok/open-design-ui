import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { Column } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import type { DataTableFilterKind } from '../DataTable';
import { facetValues, rangeInputType, type ColumnFilterValue } from './filterFns';

export const FILTER_LABELS = {
  selectAll: 'Select all',
  search: 'Search values',
  contains: 'Contains',
  from: 'From',
  to: 'To',
  empty: '(empty)',
  clear: 'Clear',
  more: (n: number) => `${n} more — narrow the search`,
  nothing: 'No matches',
};
export type FilterLabels = typeof FILTER_LABELS;

// A list of 5000 checkboxes is the slow part of the popover; past this the search narrows it.
const LIST_LIMIT = 200;
const POPOVER_WIDTH = 288; // w-72

// The Excel-style filter of one column, in a portal: the table's scroll container would clip it.
export function FilterPopover<T>({ column, kind, anchor, anchorRect, labels, onClose }: {
  column: Column<T, unknown>;
  kind: DataTableFilterKind;
  anchor: RefObject<HTMLElement | null>;
  /** Where the funnel was when clicked; the popover closes on scroll, so it never follows it. */
  anchorRect: DOMRect;
  labels: FilterLabels;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, anchor, onClose);

  const filter = (column.getFilterValue() as ColumnFilterValue | undefined) ?? {};
  const set = (patch: Partial<ColumnFilterValue>) => column.setFilterValue({ ...filter, ...patch });

  const facets = column.getFacetedUniqueValues();
  const values = useMemo(() => facetValues(facets), [facets]);
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? values.filter((v) => (v.key || labels.empty).toLowerCase().includes(q)) : values;
  }, [values, query, labels.empty]);

  const excluded = new Set(filter.excluded);
  const allOn = shown.every((v) => !excluded.has(v.key));
  const someOn = shown.some((v) => !excluded.has(v.key));
  // «Select all» acts on what the search shows, as in Excel.
  const toggleAll = () => {
    const next = new Set(excluded);
    for (const v of shown) if (allOn) next.add(v.key); else next.delete(v.key);
    set({ excluded: [...next] });
  };
  const toggle = (key: string) => {
    const next = new Set(excluded);
    if (next.has(key)) next.delete(key); else next.add(key);
    set({ excluded: [...next] });
  };

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      style={{
        top: anchorRect.bottom + 4,
        left: Math.max(8, Math.min(anchorRect.left, window.innerWidth - POPOVER_WIDTH - 8)),
      }}
      className="fixed z-50 flex w-72 flex-col gap-2 rounded-lg border border-border bg-background p-2 text-[13px] shadow-ds-medium"
    >
      {kind === 'text' && (
        <Input
          autoFocus
          placeholder={labels.contains}
          value={filter.text ?? ''}
          onChange={(e) => set({ text: e.target.value })}
        />
      )}
      {kind === 'range' && (
        <div className="grid grid-cols-2 gap-2">
          {(['min', 'max'] as const).map((bound) => (
            <Input
              key={bound}
              type={rangeInputType(facets)}
              aria-label={bound === 'min' ? labels.from : labels.to}
              placeholder={bound === 'min' ? labels.from : labels.to}
              value={filter[bound] ?? ''}
              onChange={(e) => set({ [bound]: e.target.value })}
            />
          ))}
        </div>
      )}
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus={kind === 'values'}
          placeholder={labels.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-7"
        />
      </label>
      <div className="max-h-64 overflow-y-auto rounded-md border border-border py-1">
        {shown.length ? (
          <>
            <ValueRow label={labels.selectAll} checked={allOn} indeterminate={!allOn && someOn} onChange={toggleAll} strong />
            {shown.slice(0, LIST_LIMIT).map((v) => (
              <ValueRow
                key={v.key}
                label={v.key || labels.empty}
                count={v.count}
                checked={!excluded.has(v.key)}
                onChange={() => toggle(v.key)}
              />
            ))}
            {shown.length > LIST_LIMIT && (
              <p className="px-2 py-1 text-xs text-muted-foreground">{labels.more(shown.length - LIST_LIMIT)}</p>
            )}
          </>
        ) : (
          <p className="px-2 py-1 text-xs text-muted-foreground">{labels.nothing}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => column.setFilterValue(undefined)} disabled={!column.getIsFiltered()}>
          {labels.clear}
        </Button>
      </div>
    </div>,
    document.body,
  );
}

function ValueRow({ label, count, checked, indeterminate, onChange, strong }: {
  label: string;
  count?: number;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 hover:bg-ds-gray-alpha-100">
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onChange={onChange}
        wrapperClassName="min-w-0 flex-1 text-[13px]"
        label={<span className={strong ? 'block truncate font-medium' : 'block truncate'} title={label}>{label}</span>}
      />
      {count != null && <span className="font-mono text-xs tabular-nums text-muted-foreground">{count}</span>}
    </div>
  );
}

// Closes on a click outside, Escape, or a scroll of the page/table (the fixed popover would drift).
function useDismiss(popover: RefObject<HTMLElement | null>, anchor: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const isInside = (t: EventTarget | null) => [popover, anchor].some((r) => r.current?.contains(t as Node));
    const down = (e: MouseEvent) => !isInside(e.target) && onClose();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const scroll = (e: Event) => !isInside(e.target) && onClose();
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', scroll, true);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', scroll, true);
    };
  }, [popover, anchor, onClose]);
}
