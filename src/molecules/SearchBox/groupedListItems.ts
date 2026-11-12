import type { MenuItem } from '../Menu';
import type { GroupedListSection } from './useGroupedList';

/**
 * `useGroupedList` sections as DropdownMenu / CtxMenu items: a named section is a `label` header and a `radio` whose
 * options carry `depth` 1; an unnamed one a `radio` at depth 0.
 */
export function groupedListItems(
  sections: GroupedListSection[],
  value: string,
  onSelect: (path: string) => void,
): MenuItem[] {
  return sections.flatMap((s): MenuItem[] => [
    ...(s.label ? [{ kind: 'label' as const, label: s.label }] : []),
    {
      kind: 'radio',
      value,
      onChange: onSelect,
      options: s.items.map((i) => ({ value: i.path, label: i.label, depth: s.label ? 1 : 0 })),
    },
  ]);
}
