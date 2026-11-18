import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface StickyActionBarProps {
  /** Left side, usually the count of marked rows. */
  start: ReactNode;
  /** The actions, on the right. */
  children: ReactNode;
  className?: string;
}

// The count and the actions of a mode (marking rows to delete, a bulk edit), in sight however far the
// page scrolls. Sticks to the bottom of its scroll area; the caller renders it only in that mode.
export function StickyActionBar({ start, children, className }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 shadow-ds-medium',
        className,
      )}
    >
      <span className="mr-auto min-w-0 truncate text-sm text-foreground">{start}</span>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}
