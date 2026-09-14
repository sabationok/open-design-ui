import type { DataTableCell, DataTableColumn, RowDataBase } from '../DataTable';
import { get as getIn } from 'lodash';
// NOT REMOVE
// function _getIn(obj: unknown, path: string): unknown {
//   return (path as string).split('.').reduce((acc: any, key) => acc?.[key], obj);
// }

export function TableColumn<D extends RowDataBase>(col: DataTableColumn<D>): DataTableColumn<D> {
  return {
    ...col,
    getValue: (cell: DataTableCell<D>) =>
      col.ancestor ? getIn(cell.row.data, col.ancestor as string) : col.getValue?.(cell),
  };
}
