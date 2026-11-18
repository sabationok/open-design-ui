import { useState, type ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from './Modal';

export interface NotesDialogNote {
  key: string;
  text: ReactNode;
  /** Author, date: the muted line under the text. */
  meta?: ReactNode;
}

export interface NotesDialogGroup {
  key: string | number;
  title: ReactNode;
  notes: NotesDialogNote[];
}

export interface NotesDialogProps {
  /** The modal's title. */
  title: ReactNode;
  /** The link's text, e.g. "3 notes · view". */
  trigger: ReactNode;
  groups: NotesDialogGroup[];
  /** aria-label of the modal's ×. */
  closeLabel?: string;
  /** Classes for the trigger link. */
  className?: string;
}

// A one-line link that opens every note in a modal, grouped under titles. Read-only; the open state is
// its own.
export function NotesDialog({ title, trigger, groups, closeLabel, className }: NotesDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex w-fit items-center gap-1.5 rounded-sm text-xs text-vui-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <MessageSquare aria-hidden className="size-3.5" />
        {trigger}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} closeLabel={closeLabel}>
        <div className="flex flex-col gap-4">
          {groups.map((g) => (
            <section key={g.key} className="flex flex-col gap-2">
              <h4 className="text-xs font-medium text-muted-foreground">
                {g.title} · <span className="tabular-nums">{g.notes.length}</span>
              </h4>
              <ul className="flex flex-col gap-1.5">
                {g.notes.map((n) => (
                  <li
                    key={n.key}
                    className="flex flex-col gap-0.5 rounded-md border-l-2 border-vui-accent-text bg-ds-background-200 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{n.text}</span>
                    {n.meta && <span className="text-xs text-ds-gray-700">{n.meta}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}
