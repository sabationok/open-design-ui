import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterChip } from './FilterChip';

const meta = {
  title: 'Molecules/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: {
    label: 'DELIVERED',
    variant: 'default',
  },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'directory'] },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Directory: Story = {
  args: { label: 'stripe', variant: 'directory' },
};

export const Removable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return <>{visible && <FilterChip {...args} onRemove={() => setVisible(false)} />}</>;
  },
};
