import { useId, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDismiss } from '../lib/useDismiss';
import { Button } from '../components/ui/button';

export interface ChipPickerOption {
  name: string;
  hint?: string;
}

export interface ChipPickerLabels {
  /** aria-label of a chip's ×. */
  remove: (name: string) => string;
  /** The add button's text. */
  add: string;
  /** The suggestion that adds what was typed as a new name. */
  create: (name: string) => string;
}

const DEFAULT_LABELS: ChipPickerLabels = {
  remove: (name) => `Remove ${name}`,
  add: 'Add',
  create: (name) => `Create "${name}"`,
};

export interface ChipPickerProps {
  value: string[];
  onChange: (names: string[]) => void;
  options: ChipPickerOption[];
  placeholder?: string;
  labels?: Partial<ChipPickerLabels>;
  /** The add button as an icon only, with this text as tooltip / aria-label (a compact field). */
  iconAdd?: string;
  /** The mark before a name on its chip and in the suggestions ("#" for tags). */
  prefix?: string;
  /** Splits a typed / pasted text into several names ("#a#b, c" → a, b, c); without it the text is one. */
  separators?: RegExp;
  /** Locale for case-insensitive matching (e.g. "uk"). */
  locale?: string;
  /** How many suggestions to show. */
  limit?: number;
  className?: string;
}

// Names as chips (× removes one) and an input that suggests names from `options` as you type;
// Enter or the add button adds the highlighted one or what was typed (a new name). Names are unique
// regardless of case; Backspace in an empty input removes the last chip.
export function ChipPicker({
  value,
  onChange,
  options,
  placeholder = 'Search or add new',
  labels,
  iconAdd,
  prefix = '',
  separators,
  locale,
  limit = 8,
  className,
}: ChipPickerProps) {
  const ui = { ...DEFAULT_LABELS, ...labels };
  const id = useId();
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const norm = (v: string) => v.trim().toLocaleLowerCase(locale);
  const taken = new Set(value.map(norm));
  const bare = (v: string) => (prefix && v.startsWith(prefix) ? v.slice(prefix.length) : v);
  const query = norm(bare(text));
  const matches = query
    ? options.filter((o) => !taken.has(norm(o.name)) && norm(o.name).includes(query)).slice(0, limit)
    : [];
  const exact = options.some((o) => norm(o.name) === query);
  const listOpen = open && !!query && (matches.length > 0 || !exact);
  const fieldRef = useRef<HTMLDivElement>(null);
  // Esc closes the list only, not a dialog around.
  useDismiss(listOpen, [fieldRef], () => setOpen(false));

  // A known name (any case) is kept as written in `options`; one already chosen (or typed twice) is skipped.
  function add(names: string[]) {
    const seen = new Set(taken);
    const fresh: string[] = [];
    for (const n of names) {
      const name = options.find((o) => norm(o.name) === norm(n))?.name ?? n.trim();
      if (!name || seen.has(norm(name))) continue;
      seen.add(norm(name));
      fresh.push(name);
    }
    if (fresh.length) onChange([...value, ...fresh]);
    setText('');
    setActive(0);
  }
  const typed = () =>
    separators
      ? text
          .split(separators)
          .map((t) => t.trim())
          .filter(Boolean)
      : [bare(text)];
  // A text with a separator adds what it lists, not the highlighted suggestion.
  const listed = !!separators && text.split(separators).length > 1;
  const addCurrent = () => (matches[active] && !listed ? add([matches[active].name]) : add(typed()));
  const optId = (i: number) => `${id}-opt-${i}`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {value.map((t) => (
            <li
              key={t}
              className="group inline-flex items-center gap-1 rounded-full border border-border bg-ds-background-200 py-0.5 pl-2 pr-1 text-xs text-foreground"
            >
              {prefix}
              {t}
              <button
                type="button"
                aria-label={ui.remove(t)}
                className="rounded-full p-0.5 text-ds-gray-700 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100"
                onClick={() => onChange(value.filter((v) => v !== t))}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div ref={fieldRef} className="relative flex gap-2">
        <input
          className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-shadow placeholder:text-ds-gray-700 hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus aria-[invalid=true]:border-ds-red-700"
          placeholder={placeholder}
          aria-label={placeholder}
          value={text}
          role="combobox"
          aria-expanded={listOpen}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={listOpen && matches[active] ? optId(active) : undefined}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && text.trim()) {
              e.preventDefault();
              addCurrent();
            } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
          }}
        />
        <Button
          type="button"
          variant="outline"
          size={iconAdd ? 'icon' : 'default'}
          disabled={!text.trim()}
          title={iconAdd}
          aria-label={iconAdd ?? ui.add}
          className={cn('text-xs', !iconAdd && 'px-2.5')}
          onClick={addCurrent}
        >
          {iconAdd ? <Plus /> : ui.add}
        </Button>
        {listOpen && (
          <div
            id={`${id}-list`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-ds-medium"
          >
            {matches.map((o, i) => (
              <div
                key={o.name}
                id={optId(i)}
                role="option"
                aria-selected={i === active}
                // Before the input's blur closes the list.
                onMouseDown={(e) => {
                  e.preventDefault();
                  add([o.name]);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-xs',
                  i === active && 'bg-ds-gray-alpha-100',
                )}
              >
                <span className="text-foreground">
                  {prefix}
                  {o.name}
                </span>
                {o.hint && <span className="text-ds-gray-700">{o.hint}</span>}
              </div>
            ))}
            {!exact && (
              <div
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(typed());
                }}
                className="cursor-pointer rounded-md px-2 py-1 text-left text-xs text-muted-foreground hover:bg-ds-gray-alpha-100"
              >
                {ui.create(bare(text).trim())}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
