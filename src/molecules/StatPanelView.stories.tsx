import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatPanelView, type ChartPoint, type ChartType } from './StatPanelView';

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
