import type { Meta, StoryObj } from '@storybook/react-vite';
import { PathFlow, PathLabel } from '../../atoms/PathLabel';

const meta = {
  title: 'Atoms/PathLabel',
  component: PathLabel,
  tags: ['autodocs'],
  args: { segments: ['Food', 'Groceries'] },
} satisfies Meta<typeof PathLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Truncation: Story = {
  name: 'narrow container (ancestors shrink first)',
  render: () => (
    <div className="flex w-48 flex-col gap-2 border border-border p-2">
      <PathLabel segments={['Household', 'Utilities', 'Electricity']} />
      <PathLabel segments={['Transport', 'A very long leaf category name']} />
    </div>
  ),
};

export const Flow: Story = {
  name: 'PathFlow',
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <PathFlow from={['Cash', 'Wallet']} to={['Bank', 'Savings']} />
      <PathFlow from={['Monobank', 'Black card']} />
    </div>
  ),
};
