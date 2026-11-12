import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChipMultiSelect } from '../../molecules/ChipMultiSelect';

const meta = { title: 'Molecules/ChipMultiSelect' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(['food']);
    return (
      <div className="flex w-80 flex-col gap-4 p-4">
        <ChipMultiSelect
          label="Categories"
          value={v}
          onChange={setV}
          options={[
            { id: 'food', name: 'Food' },
            { id: 'home', name: 'Home' },
            { id: 'transport', name: 'Transport' },
            { id: 'health', name: 'Health' },
          ]}
        />
        <ChipMultiSelect options={[]} value={[]} onChange={() => {}} empty="No categories yet" />
      </div>
    );
  },
};
