import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionCard } from './SectionCard';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Molecules/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  args: {
    title: 'Delivery Timeline',
    children: <div className="px-4 py-3 text-[13px] text-zinc-500">Content goes here…</div>,
  },
} satisfies Meta<typeof SectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutAction: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <SectionCard {...args} />
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    title: 'Requests',
    action: <Button variant="outline">Export</Button>,
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <SectionCard {...args} />
    </div>
  ),
};
