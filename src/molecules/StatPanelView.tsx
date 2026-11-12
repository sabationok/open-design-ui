import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Skeleton, cn } from '..';

export type ChartType = 'bar' | 'line' | 'area';

export interface ChartPoint {
  period: string;
  value: number;
}

const CHART_ACCENT: Record<ChartType, { stroke: string; fill: string }> = {
  bar: { stroke: 'var(--ds-blue-700)', fill: 'var(--ds-blue-100)' },
  line: { stroke: 'var(--ds-blue-700)', fill: 'var(--ds-blue-700)' },
  area: { stroke: 'var(--ds-blue-700)', fill: 'var(--ds-blue-100)' },
};

const TOOLTIP_STYLE = {
  fontSize: 12,
  border: '1px solid var(--ds-gray-alpha-400)',
  borderRadius: 6,
  boxShadow: 'var(--ds-shadow-small)',
  background: 'var(--ds-background-100)',
  color: 'var(--ds-gray-1000)',
  padding: '4px 10px',
};

function ScopePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

const CHART_TYPES: ChartType[] = ['bar', 'line', 'area'];

const CHART_TYPE_LABELS: Record<ChartType, string> = { bar: 'Bar', line: 'Line', area: 'Area' };

export interface ChartTypeToggleProps {
  value: ChartType;
  onChange?: (t: ChartType) => void;
  /** Subset / order of types to offer. Default: bar, line, area. */
  types?: ChartType[];
  /** Button captions. Default: Bar / Line / Area. */
  labels?: Partial<Record<ChartType, string>>;
  /** Accessible group name. Default: "Chart type". */
  ariaLabel?: string;
  className?: string;
}

/** Compact segmented bar/line/area switch. */
export function ChartTypeToggle({
  value,
  onChange,
  types = CHART_TYPES,
  labels,
  ariaLabel = 'Chart type',
  className,
}: ChartTypeToggleProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex h-7 overflow-hidden rounded-md border border-border bg-background', className)}
    >
      {types.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === t}
          onClick={() => onChange?.(t)}
          className={cn(
            'px-2.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            value === t
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-ds-gray-alpha-100 hover:text-foreground',
          )}
        >
          {labels?.[t] ?? CHART_TYPE_LABELS[t]}
        </button>
      ))}
    </div>
  );
}

function PanelEmpty() {
  return (
    <div className="flex h-[180px] items-center justify-center">
      <p className="text-[13px] text-ds-gray-700">No data for this period</p>
    </div>
  );
}

export function PanelChart({ data, chartType }: { data: ChartPoint[]; chartType: ChartType }) {
  const { stroke, fill } = CHART_ACCENT[chartType];

  const xAxis = (
    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ds-gray-700)' }} dy={4} />
  );
  const yAxis = <YAxis hide />;
  const tooltip = (
    <Tooltip
      cursor={{ fill: 'var(--ds-gray-alpha-100)' }}
      contentStyle={TOOLTIP_STYLE}
    />
  );

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          {xAxis}{yAxis}{tooltip}
          <Bar dataKey="value" fill={fill} stroke={stroke} strokeWidth={1.5} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          {xAxis}{yAxis}{tooltip}
          <Area dataKey="value" stroke={stroke} fill={fill} fillOpacity={1} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        {xAxis}{yAxis}{tooltip}
        <Line dataKey="value" stroke={stroke} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Multi-series timeline chart ─────────────────────────────────────────────

/** Series palette: Geist chart tokens, then extra accents. Same order everywhere so a key keeps its colour. */
export const CHART_SERIES_COLORS: readonly string[] = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--ds-red-700)',
  'var(--ds-gray-700)',
];

/** Colour for the series at `index`, cycling through `palette`. */
export const chartSeriesColor = (index: number, palette: readonly string[] = CHART_SERIES_COLORS) =>
  palette[index % palette.length];

/** One x-axis row: `label` + one numeric column per series key. */
export type TimelineChartRow = { label: string } & Record<string, number | string>;

export interface TimelineChartProps {
  rows: TimelineChartRow[];
  /** All series keys, in colour order. */
  keys: string[];
  /** Keys currently hidden (e.g. by a legend); they keep their colour slot. */
  hidden?: ReadonlySet<string>;
  /** Display names for series keys (tooltip); defaults to the key. */
  labels?: Record<string, string>;
  chartType: ChartType;
  /** Default 180. */
  height?: number;
  /** Override the series palette (CSS colour values, ideally token vars). */
  colors?: readonly string[];
  /** Row count above which bars drop gaps and rounding. Default 60. */
  denseThreshold?: number;
}

/** Multi-series sibling of `PanelChart`: stacked bars, or overlaid lines / areas. */
export function TimelineChart({
  rows,
  keys,
  hidden,
  labels,
  chartType,
  height = 180,
  colors = CHART_SERIES_COLORS,
  denseThreshold = 60,
}: TimelineChartProps) {
  const dense = rows.length > denseThreshold;
  const visible = keys
    .map((key, i) => ({ key, name: labels?.[key] ?? key, color: chartSeriesColor(i, colors) }))
    .filter(({ key }) => !hidden?.has(key));

  const axes = [
    <XAxis
      key="x"
      dataKey="label"
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 11, fill: 'var(--ds-gray-700)' }}
      minTickGap={16}
      dy={4}
    />,
    <YAxis key="y" hide />,
    <Tooltip key="t" cursor={{ fill: 'var(--ds-gray-alpha-100)' }} contentStyle={TOOLTIP_STYLE} />,
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === 'bar' ? (
        // Dense series: drop gaps + rounding so 1px bars stay solid.
        <BarChart data={rows} barCategoryGap={dense ? 0 : '20%'}>
          {axes}
          {visible.map(({ key, name, color }, i) => (
            <Bar
              key={key}
              dataKey={key}
              name={name}
              stackId="series"
              fill={color}
              radius={!dense && i === visible.length - 1 ? [3, 3, 0, 0] : 0}
            />
          ))}
        </BarChart>
      ) : chartType === 'area' ? (
        <AreaChart data={rows}>
          {axes}
          {visible.map(({ key, name, color }) => (
            <Area key={key} dataKey={key} name={name} stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} dot={false} />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={rows}>
          {axes}
          {visible.map(({ key, name, color }) => (
            <Line key={key} dataKey={key} name={name} stroke={color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

export interface StatPanelViewProps {
  config: { title: string; scope: string; periodPreset: string; chartType: ChartType };
  chartData: ChartPoint[];
  isLoading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onChartTypeChange?: (t: ChartType) => void;
}

export function StatPanelView({ config, chartData, isLoading, onEdit, onDelete, onChartTypeChange }: StatPanelViewProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 pt-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[14px] font-semibold text-foreground">{config.title}</span>
          <ScopePill>{config.scope}</ScopePill>
          <ScopePill>{config.periodPreset}</ScopePill>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ChartTypeToggle value={config.chartType} onChange={onChartTypeChange} />
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-4 pt-0">
        {isLoading
          ? <Skeleton className="h-[180px] w-full" />
          : chartData.length === 0
            ? <PanelEmpty />
            : <PanelChart data={chartData} chartType={config.chartType} />
        }
      </CardContent>
    </Card>
  );
}
