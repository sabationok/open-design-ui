import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { IconButton } from '../../atoms/IconButton';

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { label: 'Edit', children: <Pencil /> },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  name: 'sizes (xs / sm / md)',
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton size="xs" label="Edit"><Pencil /></IconButton>
      <IconButton size="sm" label="Edit"><Pencil /></IconButton>
      <IconButton size="md" label="Edit"><Pencil /></IconButton>
    </div>
  ),
};

export const RowActions: Story = {
  name: 'row actions (danger, disabled)',
  render: () => (
    <div className="flex w-80 items-center justify-between rounded-md border border-border px-3 py-1.5 text-sm">
      <span>Groceries</span>
      <div className="flex items-center gap-1">
        <IconButton size="xs" label="Add rule"><Plus /></IconButton>
        <IconButton size="xs" label="Edit"><Pencil /></IconButton>
        <IconButton size="xs" label="Delete" danger><Trash2 /></IconButton>
        <IconButton size="xs" label="Delete (locked)" danger disabled><Trash2 /></IconButton>
      </div>
    </div>
  ),
};

export const Dark: Story = {
  name: 'dark',
  render: () => (
    <div className="dark flex items-center gap-2 bg-background p-4">
      <IconButton label="Edit"><Pencil /></IconButton>
      <IconButton label="Delete" danger><Trash2 /></IconButton>
    </div>
  ),
};
