import { cn } from '../lib/utils';

export type IssueLevel = 'error' | 'warn';
export interface Issue {
  level: IssueLevel;
  reason: string;
}

export interface IssueEdgeProps {
  issues: Issue[];
  className?: string;
}

/**
 * A row's right edge split in two: errors on top in red, notes below in amber; the words are in IssueList.
 * Nothing when empty. Positioned on the nearest `relative` row. Decorative: pair it with IssueList or a label.
 */
export function IssueEdge({ issues, className }: IssueEdgeProps) {
  if (!issues.length) return null;
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-y-0 right-0 flex w-[3px] flex-col', className)}>
      <span className={cn('flex-1', issues.some((i) => i.level === 'error') && 'bg-vui-danger')} />
      <span className={cn('flex-1', issues.some((i) => i.level === 'warn') && 'bg-vui-warning')} />
    </span>
  );
}
