import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface OptionListOption<T extends string | number> {
  value: T;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface OptionListProps<T extends string | number> {
  value: T | undefined;
  options: OptionListOption<T>[];
  onChange: (value: T) => void;
  /** aria-label of the radio group. */
  label?: string;
  className?: string;
}

// A one-level choice as radio rows in one bordered list, each with its name and a short description
// (instead of a dropdown that hides what each choice means). ↑↓ / ←→ move the choice.
export function OptionList<T extends string | number>({ value, options, onChange, label, className }: OptionListProps<T>) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const enabled = options.filter((o) => !o.disabled);
    if (!enabled.length) return;
    e.preventDefault();
    const i = enabled.findIndex((o) => o.value === value);
    const next = enabled[(i + step + enabled.length) % enabled.length];
    onChange(next.value);
    const idx = options.indexOf(next);
    (e.currentTarget.children[idx] as HTMLElement | undefined)?.focus();
  };
  // Roving tab stop: the picked row, or the first enabled one.
  const tabStop = options.some((o) => o.value === value && !o.disabled) ? value : options.find((o) => !o.disabled)?.value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={cn('flex flex-col overflow-hidden rounded-md border border-border [&>*+*]:border-t [&>*+*]:border-border', className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={o.value === tabStop ? 0 : -1}
            disabled={o.disabled}
            className={cn(
              'flex items-start gap-2 px-3 py-2 text-left text-xs transition-colors focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              on ? 'bg-vui-accent-bg' : 'hover:bg-ds-gray-alpha-100',
            )}
            onClick={() => onChange(o.value)}
          >
            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full border',
                on ? 'border-vui-accent-text' : 'border-ds-gray-alpha-600',
              )}
            >
              {on && <span className="size-1.5 rounded-full bg-vui-accent-text" />}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={on ? 'text-vui-accent-text' : 'text-foreground'}>{o.title}</span>
              {o.description && <span className="text-muted-foreground">{o.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
