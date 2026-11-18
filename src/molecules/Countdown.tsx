import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export interface CountdownProps {
  seconds: number;
  /** The text before the link, for the seconds left. Default: "Closes in N s". */
  label?: (left: number) => string;
  /** The link that stops the timer. Default: "Keep open". */
  keepLabel?: string;
  onDone: () => void;
  /** The caller hides the countdown here. */
  onKeep: () => void;
  className?: string;
}

const defaultLabel = (left: number) => `Closes in ${left} s`;

// "Closes in N s · Keep open": a timer that ends in an action, with a way to stop it. Restart it with a
// new `key`. Not announced to screen readers every second; announce the outcome instead.
export function Countdown({ seconds, label = defaultLabel, keepLabel = 'Keep open', onDone, onKeep, className }: CountdownProps) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });
  useEffect(() => {
    let n = seconds;
    const t = setInterval(() => {
      n -= 1;
      setLeft(n);
      if (n <= 0) {
        clearInterval(t);
        done.current();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground tabular-nums', className)}>
      {label(Math.max(left, 0))} ·
      <button
        type="button"
        onClick={onKeep}
        className="rounded-sm underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {keepLabel}
      </button>
    </span>
  );
}
