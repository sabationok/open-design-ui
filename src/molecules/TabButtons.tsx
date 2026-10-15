import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface TabButtonsItem<T extends string> {
  key: T;
  label: ReactNode;
  icon?: ReactNode;
}

export interface TabButtonsProps<T extends string> {
  tabs: readonly TabButtonsItem<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  /** Accessible name of the group, e.g. "Period". */
  label?: string;
  className?: string;
}

// Segmented switch for 2–5 mutually exclusive views (period, source, currency). Use TabBar for routes.
export function TabButtons<T extends string>({ tabs, value, onChange, size = 'md', label, className }: TabButtonsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex max-w-full overflow-x-auto rounded-md border border-border bg-ds-background-200 p-0.5 [scrollbar-width:none]',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[5px] transition-colors [&_svg]:size-3.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-[13px]',
              active ? 'bg-background font-medium text-foreground shadow-ds-border' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
