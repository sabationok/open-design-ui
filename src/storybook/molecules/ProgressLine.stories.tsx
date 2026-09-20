import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressLine } from '../../molecules/ProgressLine';
import { newBadgeDecorator } from '../lib/newBadge';

const meta = {
  title: 'Molecules/ProgressLine',
  component: ProgressLine,
  tags: ['autodocs'],
  decorators: [newBadgeDecorator('Molecules/ProgressLine')],
} satisfies Meta<typeof ProgressLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Steps: Story = {
  render: () => (
    <div className="flex h-40 gap-10">
      {[0, 0.33, 0.66, 1].map((progress) => (
        <div key={progress} className="relative w-px">
          <ProgressLine progress={progress} />
        </div>
      ))}
    </div>
  ),
};
