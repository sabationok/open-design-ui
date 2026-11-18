import { useState, type ReactNode } from 'react';
import { ChevronDown, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from './Modal';

export interface InsightProps {
  /** The folded line. */
  title: ReactNode;
  children: ReactNode;
  /** Open in a modal instead of in place; by default a plain-text body longer than `longAfter` does. */
  modal?: boolean;
  /** Characters of a plain-text body above which it opens in a modal. */
  longAfter?: number;
  /** The modal's title; defaults to `title` as text. */
  modalTitle?: ReactNode;
  /** aria-label of the modal's ×. */
  closeLabel?: string;
  className?: string;
}

// An explanation that does not take space by default: a quiet accent line that unfolds `children`
// in a card under it, or (a long text, or `modal`) opens them in a Modal.
export function Insight({ title, children, modal, longAfter = 280, modalTitle, closeLabel, className }: InsightProps) {
  const [open, setOpen] = useState(false);
  const inModal = modal ?? (typeof children === 'string' && children.length > longAfter);
  return (
    <div className={cn('flex flex-col text-xs', className)}>
      <button
        type="button"
        aria-expanded={inModal ? undefined : open}
        aria-haspopup={inModal ? 'dialog' : undefined}
        className={cn(
          'group flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open
            ? 'border-vui-accent-border bg-vui-accent-bg text-vui-accent-text'
            : 'border-transparent text-muted-foreground hover:border-vui-accent-border hover:bg-vui-accent-bg hover:text-vui-accent-text',
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Sparkles
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 text-vui-accent-text transition-transform group-hover:rotate-12 motion-reduce:transition-none',
            open && 'rotate-12',
          )}
        />
        <span>{title}</span>
        {inModal ? (
          <Maximize2 aria-hidden className="size-3 shrink-0 opacity-60" />
        ) : (
          <ChevronDown aria-hidden className={cn('size-3 shrink-0 opacity-60 transition-transform', open && 'rotate-180')} />
        )}
      </button>
      {inModal ? (
        <Modal open={open} onClose={() => setOpen(false)} title={modalTitle ?? title} closeLabel={closeLabel}>
          <div className="border-l-2 border-vui-accent pl-3 text-sm leading-relaxed text-foreground">{children}</div>
        </Modal>
      ) : (
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          // Folded content stays out of the tab order and the accessibility tree.
          inert={!open}
        >
          <div className="overflow-hidden">
            <div className="mt-1.5 rounded-md border-l-2 border-vui-accent bg-ds-background-200 px-3 py-2 leading-relaxed text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
