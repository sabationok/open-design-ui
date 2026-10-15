import { cn } from '../lib/utils';
import { AnchorDot, type AnchorDotState } from '../atoms/AnchorDot';
import { ProgressLine } from './ProgressLine';

export interface AnchorNavItem {
  id: string;
  label: string;
  href?: string;
}

export interface AnchorNavProps {
  items: AnchorNavItem[];
  /** id of the currently active/visible section — drive this from your own scroll/IntersectionObserver logic. */
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

/** Vertical scrollspy-style section nav: a `ProgressLine` filled up to the active item, each row marked by an `AnchorDot`. */
export function AnchorNav({ items, activeId, onSelect, className }: AnchorNavProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const progress = items.length > 1 && activeIndex > 0 ? activeIndex / (items.length - 1) : 0;

  return (
    <nav className={cn('relative flex flex-col gap-1 pl-5', className)} aria-label="Section navigation">
      <ProgressLine progress={progress} />
      {items.map((item, index) => {
        const state: AnchorDotState = activeIndex < 0 || index > activeIndex ? 'upcoming' : index === activeIndex ? 'active' : 'done';
        return (
          <a
            key={item.id}
            href={item.href ?? `#${item.id}`}
            onClick={onSelect ? () => onSelect(item.id) : undefined}
            aria-current={state === 'active' ? 'true' : undefined}
            className={cn(
              'relative rounded-md py-1.5 text-[13px] transition-colors',
              state === 'active' ? 'font-medium text-vui-accent-text' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <AnchorDot state={state} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
