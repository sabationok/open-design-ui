import type { ReactNode } from 'react';
import newComponents from '../new-components.json';

const NEW_WINDOW_DAYS = 3;
const NEW_WINDOW_MS = NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

/** True if `title` is listed in new-components.json with an `addedAt` date less than 3 days old. */
export function isNew(title: string): boolean {
  const addedAt = (newComponents as Record<string, string>)[title];
  if (!addedAt) return false;
  const ageMs = Date.now() - new Date(addedAt).getTime();
  return ageMs >= 0 && ageMs < NEW_WINDOW_MS;
}

/**
 * Storybook decorator that pins a "🆕 NEW" ribbon into the story canvas when `title` was added
 * less than 3 days ago (per new-components.json). Evaluated on each Storybook load, so the ribbon
 * disappears on its own once the window passes — no rebuild, no manual cleanup.
 *
 * CSF requires a *static* string `title` in `meta`, so pass the same literal here.
 */
export function newBadgeDecorator(title: string) {
  return function NewBadge(Story: () => ReactNode) {
    return (
      <div className="relative">
        {isNew(title) && (
          <span className="absolute -top-2 right-0 z-10 rounded-full bg-vui-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            🆕 New
          </span>
        )}
        <Story />
      </div>
    );
  };
}
