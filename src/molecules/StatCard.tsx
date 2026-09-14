import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Trend logic (variant 2) ──────────────────────────────────────────────────

type TrendDir = 'up' | 'down' | 'flat' | 'new';

interface TrendResult {
  dir: TrendDir;
  pct: number | null;
}

function calcTrend(current: number, prev: number): TrendResult {
  if (prev === 0) return { dir: 'new', pct: null };
  const pct = ((current - prev) / prev) * 100;
  const dir = Math.abs(pct) < 0.5 ? 'flat' : pct > 0 ? 'up' : 'down';
  return { dir, pct };
}

const TREND_STYLES: Record<TrendDir, string> = {
  up:   'text-emerald-600',
  down: 'text-red-500',
  flat: 'text-zinc-400',
  new:  'text-zinc-400',
};

function TrendIndicator({ trend }: { trend: TrendResult }) {
  const cls = cn('inline-flex items-center gap-0.5 text-[11px] font-medium', TREND_STYLES[trend.dir]);
  if (trend.dir === 'new') return <span className={cls}>new</span>;
  if (trend.dir === 'flat') return (
    <span className={cls}><Minus className="h-3 w-3" />{trend.pct?.toFixed(0)}%</span>
  );
  const Icon = trend.dir === 'up' ? TrendingUp : TrendingDown;
  return (
    <span className={cls}>
      <Icon className="h-3 w-3" />
      {Math.abs(trend.pct!).toFixed(1)}%
    </span>
  );
}

// ─── Variant 1 delta (string) ─────────────────────────────────────────────────

function DeltaLabel({ delta }: { delta: string }) {
  const isPos = delta.startsWith('▲');
  const isNeg = delta.startsWith('▼');
  return (
    <span
      className={cn(
        'text-xs font-medium',
        isPos && 'text-wy-delivered-text',
        isNeg && 'text-wy-failed-text',
        !isPos && !isNeg && 'text-zinc-500',
      )}
    >
      {delta}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  /** variant 1: string|number displayed as-is; variant 2: raw number used for trend calc */
  value: string | number | undefined;
  /** variant 1 only — explicit delta string e.g. "▲ 10.2%" */
  delta?: string;
  valueColor?: string;
  size?: 'md' | 'lg';
  /** variant 2 only — previous period value; enables computed trend indicator */
  prev?: number;
  /** 1 = classic StatCard with string delta (default); 2 = computed trend from prev */
  variant?: 1 | 2;
}

export function StatCard({
  label,
  value,
  delta,
  valueColor,
  size = 'lg',
  prev,
  variant = 1,
}: StatCardProps) {
  const display = value ?? 0;
  const trend = variant === 2 && prev !== undefined
    ? calcTrend(Number(display), prev)
    : null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span
          className={cn(
            'font-bold -tracking-[0.02em]',
            size === 'lg' ? 'text-[28px]' : 'text-[24px]',
            valueColor,
          )}
        >
          {typeof display === 'number' ? display.toLocaleString() : display}
        </span>
        {trend && <TrendIndicator trend={trend} />}
        {!trend && delta && <DeltaLabel delta={delta} />}
      </div>
    </div>
  );
}
