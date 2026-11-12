import { useEffect, useRef, type RefObject } from 'react';

export type DismissReason = 'outside' | 'escape';

// Closes a popup on a press outside `refs` or on Esc. Esc is caught on the window in the capture
// phase: with focus inside the popup it stops there, so a dialog around it stays open.
export function useDismiss(
  open: boolean,
  refs: RefObject<HTMLElement | null>[],
  onDismiss: (reason: DismissReason) => void,
) {
  const latest = useRef({ refs, onDismiss });
  latest.current = { refs, onDismiss };
  useEffect(() => {
    if (!open) return;
    const inside = (n: EventTarget | null) =>
      n instanceof Node && latest.current.refs.some((r) => r.current?.contains(n));
    const down = (e: MouseEvent) => !inside(e.target) && latest.current.onDismiss('outside');
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (inside(document.activeElement)) e.stopPropagation();
      latest.current.onDismiss('escape');
    };
    document.addEventListener('mousedown', down);
    window.addEventListener('keydown', key, { capture: true });
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key, { capture: true });
    };
  }, [open]);
}
