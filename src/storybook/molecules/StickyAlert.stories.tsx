import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyAlert } from '../../molecules/StickyAlert';

const meta = { title: 'Molecules/StickyAlert' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Rows = () => (
  <>
    {Array.from({ length: 30 }, (_, i) => (
      <div key={i} className="border-b border-border px-3 py-2 text-sm text-foreground">
        Transaction {i + 1}
      </div>
    ))}
  </>
);

export const Default: Story = {
  name: 'Sticks while the list scrolls',
  render: () => {
    const [busy, setBusy] = useState(false);
    return (
      <div className="flex h-96 flex-col overflow-auto rounded-md border border-border">
        <StickyAlert
          actionLabel="Review"
          busy={busy}
          onAction={() => {
            setBusy(true);
            setTimeout(() => setBusy(false), 1200);
          }}
        >
          4 transactions wait for an answer before the import can finish.
        </StickyAlert>
        <Rows />
      </div>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <StickyAlert actionLabel="Review" onAction={() => {}}>Warning: 4 rows need an answer.</StickyAlert>
      <StickyAlert tone="danger" actionLabel="Retry" onAction={() => {}}>The sync failed.</StickyAlert>
      <StickyAlert tone="info" actionLabel="Open" onAction={() => {}}>A new statement arrived.</StickyAlert>
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark flex flex-col bg-background p-4">
      <StickyAlert actionLabel="Review" onAction={() => {}}>4 transactions wait for an answer.</StickyAlert>
    </div>
  ),
};
