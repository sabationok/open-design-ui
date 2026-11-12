import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StatPanelView,
  TimelineChart,
  ChartTypeToggle as ChartTypeToggleControl,
  chartSeriesColor,
  type ChartPoint,
  type ChartType,
  type TimelineChartRow,
} from '../../molecules/StatPanelView';

interface MockPanelConfig {
  id: string;
  title: string;
  scope: string;
  periodPreset: string;
  chartType: ChartType;
}

const MOCK_PANEL_CONFIGS: MockPanelConfig[] = [
  { id: 'p1', title: 'Delivered events', scope: 'all', periodPreset: '7d', chartType: 'bar' },
  { id: 'p2', title: 'Failed events', scope: 'stripe', periodPreset: '24h', chartType: 'line' },
  { id: 'p3', title: 'Retry rate', scope: 'novapost', periodPreset: '30d', chartType: 'area' },
];

const MOCK_CHART_DATA: ChartPoint[] = [
  { period: 'Mon', value: 42 },
  { period: 'Tue', value: 58 },
  { period: 'Wed', value: 31 },
  { period: 'Thu', value: 67 },
  { period: 'Fri', value: 49 },
  { period: 'Sat', value: 22 },
  { period: 'Sun', value: 36 },
];

const meta = {
  title: 'Molecules/StatPanelView',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChartTypeToggle: Story = {
  name: 'chart pallets — chart type toggle works',
  render: () => {
    const [configs, setConfigs] = useState(MOCK_PANEL_CONFIGS);

    function setChartType(id: string, t: ChartType) {
      setConfigs((cs) => cs.map((c) => (c.id === id ? { ...c, chartType: t } : c)));
    }

    return (
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {configs.map((config) => (
          <StatPanelView
            key={config.id}
            config={config}
            chartData={MOCK_CHART_DATA}
            onChartTypeChange={(t) => setChartType(config.id, t)}
          />
        ))}
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <div className="max-w-sm">
      <StatPanelView
        config={{ title: 'Delivered events', scope: 'all', periodPreset: '7d', chartType: 'bar' }}
        chartData={[]}
        isLoading
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-sm">
      <StatPanelView
        config={{ title: 'Delivered events', scope: 'all', periodPreset: '7d', chartType: 'bar' }}
        chartData={[]}
      />
    </div>
  ),
};

const SERIES_KEYS = ['delivered', 'failed', 'retried', 'filtered'];
const SERIES_LABELS: Record<string, string> = {
  delivered: 'Delivered',
  failed: 'Failed',
  retried: 'Retried',
  filtered: 'Filtered',
};

const TIMELINE_ROWS: TimelineChartRow[] = Array.from({ length: 14 }, (_, i) => ({
  label: `Oct ${i + 14}`,
  delivered: 40 + ((i * 17) % 35),
  failed: 3 + ((i * 7) % 9),
  retried: 5 + ((i * 5) % 11),
  filtered: 2 + ((i * 3) % 6),
}));

const DENSE_ROWS: TimelineChartRow[] = Array.from({ length: 90 }, (_, i) => ({
  label: `D${i + 1}`,
  delivered: 30 + Math.round(20 * Math.sin(i / 6)) + 20,
  failed: 4 + (i % 5),
  retried: 3 + (i % 7),
  filtered: 1 + (i % 3),
}));

function TimelineChartDemo({ rows }: { rows: TimelineChartRow[] }) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setHidden((h) => {
      const next = new Set(h);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="max-w-2xl rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ul className="flex flex-wrap gap-1.5" aria-label="Series">
          {SERIES_KEYS.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                aria-pressed={!hidden.has(key)}
                onClick={() => toggle(key)}
                className="flex h-7 items-center gap-1.5 rounded-md border border-border px-2 text-[12px] text-foreground aria-[pressed=false]:text-ds-gray-700 aria-[pressed=false]:line-through"
              >
                <span className="size-2 rounded-full" style={{ background: chartSeriesColor(i) }} />
                {SERIES_LABELS[key]}
              </button>
            </li>
          ))}
        </ul>
        <ChartTypeToggleControl value={chartType} onChange={setChartType} />
      </div>
      <TimelineChart rows={rows} keys={SERIES_KEYS} hidden={hidden} labels={SERIES_LABELS} chartType={chartType} />
    </div>
  );
}

/** Multi-series sibling of PanelChart: stacked bars, overlaid lines / areas; hidden series keep their colour. */
export const MultiSeriesTimeline: Story = {
  render: () => <TimelineChartDemo rows={TIMELINE_ROWS} />,
};

/** More than 60 rows: bars drop gaps and rounding. */
export const MultiSeriesDense: Story = {
  render: () => <TimelineChartDemo rows={DENSE_ROWS} />,
};

/** Standalone segmented chart-type switch (role=group, aria-pressed). */
export const ChartTypeToggleStandalone: Story = {
  name: 'ChartTypeToggle',
  render: () => {
    const [value, setValue] = useState<ChartType>('line');
    return <ChartTypeToggleControl value={value} onChange={setValue} />;
  },
};
