import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoTip } from '../../atoms/InfoTip';

const meta = {
  title: 'Atoms/InfoTip',
  component: InfoTip,
  tags: ['autodocs'],
  args: { text: 'Net worth is the sum of all account balances, converted to your main currency at today’s rate.' },
  render: (args) => (
    <div className="flex items-center gap-1.5 pt-20">
      <h3 className="text-sm font-medium text-foreground">Net worth</h3>
      <InfoTip {...args} />
    </div>
  ),
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NearViewportEdge: Story = {
  name: 'near the top edge (flips below)',
  render: (args) => (
    <div className="flex items-center gap-1.5">
      <h3 className="text-sm font-medium text-foreground">Cash flow</h3>
      <InfoTip {...args} />
    </div>
  ),
};
