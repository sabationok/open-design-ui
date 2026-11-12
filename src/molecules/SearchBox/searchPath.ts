/** A list request's text search: `path` is `'<mode>:<field>'` (see `toSearchPath`), `value` the text. */
export type SearchParams<P extends string = string> = { path: P; value: string };

/** `like`: the whole value equals the text; `ilike`: the value contains it. */
export const SEARCH_MODES = ['like', 'ilike'] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

/** The field path that means «search in all fields». */
export const SEARCH_ALL_FIELDS = '*';

/** Where and how to search: a field path (or SEARCH_ALL_FIELDS) and the match mode. */
export type SearchTarget = { field: string; mode: SearchMode };

const isMode = (v: string): v is SearchMode => (SEARCH_MODES as readonly string[]).includes(v);

/** `{ field: 'name', mode: 'ilike' }` → `'ilike:name'`. */
export const toSearchPath = ({ field, mode }: SearchTarget): string => `${mode}:${field}`;

/** `'ilike:name'` → `{ field: 'name', mode: 'ilike' }`; a path without a mode is a partial match on it. */
export function parseSearchPath(path: string): SearchTarget {
  const at = path.indexOf(':');
  const mode = at > 0 ? path.slice(0, at) : '';
  return isMode(mode) ? { mode, field: path.slice(at + 1) } : { mode: 'ilike', field: path };
}

/** The list request's search; blank text is no search. */
export function toSearchParams(target: SearchTarget, text: string): SearchParams | undefined {
  return text.trim() ? { path: toSearchPath(target), value: text } : undefined;
}

/**
 * Client-side match of one value: `like` = equals, `ilike` = contains; both ignore case and outer spaces.
 * `locale` drives the lower-casing (default: the runtime's).
 */
export function matchesSearch(
  value: string | null | undefined,
  text: string,
  mode: SearchMode,
  locale?: string,
): boolean {
  const v = (value ?? '').trim().toLocaleLowerCase(locale);
  const t = text.trim().toLocaleLowerCase(locale);
  return mode === 'like' ? v === t : v.includes(t);
}
