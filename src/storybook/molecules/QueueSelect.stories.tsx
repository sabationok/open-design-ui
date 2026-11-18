import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueueSelect } from '../../molecules/QueueSelect';

const meta = { title: 'Molecules/QueueSelect' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { id: 'mono', name: 'Monobank' },
  { id: 'privat', name: 'PrivatBank' },
  { id: 'cash', name: 'Cash' },
  { id: 'wise', name: 'Wise' },
];

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(['privat']);
    return (
      <div className="w-80 p-4">
        <QueueSelect label="Payment order" options={options} value={v} onChange={setV} />
      </div>
    );
  },
};
