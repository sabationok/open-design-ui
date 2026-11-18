import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export interface AppShellProps {
  /** Sidebar content (nav, brand, footer). Rendered as a fixed column ≥md and inside the drawer <md. */
  sidebar: ReactNode;
  /** Shown in the mobile top bar next to the menu button. */
  brand?: ReactNode;
  children: ReactNode;
  /** Accessible name of the mobile menu button. */
  menuLabel?: string;
  /** Accessible title of the mobile drawer. */
  navLabel?: string;
  className?: string;
}

// Sidebar + content. ≥md: fixed sidebar column. <md: top bar with a menu button opening the
// same sidebar as a drawer, closed again on navigation. Requires a react-router context.
export function AppShell({ sidebar, brand, children, menuLabel = 'Menu', navLabel = 'Navigation', className }: AppShellProps) {
  // The drawer belongs to the path it was opened on, so navigating closes it without an effect.
  const { pathname } = useLocation();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  return (
    <div className={cn('flex h-dvh flex-col bg-background text-foreground md:flex-row', className)}>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">{sidebar}</aside>

      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 md:hidden">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label={menuLabel}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-ds-gray-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" aria-hidden />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-ds-overlay" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-ds-large focus:outline-none"
            >
              <Dialog.Title className="sr-only">{navLabel}</Dialog.Title>
              {sidebar}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <div className="min-w-0 flex-1 truncate text-sm font-medium">{brand}</div>
      </header>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">{children}</main>
    </div>
  );
}
