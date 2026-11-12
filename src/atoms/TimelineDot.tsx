import type { ComponentType } from 'react';
import { cn } from '../lib/utils';

export interface TimelineDotProps {
  color: string;
  className?: string;
}

/** Small coloured dot for the plain `Timeline` rail (absolute, sits on the rail line). */
export function TimelineDot({ color, className }: TimelineDotProps) {
  return (
    <span
      className={className ?? 'absolute -left-5 top-[5px] h-[9px] w-[9px] rounded-full border-2 border-background'}
      style={{ background: color, boxShadow: `0 0 0 1px ${color}` }}
    />
  );
}

export type TimelineTone = 'neutral' | 'accent' | 'warning' | 'success' | 'danger';

const ICON_DOT_TONE: Record<TimelineTone, string> = {
  neutral: 'border-ds-gray-alpha-500 text-muted-foreground',
  accent: 'border-vui-accent-border text-vui-accent-text',
  warning: 'border-vui-warning-border text-vui-warning-text',
  success: 'border-vui-success-border text-vui-success-text',
  danger: 'border-vui-danger-border text-vui-danger-text',
};

export interface TimelineIconDotProps {
  /** Icon component rendered inside the dot; omit for a small filled dot. */
  icon?: ComponentType<{ className?: string }>;
  tone?: TimelineTone;
  /** Emphasise the dot (the item the surrounding view is about). */
  active?: boolean;
  className?: string;
}

/** 28px circular icon dot for `Timeline.Item` (in-flow, covers the rail line). */
export function TimelineIconDot({ icon: Icon, tone = 'neutral', active, className }: TimelineIconDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative z-[1] mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border bg-background',
        ICON_DOT_TONE[tone],
        active && 'ring-2 ring-foreground/15',
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
    </span>
  );
}
