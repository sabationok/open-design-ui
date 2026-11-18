import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export type NoteTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type IconComponent = ComponentType<{ className?: string }>;

const TONE: Record<NoteTone, { icon: IconComponent; className: string; role: 'note' | 'status' | 'alert' }> = {
  neutral: { icon: Info, className: 'border-ds-gray-alpha-500 bg-ds-background-200 text-muted-foreground', role: 'note' },
  info: { icon: Info, className: 'border-vui-accent-border bg-vui-accent-bg text-vui-accent-text', role: 'note' },
  success: { icon: CircleCheck, className: 'border-vui-success-border bg-vui-success-bg text-vui-success-text', role: 'status' },
  warning: { icon: TriangleAlert, className: 'border-vui-warning-border bg-vui-warning-bg text-vui-warning-text', role: 'note' },
  danger: { icon: CircleAlert, className: 'border-vui-danger-border bg-vui-danger-bg text-vui-danger-text', role: 'alert' },
};

export interface NoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  tone?: NoteTone;
  title?: ReactNode;
  /** Overrides the tone's default icon. */
  icon?: IconComponent;
  /** Trailing control, e.g. a "Retry" button. */
  action?: ReactNode;
  /** Denser plaque for rows and forms: 12px text, tighter padding, 14px icon. */
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

// Inline message the user reads rather than fixes in a field: unsupported flows, outcomes, warnings.
// Extra div attributes (data-*, id, role) pass through to the plaque.
export function Note({ tone = 'neutral', title, icon, action, compact, className, children, ...rest }: NoteProps) {
  const { icon: ToneIcon, className: toneClassName, role } = TONE[tone];
  const Icon = icon ?? ToneIcon;
  return (
    <div
      role={role}
      {...rest}
      className={cn(
        'flex items-start rounded-md border',
        compact ? 'gap-2 px-2.5 py-1.5 text-xs' : 'gap-2.5 px-3 py-2.5 text-[13px]',
        toneClassName,
        className,
      )}
    >
      <Icon className={cn('shrink-0', compact ? 'mt-px size-3.5' : 'mt-0.5 size-4')} aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5 opacity-90')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
