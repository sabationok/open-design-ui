import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDismiss } from '../lib/useDismiss';

export interface SearchSelectOption<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
  /** A small mark beside the label ("new"). */
  badge?: string;
}

export interface SearchSelectProps<V extends string = string> {
  value: V;
  options: SearchSelectOption<V>[];
  onChange: (value: V) => void;
  /** The button's text while nothing is picked. */
  placeholder?: string;
  searchPlaceholder?: string;
  /** Shown when the search matches nothing. */
  emptyText?: string;
  /** aria-label of the button. */
  label?: string;
  /** `md`: a form field (full width, input height); `sm`: inline in a toolbar. */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** Locale for case-insensitive matching (e.g. "uk"). */
  locale?: string;
  /** Which edge of the button the list keeps to. */
  align?: 'start' | 'end';
  /** A pick does not close the list (picking several in a row, e.g. MultiSelect). */
  keepOpen?: boolean;
  className?: string;
}

const Badge = ({ children }: { children: string }) => (
  <span className="rounded-full bg-vui-accent-bg px-1.5 text-[10px] font-medium text-vui-accent-text">{children}</span>
);

// One value from many: the button opens a list with a search on top. Typing narrows it by
// label / value / hint, ↑↓ move, Enter picks, Esc closes (and leaves a dialog around open).
export function SearchSelect<V extends string = string>({
  value,
  options,
  onChange,
  placeholder = 'Select',
  searchPlaceholder = 'Search…',
  emptyText = 'Nothing found',
  label,
  size = 'sm',
  disabled,
  locale,
  align = 'start',
  keepOpen = false,
  className,
}: SearchSelectProps<V>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const optId = (i: number) => `${id}-opt-${i}`;

  const norm = (s: string) => s.toLocaleLowerCase(locale);
  const q = norm(query.trim());
  const shown = q ? options.filter((o) => norm(`${o.label} ${o.value} ${o.hint ?? ''}`).includes(q)) : options;
  const current = options.find((o) => o.value === value);

  const close = (refocus: boolean) => {
    setOpen(false);
    setQuery('');
    if (refocus) trigger.current?.focus();
  };
  useDismiss(open, [ref], (reason) => close(reason === 'escape' && !!ref.current?.contains(document.activeElement)));

  useEffect(() => {
    if (open) document.getElementById(optId(active))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const pick = (v: V) => {
    onChange(v);
    if (!keepOpen) return close(true);
    setQuery('');
    setActive(0);
  };

  return (
    <div ref={ref} className={cn('relative inline-flex', size === 'md' && 'w-full', className)}>
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-md border border-input bg-background px-2 text-foreground transition-colors hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus disabled:cursor-not-allowed disabled:bg-ds-background-200 disabled:text-ds-gray-700',
          size === 'md' ? 'h-8 w-full text-sm' : 'h-7 min-w-28 text-xs',
        )}
        onClick={() => {
          if (open) return close(false);
          setOpen(true);
          setActive(Math.max(0, options.findIndex((o) => o.value === value)));
        }}
      >
        <span className={cn('flex-1 truncate text-left', !current && 'text-ds-gray-700')}>{current?.label ?? placeholder}</span>
        {current?.badge && <Badge>{current.badge}</Badge>}
        <ChevronDown className="size-3.5 shrink-0 text-ds-gray-700" aria-hidden />
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-1 flex w-56 min-w-full flex-col rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-ds-medium',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          <input
            autoFocus
            role="combobox"
            aria-expanded
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={shown[active] ? optId(active) : undefined}
            aria-label={searchPlaceholder}
            className="mb-1 h-7 rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-ds-gray-700 focus-visible:outline-none focus-visible:shadow-ds-input-focus"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, shown.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (shown[active]) pick(shown[active].value);
              }
            }}
          />
          <div id={`${id}-list`} role="listbox" aria-label={label} className="flex max-h-56 flex-col overflow-y-auto">
            {shown.length ? (
              shown.map((o, i) => (
                <div
                  key={o.value}
                  id={optId(i)}
                  role="option"
                  aria-selected={o.value === value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left text-xs',
                    i === active && 'bg-ds-gray-alpha-100',
                  )}
                  onMouseEnter={() => setActive(i)}
                  // Keeps focus on the search input.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.value)}
                >
                  <span className="flex-1 text-foreground">{o.label}</span>
                  {o.badge && <Badge>{o.badge}</Badge>}
                  {o.hint && <span className="text-ds-gray-700">{o.hint}</span>}
                  {o.value === value && <Check className="size-3.5 text-vui-accent-text" aria-hidden />}
                </div>
              ))
            ) : (
              <span className="px-2 py-1 text-xs text-ds-gray-700">{emptyText}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
