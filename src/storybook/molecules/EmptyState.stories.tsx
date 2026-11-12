import type { Meta, StoryObj } from '@storybook/react-vite';
import { Wallet } from 'lucide-react';
import { EmptyState } from '../../molecules/EmptyState';
import { Button } from '../../components/ui/button';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIconAndAction: Story = {
  name: 'with icon + action',
  args: {
    icon: '⚡',
    title: 'No events yet',
    description: 'Events appear here once your webhook receives a request.',
    action: <Button>Add destination</Button>,
  },
  render: (args) => (
    <div className="w-full border border-zinc-100">
      <EmptyState {...args} />
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    title: 'Nothing found',
    description: 'Try adjusting your filters.',
  },
  render: (args) => (
    <div className="w-full border border-zinc-100">
      <EmptyState {...args} />
    </div>
  ),
};

export const Dashed: Story = {
  name: 'variant="dashed" + component icon',
  args: {
    variant: 'dashed',
    icon: Wallet,
    title: 'No accounts yet',
    description: 'Add a bank card or a cash wallet to start tracking balances.',
    action: (
      <>
        <Button>Add account</Button>
        <Button variant="outline">Import CSV</Button>
      </>
    ),
  },
  render: (args) => (
    <div className="max-w-lg">
      <EmptyState {...args} />
    </div>
  ),
};

export const DefaultIcon: Story = {
  name: 'default icon',
  args: { variant: 'dashed', title: 'Nothing here yet' },
  render: (args) => (
    <div className="max-w-lg">
      <EmptyState {...args} />
    </div>
  ),
};
