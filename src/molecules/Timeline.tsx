import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface TimelineProps {
  children: ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn('relative pl-5', className)}>
      <div className="absolute bottom-1.5 left-1 top-1.5 w-px bg-zinc-200" />
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
