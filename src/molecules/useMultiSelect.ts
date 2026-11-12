import type { RemovableChipsProps } from './RemovableChips';
import type { SearchSelectOption, SearchSelectProps } from './SearchSelect';

export interface UseMultiSelectArgs<V extends string = string> {
  options: SearchSelectOption<V>[];
  /** The picked options' values. Controlled. */
  value: V[];
  onChange: (values: V[]) => void;
  /** The list's name: the dropdown's aria-label and the chips' label. */
  label: string;
  /** The dropdown's text while nothing is picked. */
  placeholder?: string;
  /** aria-label of a chip's × (gets the option's label). Default `Remove {name}`. */
  removeLabel?: (name: string) => string;
}

export interface UseMultiSelectResult<V extends string = string> {
  /** Props for SearchSelect: a picked option leaves the list, which stays open. */
  select: SearchSelectProps<V | ''>;
  /** Props for RemovableChips, labels taken from the options. */
  chips: RemovableChipsProps<V>;
  /** Whether there is anything to show as chips. */
  selected: boolean;
}

/** The logic of MultiSelect without its markup: props for its dropdown and its chips, when they sit apart. */
export function useMultiSelect<V extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder,
  removeLabel,
}: UseMultiSelectArgs<V>): UseMultiSelectResult<V> {
  const select: SearchSelectProps<V | ''> = {
    align: 'end',
    keepOpen: true,
    value: '',
    label,
    placeholder,
    options: options.filter((o) => !value.includes(o.value)),
    onChange: (next) => {
      if (next) onChange([...value, next]);
    },
  };
  const chips: RemovableChipsProps<V> = {
    label,
    items: value,
    show: (item) => options.find((o) => o.value === item)?.label ?? item,
    onRemove: (item) => onChange(value.filter((v) => v !== item)),
    removeLabel,
  };
  return { select, chips, selected: value.length > 0 };
}
