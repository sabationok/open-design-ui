import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Metric, MetricGrid, type MetricItem } from '../../molecules/MetricGrid';
import { Sparkline } from '../../atoms/Sparkline';

const meta = {
  title: 'Molecules/MetricGrid',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const uah = (minor: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(minor / 100);

const series = (seed: number) => Array.from({ length: 30 }, (_, i) => Math.round(1000 + Math.sin(i / 3 + seed) * 400 + i * seed * 10));

const METRICS: MetricItem[] = [
  { key: 'balance', label: 'Баланс · UAH', value: 12_450_000, good: 'none', hint: '3 гаманці' },
  { key: 'income', label: 'Надходження', value: 8_200_000, prev: 7_400_000, good: 'up', series: series(1), seriesTone: 'up' },
  { key: 'expense', label: 'Витрати', value: 5_930_000, prev: 5_100_000, good: 'down', series: series(2), seriesTone: 'down' },
  { key: 'net', label: 'Нетто', value: 2_270_000, prev: 2_300_000, good: 'up', hint: 'за 30 днів' },
];

export const DataDriven: Story = {
  name: 'MetricGrid (metrics list)',
  render: () => {
    const [loading, setLoading] = useState(false);
    return (
      <div className="w-full max-w-4xl">
        <label className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} />
          loading
        </label>
        <MetricGrid metrics={METRICS} format={uah} loading={loading} />
      </div>
    );
  },
};

export const Composed: Story = {
  name: 'Metric (free composition)',
  render: () => (
    <div className="w-full max-w-4xl">
      <MetricGrid columns={3}>
        <Metric label="Received" value="2 415" hint="last 24h" />
        <Metric label="Delivered" value="1 893" footer={<Sparkline values={series(3)} tone="accent" />} />
        <Metric label="Failed" value="414" loading />
      </MetricGrid>
    </div>
  ),
};
