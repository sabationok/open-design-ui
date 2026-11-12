import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, Info, Loader2, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONTROL_HEIGHT, CONTROL_SQUARE } from '../lib/componentSize';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';

/** A node of a drill-down tree: accounts, categories, counterparties. */
export type TreeNode = {
  id: string;
  name: string;
  parentId?: string;
  /** false = a grouping node (wallet, currency): tapping it drills in instead of picking it. */
  selectable?: boolean;
  /** Muted line under the name. */
  hint?: string;
  /** A comment behind (i): what the node is or how it behaves. Opens in place under the row. */
  note?: string;
};

/** What «+» did: a node to pick, or a level to step into (a new parent, to name its child). */
export type TreePickerCreated = { pick: string } | { open: string };

/**
 * Many nodes ticked instead of one picked. `cascade`: 'implied' — a ticked node covers its subtree (its descendants
 * show ticked and locked); 'expand' — ticking a parent ticks every pickable node under it.
 */
export type TreePickerMultiple = {
  value: string[];
  onChange: (ids: string[]) => void;
  cascade?: 'implied' | 'expand';
};

export type TreePickerLabels = {
  search: string;
  up: string;
  all: string;
  open: (name: string) => string;
  addInto: (name: string) => string;
  addIntoTitle: string;
  note: (name: string) => string;
  notFound: string;
  loading: string;
  empty: string;
  createPath: string;
  pathSummary: (existing: number, missing: number) => string;
  createIn: (trail: string) => string;
  cancel: string;
  create: string;
  duplicate: string;
  createFailed: string;
};

const levels = (n: number) => `${n} ${n === 1 ? 'level' : 'levels'}`;

export const TREE_PICKER_LABELS: TreePickerLabels = {
  search: 'Search…',
  up: 'Up one level',
  all: 'All',
  open: (name) => `Open "${name}"`,
  addInto: (name) => `Add to "${name}"`,
  addIntoTitle: 'Add inside',
  note: (name) => `Note on "${name}"`,
  notFound: 'Nothing found',
  loading: 'Loading…',
  empty: 'Empty',
  createPath: 'Create path:',
  pathSummary: (existing, missing) =>
    existing > 0
      ? `exists: ${levels(existing)} · to create: ${missing}, the last one gets picked`
      : `creates ${levels(missing)}, the last one gets picked`,
  createIn: (trail) => `in "${trail}"`,
  cancel: 'Cancel',
  create: 'Create',
  duplicate: 'This name is already here. Pick it instead',
  createFailed: 'Could not create',
};

