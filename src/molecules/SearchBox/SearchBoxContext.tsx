import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ComponentSize } from '../../lib/componentSize';
import type { MenuItem } from '../Menu';
import {
  parseSearchPath,
  SEARCH_ALL_FIELDS,
  toSearchParams,
  type SearchMode,
  type SearchParams,
  type SearchTarget,
} from './searchPath';
import type { SearchField, SearchFieldDisplay, SearchGroups } from './searchFields';

/** SearchBox's own strings; every one is overridable through `labels`. */
export const SEARCH_BOX_LABELS = {
  /** aria-label / tooltip prefix of the options button. */
  options: 'Search options',
  /** The «all fields» entry at the top of the field list. */
  allFields: 'All fields',
  /** The field sub-menu: «Search in: <field>». */
  searchIn: 'Search in',
  /** The mode sub-menu: «Match: <mode>». */
  match: 'Match',
  /** `ilike` mode. */
  contains: 'Contains',
  /** `like` mode. */
  exact: 'Exact match',
};
export type SearchBoxLabels = typeof SEARCH_BOX_LABELS;

/** SearchBox's configuration (its props without `className`). */
export interface SearchBoxConfig {
  /** Controlled search; `undefined` = no search. */
  value?: SearchParams;
  /** Blank text → `undefined`. */
  onChange: (next?: SearchParams) => void;
  /** The fields to search in; «all fields» is added first. */
  fields: SearchField[];
  /** A field whose path starts with a group's key (`out.account`) is listed under that group's header. */
  groups?: SearchGroups;
  /** `grouped` (default): headers; `flat`: one list of «group · field» labels. */
  display?: SearchFieldDisplay;
  placeholder?: string;
  /** Field chosen while no search is set (default SEARCH_ALL_FIELDS). */
  defaultField?: string;
  /** Mode chosen while no search is set (default `ilike`). */
  defaultMode?: SearchMode;
  /** The caller's own options after the field and mode sub-menus, behind a separator. */
  extraItems?: MenuItem[];
  size?: ComponentSize;
  labels?: Partial<SearchBoxLabels>;
}

/** What SearchBox's private parts read: the box's configuration, the chosen target and the ways to change it. */
type SearchBoxContextValue = {
  /** The caller's fields with «all fields» first. */
  fields: SearchField[];
  groups?: SearchGroups;
  display: SearchFieldDisplay;
  size: ComponentSize;
  placeholder?: string;
  labels: SearchBoxLabels;
  extraItems?: MenuItem[];
  target: SearchTarget;
  text: string;
  setText: (text: string) => void;
  /** Changes the field and / or the match mode; kept while the text is empty. */
  select: (patch: Partial<SearchTarget>) => void;
};

const SearchBoxContext = createContext<SearchBoxContextValue | null>(null);

/** For the parts of SearchBox only (this folder). */
export function useSearchBox(): SearchBoxContextValue {
  const ctx = useContext(SearchBoxContext);
  if (!ctx) throw new Error('useSearchBox: outside a SearchBoxProvider');
  return ctx;
}

/** The private context of SearchBox: configuration, the chosen field and mode, the text and how to change them. */
export function SearchBoxProvider({
  value,
  onChange,
  fields,
  groups,
  display = 'grouped',
  placeholder,
  defaultField = SEARCH_ALL_FIELDS,
  defaultMode = 'ilike',
  extraItems,
  size = 'sm',
  labels,
  children,
}: SearchBoxConfig & { children: ReactNode }) {
  // Kept for an empty search, which has no path to carry the choice.
  const [kept, setKept] = useState<SearchTarget>({ field: defaultField, mode: defaultMode });
  const target = value ? parseSearchPath(value.path) : kept;
  const text = value?.value ?? '';
  const ui = useMemo(() => ({ ...SEARCH_BOX_LABELS, ...labels }), [labels]);

  const all = useMemo(() => [{ path: SEARCH_ALL_FIELDS, label: ui.allFields }, ...fields], [fields, ui.allFields]);

  const ctx: SearchBoxContextValue = {
    fields: all,
    groups,
    display,
    size,
    placeholder,
    labels: ui,
    extraItems,
    target,
    text,
    setText: (next) => onChange(toSearchParams(target, next)),
    select: (patch) => {
      const next = { ...target, ...patch };
      setKept(next);
      if (value) onChange(toSearchParams(next, text));
    },
  };
  return <SearchBoxContext.Provider value={ctx}>{children}</SearchBoxContext.Provider>;
}
