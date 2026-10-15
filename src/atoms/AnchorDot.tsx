import { cn } from '../lib/utils';

export type AnchorDotState = 'done' | 'active' | 'upcoming';

export interface AnchorDotProps {
  state?: AnchorDotState;
  className?: string;
}

const STATE_CLASSES: Record<AnchorDotState, string> = {
  done: 'bg-vui-accent',
  active: 'bg-vui-accent ring-4 ring-vui-accent-bg',
  upcoming: 'bg-ds-gray-300',
};

/** Circular step/anchor marker, absolutely positioned against a `relative` row — pair with `ProgressLine`. */
export function AnchorDot({ state = 'upcoming', className }: AnchorDotProps) {
  return (
    <span
      className={cn(
        'absolute -left-5 top-1/2 h-[9px] w-[9px] shrink-0 -translate-y-1/2 rounded-full border-2 border-background transition-colors',
        STATE_CLASSES[state],
        className,
      )}
    />
  );
}