// "Income / Project / Salary", "inc › sal", "a > b": the segments of a path typed in the search.
const pathSegments = (v: string) =>
  v
    .split(/\s*[/›>]\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

const errorOf = (err: unknown, fallback: string) => (err instanceof Error && err.message ? err.message : fallback);

// A small square/row button inside the picker: quiet, gray hover, ring on focus.
const ROW_ACTION =
  'rounded-md transition-colors hover:bg-ds-gray-alpha-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring';
const ERROR_TEXT = 'text-xs text-vui-danger-text';

export interface TreePickerProps {
  /** The picked node (single pick). */
  value?: string;
  onPick?: (id: string) => void;
  /** A checkbox on every row in place of the single pick; a level's row ticks what is under it by `cascade`. */
  multiple?: TreePickerMultiple;
  /** Takes its container's height; the list scrolls. */
  fill?: boolean;
  /** Every node known up front (the search runs over them). */
  nodes: TreeNode[];
  /** A level's rows: `getChildrenAsync` (loaded once per level), else `getChildren`, else the nodes by `parentId`. */
  getChildren?: (level?: string) => TreeNode[];
  getChildrenAsync?: (level?: string) => Promise<TreeNode[]>;
  /** false hides the way up from that level (a root-like one); its `footer` can offer another. */
  canGoBack?: (level?: string) => boolean;
  /** The number on a row with children; default: its children count. */
  countOf?: (id: string, children: (id?: string) => TreeNode[]) => number;
  /** Bottom right of the level: the level's own actions. */
  footer?: (at: { level?: string; openLevel: (id?: string) => void }) => ReactNode;
  onLevelChange?: (level?: string) => void;
  initialLevel?: string;
  /**
   * «+» makes a child of the level you are on (a name already there is refused): `at` is the button's label
   * on a level (null = nothing to create there), `defaultName` the suggested name, `extra` more inputs beside
   * the name, `run` the call that creates it.
   */
  create?: {
    at: (level?: string) => string | null;
    defaultName: (level?: string) => string;
    extra?: (level?: string) => ReactNode;
    run: (name: string, level?: string) => Promise<TreePickerCreated>;
  };
  /**
   * A whole path made in one click: the levels not in the tree yet are created under the deepest one that is,
   * and the last is picked. `suggest`: the path proposed while nothing is typed; a path typed in the search
   * (with "/" or "›") is proposed instead when the search finds nothing.
   */
  createPath?: {
    suggest: string[];
    run: (segments: string[]) => Promise<string>;
  };
  /** Above the tree: a status line, other ways to answer. */
  header?: ReactNode;
  /** The tree is not shown but stays mounted (its level comes back as it was). */
  hidden?: boolean;
  labels?: Partial<TreePickerLabels>;
  /** The words of a failed create (an API error in the user's language). */
  errorText?: (err: unknown, fallback: string) => string;
  /** Locale for case-insensitive matching (search, duplicate names). */
  locale?: string;
  className?: string;
}

/**
 * A hierarchical picker: drill down a tree of nodes, search it (plain words or a "a / b" path), pick one or tick
 * many, or create a child of the level you are on / a whole path in one click.
 */
export function TreePicker({
  value,
  onPick,
  multiple,
  fill,
  nodes,
  getChildren,
  getChildrenAsync,
  canGoBack = () => true,
  countOf,
  footer,
  onLevelChange,
  initialLevel,
  create,
  createPath,
  header,
  hidden,
  labels: labelsIn,
  errorText = errorOf,
  locale,
  className,
}: TreePickerProps) {
  const labels = { ...TREE_PICKER_LABELS, ...labelsIn };
  const norm = (v: string) => v.trim().toLocaleLowerCase(locale);
  // Levels loaded by `getChildrenAsync`, by level ('' = the top).
  const [loaded, setLoaded] = useState<Map<string, TreeNode[]>>(() => new Map());
  const byId = useMemo(() => new Map([...nodes, ...[...loaded.values()].flat()].map((n) => [n.id, n])), [nodes, loaded]);
  const [level, setLevel] = useState<string | undefined>(() =>
    initialLevel && byId.has(initialLevel) ? initialLevel : undefined,
  );
  // A level not loaded yet is loading (a failed load stays "loading").
  const loading = !!getChildrenAsync && !loaded.has(level ?? '');
  useEffect(() => {
    const at = level ?? '';
    if (!getChildrenAsync || loaded.has(at)) return;
    let live = true;
    void getChildrenAsync(level).then((rows) => live && setLoaded((m) => new Map(m).set(at, rows)));
    return () => {
      live = false;
    };
  }, [level, getChildrenAsync, loaded]);
  const [query, setQuery] = useState('');
  // The node whose note is open under its row.
  const [noteOf, setNoteOf] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string | null>(null); // the «+» input when open
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [makingPath, setMakingPath] = useState(false);

  const byParent = useMemo(() => {
    const m = new Map<string, TreeNode[]>();
    for (const n of nodes) {
      const parent = n.parentId && byId.has(n.parentId) ? n.parentId : '';
      m.set(parent, [...(m.get(parent) ?? []), n]);
    }
    return m;
  }, [nodes, byId]);
  const children = (id?: string) => loaded.get(id ?? '') ?? getChildren?.(id) ?? byParent.get(id ?? '') ?? [];
  const countOfRow = (n: TreeNode) => countOf?.(n.id, children) ?? children(n.id).length;
  const ancestors = (n: TreeNode) => {
    const out: TreeNode[] = [];
    for (let p = n.parentId ? byId.get(n.parentId) : undefined; p; p = p.parentId ? byId.get(p.parentId) : undefined)
      out.unshift(p);
    return out;
  };
  const current = level ? byId.get(level) : undefined;
  const trail = current ? [...ancestors(current), current] : [];

  const q = norm(query);
  const pathOf = (n: TreeNode) =>
    ancestors(n)
      .map((p) => p.name)
      .join(' › ');
  // Deep search: a path typed with "/" or "›" matches its segments level by level, in order (the last one on
  // the node itself, the others on its parents); plain words match the name or the path.
  const segments = pathSegments(query).map(norm);
  const deepMatch = (n: TreeNode) => {
    const names = [...ancestors(n), n].map((x) => norm(x.name));
    if (!names.at(-1)!.includes(segments.at(-1)!)) return false;
    let i = 0;
    for (const name of names.slice(0, -1)) if (i < segments.length - 1 && name.includes(segments[i])) i++;
    return i === segments.length - 1;
  };
  const rows = q
    ? nodes.filter(
        (n) =>
          n.selectable !== false && (segments.length > 1 ? deepMatch(n) : norm(`${n.name} ${pathOf(n)}`).includes(q)),
      )
    : children(level);
  // The path to propose: the typed one (only when the search finds nothing), else the suggested one; what of it
  // the tree has (by name, level by level from the top) and what would be made.
  const proposed = !createPath
    ? []
    : segments.length > 1
      ? rows.length
        ? []
        : pathSegments(query)
      : q
        ? []
        : createPath.suggest;
  const existing: TreeNode[] = [];
  for (const name of proposed) {
    const next = children(existing.at(-1)?.id).find((c) => norm(c.name.replace(/ \*$/, '')) === norm(name));
    if (!next) break;
    existing.push(next);
  }
  const missing = proposed.slice(existing.length);

  async function makePath() {
    if (!createPath || makingPath) return;
    setMakingPath(true);
    setCreateError(null);
    try {
      const id = await createPath.run(proposed);
      onPick?.(id);
      setQuery('');
    } catch (err) {
      setCreateError(errorText(err, labels.createFailed));
    } finally {
      setMakingPath(false);
    }
  }

  function openLevel(id?: string) {
    setLevel(id);
    onLevelChange?.(id);
    setQuery('');
    setDraftName(null);
    setCreateError(null);
  }

  function closeCreate() {
    setDraftName(null);
    setCreateError(null);
  }

  const createLabel = q || !create ? null : create.at(level);
  const levelFooter = q ? null : footer?.({ level, openLevel });
  const duplicate =
    draftName !== null && children(level).some((n) => norm(n.name.replace(/ \*$/, '')) === norm(draftName));

  // Esc within the «+» sheet closes the sheet only. A Radix modal around the picker listens on the document in
  // the capture phase, so the sheet catches it earlier, on the window.
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetOpen = draftName !== null;
  // The name input starts below the picker (the sheet slides up): focused without scrolling, or a modal around
  // it would scroll mid-animation.
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (sheetOpen) nameRef.current?.focus({ preventScroll: true });
  }, [sheetOpen, level]);
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !sheetRef.current?.contains(document.activeElement)) return;
      e.stopPropagation();
      setDraftName(null);
      setCreateError(null);
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [sheetOpen]);

  async function addHere() {
    const name = draftName?.trim();
    if (!name || duplicate || creating || !create) return;
    setCreating(true);
    setCreateError(null);
    try {
      const done = await create.run(name, level);
      if ('pick' in done) {
        onPick?.(done.pick);
        setDraftName(null);
      } else {
        // A new parent: step into it, its child's name already in the input.
        setLevel(done.open);
        onLevelChange?.(done.open);
        setDraftName(create.defaultName(done.open));
      }
    } catch (err) {
      setCreateError(errorText(err, labels.createFailed));
    } finally {
      setCreating(false);
    }
  }

  // Many ticked (`multiple`): what a row's checkbox shows and which ids it ticks.
  const chosen = new Set(multiple?.value ?? []);
  const expand = multiple?.cascade === 'expand';
  const leavesOf = (n: TreeNode): string[] => [
    ...(n.selectable !== false ? [n.id] : []),
    ...children(n.id).flatMap(leavesOf),
  ];
  const coveredByParent = (n: TreeNode) => ancestors(n).some((p) => chosen.has(p.id));
  const idsOf = (list: TreeNode[]) => list.flatMap((n) => (expand ? leavesOf(n) : coveredByParent(n) ? [] : [n.id]));
  const tickOf = (list: TreeNode[]) => {
    if (!expand && list.length === 1 && coveredByParent(list[0]))
      return { checked: true, indeterminate: false, disabled: true };
    const ids = idsOf(list);
    const on = ids.filter((id) => chosen.has(id)).length;
    return { checked: !!ids.length && on === ids.length, indeterminate: on > 0 && on < ids.length, disabled: !ids.length };
  };
  const toggle = (list: TreeNode[]) => {
    if (!multiple) return;
    const ids = idsOf(list);
    multiple.onChange(
      tickOf(list).checked
        ? multiple.value.filter((id) => !ids.includes(id))
        : [...new Set([...multiple.value, ...ids])],
    );
  };

  return (
    <div className={cn('flex flex-col gap-2', fill && 'min-h-0 flex-1', className)}>
      {header}
      <div
        className={cn(
          // `clip`, not `hidden`: no scroll box a focus inside the rising sheet could scroll.
          'relative flex flex-col gap-1.5 overflow-clip rounded-md border border-border bg-background p-2',
          fill && 'min-h-0 flex-1',
          // Tall enough while the «+» sheet is open for it to fit over a short level.
          createLabel && sheetOpen && 'min-h-52',
          hidden && 'hidden',
        )}
      >
        <Input
          className={cn(CONTROL_HEIGHT.sm, 'text-xs')}
          placeholder={labels.search}
          aria-label={labels.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!q && (
          <nav className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {trail.length > 0 && canGoBack(level) && (
              <button
                type="button"
                aria-label={labels.up}
                className={cn(ROW_ACTION, 'p-0.5')}
                onClick={() => openLevel(trail.at(-2)?.id)}
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
            )}
            {/* The top is reachable only when the first level of the trail lets you up. */}
            {(!trail.length || canGoBack(trail[0].id)) && (
              <button
                type="button"
                className={cn(ROW_ACTION, 'px-0.5 hover:bg-transparent hover:text-foreground')}
                aria-current={!trail.length ? 'location' : undefined}
                onClick={() => openLevel(undefined)}
              >
                {labels.all}
              </button>
            )}
            {trail.map((t, i) => (
              <span key={t.id} className="flex items-center gap-1">
                {(i > 0 || canGoBack(t.id)) && <span aria-hidden>›</span>}
                <button
                  type="button"
                  className={cn(ROW_ACTION, 'px-0.5 hover:bg-transparent hover:text-foreground')}
                  aria-current={i === trail.length - 1 ? 'location' : undefined}
                  onClick={() => openLevel(t.id)}
                >
                  {t.name}
                </button>
              </span>
            ))}
          </nav>
        )}
        {/* At most 5.5 rows (2rem each): the half row says the list scrolls. */}
        <div className={cn('flex flex-col overflow-auto', fill ? 'min-h-0 flex-1' : 'max-h-44')}>
          {rows.map((n) => {
            // The name picks the node (or opens it, if it is not to pick), the number opens its level, «+» opens
            // it with the name input when `create.at` allows creating there.
            const kids = !q && children(n.id).length > 0;
            const canAdd = !q && !!create?.at(n.id);
            const selected = !multiple && value !== undefined && value === n.id;
            const tick = multiple ? tickOf([n]) : null;
            return (
              <Fragment key={n.id}>
                <div className="flex items-center">
                  {tick && (
                    <Checkbox
                      aria-label={n.name}
                      wrapperClassName="ml-2 inline-flex shrink-0"
                      checked={tick.checked}
                      indeterminate={tick.indeterminate}
                      disabled={tick.disabled}
                      onChange={() => toggle([n])}
                    />
                  )}
                  <button
                    type="button"
                    aria-pressed={multiple ? undefined : selected}
                    className={cn(
                      ROW_ACTION,
                      'flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm text-foreground',
                      selected && 'bg-vui-accent-bg text-vui-accent-text hover:bg-vui-accent-bg',
                    )}
                    onClick={() => (n.selectable === false ? openLevel(n.id) : multiple ? toggle([n]) : onPick?.(n.id))}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{n.name}</span>
                      {(q || n.hint) && (
                        <span className="truncate text-xs text-ds-gray-700">
                          {(q ? [n.hint, pathOf(n)] : [n.hint]).filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </span>
                    {selected && <Check aria-hidden className="size-4 shrink-0" />}
                  </button>
                  {kids && (
                    <button
                      type="button"
                      aria-label={labels.open(n.name)}
                      className={cn(ROW_ACTION, 'flex items-center gap-0.5 px-2 py-1.5 text-xs text-muted-foreground tabular-nums')}
                      onClick={() => openLevel(n.id)}
                    >
                      {countOfRow(n)}
                      <ChevronRight aria-hidden className="size-4" />
                    </button>
                  )}
                  {canAdd && (
                    <button
                      type="button"
                      aria-label={labels.addInto(n.name)}
                      title={labels.addIntoTitle}
                      className={cn(ROW_ACTION, 'px-2 py-1.5 text-ds-gray-700 hover:text-vui-accent-text')}
                      onClick={() => {
                        openLevel(n.id);
                        setDraftName(create?.defaultName(n.id) ?? '');
                      }}
                    >
                      <Plus aria-hidden className="size-4" />
                    </button>
                  )}
                  {n.note && (
                    <button
                      type="button"
                      aria-label={labels.note(n.name)}
                      aria-expanded={noteOf === n.id}
                      className={cn(
                        ROW_ACTION,
                        'px-2 py-1.5 text-ds-gray-700 hover:text-foreground',
                        noteOf === n.id && 'text-foreground',
                      )}
                      onClick={() => setNoteOf((id) => (id === n.id ? null : n.id))}
                    >
                      <Info aria-hidden className="size-3.5" />
                    </button>
                  )}
                </div>
                {n.note && noteOf === n.id && <p className="px-2 pb-1.5 text-xs text-muted-foreground">{n.note}</p>}
              </Fragment>
            );
          })}
          {rows.length === 0 && (
            <p role={loading && !q ? 'status' : undefined} className="px-2 py-1.5 text-xs text-ds-gray-700">
              {q ? labels.notFound : loading ? labels.loading : labels.empty}
            </p>
          )}
        </div>
        {missing.length > 0 && (
          <button
            type="button"
            disabled={makingPath}
            className={cn(
              ROW_ACTION,
              'flex items-start gap-2 border border-dashed border-ds-gray-alpha-500 px-2 py-1.5 text-left text-xs disabled:opacity-60',
            )}
            onClick={() => void makePath()}
          >
            {makingPath ? (
              <Loader2 aria-hidden className="mt-0.5 size-3.5 shrink-0 animate-spin text-vui-accent-text" />
            ) : (
              <Plus aria-hidden className="mt-0.5 size-3.5 shrink-0 text-vui-accent-text" />
            )}
            <span className="flex min-w-0 flex-col">
              <span className="text-foreground">
                {labels.createPath}{' '}
                {existing.length > 0 && (
                  <span className="text-muted-foreground">{existing.map((e) => e.name).join(' › ')} › </span>
                )}
                <span className="font-medium">{missing.join(' › ')}</span>
              </span>
              <span className="text-ds-gray-700">{labels.pathSummary(existing.length, missing.length)}</span>
            </span>
          </button>
        )}
        {createError && !sheetOpen && (
          <span role="alert" className={ERROR_TEXT}>
            {createError}
          </span>
        )}
        {/* The level's bottom row: «+» on the left, the level's own actions on the right. It stays while the
            sheet is open (under it), so the picker keeps its height. */}
        {(createLabel || levelFooter) && (
          <div className="flex items-center justify-between gap-2">
            {createLabel ? (
              <button
                type="button"
                className={cn(ROW_ACTION, 'flex items-center gap-1 px-2 py-1 text-xs text-vui-accent-text')}
                onClick={() => setDraftName(create?.defaultName(level) ?? '')}
              >
                <Plus aria-hidden className="size-3.5" /> {createLabel}
              </button>
            ) : (
              <span />
            )}
            {levelFooter}
          </div>
        )}
        {/* The «+» form: a sheet over the picker, risen from its bottom; the list dims behind it. */}
        {createLabel && sheetOpen && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-background/70 motion-safe:animate-in motion-safe:fade-in-0"
              onClick={closeCreate}
            />
            <div
              ref={sheetRef}
              role="dialog"
              aria-label={createLabel}
              className="absolute inset-x-3 bottom-3 flex flex-col gap-2 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-ds-large motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4"
            >
              <div className="flex items-start gap-2">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs font-medium text-foreground">{createLabel}</span>
                  {trail.length > 0 && (
                    <span className="truncate text-xs text-ds-gray-700">
                      {labels.createIn(trail.map((t) => t.name).join(' › '))}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  aria-label={labels.cancel}
                  title={`${labels.cancel} (Esc)`}
                  className={cn(ROW_ACTION, CONTROL_SQUARE.xs, 'grid shrink-0 place-items-center text-muted-foreground hover:text-foreground')}
                  onClick={closeCreate}
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              {create?.extra?.(level)}
              <div className="flex items-center gap-1">
                <Input
                  ref={nameRef}
                  className={cn(CONTROL_HEIGHT.sm, 'min-w-0 flex-1 text-xs')}
                  aria-label={createLabel}
                  aria-invalid={duplicate || !!createError || undefined}
                  value={draftName}
                  onChange={(e) => {
                    setDraftName(e.target.value);
                    setCreateError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void addHere();
                  }}
                />
                <button
                  type="button"
                  aria-label={labels.create}
                  title={`${labels.create} (Enter)`}
                  className={cn(
                    CONTROL_SQUARE.sm,
                    'grid shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40',
                  )}
                  disabled={!draftName.trim() || duplicate || creating}
                  onClick={() => void addHere()}
                >
                  {creating ? (
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                  ) : (
                    <Check aria-hidden className="size-4" />
                  )}
                </button>
              </div>
              {duplicate && <span className={ERROR_TEXT}>{labels.duplicate}</span>}
              {createError && (
                <span role="alert" className={ERROR_TEXT}>
                  {createError}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
