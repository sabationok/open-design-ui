import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from '../../molecules/Sheet';
import { Button } from '../../components/ui/button';

const meta = { title: 'Molecules/Sheet' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nested: Story = {
  name: 'Sheet and a nested sheet',
  render: () => {
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open sheet</Button>
        <Sheet open={open} onClose={() => setOpen(false)} title="Account">
          <div className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
            <p>Details of the account live here.</p>
            <Button variant="outline" className="w-fit" onClick={() => setInner(true)}>Open nested</Button>
          </div>
        </Sheet>
        <Sheet open={inner} onClose={() => setInner(false)} title="Edit category" nested>
          <p className="p-5 text-sm text-muted-foreground">A sheet opened from another one.</p>
        </Sheet>
      </>
    );
  },
};
