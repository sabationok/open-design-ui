import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { InfoTip } from './InfoTip';

export interface SectionHeadingProps {
  /** The title. */
  children: ReactNode;
  /** The explanation behind an (i) next to the title (`InfoTip`). */
  info?: ReactNode;
  /** Right after the title (a badge, a count). */
  aside?: ReactNode;
  /** Heading level. Default h3 (a form section); `Section` uses h2. */
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
}

// A section's heading: the title, its explanation behind an (i), and an inline slot. The uppercase meta label is
// `SectionLabel`; a titled block with a body is `Section`.
export function SectionHeading({ children, info, aside, as: Tag = 'h3', className }: SectionHeadingProps) {
  return (
    <Tag className={cn('flex items-center gap-1.5 text-sm font-medium text-foreground', className)}>
      {children}
      {info != null && <InfoTip text={info} />}
      {aside}
    </Tag>
  );
}
