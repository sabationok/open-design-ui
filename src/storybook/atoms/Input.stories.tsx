import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../components/ui/input';

const meta = { title: 'Atoms/Input' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3 p-4">
      <Input placeholder="Plain input" aria-label="Plain input" />
      <Input placeholder="Disabled" aria-label="Disabled" disabled />
      <Input placeholder="Invalid" aria-label="Invalid" aria-invalid />
    </div>
  ),
};

export const WithSuggestions: Story = {
  name: 'With suggestions (datalist)',
  render: () => {
    const [v, setV] = useState('');
    return (
      <div className="w-72 p-4">
        <Input
          aria-label="Merchant"
          placeholder="Type a merchant"
          value={v}
          onChange={(e) => setV(e.target.value)}
          suggestions={['Silpo', 'Nova Poshta', 'Rozetka', 'ATB']}
        />
      </div>
    );
  },
};
