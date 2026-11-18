import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotesDialog } from '../../molecules/NotesDialog';

const meta = {
  title: 'Molecules/NotesDialog',
  component: NotesDialog,
  args: {
    title: 'Notes',
    trigger: '3 notes · view',
    groups: [
      {
        key: 'tx-1',
        title: 'Coffee, 12 Nov',
        notes: [
          { key: 'a', text: 'Split with Anna, she owes half.', meta: 'Vitalii · 12 Nov, 09:14' },
          { key: 'b', text: 'Paid back.', meta: 'Anna · 13 Nov, 18:02' },
        ],
      },
      {
        key: 'tx-2',
        title: 'Rent, 1 Nov',
        notes: [{ key: 'c', text: 'Includes the parking spot from this month.', meta: 'Vitalii · 1 Nov' }],
      },
    ],
  },
} satisfies Meta<typeof NotesDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  render: (args) => (
    <div className="dark bg-background p-4">
      <NotesDialog {...args} />
    </div>
  ),
};
