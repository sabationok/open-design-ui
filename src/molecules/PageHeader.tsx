import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface PageHeaderProps {
  /**
   * Free-form bar content (title atom, breadcrumbs, actions) — renders the bordered toolbar bar.
   * Ignored when any of `title`/`description`/`actions`/`eyebrow` is set.
   */
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Small line above the title (back link, breadcrumb). */
  eyebrow?: ReactNode;
  className?: string;
}

// Two shapes: `children` → full-width bordered bar (dashboard toolbar);
// `title`/`description`/`actions`/`eyebrow` → page heading block (used by `Page`).
export function PageHeader({ children, title, description, actions, eyebrow, className }: PageHeaderProps) {
  const structured = title != null || description != null || actions != null || eyebrow != null;
  if (!structured) {
    return <div className={cn('flex items-center gap-3 border-b border-border px-6 py-4', className)}>{children}</div>;
  }
  return (
    <header className={cn('mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3', className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-[13px] text-muted-foreground">{eyebrow}</div>}
        {title && <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{title}</h1>}
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

const PAGE_WIDTH = { md: 'max-w-3xl', lg: 'max-w-5xl', full: 'max-w-none' } as const;
export type PageWidth = keyof typeof PAGE_WIDTH;

export interface PageProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Small line above the title (back link, breadcrumb). */
  eyebrow?: ReactNode;
  /** Controls under the header (search, filters); pinned together with it when `sticky`. */
  toolbar?: ReactNode;
  /** Pin header + toolbar to the top of the nearest scrolling ancestor (e.g. `AppShell`'s <main>). */
  sticky?: boolean;
  width?: PageWidth;
  children: ReactNode;
  className?: string;
}

// Standard page frame: header (title, meta, actions) + padded, centred body with vertical rhythm.
export function Page({ title, description, actions, eyebrow, toolbar, sticky, width = 'md', children, className }: PageProps) {
  const header = (title || actions) && (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      eyebrow={eyebrow}
      className={sticky ? 'mb-0' : toolbar ? 'mb-4' : undefined}
    />
  );
  return (
    <div className={cn('mx-auto w-full px-4 py-6 sm:px-6', sticky && 'pt-0', PAGE_WIDTH[width], className)}>
      {sticky ? (
        <StickyBar>
          {header}
          {toolbar}
        </StickyBar>
      ) : (
        <>
          {header}
          {toolbar && <div className="mb-6 flex flex-col gap-3">{toolbar}</div>}
        </>
      )}
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
}

// Full-bleed (cancels the page gutter) so rows scrolling underneath never show at the sides.
// The hairline appears only once content is actually under the bar.
function StickyBar({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <div
        className={cn(
          'sticky top-0 z-20 -mx-4 mb-6 flex flex-col gap-4 border-b border-border bg-background px-4 pb-4 pt-6 sm:-mx-6 sm:px-6',
          stuck ? 'border-border' : 'border-transparent',
        )}
      >
        {children}
      </div>
    </>
  );
}
