import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../components/ui/dialog';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Pinned under the scrolling body (actions). */
  footer?: ReactNode;
  /** 880px instead of 560px. */
  wide?: boolean;
  /** A fixed 80vh height, so the dialog does not jump as its content changes. */
  tall?: boolean;
  /** From md up the body neither scrolls nor pads: its columns scroll on their own (`md:overflow-y-auto`). */
  split?: boolean;
  /** aria-label of the header ×. */
  closeLabel?: string;
  className?: string;
  bodyClassName?: string;
}

// A preset over the lib Dialog: a header with title and ×, a scrolling body, an optional pinned footer.
// Up to 560px wide (`wide`: 880px), full width minus a margin on narrow screens.
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
  tall,
  split,
  closeLabel = 'Close',
  className,
  bodyClassName,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        hideClose
        aria-describedby={undefined}
        className={cn(
          'flex w-[calc(100%-2rem)] flex-col gap-0 rounded-xl bg-popover p-0 text-popover-foreground',
          tall ? 'h-[80vh]' : 'max-h-[85vh]',
          wide ? 'max-w-[880px]' : 'max-w-[560px]',
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
        <div className={cn('min-h-0 flex-1 overflow-auto p-5', split && 'md:overflow-hidden md:p-0', bodyClassName)}>
          {children}
        </div>
        {footer && <div className="border-t border-border px-5 py-3">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
