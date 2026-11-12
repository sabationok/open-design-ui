import { useMemo, useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Checkbox } from '../components/ui/checkbox';

export interface CheckItem<T extends string = string> {
  id: T;
  title: string;
  meta?: string;
  hint?: string;
  /** Can't be toggled (kept because something kept needs it); `lockedHint` says why. */
  locked?: boolean;
  lockedHint?: string;
}

export interface CheckRowProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (on: boolean) => void;
  title: string;
  /** Right-hand note (a count, an amount). */
  meta?: ReactNode;
  hint?: string;
  /** Indented, for rows inside a CheckGroup. */
  inset?: boolean;
  className?: string;
}

/** One checklist row: checkbox, title (struck through when off), optional hint and right-hand meta. Controlled. */
export function CheckRow({ checked, disabled, onChange, title, meta, hint, inset, className }: CheckRowProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-2 px-3 text-sm',
        inset ? 'py-1.5 pl-9' : 'py-2',
        disabled ? 'cursor-default' : 'cursor-pointer hover:bg-ds-gray-alpha-100',
        checked ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      <Checkbox
        wrapperClassName="mt-0.5 inline-flex"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('break-words', !checked && 'line-through decoration-vui-danger-text/60')}>{title}</span>
        {hint && <span className="text-xs text-ds-gray-700">{hint}</span>}
      </span>
      {meta !== undefined && <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{meta}</span>}
    </label>
  );
}

export interface CheckGroupProps<T extends string = string> {
  title: string;
  hint?: string;
  items: CheckItem<T>[];
  isOn: (id: T) => boolean;
  /** Sets several items at once (the group box) or one (a row). */
  onSet: (ids: T[], on: boolean) => void;
  /** Right side of the header, e.g. "3 of 5 kept". */
  summary?: (on: number, total: number) => ReactNode;
  /** aria-label of the group checkbox. */
  allLabel?: string;
  /** Hint of a locked item that has no `lockedHint` of its own. */
  lockedHint?: string;
  /** Whether the group starts open. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A collapsible checklist group with one checkbox for all (half-checked when only some are on).
 * Locked items are never toggled by the group box. Controlled; the open state is internal and starts closed.
 */
export function CheckGroup<T extends string = string>({
  title,
  hint,
  items,
  isOn,
  onSet,
  summary,
  allLabel = 'Select all',
  lockedHint,
  defaultOpen = false,
  className,
}: CheckGroupProps<T>) {
  const [opened, setOpened] = useState(defaultOpen);
  const onCount = items.reduce((n, i) => (isOn(i.id) ? n + 1 : n), 0);
  const free = useMemo(() => items.filter((i) => !i.locked).map((i) => i.id), [items]);
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-start gap-2 px-3 py-2 text-sm">
        <Checkbox
          wrapperClassName="mt-0.5 inline-flex"
          aria-label={allLabel}
          checked={items.length > 0 && onCount === items.length}
          indeterminate={onCount > 0 && onCount < items.length}
          disabled={free.length === 0}
          onChange={(e) => onSet(free, e.target.checked)}
        />
        <button
          type="button"
          aria-expanded={opened}
          className="flex min-w-0 flex-1 flex-col rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpened((v) => !v)}
        >
          <span className="flex w-full items-center gap-1 text-foreground">
            <ChevronRight
              aria-hidden
              className={cn('size-3.5 shrink-0 text-ds-gray-700 motion-safe:transition-transform', opened && 'rotate-90')}
            />
            <span className="min-w-0">{title}</span>
            {summary && (
              <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                {summary(onCount, items.length)}
              </span>
            )}
          </span>
          {hint && <span className="pl-[18px] text-xs text-ds-gray-700">{hint}</span>}
        </button>
      </div>
      {opened && (
        <div className="flex max-h-64 flex-col overflow-y-auto border-t border-border bg-ds-background-200 py-1">
          {items.map((i) => (
            <CheckRow
              key={i.id}
              inset
              checked={isOn(i.id)}
              disabled={i.locked}
              onChange={(on) => onSet([i.id], on)}
              title={i.title}
              meta={i.meta}
              hint={i.locked ? (i.lockedHint ?? lockedHint) : i.hint}
            />
          ))}
        </div>
      )}
    </div>
  );
}
