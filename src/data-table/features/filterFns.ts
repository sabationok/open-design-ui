import type { FilterFn } from '@tanstack/react-table';

// One column's filter. Values are kept as an exclusion list, so values that appear later
// (another column's filter relaxed) stay visible, as in Excel.
export type ColumnFilterValue = {
  excluded?: string[];
  text?: string;
  min?: string;
  max?: string;
};

type Resolved = ColumnFilterValue & { excludedSet?: Set<string>; textLower?: string };

// The comparable text of a cell value: what the values list shows and the exclusion list keeps.
export function valueKey(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(valueKey).filter(Boolean).join(' › ');
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export const isFilterActive = (f: ColumnFilterValue | undefined): boolean =>
  !!f && (!!f.excluded?.length || !!f.text || !!f.min || !!f.max);

// Range bounds compare numbers as numbers and anything else (ISO dates) as strings; a date bound
// "2026-10-01" matches "2026-10-01T…" through the prefix.
function inRange(v: unknown, min?: string, max?: string): boolean {
  if (v == null || v === '') return false;
  if (typeof v === 'number') {
    if (min && v < Number(min)) return false;
    if (max && v > Number(max)) return false;
    return true;
  }
  const s = valueKey(v);
  if (min && s < min) return false;
  if (max && s.slice(0, max.length) > max) return false;
  return true;
}

// The one filterFn of every column; `resolveFilterValue` builds the Set once per filter change,
// not once per row.
export const excelFilter: FilterFn<any> = (row, columnId, filter: Resolved) => {
  const v = row.getValue(columnId);
  if (filter.excludedSet?.size && filter.excludedSet.has(valueKey(v))) return false;
  if (filter.textLower && !valueKey(v).toLowerCase().includes(filter.textLower)) return false;
  if ((filter.min || filter.max) && !inRange(v, filter.min, filter.max)) return false;
  return true;
};
excelFilter.resolveFilterValue = (f: ColumnFilterValue): Resolved => ({
  ...f,
  excludedSet: f.excluded?.length ? new Set(f.excluded) : undefined,
  textLower: f.text?.trim().toLowerCase() || undefined,
});
excelFilter.autoRemove = (f: ColumnFilterValue | undefined) => !isFilterActive(f);

export type FacetValue = { key: string; count: number };

// A column's distinct values (`getFacetedUniqueValues()`: among the rows the other filters keep),
// sorted as Excel does: numbers by value, text alphabetically, empty last.
export function facetValues(facets: Map<unknown, number>): FacetValue[] {
  const counts = new Map<string, number>();
  let numeric = true;
  for (const [v, n] of facets) {
    const key = valueKey(v);
    if (v != null && v !== '' && typeof v !== 'number') numeric = false;
    counts.set(key, (counts.get(key) ?? 0) + n);
  }
  const list = [...counts].map(([key, count]) => ({ key, count }));
  return list.sort((a, b) => {
    if (!a.key || !b.key) return a.key ? -1 : b.key ? 1 : 0;
    return numeric ? Number(a.key) - Number(b.key) : a.key.localeCompare(b.key, undefined, { numeric: true });
  });
}

// `range` inputs: number for numeric columns, date for the rest.
export function rangeInputType(facets: Map<unknown, number>): 'number' | 'date' {
  for (const v of facets.keys()) if (v != null && v !== '') return typeof v === 'number' ? 'number' : 'date';
  return 'number';
}
