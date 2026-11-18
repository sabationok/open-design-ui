import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import * as DM from '@radix-ui/react-dropdown-menu';
import * as CM from '@radix-ui/react-context-menu';
import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

/** One item list for every menu: DropdownMenu (a button) and CtxMenu (right click / long press, optional preview). */
export type MenuItem =
  | {
      kind?: 'item';
      label: string;
      icon?: ComponentType<{ className?: string }>;
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
      onSelect?: () => void;
    }
  | { kind: 'check'; label: string; checked: boolean; onChange: (on: boolean) => void; disabled?: boolean }
  | {
      kind: 'radio';
      value: string;
      /** `depth` 0–2: indents the option under the `label` header above it (headers themselves are drawn at depth 0). */
      options: { value: string; label: string; depth?: number }[];
      onChange: (value: string) => void;
    }
  | {
      kind: 'sub';
      label: string;
      /** Muted trailing text before the arrow. */
      meta?: string;
      icon?: ComponentType<{ className?: string }>;
      items: MenuItem[];
    }
  | { kind: 'label'; label: string; depth?: number }
  | { kind: 'separator' };

/** How a `sub` item opens: a side flyout (Radix SubContent) or a level drilled into inside the same panel (iOS). */
export type MenuNested = 'flyout' | 'drill';

/** The menus' own strings; every one is overridable through `labels`. */
export const MENU_LABELS = {
  /** aria-label / tooltip of DropdownMenu's default trigger. */
  trigger: 'Actions',
  /** Prefix of the drill view's back row (read as «Back: <level>»). */
  back: 'Back',
};
export type MenuLabels = typeof MENU_LABELS;

const panel =
  'z-50 min-w-52 scroll-pt-10 overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-ds-medium';
const row =
  'flex cursor-default select-none items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-ds-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50';
const dangerRow = 'text-vui-danger-text data-[highlighted]:bg-vui-danger-bg';
const metaText = 'ml-auto pl-4 text-xs text-ds-gray-700';
const separator = 'my-1 h-px bg-border';
const slot = 'grid size-4 shrink-0 place-items-center';
// Indent per depth under a group header.
const DEPTH_PAD = ['', 'pl-4', 'pl-8'];
const padOf = (depth = 0) => DEPTH_PAD[Math.min(depth, DEPTH_PAD.length - 1)];
// A panel never outgrows the room Radix measures for it: its list scrolls (the drill view's back row stays on top).
const availableHeight = (kit: 'dropdown-menu' | 'context-menu') => ({
  maxHeight: `var(--radix-${kit}-content-available-height)`,
});
const COLLISION_PADDING = 8;

// Radix DropdownMenu and ContextMenu expose the same item parts with the same props — render both from one tree.
type Kit = Pick<
  typeof DM,
  | 'Item'
  | 'CheckboxItem'
  | 'RadioGroup'
  | 'RadioItem'
  | 'ItemIndicator'
  | 'Label'
  | 'Separator'
  | 'Sub'
  | 'SubTrigger'
  | 'SubContent'
  | 'Portal'
>;
const ctxKit = CM as unknown as Kit;

