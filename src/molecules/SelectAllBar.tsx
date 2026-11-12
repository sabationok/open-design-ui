import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

export interface SelectAllBarLabels {
  select: string;
  clear: string;
  count: (on: number, total: number) => string;
}

const DEFAULT_LABELS: SelectAllBarLabels = {
  select: 'Select all',
  clear: 'Clear all',
  count: (on, total) => `${on} of ${total} selected`,
};

export interface SelectAllBarProps {
  /** The rows shown. */
  ids: string[];
  picked: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
  labels?: Partial<SelectAllBarLabels>;
  className?: string;
}

/**
 * "Select all / clear all · N of M selected" over a ticked table: the rows shown go on or off, the rest of the
 * selection is kept. Goes into ShadcnDataTable's toolbar. Controlled.
 */
export function SelectAllBar({ ids, picked, onChange, labels, className }: SelectAllBarProps) {
  const ui = { ...DEFAULT_LABELS, ...labels };
  const on = ids.filter((id) => picked.has(id)).length;
  const set = (pick: boolean) => {
    const next = new Set(picked);
    for (const id of ids) {
      if (pick) next.add(id);
      else next.delete(id);
    }
    onChange(next);
  };
  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      <Button type="button" variant="outline" size="sm" disabled={on === ids.length} onClick={() => set(true)}>
        {ui.select}
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={on === 0} onClick={() => set(false)}>
        {ui.clear}
      </Button>
      <span className="whitespace-nowrap text-muted-foreground tabular-nums" aria-live="polite">
        {ui.count(on, ids.length)}
      </span>
    </div>
  );
}
