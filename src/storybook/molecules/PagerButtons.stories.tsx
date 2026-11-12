import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PagerButtons } from '../../molecules/PagerButtons';

const meta = {
  title: 'Molecules/PagerButtons',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = ['Coffee', 'Groceries', 'Rent', 'Salary', 'Taxi'];

function Demo({ dark }: { dark?: boolean }) {
  const [i, setI] = useState(1);
  return (
    <div className={dark ? 'dark bg-background p-4 text-foreground' : undefined}>
      <div className="flex w-80 items-center justify-between rounded-md border border-border px-4 py-3">
        <span className="text-sm font-medium">{ITEMS[i]}</span>
        <PagerButtons
          position={`${i + 1} / ${ITEMS.length}`}
          prev={i > 0 ? () => setI(i - 1) : undefined}
          next={i < ITEMS.length - 1 ? () => setI(i + 1) : undefined}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">← / → step through the list.</p>
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const Dark: Story = { name: 'dark', render: () => <Demo dark /> };
