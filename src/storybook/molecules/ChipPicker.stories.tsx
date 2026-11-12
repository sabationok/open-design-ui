import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChipPicker } from '../../molecules/ChipPicker';

const meta = { title: 'Molecules/ChipPicker' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { name: 'travel', hint: '12' },
  { name: 'groceries', hint: '48' },
  { name: 'gifts', hint: '3' },
  { name: 'subscriptions', hint: '9' },
];

export const Tags: Story = {
  name: 'Tags with prefix and separators',
  render: () => {
    const [v, setV] = useState(['travel']);
    return (
      <div className="w-80 p-4">
        <ChipPicker value={v} onChange={setV} options={options} prefix="#" separators={/[#,\s]+/} iconAdd="Add tag" />
      </div>
    );
  },
};

export const Names: Story = {
  render: () => {
    const [v, setV] = useState<string[]>([]);
    return (
      <div className="w-80 p-4">
        <ChipPicker value={v} onChange={setV} options={[{ name: 'Silpo' }, { name: 'Nova Poshta' }, { name: 'Rozetka' }]} />
      </div>
    );
  },
};
