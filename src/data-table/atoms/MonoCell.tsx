import type { ReactNode } from 'react';

export function MonoCell({
  children,
  fallback = '—',
}: {
  children?: ReactNode;
  fallback?: string;
}) {
  if (children == null || children === '') {
    return <span className="text-[12px] text-ds-gray-700 whitespace-nowrap">{fallback}</span>;
  }
  return <span className="font-mono text-[12px] text-muted-foreground whitespace-nowrap">{children}</span>;
}