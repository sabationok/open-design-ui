import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2 } from 'lucide-react';
import { StickyActionBar } from '../../molecules/StickyActionBar';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';

const meta = { title: 'Molecules/StickyActionBar' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const RULES = Array.from({ length: 30 }, (_, i) => `Rule ${i + 1}: description contains «coffee» → Cafes`);

// Delete mode of a list: rows get checkboxes, the bar with the count and the actions stays in sight while scrolling.
function DeleteModeList() {
  const [deleting, setDeleting] = useState(true);
  const [marked, setMarked] = useState<Set<number>>(() => new Set([1, 4, 7]));
  const toggle = (i: number) =>
    setMarked((s) => {
      const next = new Set(s);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  return (
    <div className="flex h-96 w-full max-w-xl flex-col overflow-auto rounded-md border border-border bg-background p-2">
      {!deleting && (
        <Button size="sm" variant="outline" className="mb-2 self-end" onClick={() => setDeleting(true)}>
          Delete rules…
        </Button>
      )}
      {RULES.map((rule, i) => (
        <div key={rule} className="flex items-center gap-2 border-b border-border px-3 py-2 text-sm text-foreground">
          {deleting && <Checkbox checked={marked.has(i)} onChange={() => toggle(i)} aria-label={`Mark ${rule}`} />}
          <span className="truncate">{rule}</span>
        </div>
      ))}
      {deleting && (
        <StickyActionBar
          start={
            <>
              Marked: <span className="font-medium tabular-nums">{marked.size}</span>
            </>
          }
        >
          <Button size="sm" variant="ghost" onClick={() => setDeleting(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="destructive" disabled={marked.size === 0}>
            <Trash2 /> Delete {marked.size || ''}
          </Button>
        </StickyActionBar>
      )}
    </div>
  );
}

export const Default: Story = {
  name: 'Delete mode (sticks to the bottom while scrolling)',
  render: () => <DeleteModeList />,
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-background p-4">
      <DeleteModeList />
    </div>
  ),
};