/** `onDrill` set → `sub` items drill into their level instead of opening a flyout. */
function MenuItems({ items, kit: K, onDrill }: { items: MenuItem[]; kit: Kit; onDrill?: (index: number) => void }) {
  return items.map((it, i) => {
    switch (it.kind) {
      case 'separator':
        return <K.Separator key={i} className={separator} />;
      case 'label':
        return (
          <K.Label key={i} className={cn('px-2 py-1 text-xs text-muted-foreground', padOf(it.depth))}>
            {it.label}
          </K.Label>
        );
      case 'check':
        return (
          <K.CheckboxItem
            key={i}
            className={row}
            checked={it.checked}
            onCheckedChange={it.onChange}
            disabled={it.disabled}
            onSelect={(e) => e.preventDefault()}
          >
            <span className={slot}>
              <K.ItemIndicator>
                <Check className="size-4" />
              </K.ItemIndicator>
            </span>
            {it.label}
          </K.CheckboxItem>
        );
      case 'radio':
        return (
          <K.RadioGroup key={i} value={it.value} onValueChange={it.onChange}>
            {it.options.map((o) => (
              <K.RadioItem
                key={o.value}
                value={o.value}
                className={cn(row, padOf(o.depth))}
                onSelect={(e) => e.preventDefault()}
              >
                <span className={slot}>
                  <K.ItemIndicator>
                    <span className="block size-1.5 rounded-full bg-foreground" />
                  </K.ItemIndicator>
                </span>
                {o.label}
              </K.RadioItem>
            ))}
          </K.RadioGroup>
        );
      case 'sub': {
        const inner = (
          <>
            {it.icon && <it.icon className="size-4 text-muted-foreground" />}
            {it.label}
            {it.meta && <span className={metaText}>{it.meta}</span>}
            <ChevronRight className={cn('size-4 text-muted-foreground', !it.meta && 'ml-auto')} />
          </>
        );
        if (onDrill) {
          return (
            <K.Item
              key={i}
              className={row}
              data-drill-index={i}
              onSelect={(e) => {
                e.preventDefault();
                onDrill(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  onDrill(i);
                }
              }}
            >
              {inner}
            </K.Item>
          );
        }
        return (
          <K.Sub key={i}>
            <K.SubTrigger className={cn(row, 'data-[state=open]:bg-ds-gray-alpha-100')}>{inner}</K.SubTrigger>
            <K.Portal>
              <K.SubContent
                sideOffset={6}
                collisionPadding={COLLISION_PADDING}
                className={panel}
                style={availableHeight(K === ctxKit ? 'context-menu' : 'dropdown-menu')}
              >
                <MenuItems items={it.items} kit={K} />
              </K.SubContent>
            </K.Portal>
          </K.Sub>
        );
      }
      default:
        return (
          <K.Item key={i} className={cn(row, it.danger && dangerRow)} disabled={it.disabled} onSelect={it.onSelect}>
            {it.icon && <it.icon className={cn('size-4', !it.danger && 'text-muted-foreground')} />}
            {it.label}
            {it.shortcut && <span className={metaText}>{it.shortcut}</span>}
          </K.Item>
        );
    }
  });
}

const DRILL_SHIFT = 16; // px the incoming level slides in from
const DRILL_MS = 180;
const DRILL_EASING = 'cubic-bezier(.2,.8,.2,1)';

/** The `sub` items along `path` and the items of the level they lead to (a path that no longer fits stops early). */
function drillLevel(items: MenuItem[], path: number[]) {
  const levels: Extract<MenuItem, { kind: 'sub' }>[] = [];
  let shown = items;
  for (const i of path) {
    const it = shown[i];
    if (it?.kind !== 'sub') break;
    levels.push(it);
    shown = it.items;
  }
  return { levels, shown };
}

// The panel's content for `nested="drill"`: one level at a time, a back row on top of a sub-level. The path is kept as
// indices so a check / radio inside a level shows the caller's fresh state. Lives inside the menu's Content, so it
// starts at the root each time the menu opens.
function DrillLevels({ items, kit: K, backLabel }: { items: MenuItem[]; kit: Kit; backLabel: string }) {
  const [path, setPath] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const move = useRef<{ height: number; width: number; dir: 1 | -1; focus?: number }>(undefined);
  const { levels, shown } = drillLevel(items, path);
  const current = levels.at(-1);

  const go = (next: number[], dir: 1 | -1, focus?: number) => {
    const el = ref.current;
    if (el) move.current = { height: el.offsetHeight, width: el.offsetWidth, dir, focus };
    setPath(next);
  };
  const open = (i: number) => go([...path, i], 1);
  const back = () => {
    if (path.length) go(path.slice(0, -1), -1, path.at(-1));
  };

  useLayoutEffect(() => {
    const el = ref.current;
    const m = move.current;
    if (!el || !m) return;
    move.current = undefined;
    // The panel keeps the widest width it has had; only its height follows the level.
    el.style.minWidth = `${Math.max(m.width, parseFloat(el.style.minWidth) || 0)}px`;
    // A deeper level starts at its top; the height animation stops at the panel's cap (the list scrolls past it).
    const box = el.parentElement;
    if (box && m.dir === 1) box.scrollTop = 0;
    const cap = box ? parseFloat(getComputedStyle(box).maxHeight) : NaN;
    const room = Number.isFinite(cap) && box ? cap - (box.offsetHeight - box.clientHeight) - 8 : Infinity;
    const target =
      m.focus == null
        ? el.querySelector<HTMLElement>('[role^="menuitem"]:not([data-drill-back]):not([data-disabled])')
        : el.querySelector<HTMLElement>(`[data-drill-index="${m.focus}"]`);
    (target ?? el.querySelector<HTMLElement>('[role^="menuitem"]'))?.focus();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timing = { duration: DRILL_MS, easing: DRILL_EASING };
    el.animate(
      [
        { height: `${m.height}px`, overflow: 'hidden' },
        { height: `${Math.min(el.offsetHeight, room)}px`, overflow: 'hidden' },
      ],
      timing,
    );
    el.firstElementChild?.animate(
      [
        { opacity: 0, transform: `translateX(${m.dir * DRILL_SHIFT}px)` },
        { opacity: 1, transform: 'none' },
      ],
      timing,
    );
  }, [path]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!path.length || (e.key !== 'ArrowLeft' && e.key !== 'Backspace')) return;
    e.preventDefault();
    back();
  };

  return (
    <div ref={ref} onKeyDown={onKeyDown}>
      <div key={path.join('.')}>
        {current && (
          <div className="sticky top-0 z-10 -mt-1 bg-popover pt-1">
            <K.Item
              className={cn(row, 'font-medium')}
              data-drill-back
              aria-label={`${backLabel}: ${current.label}`}
              onSelect={(e) => {
                e.preventDefault();
                back();
              }}
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
              {current.label}
            </K.Item>
            <K.Separator className={separator} />
          </div>
        )}
        <MenuItems items={shown} kit={K} onDrill={open} />
      </div>
    </div>
  );
}

