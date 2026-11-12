import { useLayoutEffect, useRef, type ReactNode } from 'react';

export interface SlideSwapProps<V> {
  value: V;
  /** The values left to right: the new content comes in from the side its value lies on. */
  order: readonly V[];
  children: ReactNode;
  className?: string;
}

const SHIFT = 32;

// Slides its content in from the side the new value lies on (tabs, steps, months): 220ms, the incoming
// content only, no exit or height animation. Skipped under prefers-reduced-motion.
export function SlideSwap<V>({ value, order, children, className }: SlideSwapProps<V>) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(value);
  useLayoutEffect(() => {
    if (prev.current === value) return;
    const from = order.indexOf(value) > order.indexOf(prev.current) ? SHIFT : -SHIFT;
    prev.current = value;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ref.current?.animate?.(
      [
        { transform: `translateX(${from}px)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
  }, [value, order]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
