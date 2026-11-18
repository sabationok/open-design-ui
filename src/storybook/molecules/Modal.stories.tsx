import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '../../molecules/Modal';
import { Button } from '../../components/ui/button';

const meta = { title: 'Molecules/Modal' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Lorem = () => (
  <div className="flex flex-col gap-3 text-sm text-muted-foreground">
    {Array.from({ length: 12 }, (_, i) => (
      <p key={i}>Row {i + 1}: transactions are grouped by account and matched against the statement.</p>
    ))}
  </div>
);

export const Default: Story = {
  name: 'Default with footer',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Import statement"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Import</Button>
            </div>
          }
        >
          <Lorem />
        </Modal>
      </>
    );
  },
};

export const WideTall: Story = {
  name: 'Wide, tall, split',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Open wide modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Compare" wide tall split>
          <div className="grid h-full md:grid-cols-2">
            <div className="p-5 md:overflow-y-auto"><Lorem /></div>
            <div className="border-t border-border p-5 md:overflow-y-auto md:border-l md:border-t-0"><Lorem /></div>
          </div>
        </Modal>
      </>
    );
  },
};
