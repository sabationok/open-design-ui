import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';
import { Sparkline, type SparklineTone } from '../atoms/Sparkline';

// ─── Delta ────────────────────────────────────────────────────────────────────

/** Which direction of change is good: income up is good, expenses up is bad, a balance is neither. */
export type MetricGood = 'up' | 'down' | 'none';

function MetricDelta({ value, prev, good }: { value: number; prev: number; good: MetricGood }) {
  if (prev === 0) return <span className="text-xs text-ds-gray-700">new</span>;
  const pct = ((value - prev) / Math.abs(prev)) * 100;
  const dir = Math.abs(pct) < 0.5 ? 'flat' : pct > 0 ? 'up' : 'down';
  const tone =
    dir === 'flat' || good === 'none' ? 'text-muted-foreground' : dir === good ? 'text-vui-success-text' : 'text-vui-danger-text';
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium tabular-nums', tone)}>
      <Icon className="size-3.5" aria-hidden />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface MetricProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  /** Top-right, next to the label — e.g. a computed delta. */
  delta?: ReactNode;
  /** Below the value: sparkline, breakdown. */
  footer?: ReactNode;
  loading?: boolean;
  className?: string;
}

// Dashboard number: label, big value, optional delta/hint and a footer.
export function Metric({ label, value, hint, delta, footer, loading, className }: MetricProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-background p-4', className)}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-[13px] text-muted-foreground">{label}</span>
        {!loading && delta}
      </div>
      {loading ? (
        <Skeleton className="my-1 h-7 w-2/3" />
      ) : (
        <span className="truncate text-2xl font-semibold tracking-tight text-foreground tabular-nums [&_*]:text-inherit">{value}</span>
      )}
      {hint && <span className="truncate text-xs text-ds-gray-700">{hint}</span>}
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface MetricItem {
  key: string;
  label: ReactNode;
  /** Raw number — formatted with `format`, drives the delta. `null`/`undefined` renders as loading. */
  value?: number | null;
  /** Pre-rendered value; wins over `value` + `format` (e.g. a `<Money>`). */
  display?: ReactNode;
  /** Previous-period value; enables the delta. */
  prev?: number;
  good?: MetricGood;
  /** Chronological values for a sparkline footer. */
  series?: number[];
  seriesTone?: SparklineTone;
  hint?: ReactNode;
  /** Custom footer; replaces the sparkline. */
  footer?: ReactNode;
}

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

export interface MetricGridProps {
  metrics?: MetricItem[];
  format?: (value: number, item: MetricItem) => ReactNode;
  /** Forces every card into the loading state. */
  loading?: boolean;
  columns?: keyof typeof COLUMNS;
  className?: string;
  /** Free-form `<Metric>` cards, rendered after `metrics`. */
  children?: ReactNode;
}

const defaultFormat = (v: number) => v.toLocaleString();

export function MetricGrid({ metrics = [], format = defaultFormat, loading, columns = 4, className, children }: MetricGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3', COLUMNS[columns], className)}>
      {metrics.map((m) => {
        const hasValue = m.value !== undefined && m.value !== null;
        return (
          <Metric
            key={m.key}
            label={m.label}
            loading={loading || (m.display === undefined && !hasValue)}
            value={m.display ?? (hasValue ? format(m.value!, m) : null)}
            delta={hasValue && m.prev !== undefined && <MetricDelta value={m.value!} prev={m.prev} good={m.good ?? 'up'} />}
            hint={m.hint}
            footer={m.footer ?? (m.series && <Sparkline values={m.series} tone={m.seriesTone} />)}
          />
        );
      })}
      {children}
    </div>
  );
}
