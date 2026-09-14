import { useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';
import { cn } from '../lib/utils';
import { JSONViewer } from './JSONViewer';
import { SearchInput } from './SearchInput';

export interface JSONPathPickerProps {
  /** Current path value (lodash `get`-compatible, e.g. "data.items[0].email"). */
  value: string;
  onChange: (path: string) => void;
  /** Sample JSON to pick a path from. Omit to fall back to manual entry only. */
  sample?: unknown;
  placeholder?: string;
  className?: string;
}

/**
 * Path input with two entry modes: type a path manually, or expand a sample JSON
 * tree and click a node to fill it in. Used wherever a `by_path` condition needs
 * a path (DataFilter, ContextFilter) — both flavors share the same path protocol.
 */
export function JSONPathPicker({ value, onChange, sample, placeholder, className }: JSONPathPickerProps) {
  const [treeOpen, setTreeOpen] = useState(false);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1.5">
        <SearchInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'e.g. data.customer.email'}
          className="flex-1"
        />
        {sample !== undefined && (
          <button
            type="button"
            onClick={() => setTreeOpen((o) => !o)}
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-md border border-zinc-200 px-2 py-[7px] text-[12px] text-zinc-600 hover:bg-zinc-50',
              treeOpen && 'bg-zinc-50',
            )}
          >
            <ListTree className="size-3.5" />
            Pick from JSON
            <ChevronDown className={cn('size-3 transition-transform', treeOpen && 'rotate-180')} />
          </button>
        )}
      </div>
      {treeOpen && sample !== undefined && (
        <JSONViewer
          value={sample}
          defaultExpandDepth={2}
          maxHeight={280}
          selectedPath={value}
          onSelectPath={onChange}
        />
      )}
    </div>
  );
}
