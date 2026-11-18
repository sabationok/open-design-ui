// Where a `position: fixed` element's 0,0 is: the window, or the nearest ancestor that makes itself
// the containing block (a transform, a filter, a perspective).
export function fixedOrigin(el: HTMLElement): { top: number; left: number } {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const cs = getComputedStyle(p);
    // Tailwind v4 moves with the individual `translate` / `scale` / `rotate`, not `transform`.
    const moved = [cs.transform, cs.translate, cs.scale, cs.rotate].some((v) => v && v !== 'none');
    if (moved || cs.filter !== 'none' || cs.perspective !== 'none') {
      const r = p.getBoundingClientRect();
      return { top: r.top, left: r.left };
    }
  }
  return { top: 0, left: 0 };
}
