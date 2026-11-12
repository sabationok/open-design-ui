import type { ComponentType } from 'react';
import { cn } from '../lib/utils';

export interface IconTileProps {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}

// Monochrome square: the icon names the kind, colour stays on the value next to it.
export function IconTile({ icon: Icon, className }: IconTileProps) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md border border-ds-gray-alpha-500 text-muted-foreground',
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </span>
  );
}
