import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard, PiggyBank, ShoppingCart, Wallet } from 'lucide-react';
import { IconTile } from '../../atoms/IconTile';

const meta = {
  title: 'Atoms/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  args: { icon: Wallet },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InARow: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { icon: ShoppingCart, name: 'Groceries', amount: '−1 240.00' },
        { icon: CreditCard, name: 'Card payment', amount: '−320.50' },
        { icon: PiggyBank, name: 'Savings', amount: '+5 000.00' },
      ].map((r) => (
        <div key={r.name} className="flex w-72 items-center gap-3">
          <IconTile icon={r.icon} />
          <span className="flex-1 text-sm text-foreground">{r.name}</span>
          <span className="font-mono text-sm tabular-nums text-foreground">{r.amount}</span>
        </div>
      ))}
    </div>
  ),
};
