import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectAllBar } from '../../molecules/SelectAllBar';

const meta = { title: 'Molecules/SelectAllBar' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [picked, setPicked] = useState<Set<string>>(new Set(['a', 'x']));
    return (
      <div className="p-4">
        <SelectAllBar ids={['a', 'b', 'c', 'd']} picked={picked} onChange={setPicked} />
      </div>
    );
  },
};
