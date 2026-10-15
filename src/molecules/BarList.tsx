import { useMemo, useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BarListNode<T = unknown> {
  id: string;
  /** Missing, `null` or unknown parent → root level. */
  parentId?: string | null;
  label: ReactNode;
  /** Payload handed back to `getValue`/`format`, e.g. the category entity. */
  data?: T;
}

export interface BarListProps<T = unknown> {
  /** Flat list; the tree is built from `parentId`. A flat list without parents is a plain ranked bar list. */
  nodes: BarListNode<T>[];
  /** The node's own value. The caller decides where it comes from (period, live, which jsonb key). */
  getValue: (node: BarListNode<T>) => number | null | undefined;
  format?: (value: number, node: BarListNode<T>) => ReactNode;
  /**
   * Parent value = own + Σ children. Off by default: stats snapshots arrive already aggregated up the tree
   * (corrections/storno included as nested deltas). Turn on only for own-only values.
   */
  rollup?: boolean;
  /** Hide nodes whose (rolled-up) value is 0 or missing. Default true. */
  hideEmpty?: boolean;
  /** Max rows per level before a "+N more" row. */
  limit?: number;
  /** Levels expanded initially: 0 = only roots visible. */
  defaultExpandedDepth?: number;
  onSelect?: (node: BarListNode<T>) => void;
  moreLabel?: (hidden: number) => ReactNode;
  empty?: ReactNode;
  className?: string;
}

interface TreeItem<T> {
  node: BarListNode<T>;
  value: number;
  children: TreeItem<T>[];
}

function buildTree<T>(
  nodes: BarListNode<T>[],
  getValue: BarListProps<T>['getValue'],
  rollup: boolean,
  hideEmpty: boolean,
): TreeItem<T>[] {
  const ids = new Set(nodes.map((n) => n.id));
  const byParent = new Map<string | null, BarListNode<T>[]>();
  for (const n of nodes) {
    const parent = n.parentId && ids.has(n.parentId) && n.parentId !== n.id ? n.parentId : null;
    byParent.set(parent, [...(byParent.get(parent) ?? []), n]);
  }

  const visit = (parent: string | null, seen: Set<string>): TreeItem<T>[] =>
    (byParent.get(parent) ?? [])
      .filter((n) => !seen.has(n.id)) // cycle guard
      .map((node) => {
        const children = visit(node.id, new Set(seen).add(node.id));
        const own = getValue(node) ?? 0;
        const value = rollup ? own + children.reduce((s, c) => s + c.value, 0) : own;
        return { node, value, children };
      })
      .filter((it) => !hideEmpty || it.value !== 0)
      .sort((a, b) => b.value - a.value);

  return visit(null, new Set());
}

// Chevron slot (24px) + gap: each level shifts one slot right.
const INDENT = 26;
const defaultFormat = (v: number) => v.toLocaleString();
const defaultMore = (n: number) => `+${n} ще`;

// Ranked horizontal bars; with `parentId` it becomes a collapsible tree.
// Bar width is relative to the largest sibling, so every level reads as its own ranking.
export function BarList<T = unknown>({
  nodes,
  getValue,
  format = defaultFormat,
  rollup = false,
  hideEmpty = true,
  limit,
  defaultExpandedDepth = 0,
  onSelect,
  moreLabel = defaultMore,
  empty = 'Немає даних',
  className,
}: BarListProps<T>) {
  const tree = useMemo(() => buildTree(nodes, getValue, rollup, hideEmpty), [nodes, getValue, rollup, hideEmpty]);
  const [toggled, setToggled] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAll] = useState<Set<string>>(() => new Set());

  // Any branch in the tree → every row reserves the chevron slot, so labels line up per depth.
  const isTree = tree.some((i) => i.children.length > 0);

  if (!tree.length) return <p className="py-6 text-center text-[13px] text-ds-gray-700">{empty}</p>;

  const flip = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (!next.delete(id)) next.add(id);
    return next;
  };

  const renderLevel = (items: TreeItem<T>[], depth: number, parentKey: string): ReactNode => {
    const max = Math.max(...items.map((i) => Math.abs(i.value))) || 1;
    const cut = limit && !showAll.has(parentKey) && items.length > limit ? limit : items.length;
    return (
      <>
        {items.slice(0, cut).map(({ node, value, children }) => {
          const hasChildren = children.length > 0;
          // Initial state by depth; a click flips it, so `toggled` stores deviations from the default.
          const expanded = hasChildren && depth < defaultExpandedDepth !== toggled.has(node.id);
          const toggle = () => setToggled((s) => flip(s, node.id));
          const select = onSelect ? () => onSelect(node) : hasChildren ? toggle : undefined;
          const body = (
            <>
              <span
                className="absolute inset-y-0 left-0 rounded-md bg-ds-gray-100 transition-[width]"
                style={{ width: `${Math.max(2, (Math.abs(value) / max) * 100)}%` }}
              />
              <span className="relative min-w-0 flex-1 truncate text-left text-[13px] text-foreground">{node.label}</span>
              <span className="relative shrink-0 text-[13px] tabular-nums text-foreground">{format(value, node)}</span>
            </>
          );
          const rowCls = 'relative flex h-8 min-w-0 flex-1 items-center gap-3 px-2';
          return (
            <li key={node.id} role="treeitem" aria-level={depth + 1} aria-expanded={hasChildren ? expanded : undefined}>
              <div className="flex items-center gap-0.5" style={{ paddingLeft: depth * INDENT }}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={expanded ? 'Згорнути' : 'Розгорнути'}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-ds-gray-700 hover:bg-ds-gray-alpha-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronRight className={cn('size-3.5 transition-transform', expanded && 'rotate-90')} />
                  </button>
                ) : (
                  isTree && <span className="size-6 shrink-0" />
                )}
                {select ? (
                  <button
                    type="button"
                    onClick={select}
                    className={cn(rowCls, 'rounded-md hover:ring-1 hover:ring-ds-gray-alpha-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={rowCls}>{body}</div>
                )}
              </div>
              {expanded && (
                <ul role="group" className="mt-1 flex flex-col gap-1">
                  {renderLevel(children, depth + 1, node.id)}
                </ul>
              )}
            </li>
          );
        })}
        {cut < items.length && (
          <li role="none" style={{ paddingLeft: (depth + (isTree ? 1 : 0)) * INDENT }}>
            <button
              type="button"
              onClick={() => setShowAll((s) => flip(s, parentKey))}
              className="h-7 rounded-md px-2 text-xs text-muted-foreground hover:bg-ds-gray-alpha-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {moreLabel(items.length - cut)}
            </button>
          </li>
        )}
      </>
    );
  };

  return (
    <ul role="tree" className={cn('flex flex-col gap-1', className)}>
      {renderLevel(tree, 0, '__root__')}
    </ul>
  );
}
