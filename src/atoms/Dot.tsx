import { cn } from '../lib/utils';

export type DotSize = 'xs' | 'sm' | 'md';

export interface DotProps {
  /** Tailwind `bg-*` class (or any className fragment resolving to a background color). */
  color?: string;
  size?: DotSize;
  className?: string;
}

const SIZE_CLASSES: Record<DotSize, string> = {
  xs: 'h-[5px] w-[5px]',
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
};

/** Plain colored circle — the shared building block behind HealthDot, DotIndicator, and Badge's status dot. */
export function Dot({ color = 'bg-zinc-400', size = 'xs', className }: DotProps) {
  return <span className={cn('inline-block shrink-0 rounded-full', SIZE_CLASSES[size], color, className)} />;
}
