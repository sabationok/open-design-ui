import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MonoChip } from '../../atoms';
import type { DataTableColumn, RowDataBase } from '../DataTable';

export type LinkColumnVariant = 'chip' | 'text';

export type LinkColumnProps<D extends RowDataBase = RowDataBase> = Partial<Omit<DataTableColumn<D>, 'render'>> & {
  href: (id: string, row: D) => string;
  chars?: number;
  label?: (id: string, row: D) => ReactNode;
  variant?: LinkColumnVariant;
};

const EMPTY = <span className="text-[12px] text-zinc-400">—</span>;

export function LinkColumn<D extends RowDataBase = RowDataBase>({
  href,
  chars = 12,
  label,
  variant = 'chip',
  ...props
}: LinkColumnProps<D>): DataTableColumn<D> {
  return {
    key: 'linkColl',
    header: 'Link',
    ...props,
    render: ({ value, row }) => {
      if (!value) return EMPTY;
      const id = value as string;
      const content = label ? label(id, row.data) : `${id.slice(0, chars)} →`;
      const to = href(id, row.data);

      if (variant === 'text') {
        return (
          <Link
            to={to}
            onClick={(e) => e.stopPropagation()}
            className="text-[12px] text-indigo-600 hover:underline"
          >
            {content}
          </Link>
        );
      }

      return (
        <MonoChip to={to} onClick={(e) => e.stopPropagation()}>
          {content}
        </MonoChip>
      );
    },
  };
}
