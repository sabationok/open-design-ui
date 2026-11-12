import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Note, type NoteTone } from './Note';

export type StickyAlertTone = Extract<NoteTone, 'warning' | 'danger' | 'info'>;

// Literal classes per tone, so Tailwind sees them: the action's edge matches the plaque's.
const ACTION_TONE: Record<StickyAlertTone, string> = {
  warning: 'border-vui-warning-border',
  danger: 'border-vui-danger-border',
  info: 'border-vui-accent-border',
};

export interface StickyAlertProps {
  /** The message. */
  children: ReactNode;
  actionLabel: ReactNode;
  onAction: () => void;
  /** The action's request is out: the button is disabled. */
  busy?: boolean;
  tone?: StickyAlertTone;
  className?: string;
}

// A message that stays in sight while a long list scrolls, with the one action that resolves it.
// Sticks 8px under the page's sticky header: set `--vui-page-bar` (its height) on an ancestor, else it
// sticks to the top. For a message that stays in its place, use Note.
export function StickyAlert({ children, actionLabel, onAction, busy, tone = 'warning', className }: StickyAlertProps) {
  return (
    <Note
      tone={tone}
      className={cn(
        'sticky top-[calc(var(--vui-page-bar,0px)+0.5rem)] z-10 w-[90%] items-center self-center text-sm shadow-ds-medium',
        className,
      )}
      action={
        <button
          type="button"
          disabled={busy}
          onClick={onAction}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors hover:bg-ds-gray-alpha-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            ACTION_TONE[tone],
          )}
        >
          {actionLabel}
        </button>
      }
    >
      {children}
    </Note>
  );
}
