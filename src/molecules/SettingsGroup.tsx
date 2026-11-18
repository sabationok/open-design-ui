import type { ComponentType, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { IconTile } from '../atoms/IconTile';

export interface SettingsGroupProps {
  icon: ComponentType<{ className?: string }>;
  title: ReactNode;
  /** Current value(s) shown while collapsed, e.g. "System". */
  summary?: ReactNode;
  defaultOpen?: boolean;
  /** Usually `SettingsRow`s; direct children are separated by hairlines. */
  children: ReactNode;
  className?: string;
}

// Phone-style settings section: a row with icon, title and the current value that expands in place.
// Native <details>: keyboard and screen-reader support, open state without React.
export function SettingsGroup({ icon, title, summary, defaultOpen, children, className }: SettingsGroupProps) {
  return (
    <details open={defaultOpen} className={cn('group overflow-hidden rounded-xl border border-border bg-background', className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-2.5 transition-colors hover:bg-ds-gray-alpha-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <IconTile icon={icon} className="shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{title}</span>
          {summary && <span className="block truncate text-[13px] text-muted-foreground group-open:hidden">{summary}</span>}
        </span>
        <ChevronRight className="size-4 shrink-0 text-ds-gray-700 transition-transform group-open:rotate-90" aria-hidden />
      </summary>
      <div className="border-t border-border [&>*+*]:border-t [&>*+*]:border-border">{children}</div>
    </details>
  );
}

export interface SettingsRowProps {
  label: ReactNode;
  /** Id of the control, so clicking the label focuses it. */
  htmlFor?: string;
  description?: ReactNode;
  control: ReactNode;
  /** Put the control under the label on narrow screens. */
  stack?: boolean;
  className?: string;
}

// One setting inside a group: label + description on the left, its control on the right
// (or below on narrow screens when `stack`).
export function SettingsRow({ label, htmlFor, description, control, stack, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex gap-x-4 gap-y-3 px-4 py-3',
        stack ? 'flex-col sm:flex-row sm:items-center sm:justify-between' : 'items-center justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-sm text-foreground">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
