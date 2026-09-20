import { cn } from '../lib/utils';

export interface ProgressLineProps {
  /** Fraction filled from the top, 0–1. */
  progress?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}

/** Vertical track + fill line, positioned absolutely inside a `relative` container — pair with `AnchorDot`. */
export function ProgressLine({ progress = 0, className, trackClassName, fillClassName }: ProgressLineProps) {
  const pct = Math.min(1, Math.max(0, progress)) * 100;
  return (
    <div className={cn('absolute bottom-1.5 left-1 top-1.5 w-px', className)} aria-hidden>
      <div className={cn('absolute inset-0 bg-zinc-200', trackClassName)} />
      <div className={cn('absolute left-0 top-0 w-px bg-vui-accent transition-[height]', fillClassName)} style={{ height: `${pct}%` }} />
    </div>
  );
}
