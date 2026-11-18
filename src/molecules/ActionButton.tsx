import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { fixedOrigin } from '../lib/fixedOrigin';
import { useDismiss } from '../lib/useDismiss';
import { Button } from '../components/ui/button';

export interface ActionButtonItem {
  key: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}

export interface ActionButtonProps {
  label: ReactNode;
  onClick: () => void;
  /** The other actions behind the chevron; none → a plain button. */
  items: ActionButtonItem[];
  disabled?: boolean;
  title?: string;
  /** aria-label of the chevron. */
  menuLabel?: string;
  /** `primary` fills it (a form's submit). */
  tone?: 'neutral' | 'primary';
  /** `xs` (24px) fits a field's toolbar; `sm` is the 32px control height. */
  size?: 'xs' | 'sm';
  /** Menu side: `auto` picks the one it fits on. */
  placement?: 'down' | 'up' | 'auto';
  /** Menu edge: the button's left / right; `auto` keeps it inside the window. */
  align?: 'left' | 'right' | 'auto';
  className?: string;
}

const GAP = 4;
const EDGE = 8;

// Split button: the main part runs the default action, the chevron opens a menu of the others.
// The menu is fixed to the viewport (a scrolling column does not clip it) and closes on scroll / resize.
export function ActionButton({
  label,
  onClick,
  items,
  disabled,
  title,
  menuLabel = 'More actions',
  tone = 'neutral',
  size = 'sm',
  placement = 'auto',
  align = 'auto',
  className,
}: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevron = useRef<HTMLButtonElement>(null);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) chevron.current?.focus();
  };

  // Placed once rendered (its size known), before it is painted.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const anchor = ref.current?.getBoundingClientRect();
    if (!open || !menu || !anchor) return;
    const { width, height } = menu.getBoundingClientRect();
    const up =
      placement === 'up' ||
      (placement === 'auto' && anchor.bottom + GAP + height > window.innerHeight - EDGE && anchor.top - GAP - height > EDGE);
    const right = align === 'right' || (align === 'auto' && anchor.left + width > window.innerWidth - EDGE);
    const left = right ? anchor.right - width : anchor.left;
    // A transformed ancestor (a centered dialog) is what `fixed` is relative to, not the window.
    const origin = fixedOrigin(menu);
    setPos({
      top: (up ? anchor.top - GAP - height : anchor.bottom + GAP) - origin.top,
      left: Math.min(Math.max(EDGE, left), window.innerWidth - width - EDGE) - origin.left,
    });
  }, [open, placement, align]);

  // Focus the first enabled item once placed.
  useEffect(() => {
    if (open && pos) menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [open, pos]);

  useDismiss(open, [ref, menuRef], (reason) => close(reason === 'escape' && !!menuRef.current?.contains(document.activeElement)));

  // Fixed to the viewport: a scroll or resize would leave it behind, so it closes.
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => !(e.target instanceof Node && menuRef.current?.contains(e.target)) && setOpen(false);
    window.addEventListener('scroll', away, true);
    window.addEventListener('resize', away);
    return () => {
      window.removeEventListener('scroll', away, true);
      window.removeEventListener('resize', away);
    };
  }, [open]);

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])];
    if (!all.length) return;
    const i = all.indexOf(document.activeElement as HTMLButtonElement);
    const to =
      e.key === 'ArrowDown' ? (i + 1) % all.length
      : e.key === 'ArrowUp' ? (i - 1 + all.length) % all.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? all.length - 1
      : null;
    if (to !== null) {
      e.preventDefault();
      all[to].focus();
    } else if (e.key === 'Tab') setOpen(false);
  };

  const variant = tone === 'primary' ? 'default' : 'outline';
  const btnSize = size === 'xs' ? 'sm' : 'default';
  const hasMenu = items.length > 0;

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <Button
        type="button"
        variant={variant}
        size={btnSize}
        title={title}
        disabled={disabled}
        className={cn(hasMenu && 'rounded-r-none', size === 'sm' && 'text-xs')}
        onClick={onClick}
      >
        {label}
      </Button>
      {hasMenu && (
        <Button
          ref={chevron}
          type="button"
          variant={variant}
          size={btnSize}
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'rounded-l-none',
            size === 'sm' ? 'px-2' : 'px-1.5',
            tone === 'primary' ? 'border-l border-primary-foreground/30' : '-ml-px',
            open && tone === 'neutral' && 'bg-ds-gray-alpha-100',
          )}
          onClick={() => {
            setPos(null);
            setOpen((v) => !v);
          }}
        >
          <ChevronDown className="size-3.5" />
        </Button>
      )}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={menuLabel}
          onKeyDown={onMenuKey}
          className="fixed z-50 flex w-72 max-w-[calc(100vw-1rem)] flex-col rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-ds-medium"
          // Hidden for the one layout pass before it is placed.
          style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
        >
          {items.map((m) => (
            <button
              key={m.key}
              type="button"
              role="menuitem"
              disabled={m.disabled}
              className="flex flex-col items-start rounded-md px-2 py-1.5 text-left outline-none hover:bg-ds-gray-alpha-100 focus-visible:bg-ds-gray-alpha-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              onClick={() => {
                m.onSelect();
                close(true);
              }}
            >
              <span className="text-xs text-foreground">{m.label}</span>
              {m.hint && <span className="text-[11px] text-ds-gray-700">{m.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
