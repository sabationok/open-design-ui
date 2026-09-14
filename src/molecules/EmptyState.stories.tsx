import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../components/ui/button';

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
