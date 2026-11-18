import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionsMenu } from '../../molecules/OptionsMenu';

const meta = { title: 'Molecules/OptionsMenu' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [archived, setArchived] = useState(false);
    const [zero, setZero] = useState(true);
    return (
      <div className="flex justify-end p-4">
        <OptionsMenu
          items={[
            { key: 'archived', label: 'Show archived', hint: 'Closed accounts stay in the list', checked: archived, onChange: setArchived },
            { key: 'zero', label: 'Show zero balances', checked: zero, onChange: setZero },
          ]}
        />
      </div>
    );
  },
};
