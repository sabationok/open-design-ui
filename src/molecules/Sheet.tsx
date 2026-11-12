import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from '../components/ui/dialog';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Opened from another sheet: inset with margins and rounded, so the sheet under it shows. */
  nested?: boolean;
  /** aria-label of the header ×. */
  closeLabel?: string;
  className?: string;
}

// Right-hand drawer on the lib Dialog primitives: 420px on desktop, full width on small screens.
export function Sheet({ open, onClose, title, children, nested = false, closeLabel = 'Close', className }: SheetProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed z-50 flex flex-col bg-popover text-popover-foreground focus:outline-none',
            nested
              ? 'inset-y-3 right-3 w-[calc(100%-1.5rem)] max-w-[380px] overflow-hidden rounded-xl border border-border shadow-ds-large sm:inset-y-6 sm:right-6'
              : 'inset-y-0 right-0 w-full max-w-[420px] border-l border-border shadow-ds-large',
            className,
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <DialogTitle className="text-base font-semibold leading-snug">{title}</DialogTitle>
            <DialogClose
              aria-label={closeLabel}
              className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-ds-gray-alpha-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </DialogClose>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
