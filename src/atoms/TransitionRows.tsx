import type { ReactNode } from 'react';
import { CornerDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

export type TransitionTone = 'resolved' | 'warning' | 'muted';

const TONE: Record<TransitionTone, string> = {
  resolved: 'text-foreground',
  warning: 'text-vui-warning-text',
  muted: 'text-muted-foreground',
};

export interface TransitionRowsProps {
  from: string;
  to: ReactNode;
  /** Colours the second line. */
  tone: TransitionTone;
  /** Which line stands out: `top` (a list of what was), `bottom` (bolder and larger: a form about what it becomes). */
  accent?: 'top' | 'bottom';
  className?: string;
}

/**
 * A transition from one value to another: `from` over `↳ to`, two short lines instead of one long line wrapping
 * mid-arrow. The arrow gives the direction, so the order never changes. Read-only.
 */
export function TransitionRows({ from, to, tone, accent, className }: TransitionRowsProps) {
  return (
    <span className={cn('flex min-w-0 flex-col gap-0.5', className)}>
      <span className={cn('break-words text-foreground', accent === 'top' && 'font-medium')}>{from}</span>
      <span
        className={cn(
          'flex items-start gap-1 break-words',
          TONE[tone],
          tone === 'resolved' && !accent && 'font-medium',
          accent === 'bottom' && 'text-base font-semibold',
        )}
      >
        <CornerDownRight
          aria-hidden
          className={cn('size-3.5 shrink-0 text-ds-gray-700', accent === 'bottom' ? 'mt-1' : 'mt-0.5')}
        />
        <span className="min-w-0">{to}</span>
      </span>
    </span>
  );
}
