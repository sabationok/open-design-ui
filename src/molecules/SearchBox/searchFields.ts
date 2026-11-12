/** A field the caller offers to search in: `path` is its path in the record. */
export type SearchField = { label: string; path: string };
/** A dictionary of groups by key, in display order: `{ out: { label: 'From' }, in: { label: 'To' } }`. */
export type SearchGroups = Record<string, { label: string }>;

/** How a grouped list reads: group headers over the fields' own labels, or one list of «group · field» labels. */
export type SearchFieldDisplay = 'grouped' | 'flat';

/**
 * The key of the group a search field's path belongs to: the path's first segment when the dictionary has it
 * (`out.account` → `out`); a group key therefore can't contain `.`.
 */
export const searchFieldGroup = (path: string, groups?: SearchGroups): string | undefined => {
  const key = path.split('.')[0];
  return groups && path.includes('.') && key in groups ? key : undefined;
};
