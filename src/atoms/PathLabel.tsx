import { Fragment, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface PathLabelProps {
  /** Ancestors first, leaf last. Empty entries are skipped. */
  segments: (string | null | undefined)[];
  /** Joins segments; non-breaking spaces keep it glued to its neighbours. */
  separator?: string;
  className?: string;
}

// "Food › Groceries": ancestors are muted and shrink first, the leaf keeps its width.
export function PathLabel({ segments, separator = ' › ', className }: PathLabelProps) {
  const parts = segments.filter((s): s is string => !!s);
  if (!parts.length) return null;
  const leaf = parts[parts.length - 1];
  const ancestors = parts.slice(0, -1);
  return (
    <span className={cn('flex min-w-0 items-baseline text-[13px]', className)} title={parts.join(separator)}>
      {ancestors.length > 0 && (
        <span className="min-w-0 shrink truncate text-ds-gray-700">
          {ancestors.map((a, i) => (
            <Fragment key={i}>
              {a}
              {separator}
            </Fragment>
          ))}
        </span>
      )}
      <span className="min-w-0 max-w-full shrink-0 truncate text-foreground">{leaf}</span>
    </span>
  );
}

export interface PathFlowProps {
  from?: PathLabelProps['segments'];
  to?: PathLabelProps['segments'];
  /** Drawn between the two paths; never truncates. */
  arrow?: ReactNode;
  separator?: string;
  className?: string;
}

// Two paths joined by an arrow, e.g. a transfer from one account to another.
export function PathFlow({ from, to, arrow = '→', separator, className }: PathFlowProps) {
  if (!from && !to) return null;
  return (
    <span className={cn('flex min-w-0 items-baseline gap-1', className)}>
      {from && <PathLabel segments={from} separator={separator} className="min-w-0 shrink" />}
      {from && to && (
        <span className="shrink-0 text-[13px] text-ds-gray-700" aria-hidden>
          {arrow}
        </span>
      )}
      {to && <PathLabel segments={to} separator={separator} className="min-w-0 shrink" />}
    </span>
  );
}
