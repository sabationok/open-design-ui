import { cn } from '../lib/utils';

export interface ChipMultiSelectOption {
  id: string;
  name: string;
}

export interface ChipMultiSelectProps {
  options: ChipMultiSelectOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** Shown when there are no options. */
  empty?: string;
  /** aria-label of the group. */
  label?: string;
  className?: string;
}

// Toggle chips in a wrapping row; fine while the list stays short.
export function ChipMultiSelect({ options, value, onChange, empty = 'Empty', label, className }: ChipMultiSelectProps) {
  if (!options.length) return <p className={cn('text-sm text-muted-foreground', className)}>{empty}</p>;
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              on ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-ds-gray-alpha-100',
            )}
          >
            {o.name}
          </button>
        );
      })}
    </div>
  );
}
