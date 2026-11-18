import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchSelect } from '../../molecules/SearchSelect';

const meta = { title: 'Molecules/SearchSelect' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'UAH', label: 'UAH', hint: '₴' },
  { value: 'USD', label: 'USD', hint: '$' },
  { value: 'EUR', label: 'EUR', hint: '€' },
  { value: 'PLN', label: 'PLN', hint: 'zł' },
  { value: 'GBP', label: 'GBP', hint: '£' },
  { value: 'USDT', label: 'USDT', hint: 'crypto', badge: 'new' },
];

export const Sizes: Story = {
  name: 'Inline and form sizes',
  render: () => {
    const [a, setA] = useState('USD');
    const [b, setB] = useState('');
    return (
      <div className="flex w-72 flex-col items-start gap-4 p-4">
        <SearchSelect label="Currency" value={a} options={options} onChange={setA} />
        <SearchSelect label="Currency" value={b} options={options} onChange={setB} size="md" placeholder="Pick a currency" />
      </div>
    );
  },
};
