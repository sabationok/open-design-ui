import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, toast } from '../../molecules/Toast';
import { Button } from '../../components/ui/button';

const meta = {
  title: 'Molecules/Toast',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = <T,>(ms: number, value: T, fail = false) =>
  new Promise<T>((resolve, reject) => setTimeout(() => (fail ? reject(new Error('Network error')) : resolve(value)), ms));

export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.success('Transaction saved')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error('Could not save', { description: 'The server did not respond.' })}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Transaction deleted', { action: { label: 'Undo', onClick: () => toast.success('Restored') } })}
      >
        Info + action
      </Button>
      <Button
        variant="outline"
        onClick={() => void toast.promise(wait(1500, 42), { loading: 'Importing…', success: (n) => `Imported ${n} rows`, error: 'Import failed' })}
      >
        Promise (resolves)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          void toast
            .promise(wait(1500, 0, true), { loading: 'Importing…', success: 'Done', error: (e) => `Import failed: ${(e as Error).message}` })
            .catch(() => {})
        }
      >
        Promise (rejects)
      </Button>
      <Toaster {...args} />
    </div>
  ),
};
