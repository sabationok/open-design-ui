import { DateCell, type DateFormat } from '../atoms/DateCell';
import type { DataTableColumn, RowDataBase } from '../DataTable';

interface HasTimestamps {
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export type DateColumnProps<D extends RowDataBase = RowDataBase> = Omit<DataTableColumn<D>, 'render'> & {
  format?: DateFormat;
};

export function DateColumn<D extends RowDataBase = RowDataBase>({
  format = 'time-s',
  ...props
}: DateColumnProps<D>): DataTableColumn<D> {
  return {
    ...props,
    render: ({ value }) => (
      <DateCell value={value as string | number | null | undefined} format={format} />
    ),
  };
}
type ShortedProps = { header?: string; key?: string; format?: DateFormat };

export function CreatedAtColumn<T extends HasTimestamps = HasTimestamps>(props: ShortedProps = {}) {
  return DateColumn<T>({
    key: 'createdAt',
    header: 'Created',
    ...props,
    ancestor: 'createdAt',
  });
}
export function DeletedAtColumn<T extends HasTimestamps = HasTimestamps>(props: ShortedProps = {}) {
  return DateColumn<T>({
    key: 'deletedAt',
    header: 'Deleted',
    ...props,
    ancestor: 'deletedAt',
  });
}
export function UpdatedAtColumn<T extends HasTimestamps = HasTimestamps>(props: ShortedProps = {}) {
  return DateColumn<T>({
    key: 'updatedAt',
    header: 'Updated',
    ...props,
    ancestor: 'updatedAt',
  });
}
