import type { Meta, StoryObj } from '@storybook/react-vite';
import { IssueList } from '../../molecules/IssueList';

const meta = {
  title: 'Molecules/IssueList',
  component: IssueList,
  args: {
    issues: [
      { level: 'error', reason: 'Amount is missing' },
      { level: 'warn', reason: 'Date is in the future' },
      { level: 'warn', reason: 'Possible duplicate of row 12' },
    ],
  },
} satisfies Meta<typeof IssueList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <div className="w-80 p-4"><IssueList {...args} /></div> };
