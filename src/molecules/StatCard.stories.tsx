import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './StatCard';
import { StatsGrid } from './StatsGrid';

const MOCK_STATS = { received: 2415, delivered: 1893, rejected: 108, failed: 414, retrying: 23 };
const MOCK_PREV = { received: 2100, delivered: 1720, rejected: 90, failed: 290, retrying: 41 };

const meta = {
  title: 'Molecules/StatCard',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  name: 'StatsGrid (variant=2, optional trend)',
  render: () => {
    const [withPrev, setWithPrev] = useState(false);
    return (
      <div className="w-full max-w-2xl">
        <label className="mb-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <input type="checkbox" checked={withPrev} onChange={(e) => setWithPrev(e.target.checked)} />
          prev data
        </label>
        <StatsGrid stats={MOCK_STATS} prev={withPrev ? MOCK_PREV : undefined} />
      </div>
    );
  },
};

export const ExplicitDelta: Story = {
  name: 'StatCard (variant=1, explicit delta string)',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatCard label="Delivered" value="1 893" delta="▲ 10.2%" />
      <StatCard label="Failed" value="414" delta="▼ 3.1%" />
      <StatCard label="Received" value="2 415" />
      <StatCard label="Retrying" value="23" delta="▲ 1.0%" size="md" />
    </div>
  ),
};
