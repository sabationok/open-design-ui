import type { DataTableColumn, RowDataBase } from '../DataTable';
import { MonoCell } from '../atoms/MonoCell';

export type MonoColumnProps<D extends RowDataBase = RowDataBase> = Omit<DataTableColumn<D>, 'render'> & {
  fallback?: string;
};

export function MonoColumn<D extends RowDataBase = RowDataBase>({
  fallback,
  ...props
}: MonoColumnProps<D>): DataTableColumn<D> {
  return {
    ...props,
    render: ({ value = '— — —' }) => (
      <MonoCell fallback={fallback}>
        {(value as string | number | null | undefined) ?? undefined}
      </MonoCell>
    ),
  };
}
