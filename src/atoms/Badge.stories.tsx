import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'tone',
    size: 'sm',
    tone: 'default',
    children: 'Status',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'] satisfies BadgeTone[],
    },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tone: Story = {};

export const AllTones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {(['success', 'destructive', 'warning', 'default'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};
