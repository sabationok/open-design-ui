import { useEffect, useState, type RefObject } from 'react';

const OVERSCAN = 8;

// The slice of fixed-height rows visible in a scroll container (plus overscan). Fixed height keeps
// it arithmetic — no measuring, no dependency. `enabled: false` returns every row.
export function useVirtualRows(
  scrollRef: RefObject<HTMLElement | null>,
  count: number,
  rowHeight: number,
  enabled: boolean,
) {
  const [view, setView] = useState({ top: 0, height: 800 });
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setView({ top: el.scrollTop, height: el.clientHeight }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [scrollRef, enabled]);
  if (!enabled) return { start: 0, end: count, padTop: 0, padBottom: 0 };
  const start = Math.max(0, Math.floor(view.top / rowHeight) - OVERSCAN);
  const end = Math.min(count, Math.ceil((view.top + view.height) / rowHeight) + OVERSCAN);
  return { start, end, padTop: start * rowHeight, padBottom: (count - end) * rowHeight };
}
