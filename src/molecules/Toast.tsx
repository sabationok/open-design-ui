import { useEffect, useSyncExternalStore } from 'react';
import { CircleAlert, CircleCheck, Info, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastTone = 'success' | 'error' | 'info' | 'loading';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: ToastAction;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  /** Auto-dismiss delay in ms. Defaults to 4s, 8s for errors. */
  duration?: number;
}

export interface ToastPromiseMessages<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
}

const DURATION = 4000;
const MAX_VISIBLE = 5;

// Tiny module-level store: the imperative `toast` API writes, every <Toaster> subscribes.
let items: ToastItem[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function setItems(next: ToastItem[]) {
  items = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => items;

function schedule(id: number, ms: number) {
  clearTimeout(timers.get(id));
  timers.set(id, setTimeout(() => toast.dismiss(id), ms));
}

function update(id: number, patch: Partial<ToastItem>) {
  setItems(items.map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

function show(tone: ToastTone, title: string, opts: ToastOptions = {}) {
  const id = ++seq;
  setItems([...items.slice(-(MAX_VISIBLE - 1)), { id, tone, title, description: opts.description, action: opts.action }]);
  if (tone !== 'loading') schedule(id, opts.duration ?? (tone === 'error' ? DURATION * 2 : DURATION));
  return id;
}

// Imperative API, usable outside React (mutations, query callbacks). Each call returns the toast id.
export const toast = {
  success: (title: string, opts?: ToastOptions) => show('success', title, opts),
  error: (title: string, opts?: ToastOptions) => show('error', title, opts),
  info: (title: string, opts?: ToastOptions) => show('info', title, opts),
  dismiss: (id: number) => {
    clearTimeout(timers.get(id));
    timers.delete(id);
    setItems(items.filter((t) => t.id !== id));
  },
  /** Loading toast that turns into success/error when the promise settles. Returns the same promise. */
  promise<T>(p: Promise<T>, msg: ToastPromiseMessages<T>) {
    const id = show('loading', msg.loading);
    p.then(
      (v) => {
        update(id, { tone: 'success', title: typeof msg.success === 'function' ? msg.success(v) : msg.success });
        schedule(id, DURATION);
      },
      (e: unknown) => {
        update(id, { tone: 'error', title: typeof msg.error === 'function' ? msg.error(e) : msg.error });
        schedule(id, DURATION * 2);
      },
    );
    return p;
  },
};

const ICON = {
  success: { icon: CircleCheck, className: 'text-vui-success' },
  error: { icon: CircleAlert, className: 'text-vui-danger' },
  info: { icon: Info, className: 'text-vui-accent' },
  loading: { icon: Loader2, className: 'animate-spin text-muted-foreground' },
} as const;

export interface ToasterProps {
  /** Accessible name of each toast's close button. */
  closeLabel?: string;
  className?: string;
}

// Mount once near the root. Bottom-right on desktop, full-width bottom on phones.
export function Toaster({ closeLabel = 'Close', className }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(
    () => () => {
      timers.forEach(clearTimeout);
      timers.clear();
    },
    [],
  );
  return (
    <ol
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed inset-x-3 bottom-3 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[360px]',
        className,
      )}
    >
      {list.map((t) => {
        const { icon: Icon, className: iconClassName } = ICON[t.tone];
        return (
          <li
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-background p-3 text-sm shadow-ds-large"
          >
            <Icon className={cn('mt-0.5 size-4 shrink-0', iconClassName)} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] text-muted-foreground">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  toast.dismiss(t.id);
                }}
                className="shrink-0 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              aria-label={closeLabel}
              className="shrink-0 rounded-sm text-ds-gray-700 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
