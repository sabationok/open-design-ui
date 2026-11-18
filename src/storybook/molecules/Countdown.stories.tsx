import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from '../../molecules/Countdown';
import { Button } from '../../components/ui/button';

const meta = { title: 'Molecules/Countdown' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [state, setState] = useState<'running' | 'done' | 'kept'>('running');
    const [run, setRun] = useState(0);
    return (
      <div className="flex flex-col items-start gap-3">
        {state === 'running' ? (
          <Countdown key={run} seconds={5} onDone={() => setState('done')} onKeep={() => setState('kept')} />
        ) : (
          <p className="text-xs text-muted-foreground">{state === 'done' ? 'Closed.' : 'Kept open.'}</p>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRun((n) => n + 1);
            setState('running');
          }}
        >
          Restart
        </Button>
      </div>
    );
  },
};

export const CustomLabels: Story = {
  render: () => (
    <Countdown seconds={30} label={(n) => `Undo available for ${n} s`} keepLabel="Stop" onDone={() => {}} onKeep={() => {}} />
  ),
};
