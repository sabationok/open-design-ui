import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface CodeChipProps {
  children: ReactNode;
  className?: string;
}

/**
 * A small grey chip beside a value: a currency code, a unit. Static.
 * For an id or path (mono, accent, clickable) use MonoChip; for statuses Badge.
 */
export function CodeChip({ children, className }: CodeChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md border border-border bg-ds-background-200 px-1 text-[11px] font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
