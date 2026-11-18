import { cn } from '../lib/utils';
import type { Issue, IssueLevel } from '../atoms/IssueEdge';

const LEVEL: Record<IssueLevel, string> = {
  error: 'border-vui-danger-border bg-vui-danger-bg text-vui-danger-text',
  warn: 'border-vui-warning-border bg-vui-warning-bg text-vui-warning-text',
};

export interface IssueListProps {
  issues: Issue[];
  className?: string;
}

/** A record's errors and notes in words, one tinted line each. Nothing when empty. The record's mark on a list: IssueEdge. */
export function IssueList({ issues, className }: IssueListProps) {
  if (!issues.length) return null;
  return (
    <ul className={cn('flex w-full flex-col gap-0.5', className)}>
      {issues.map((i) => (
        <li key={`${i.level}:${i.reason}`} className={cn('rounded-sm border px-1.5 py-0.5 text-xs', LEVEL[i.level])}>
          {i.reason}
        </li>
      ))}
    </ul>
  );
}
