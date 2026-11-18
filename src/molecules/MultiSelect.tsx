import { cn } from '../lib/utils';
import { RemovableChips } from './RemovableChips';
import { SearchSelect } from './SearchSelect';
import { useMultiSelect, type UseMultiSelectArgs } from './useMultiSelect';

export interface MultiSelectProps<V extends string = string> extends UseMultiSelectArgs<V> {
  className?: string;
}

/**
 * Several values of a list: picked from a dropdown with a search, each a chip with a × to take it out.
 * A picked option leaves the dropdown, which stays open for the next. Controlled (`value` + `onChange`).
 * Dropdown and chips apart: useMultiSelect. For a short list without a dropdown use ChipMultiSelect,
 * for names that can be new ChipPicker.
 */
export function MultiSelect<V extends string = string>({ className, ...args }: MultiSelectProps<V>) {
  const { select, chips, selected } = useMultiSelect(args);
  return (
    <div className={cn('flex min-w-0 flex-col items-end gap-2', className)}>
      <SearchSelect {...select} />
      {selected && <RemovableChips {...chips} />}
    </div>
  );
}