/** The panel's items: flyout sub-menus, or levels drilled into in place. */
function MenuBody({ items, kit, nested, backLabel }: { items: MenuItem[]; kit: Kit; nested: MenuNested; backLabel: string }) {
  return nested === 'drill' ? (
    <DrillLevels items={items} kit={kit} backLabel={backLabel} />
  ) : (
    <MenuItems items={items} kit={kit} />
  );
}

export interface DropdownMenuProps {
  items: MenuItem[];
  /** Replaces the default ⋯ icon button; must forward its ref and props (Radix `asChild`). */
  trigger?: ReactElement;
  align?: 'start' | 'center' | 'end';
  /** How `sub` items open: a side flyout (default), or a level drilled into inside the same panel. */
  nested?: MenuNested;
  /** `trigger` = aria-label of the default ⋯ button, `back` = the drill view's back row. */
  labels?: Partial<MenuLabels>;
  /** Classes of the menu panel. */
  className?: string;
}

/**
 * DropdownMenu — actions behind a button; the default trigger is a ⋯ outline icon button. Items: `item` (icon,
 * shortcut, danger, disabled), `check`, `radio` (options with `depth` 0–2 under a `label` header), `sub` (`meta` =
 * muted trailing text), `label`, `separator`. `nested="drill"` slides a `sub` level into the same panel with a
 * «‹ label» back row (Enter/→ open, ←/Backspace/back row return, Esc closes; no motion with reduced motion). The panel
 * is at most the room left in the window and its list scrolls. Shares the item list with CtxMenu.
 */
export function DropdownMenu({ items, trigger, align = 'end', nested = 'flyout', labels, className }: DropdownMenuProps) {
  const text = { ...MENU_LABELS, ...labels };
  return (
    <DM.Root>
      <DM.Trigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={text.trigger}
            title={text.trigger}
            className="text-muted-foreground hover:text-foreground data-[state=open]:bg-ds-gray-alpha-100 data-[state=open]:text-foreground"
          >
            <MoreHorizontal />
          </Button>
        )}
      </DM.Trigger>
      <DM.Portal>
        <DM.Content
          align={align}
          sideOffset={4}
          collisionPadding={COLLISION_PADDING}
          className={cn(panel, className)}
          style={availableHeight('dropdown-menu')}
        >
          <MenuBody items={items} kit={DM} nested={nested} backLabel={text.back} />
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

export interface CtxMenuProps {
  /** One element; it must accept a ref and pointer props. */
  children: ReactElement;
  items: MenuItem[];
  /**
   * Without it, a menu at the pointer. With it, the element lifts over a dimmed backdrop and the actions open under
   * it: `true` lifts the element itself, a node shows that instead (e.g. details).
   */
  preview?: true | ReactNode;
  disabled?: boolean;
  /** As on DropdownMenu; `drill` suits the preview menu on phones (no side panel off the screen). */
  nested?: MenuNested;
  /** `back` = the drill view's back row (`trigger` is unused here). */
  labels?: Partial<MenuLabels>;
  /** Classes of the menu panel. */
  className?: string;
}

/**
 * CtxMenu — a context menu on right click / long press of `children`, optionally with an iOS-style lifted preview.
 * Same item list as DropdownMenu.
 */
