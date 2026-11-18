import type { Meta, StoryObj } from '@storybook/react-vite';
import { IssueEdge, type Issue } from '../../atoms/IssueEdge';
import { IssueList } from '../../molecules/IssueList';

const meta = { title: 'Atoms/IssueEdge' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const rows: { name: string; issues: Issue[] }[] = [
  { name: 'Both', issues: [{ level: 'error', reason: 'Amount is missing' }, { level: 'warn', reason: 'Date is in the future' }] },
  { name: 'Error only', issues: [{ level: 'error', reason: 'Unknown currency' }] },
  { name: 'Warning only', issues: [{ level: 'warn', reason: 'Possible duplicate' }] },
  { name: 'Clean', issues: [] },
];

export const OnRows: Story = {
  render: () => (
    <ul className="w-80 divide-y divide-border overflow-hidden rounded-xl border border-border">
      {rows.map((r) => (
        <li key={r.name} className="relative flex flex-col gap-1 px-4 py-3 text-sm">
          {r.name}
          <IssueList issues={r.issues} />
          <IssueEdge issues={r.issues} />
        </li>
      ))}
    </ul>
  ),
};
