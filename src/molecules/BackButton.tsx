import type { ReactNode } from 'react';
import { BackLink } from './BackLink';

/** @deprecated Use `BackLink` (same look; `label` adds the arrow icon). */
export function BackButton({ onClick, children }: { onClick(): void; children: ReactNode }) {
  return <BackLink onClick={onClick}>{children}</BackLink>;
}
