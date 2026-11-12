import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionList } from '../../molecules/OptionList';

const meta = { title: 'Molecules/OptionList' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<'keep' | 'merge' | 'skip'>('merge');
    return (
      <div className="w-80 p-4">
        <OptionList
          label="Duplicates"
          value={v}
          onChange={setV}
          options={[
            { value: 'keep', title: 'Keep both', description: 'Import every row as is' },
            { value: 'merge', title: 'Merge', description: 'Match by date and amount' },
            { value: 'skip', title: 'Skip', description: 'Leave duplicates out', disabled: true },
          ]}
        />
      </div>
    );
  },
};
