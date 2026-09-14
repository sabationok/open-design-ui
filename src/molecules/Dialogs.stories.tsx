import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogProvider, useDialogs } from './DialogProvider';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Molecules/Dialogs',
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogsDemo() {
  const { alert, confirm, prompt } = useDialogs();
  const [result, setResult] = useState('—');

  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-[12px] text-zinc-600">{result}</span>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={async () => {
            await alert({ title: 'Saved', description: 'Your changes have been saved.' });
            setResult('alert dismissed');
          }}
        >
          Show alert
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            const ok = await confirm({
              title: 'Discard changes?',
              description: 'Unsaved changes will be lost.',
            });
            setResult(`confirm → ${ok}`);
          }}
        >
          Show confirm
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete destination?',
              description: 'This action cannot be undone.',
              variant: 'destructive',
              confirmText: 'DELETE',
              confirmLabel: 'Delete',
            });
            setResult(`confirm (destructive) → ${ok}`);
          }}
        >
          Show destructive confirm
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            const value = await prompt({
              title: 'Rename panel',
              label: 'Panel title',
              defaultValue: 'Stripe deliveries',
            });
            setResult(`prompt → ${value === null ? 'null' : `"${value}"`}`);
          }}
        >
          Show prompt
        </Button>
      </div>
    </div>
  );
}

export const AllDialogs: Story = {
  render: () => <DialogsDemo />,
};
