import { cn } from '../lib/utils';
import { StatCard } from './StatCard';

type StatValues = Record<string, number | undefined>;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface StatsGridProps {
  stats: StatValues;
  prev?: StatValues;
  className?: string;
}

export function StatsGrid({ stats, prev, className }: StatsGridProps) {
  return (
    <div
      className={cn('grid gap-3', className)}
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
    >
      {Object.entries(stats).map(([key, value]) => (
        <StatCard
          key={key}
          variant={2}
          label={capitalize(key)}
          value={value}
          prev={prev?.[key]}
        />
      ))}
    </div>
  );
}
