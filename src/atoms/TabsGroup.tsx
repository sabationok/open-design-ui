import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { ComponentSize } from '../lib/componentSize';
import { Dot } from './Dot';

const SIZE: Record<ComponentSize, string> = {
  xs: 'px-1.5 py-1.5 text-xs',
  sm: 'px-2 py-2 text-[13px]',
  md: 'px-2 py-2.5 text-sm',
};

export interface TabsGroupItem<K extends string> {
  key: K;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsGroupLink {
  /** A Link's `to`, relative to the current route. */
  to: string;
  label: ReactNode;
  /** Match the path exactly (react-router `end`). */
  end?: boolean;
  disabled?: boolean;
}

interface TabsGroupCommon {
  size?: ComponentSize;
  /** Accessible name of the tab row. */
  label?: string;
  /** Per tab (its `key`; a url tab: its `to`): something is set in it (filled dot) or not (hollow). */
  marks?: Partial<Record<string, boolean>>;
  className?: string;
}

export interface TabsGroupInMemoryProps<K extends string> extends TabsGroupCommon {
  navType?: 'inmemory';
  items: readonly TabsGroupItem<K>[];
  value: K;
  onChange: (key: K) => void;
}

export interface TabsGroupUrlProps extends TabsGroupCommon {
  navType: 'url';
  items: readonly TabsGroupLink[];
}

export interface TabsGroupHashProps<K extends string> extends TabsGroupCommon {
  navType: 'hash';
  items: readonly TabsGroupItem<K>[];
  /** The tab while the location has no (known) hash; none: the first. */
  defaultValue?: K;
}

export type TabsGroupProps<K extends string = string> =
  | TabsGroupInMemoryProps<K>
  | TabsGroupUrlProps
  | TabsGroupHashProps<K>;

/**
 * Underlined tab row. One look, three ways to hold the active tab:
 * - `navType: 'inmemory'` (default): controlled `value` + `onChange`; tabs are buttons in a `tablist` (arrow keys move).
 * - `navType: 'url'`: tabs are NavLinks, the active one is the current route (`end` for exact). `NavTabs` is this preset.
 * - `navType: 'hash'`: tabs are `#key` links on the same page (path and query kept); `defaultValue` without a hash.
 * `marks` adds a filled / hollow "is set" dot per tab. Scrolls horizontally on phones. A 2–5 option segmented
 * switch in a toolbar is `TabButtons`.
 */
export function TabsGroup<K extends string>(props: TabsGroupProps<K>) {
  if (props.navType === 'url') return <UrlTabs {...props} />;
  if (props.navType === 'hash') return <HashTabs {...props} />;
  return <InMemoryTabs {...props} />;
}

function InMemoryTabs<K extends string>({
  items,
  value,
  onChange,
  size = 'md',
  label,
  marks,
  className,
}: TabsGroupInMemoryProps<K>) {
  const rowRef = useRef<HTMLDivElement>(null);

  // WAI-ARIA tabs: arrows / Home / End move to the next enabled tab and select it.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((t) => !t.disabled);
    const at = enabled.findIndex((t) => t.key === value);
    let next: TabsGroupItem<K> | undefined;
    if (e.key === 'ArrowRight') next = enabled[(at + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(at - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    onChange(next.key);
    rowRef.current?.querySelector<HTMLButtonElement>(`[data-key="${CSS.escape(next.key)}"]`)?.focus();
  };

  return (
    <div
      ref={rowRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(ROW, className)}
    >
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            data-key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.key)}
            className={tabClass(size, selected)}
          >
            <TabLabel label={item.label} mark={marks?.[item.key]} />
          </button>
        );
      })}
    </div>
  );
}

// Its own component: the router hooks run only for route tabs, so value tabs need no router.
function UrlTabs({ items, size = 'md', label, marks, className }: TabsGroupUrlProps) {
  return (
    <nav aria-label={label} className={cn(ROW, className)}>
      {items.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          aria-disabled={t.disabled || undefined}
          tabIndex={t.disabled ? -1 : undefined}
          className={({ isActive }) => cn(tabClass(size, isActive), t.disabled && DISABLED_LINK)}
        >
          <TabLabel label={t.label} mark={marks?.[t.to]} />
        </NavLink>
      ))}
    </nav>
  );
}

// The tab is the location's hash: a link keeps the path and the query, changes the hash only.
function HashTabs<K extends string>({
  items,
  defaultValue,
  size = 'md',
  label,
  marks,
  className,
}: TabsGroupHashProps<K>) {
  const { pathname, search, hash } = useLocation();
  const current = items.find((t) => `#${t.key}` === hash)?.key ?? defaultValue ?? items[0]?.key;
  return (
    <nav aria-label={label} className={cn(ROW, className)}>
      {items.map((t) => (
        <Link
          key={t.key}
          to={{ pathname, search, hash: t.key }}
          aria-current={t.key === current ? 'location' : undefined}
          aria-disabled={t.disabled || undefined}
          tabIndex={t.disabled ? -1 : undefined}
          className={cn(tabClass(size, t.key === current), t.disabled && DISABLED_LINK)}
        >
          <TabLabel label={t.label} mark={marks?.[t.key]} />
        </Link>
      ))}
    </nav>
  );
}

function TabLabel({ label, mark }: { label: ReactNode; mark: boolean | undefined }) {
  if (mark === undefined) return <>{label}</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <Dot size="sm" color={mark ? 'bg-vui-accent' : 'border border-ds-gray-700 bg-transparent'} />
    </span>
  );
}

const ROW = 'flex shrink-0 gap-1 overflow-x-auto border-b border-border [scrollbar-width:none]';
const DISABLED_LINK = 'pointer-events-none opacity-50';

const tabClass = (size: ComponentSize, selected: boolean) =>
  cn(
    'relative shrink-0 whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
    SIZE[size],
    selected
      ? 'font-medium text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-foreground'
      : 'text-muted-foreground hover:text-foreground',
  );
