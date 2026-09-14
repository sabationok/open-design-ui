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
  bar: { stroke: '#818cf8', fill: '#e0e7ff' },
  line: { stroke: '#6366f1', fill: '#6366f1' },
  area: { stroke: '#f97316', fill: '#fff7ed' },
};

function ScopePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-500">
      {children}
    </span>
  );
}

function ChartTypeToggle({ value, onChange }: { value: ChartType; onChange?: (t: ChartType) => void }) {
  const types: ChartType[] = ['bar', 'line', 'area'];
  return (
    <div className="flex overflow-hidden rounded border border-zinc-200 bg-white">
      {types.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange?.(t)}
          className={cn(
            'px-2.5 py-0.5 text-[12px] capitalize transition-colors',
            value === t ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-400 hover:text-zinc-600',
          )}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function PanelEmpty() {
  return (
    <div className="flex h-[180px] items-center justify-center">
      <p className="text-[13px] text-zinc-400">No data for this period</p>
    </div>
  );
}

export function PanelChart({ data, chartType }: { data: ChartPoint[]; chartType: ChartType }) {
  const { stroke, fill } = CHART_ACCENT[chartType];

  const xAxis = (
    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={4} />
  );
  const yAxis = <YAxis hide />;
  const tooltip = (
    <Tooltip
      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
      contentStyle={{ fontSize: 12, border: '1px solid #e4e4e7', borderRadius: 6, boxShadow: 'none', padding: '4px 10px' }}
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
          <span className="truncate text-[14px] font-semibold text-zinc-900">{config.title}</span>
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
