import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RemovableChipsProps<T extends string = string> {
  /** The row's name, shown before the chips ("Skipped:"). */
  label?: string;
  items: T[];
  /** Display text of an item (default: the item itself). */
  show?: (item: T) => string;
  onRemove: (item: T) => void;
  /** aria-label of an item's × (gets the display text). */
  removeLabel?: (name: string) => string;
  /** Tooltip of every ×. */
  removeTitle?: string;
  className?: string;
}

const DEFAULT_REMOVE_LABEL = (name: string) => `Remove ${name}`;

/**
 * A labelled row of chips, each with its own × to take it out. Display and remove only: no adding, no input.
 * For add / search use ChipPicker; for picking from a list MultiSelect.
 */
export function RemovableChips<T extends string = string>({
  label,
  items,
  show = (item) => item,
  onRemove,
  removeLabel = DEFAULT_REMOVE_LABEL,
  removeTitle,
  className,
}: RemovableChipsProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1 text-xs', className)}>
      {label && <span className="mr-0.5 text-muted-foreground">{label}:</span>}
      <ul className="contents">
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-md border border-border py-0.5 pl-1.5 pr-0.5 text-foreground"
          >
            {show(item)}
            <button
              type="button"
              aria-label={removeLabel(show(item))}
              title={removeTitle}
              className="grid size-4 place-items-center rounded-sm text-ds-gray-700 hover:bg-ds-gray-alpha-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onRemove(item)}
            >
              <X className="size-3" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
