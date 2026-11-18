import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BackLinkProps {
  onClick(): void;
  /** Where "back" goes, e.g. "Events". Rendered after a left arrow icon. */
  label?: ReactNode;
  /** Free content instead of `label` (no icon is added), e.g. "← Back to Events". */
  children?: ReactNode;
  className?: string;
}

// "← where you came from", the eyebrow of a nested page. Pass `label` (arrow icon + text) or `children` (as is).
// A path of several levels is `Breadcrumbs`.
export function BackLink({ onClick, label, children, className }: BackLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-sm text-[13px] text-muted-foreground transition-colors hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5',
        className,
      )}
    >
      {label != null ? (
        <>
          <ArrowLeft aria-hidden />
          {label}
        </>
      ) : (
        children
      )}
    </button>
  );
}
