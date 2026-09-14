import type { BaseColumnSizing, DataTableColumn } from '../DataTable';
import { IdCell } from '../atoms/IdCell';

export type IdColumnProps = BaseColumnSizing & {
  label?: string;
  chars?: number;
};

export function IdColumn<D extends { id: string }>(props: IdColumnProps = {}): DataTableColumn<D> {
  const { label, chars, ...sizing } = props;
  return {
    key: 'id',
    header: label ?? 'ID',
    maxWidth: '125px',
    minWidth: '125px',
    ...sizing,
    getValue: (cell) => cell.row.data.id,
    render: ({ value }) => <IdCell id={value as string} chars={chars} />,
  };
}
