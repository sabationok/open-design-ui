import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeChip } from '../../atoms/CodeChip';

const meta = { title: 'Atoms/CodeChip', component: CodeChip, args: { children: 'UAH' } } satisfies Meta<typeof CodeChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BesideAValue: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4 text-sm">
      <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
        1 240.50 <CodeChip>UAH</CodeChip>
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
        12.4 <CodeChip>kg</CodeChip>
      </span>
    </div>
  ),
};
