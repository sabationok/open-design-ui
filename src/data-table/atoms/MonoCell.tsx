import type { ReactNode } from 'react';

export function MonoCell({
  children,
  fallback = '—',
}: {
  children?: ReactNode;
  fallback?: string;
}) {
  if (children == null || children === '') {
    return <span className="text-[12px] text-zinc-400">{fallback}</span>;
  }
  return <span className="font-mono text-[12px] text-zinc-500">{children}</span>;
}