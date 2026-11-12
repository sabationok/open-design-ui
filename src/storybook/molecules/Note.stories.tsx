import type { Meta, StoryObj } from '@storybook/react-vite';
import { Note, type NoteTone } from '../../molecules/Note';
import { Button } from '../../components/ui/button';

const meta = {
  title: 'Molecules/Note',
  component: Note,
  tags: ['autodocs'],
  args: {
    tone: 'neutral',
    title: 'Import is not available for this bank',
    children: 'Add transactions manually or upload a CSV export instead.',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] satisfies NoteTone[] },
  },
  render: (args) => (
    <div className="max-w-md">
      <Note {...args} />
    </div>
  ),
} satisfies Meta<typeof Note>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Note tone="neutral" title="Neutral">Read-only context the user should know.</Note>
      <Note tone="info" title="Info">Sync runs every 15 minutes.</Note>
      <Note tone="success" title="Imported 42 transactions" />
      <Note tone="warning" title="3 rows were skipped">They had no amount.</Note>
      <Note tone="danger" title="Could not load accounts">The server did not respond.</Note>
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    tone: 'danger',
    title: 'Could not load accounts',
    children: 'The server did not respond.',
    action: (
      <Button variant="destructive" size="sm">
        Retry
      </Button>
    ),
  },
};

export const Compact: Story = {
  name: 'Compact (warning plaque)',
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Note
        tone="warning"
        compact
        title="2 rows have no category"
        action={
          <button type="button" className="rounded-sm text-xs underline decoration-dotted underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Show
          </button>
        }
      >
        <span className="text-muted-foreground">They import as Uncategorized.</span>
      </Note>
      <Note tone="danger" compact title="Could not save the rule" />
    </div>
  ),
};
