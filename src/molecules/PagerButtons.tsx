import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { cn } from '../lib/utils';
import type { ComponentSize } from '../lib/componentSize';

export interface PagerButtonsProps {
  /** Step back; missing disables the button. */
  prev?: () => void;
  /** Step forward; missing disables the button. */
  next?: () => void;
  /** Shown between the arrows, e.g. "2 / 5". */
  position?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Window ← / → step too, unless focus is in a field, select, menu or listbox. Default true. */
  keys?: boolean;
  size?: ComponentSize;
  className?: string;
}

const IGNORE = 'input, textarea, select, [contenteditable="true"], [role="menu"], [role="listbox"]';

// ‹ position › — step back and forward through a list (a detail view's siblings). Numbered pages: `PaginationBar`.
export function PagerButtons({
  prev,
  next,
  position,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  keys = true,
  size = 'xs',
  className,
}: PagerButtonsProps) {
  // Latest callbacks without re-subscribing on every render.
  const nav = useRef({ prev, next });
  nav.current = { prev, next };

  useEffect(() => {
    if (!keys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if ((e.target as HTMLElement | null)?.closest?.(IGNORE)) return;
      const { prev: p, next: n } = nav.current;
      if (e.key === 'ArrowLeft' && p) p();
      else if (e.key === 'ArrowRight' && n) n();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keys]);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <IconButton
        size={size}
        label={prevLabel}
        title={keys ? `${prevLabel} (←)` : prevLabel}
        disabled={!prev}
        onClick={prev}
      >
        <ChevronLeft />
      </IconButton>
      {position && <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">{position}</span>}
      <IconButton
        size={size}
        label={nextLabel}
        title={keys ? `${nextLabel} (→)` : nextLabel}
        disabled={!next}
        onClick={next}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
}
