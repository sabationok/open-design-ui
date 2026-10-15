import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type IndicatorBoxTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface IndicatorBoxProps {
  tone?: IndicatorBoxTone;
  /** Escape hatch for a one-off bar color that doesn't map to a tone (e.g. an arbitrary category hex). */
  color?: string;
  className?: string;
  children: ReactNode;
}

const TONE_BAR: Record<IndicatorBoxTone, string> = {
  neutral: 'bg-vui-neutral',
  accent: 'bg-vui-accent',
  success: 'bg-vui-success',
  warning: 'bg-vui-warning',
  danger: 'bg-vui-danger',
};

/**
 * Generic surface with a colored left accent bar. Carries no opinion about its content —
 * compose it as a hint/callout, an issue/finding card, a legend entry, etc.
 */
export function IndicatorBox({ tone = 'neutral', color, className, children }: IndicatorBoxProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-md border border-border bg-background pl-4 pr-3.5 py-3', className)}>
      <span className={cn('absolute inset-y-0 left-0 w-[3px]', !color && TONE_BAR[tone])} style={color ? { background: color } : undefined} />
      {children}
    </div>
  );
}
