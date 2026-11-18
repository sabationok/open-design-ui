import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RemovableChips } from '../../molecules/RemovableChips';

const meta = { title: 'Molecules/RemovableChips' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(['Silpo', 'Nova Poshta', 'Rozetka']);
    return (
      <div className="w-80 p-4">
        <RemovableChips label="Skipped" items={items} onRemove={(i) => setItems((s) => s.filter((v) => v !== i))} removeTitle="Take out" />
      </div>
    );
  },
};
