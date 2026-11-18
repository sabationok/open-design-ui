import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FoldProps {
  title: ReactNode;
  /** Short state shown only while closed; opened, the body shows it in full. */
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

// A compact collapsible row inside a card section: a title with its short state, opened in place.
// Native <details> (keyboard and screen-reader support, no open state in React). Stack several in
// FoldList. For a phone-style settings section with an icon, use SettingsGroup.
export function Fold({ title, meta, defaultOpen, children, className }: FoldProps) {
  return (
    <details open={defaultOpen} className={cn('group py-1.5', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden
          className="size-3.5 shrink-0 text-ds-gray-700 transition-transform group-open:rotate-90 motion-reduce:transition-none"
        />
        <span className="shrink-0">{title}</span>
        {meta && <span className="min-w-0 truncate text-ds-gray-700 group-open:hidden">{meta}</span>}
      </summary>
      <div className="mt-1.5 flex flex-col gap-1.5 pl-5">{children}</div>
    </details>
  );
}

export interface FoldListProps {
  children: ReactNode;
  className?: string;
}

// A bordered box that stacks Fold items with hairlines between them. Each Fold toggles on its own.
export function FoldList({ children, className }: FoldListProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md border border-border px-3 py-1 [&>*+*]:border-t [&>*+*]:border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}
