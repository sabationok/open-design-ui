import type { ReactNode } from 'react';
import { Plus, X } from 'lucide-react';

export interface QueueSelectOption {
  id: string;
  name: string;
}

export interface QueueSelectProps {
  options: QueueSelectOption[];
  /** The queue, first first. */
  value: string[];
  onChange: (ids: string[]) => void;
  label?: ReactNode;
  /** Text of an empty queue. */
  empty?: string;
  /** aria-label of a chip's ×. */
  removeLabel?: (name: string) => string;
  /** aria-label prefix of a "put at the end" chip. */
  addLabel?: (name: string) => string;
}

// Several options in an order: the queue (numbered chips, × takes one out) and under it what is
// left to pick (a click puts it at the end of the queue).
export function QueueSelect({
  options,
  value,
  onChange,
  label,
  empty = 'Nothing selected',
  removeLabel = (name) => `Remove ${name}`,
  addLabel = (name) => `Add ${name}`,
}: QueueSelectProps) {
  const nameOf = (id: string) => options.find((o) => o.id === id)?.name ?? id;
  const left = options.filter((o) => !value.includes(o.id));
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      {label && <span className="flex items-center gap-1 text-muted-foreground">{label}</span>}
      <ol className="flex flex-wrap items-center gap-1">
        {value.length ? (
          value.map((id, i) => (
            <li
              key={id}
              className="inline-flex items-center gap-1 rounded-full border border-vui-accent-border bg-vui-accent-bg py-0.5 pl-1 pr-0.5 text-foreground"
            >
              <span aria-hidden className="grid size-4 place-items-center rounded-full bg-vui-accent text-[10px] font-medium tabular-nums text-ds-background-100">
                {i + 1}
              </span>
              {nameOf(id)}
              <button
                type="button"
                aria-label={removeLabel(nameOf(id))}
                className="grid size-4 place-items-center rounded-full text-ds-gray-700 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onChange(value.filter((v) => v !== id))}
              >
                <X className="size-3" />
              </button>
            </li>
          ))
        ) : (
          <li className="text-ds-gray-700">{empty}</li>
        )}
      </ol>
      {left.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {left.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-label={addLabel(o.name)}
              className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-border px-2 py-0.5 text-muted-foreground transition-colors hover:border-ds-gray-alpha-500 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onChange([...value, o.id])}
            >
              <Plus className="size-3" aria-hidden />
              {o.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
