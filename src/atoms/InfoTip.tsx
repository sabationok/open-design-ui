import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { fixedOrigin } from '../lib/fixedOrigin';

export interface InfoTipProps {
  /** The explanation shown in the tooltip. */
  text: ReactNode;
  /** Accessible name of the (i) button. Defaults to `text` when it is a string, else "More info". */
  label?: string;
  className?: string;
}

const GAP = 6;
const EDGE = 8;

// An (i) next to a heading: the explanation shows on hover or keyboard focus of the (i) itself, so the
// heading stays a short name. Fixed to the viewport (a scrolling card does not clip it): above the (i)
// when there is room, else below; nudged back inside the window at its edges.
export function InfoTip({ text, label, className }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();

  useLayoutEffect(() => {
    const tip = tipRef.current;
    const anchor = anchorRef.current?.getBoundingClientRect();
    if (!open || !tip || !anchor) return;
    const { width, height } = tip.getBoundingClientRect();
    const top = anchor.top - GAP - height > EDGE ? anchor.top - GAP - height : anchor.bottom + GAP;
    const left = Math.min(Math.max(EDGE, anchor.left + anchor.width / 2 - width / 2), window.innerWidth - width - EDGE);
    // A transformed ancestor (a centered dialog) is what `fixed` is relative to, not the window.
    const origin = fixedOrigin(tip);
    setPos({ top: top - origin.top, left: left - origin.left });
  }, [open]);

  const show = () => {
    setPos(null);
    setOpen(true);
  };
  const hide = () => setOpen(false);
  const accessibleName = label ?? (typeof text === 'string' ? text : 'More info');

  return (
    <span className={cn('relative inline-flex align-middle', className)}>
      <button
        ref={anchorRef}
        type="button"
        aria-label={accessibleName}
        // Only describe when the name is not already the tooltip text, so it is not read twice.
        aria-describedby={open && accessibleName !== text ? tipId : undefined}
        className="inline-flex rounded-full text-ds-gray-700 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => e.key === 'Escape' && hide()}
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      {open && (
        <span
          ref={tipRef}
          id={tipId}
          role="tooltip"
          className="pointer-events-none fixed z-50 w-64 max-w-[calc(100vw-1rem)] rounded-md border border-border bg-background px-2 py-1.5 text-xs font-normal text-foreground shadow-ds-medium"
          // Hidden for the one layout pass before it is placed.
          style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
