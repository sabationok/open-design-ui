import type { ReactNode } from 'react';
import { SectionHeading } from '../atoms/SectionHeading';
import { cn } from '../lib/utils';

export interface SectionCardProps {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

// Bordered card with a title bar (title + optional action) above its body.
export function SectionCard({ title, action, children, className }: SectionCardProps) {
  return (
    <div className={cn('overflow-hidden rounded-md border border-border', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[14px] font-semibold text-foreground">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

export interface FrameProps {
  children: ReactNode;
  className?: string;
}

// Bordered, rounded list container whose direct children are separated by hairlines.
export function Frame({ children, className }: FrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-background [&>*+*]:border-t [&>*+*]:border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SectionProps {
  title?: ReactNode;
  /** Explanation of the title behind an (i) next to it (`InfoTip`). */
  info?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Wrap the body in a `Frame`. */
  framed?: boolean;
  children: ReactNode;
  className?: string;
}

// Titled block inside a `Page`: heading row outside, body below (optionally framed).
export function Section({ title, info, description, actions, framed, children, className }: SectionProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      {(title || actions) && (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <SectionHeading as="h2" info={info}>
                {title}
              </SectionHeading>
            )}
            {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {framed ? <Frame>{children}</Frame> : children}
    </section>
  );
}
