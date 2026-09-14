import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotIndicator } from './DotIndicator';

const meta = {
  title: 'Atoms/DotIndicator',
  component: DotIndicator,
  tags: ['autodocs'],
  args: {
    ok: true,
    label: 'Redis',
  },
} satisfies Meta<typeof DotIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = {
  args: { ok: true },
};

export const Down: Story = {
  args: { ok: false },
};
