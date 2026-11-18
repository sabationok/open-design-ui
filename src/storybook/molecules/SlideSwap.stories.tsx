import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SlideSwap } from '../../molecules/SlideSwap';
import { TabButtons } from '../../molecules/TabButtons';

const meta = { title: 'Molecules/SlideSwap' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec'] as const;

export const Default: Story = {
  render: () => {
    const [month, setMonth] = useState<(typeof MONTHS)[number]>('Nov');
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <TabButtons
          label="Month"
          size="sm"
          tabs={MONTHS.map((m) => ({ key: m, label: m }))}
          value={month}
          onChange={setMonth}
        />
        <div className="overflow-hidden rounded-md border border-border p-4">
          <SlideSwap value={month} order={MONTHS}>
            <p className="text-sm text-foreground">Spending in {month}</p>
            <p className="text-[13px] text-muted-foreground">Picks a side by the month's position. Off with reduced motion.</p>
          </SlideSwap>
        </div>
      </div>
    );
  },
};
