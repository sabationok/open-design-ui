import type { Meta, StoryObj } from '@storybook/react-vite';
import { TransitionRows } from '../../atoms/TransitionRows';

const meta = { title: 'Atoms/TransitionRows' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4 p-4 text-sm">
      <TransitionRows from="SILPO KYIV 0042" to="Silpo" tone="resolved" />
      <TransitionRows from="LIQPAY*UNKNOWN MERCHANT" to="Needs a rule" tone="warning" />
      <TransitionRows from="Transfer from card" to="Skipped" tone="muted" />
    </div>
  ),
};

export const Accent: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4 p-4 text-sm">
      <TransitionRows from="Groceries / Food" to="Groceries" tone="resolved" accent="top" />
      <TransitionRows from="Groceries / Food" to="Groceries" tone="resolved" accent="bottom" />
    </div>
  ),
};
