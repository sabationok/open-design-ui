import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbSep, MonoId } from '../atoms';
import { cn } from '../lib/utils';
import { BackLink } from './BackLink';

interface BreadcrumbNavProps {
  backLabel: string;
  onBack(): void;
  id: string;
  actions?: React.ReactNode;
}

// Detail-page bar: "← back" / mono id, actions on the right.
export function BreadcrumbNav({ backLabel, onBack, id, actions }: BreadcrumbNavProps) {
  return (
    <>
      <BackLink onClick={onBack}>← {backLabel}</BackLink>
      <BreadcrumbSep />
      <MonoId>{id}</MonoId>
      {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </>
  );
}

export interface BreadcrumbItem {
  label: ReactNode;
  /** A Link's `to`; without it the item is plain text. */
  to?: string;
  /** Router state the link carries. */
  state?: unknown;
}

export interface BreadcrumbsProps {
  /** Root → current page. The last item is the page itself (`aria-current="page"` when it has no `to`). */
  items: readonly BreadcrumbItem[];
  /** Accessible name of the <nav>. */
  label?: string;
  /** Between items. Defaults to `BreadcrumbSep` ("/"). */
  separator?: ReactNode;
  className?: string;
}

// The path to a nested page: each level a link, the last one plain text. One level back only: `BackLink`.
export function Breadcrumbs({ items, label = 'Breadcrumbs', separator, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground [&_svg]:size-3.5')}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <li aria-hidden className="flex items-center text-ds-gray-600">
                  {separator ?? <BreadcrumbSep />}
                </li>
              )}
              <li className="min-w-0">
                {item.to ? (
                  <Link
                    to={item.to}
                    state={item.state}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className="text-foreground">
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
