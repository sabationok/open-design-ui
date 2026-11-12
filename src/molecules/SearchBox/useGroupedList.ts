import { useMemo } from 'react';
import { searchFieldGroup, type SearchField, type SearchFieldDisplay, type SearchGroups } from './searchFields';

/** A run of fields under one header; the unnamed one (`key` '') holds what no header covers. */
export type GroupedListSection = {
  key: string;
  label?: string;
  items: { path: string; label: string }[];
};

/**
 * The search fields sorted into sections by their group, with the labels to show. `grouped`: the unnamed section
 * (ungrouped fields) first, then a section per non-empty group in the dictionary's order; each label is the field's
 * own. `flat`: one unnamed section, each label «group · field». `labelOf` is the label as displayed, `fullLabelOf`
 * always has the group, `groupLabelOf` is the group's label (undefined for an ungrouped field).
 */
export function useGroupedList({
  items,
  groups,
  display = 'grouped',
}: {
  items: SearchField[];
  groups?: SearchGroups;
  display?: SearchFieldDisplay;
}) {
  return useMemo(() => {
    const full = new Map<string, string>();
    const own = new Map<string, string>();
    const keyOf = (f: SearchField) => searchFieldGroup(f.path, groups) ?? '';
    for (const f of items) {
      const key = keyOf(f);
      own.set(f.path, f.label);
      full.set(f.path, key && groups ? `${groups[key].label} · ${f.label}` : f.label);
    }
    const order = ['', ...Object.keys(groups ?? {})];
    const named = (f: SearchField) => (display === 'flat' ? full : own).get(f.path) ?? f.label;
    const sections: GroupedListSection[] =
      display === 'flat'
        ? [
            {
              key: '',
              items: order
                .flatMap((k) => items.filter((f) => keyOf(f) === k))
                .map((f) => ({ path: f.path, label: named(f) })),
            },
          ]
        : order
            .map((key) => ({
              key,
              label: key && groups ? groups[key].label : undefined,
              items: items.filter((f) => keyOf(f) === key).map((f) => ({ path: f.path, label: named(f) })),
            }))
            .filter((s) => s.items.length);
    return {
      sections,
      labelOf: (path: string) => (display === 'flat' ? full : own).get(path),
      fullLabelOf: (path: string) => full.get(path),
      groupLabelOf: (path: string) => {
        const key = searchFieldGroup(path, groups);
        return key && groups ? groups[key].label : undefined;
      },
    };
  }, [items, groups, display]);
}
