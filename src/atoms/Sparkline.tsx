import { useId } from 'react';
import { cn } from '../lib/utils';

export type SparklineTone = 'neutral' | 'up' | 'down' | 'accent';

export interface SparklineProps {
  /** Values in chronological order. A single point draws a flat line. */
  values: number[];
  tone?: SparklineTone;
  height?: number;
  className?: string;
}

const TONE_COLOR: Record<SparklineTone, string> = {
  neutral: 'var(--ds-gray-700)',
  up: 'var(--vui-success)',
  down: 'var(--vui-danger)',
  accent: 'var(--vui-accent)',
};

// Tiny trend line without axes; stretches to the container width.
export function Sparkline({ values, tone = 'neutral', height = 32, className }: SparklineProps) {
  const gid = useId();
  if (values.length === 0) return null;
  const w = 100;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const pts = (values.length === 1 ? [values[0], values[0]] : values).map((v, i, arr) => [
    (i / (arr.length - 1)) * w,
    height - 2 - ((v - min) / span) * (height - 4),
  ]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const color = TONE_COLOR[tone];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={cn('w-full', className)} style={{ height }} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${height} L0,${height} Z`} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
