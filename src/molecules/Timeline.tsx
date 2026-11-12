import { type ComponentType, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { TimelineIconDot, type TimelineTone } from '../atoms/TimelineDot';

export interface TimelineProps {
  children: ReactNode;
  className?: string;
}

/** Plain rail: a thin line on the left; children position their own `TimelineDot`. */
function TimelineBase({ children, className }: TimelineProps) {
  return (
    <div className={cn('relative pl-5', className)}>
      <div className="absolute bottom-1.5 left-1 top-1.5 w-px bg-ds-gray-200" />
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

// ─── Compound activity rail ──────────────────────────────────────────────────
// Icon dots joined by a line; a nested `Timeline.Root` inside an item indents under it.
// Layout only: callers decide what an item says.

export interface TimelineRootProps {
  children: ReactNode;
  className?: string;
  /** Accessible name for the list. */
  'aria-label'?: string;
}

export function TimelineRoot({ children, className, 'aria-label': ariaLabel }: TimelineRootProps) {
  return (
    <ol
      aria-label={ariaLabel}
      className={cn(
        'relative flex flex-col before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-border',
        className,
      )}
    >
      {children}
    </ol>
  );
}

export interface TimelineItemProps {
  /** Icon inside the dot; omit for a small filled dot. */
  icon?: ComponentType<{ className?: string }>;
  /** Dot colour: neutral, or a role tone (fee = warning, rejected = danger…). */
  tone?: TimelineTone;
  title: ReactNode;
  /** Small line under the title (date, status chips). */
  meta?: ReactNode;
  /** Right side (amount, timestamp). */
  trailing?: ReactNode;
  /** The item the surrounding view is about. */
  active?: boolean;
  /** Makes the head row a button. */
  onClick?: () => void;
  /** Free content under the item (comment text, a summary box). */
  footer?: ReactNode;
  /** Nested `Timeline.Root` of descendants. */
  children?: ReactNode;
  className?: string;
}

export function TimelineItem({
  icon,
  tone = 'neutral',
  title,
  meta,
  trailing,
  active,
  onClick,
  footer,
  children,
  className,
}: TimelineItemProps) {
  const head = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 flex-wrap items-center gap-1.5 text-[13px] text-foreground">{title}</span>
        {meta && (
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ds-gray-700">{meta}</span>
        )}
      </span>
      {trailing && <span className="shrink-0 text-right">{trailing}</span>}
    </>
  );

  return (
    <li className={cn('relative flex gap-3 pb-3 last:pb-0', className)}>
      <TimelineIconDot icon={icon} tone={tone} active={active} />
      <div className="min-w-0 flex-1">
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            aria-current={active || undefined}
            className={cn(
              '-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-md px-2 py-1 text-left transition-colors hover:bg-ds-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active && 'bg-ds-background-200',
            )}
          >
            {head}
          </button>
        ) : (
          <div
            aria-current={active || undefined}
            className={cn('flex items-start gap-3 py-1', active && '-mx-2 rounded-md bg-ds-background-200 px-2')}
          >
            {head}
          </div>
        )}
        {footer && <div className="mt-1">{footer}</div>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </li>
  );
}

/**
 * `<Timeline>` keeps the original plain-rail API; `Timeline.Root` / `Timeline.Item`
 * are the compound activity rail.
 */
export const Timeline = Object.assign(TimelineBase, { Root: TimelineRoot, Item: TimelineItem });