export function CtxMenu({ children, items, preview, disabled, nested = 'flyout', labels, className }: CtxMenuProps) {
  const backLabel = labels?.back ?? MENU_LABELS.back;
  if (disabled) return children;
  if (preview == null || preview === false) {
    return (
      <CM.Root>
        <CM.Trigger asChild>{children}</CM.Trigger>
        <CM.Portal>
          <CM.Content
            collisionPadding={COLLISION_PADDING}
            className={cn(panel, className)}
            style={availableHeight('context-menu')}
          >
            <MenuBody items={items} kit={ctxKit} nested={nested} backLabel={backLabel} />
          </CM.Content>
        </CM.Portal>
      </CM.Root>
    );
  }
  return (
    <PreviewMenu
      items={items}
      preview={preview === true ? null : preview}
      nested={nested}
      backLabel={backLabel}
      className={className}
    >
      {children}
    </PreviewMenu>
  );
}

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE = 8;
const GUTTER = 16;
const LIFT = 1.03;
const MENU_ROOM = 240; // space kept under the preview for the actions

function PreviewMenu({
  children,
  items,
  preview,
  nested,
  backLabel,
  className,
}: {
  children: ReactElement;
  items: MenuItem[];
  preview: ReactNode;
  nested: MenuNested;
  backLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ timer: number; x: number; y: number }>(undefined);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [previewH, setPreviewH] = useState(0);
  const [lifted, setLifted] = useState(false);

  const open = () => ref.current && setRect(ref.current.getBoundingClientRect());
  const close = () => {
    setLifted(false);
    setRect(null);
    setPreviewH(0);
  };
  const cancelPress = () => {
    clearTimeout(press.current?.timer);
    press.current = undefined;
  };

  // A custom preview can be taller than the element — measure it before paint to anchor the menu under it.
  useLayoutEffect(() => {
    if (rect && previewRef.current) setPreviewH(previewRef.current.offsetHeight);
  }, [rect]);
  useEffect(() => {
    if (!rect) return;
    const id = requestAnimationFrame(() => setLifted(true));
    window.addEventListener('resize', close);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', close);
    };
  }, [rect]);

  let stack = null;
  if (rect) {
    const vw = window.innerWidth;
    const width = Math.min(preview ? Math.max(rect.width, 320) : rect.width, vw - GUTTER * 2);
    const left = Math.min(Math.max(rect.left, GUTTER), vw - width - GUTTER);
    const bottom = rect.top + (previewH || rect.height) * LIFT;
    // Lift the whole stack when the actions would run off the bottom edge.
    const shift = Math.max(0, bottom + MENU_ROOM - window.innerHeight);
    const alignEnd = left + width / 2 > vw / 2;
    stack = (
      <div className="fixed inset-0 z-40">
        <div
          className={cn(
            'absolute inset-0 bg-ds-overlay transition-opacity duration-200 motion-reduce:transition-none',
            lifted ? 'opacity-100' : 'opacity-0',
          )}
          onClick={close}
        />
        <div
          ref={previewRef}
          className="pointer-events-none absolute overflow-hidden rounded-xl border border-border bg-background shadow-ds-large transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{
            top: rect.top,
            left,
            width,
            transform: `translateY(${-shift}px) scale(${lifted ? LIFT : 1})`,
            transformOrigin: alignEnd ? 'top right' : 'top left',
          }}
        >
          {preview ?? children}
        </div>
        <DM.Root open onOpenChange={(o) => !o && close()}>
          <DM.Trigger asChild>
            <span
              aria-hidden
              className="absolute size-px"
              style={{ top: bottom - shift, left: alignEnd ? left + width : left }}
            />
          </DM.Trigger>
          <DM.Portal>
            <DM.Content
              collisionPadding={COLLISION_PADDING}
              style={availableHeight('dropdown-menu')}
              side="bottom"
              align={alignEnd ? 'end' : 'start'}
              sideOffset={12}
              avoidCollisions={false}
              className={cn(
                panel,
                'transition-[opacity,transform] duration-200 motion-reduce:transition-none',
                alignEnd ? 'origin-top-right' : 'origin-top-left',
                lifted ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                className,
              )}
            >
              <MenuBody items={items} kit={DM} nested={nested} backLabel={backLabel} />
            </DM.Content>
          </DM.Portal>
        </DM.Root>
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        className="select-none [-webkit-touch-callout:none]"
        onContextMenu={(e) => {
          e.preventDefault();
          cancelPress();
          open();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') return;
          press.current = { timer: window.setTimeout(open, LONG_PRESS_MS), x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          const p = press.current;
          if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_TOLERANCE) cancelPress();
        }}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
      >
        {children}
      </div>
      {stack && createPortal(stack, document.body)}
    </>
  );
}
