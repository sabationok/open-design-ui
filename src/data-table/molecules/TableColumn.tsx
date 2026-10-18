import type { DataTableCell, DataTableColumn, RowDataBase } from '../DataTable';

// Dot/bracket path accessor ("a.b", "items[0].email") — replaces lodash `get` for this one use.
function getIn(obj: unknown, path: string): unknown {
  return path
    .split(/[.[\]]+/)
    .filter(Boolean)
    .reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]), obj);
}

export function TableColumn<D extends RowDataBase>(col: DataTableColumn<D>): DataTableColumn<D> {
  return {
    ...col,
    getValue: (cell: DataTableCell<D>) =>
      col.ancestor ? getIn(cell.row.data, col.ancestor as string) : col.getValue?.(cell),
  };
}
