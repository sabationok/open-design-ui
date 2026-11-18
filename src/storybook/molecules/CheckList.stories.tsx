import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckGroup, CheckRow, type CheckItem } from '../../molecules/CheckList';

const meta = { title: 'Molecules/CheckList' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const items: CheckItem[] = [
  { id: 'groceries', title: 'Groceries', meta: '48' },
  { id: 'travel', title: 'Travel', meta: '12', hint: 'Includes flights' },
  { id: 'food', title: 'Food', meta: '30', locked: true },
  { id: 'gifts', title: 'Gifts', meta: '3' },
];

export const Group: Story = {
  render: () => {
    const [on, setOn] = useState(new Set(['groceries', 'food']));
    const onSet = (ids: string[], v: boolean) =>
      setOn((s) => {
        const next = new Set(s);
        for (const id of ids) {
          if (v) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    return (
      <div className="w-96 divide-y divide-border overflow-hidden rounded-xl border border-border">
        <CheckGroup
          title="Categories"
          hint="Drop the ones you don't need"
          items={items}
          isOn={(id) => on.has(id)}
          onSet={onSet}
          summary={(n, total) => `${n} of ${total} kept`}
          allLabel="All categories"
          lockedHint="Kept: a rule uses it"
          defaultOpen
        />
        <CheckGroup title="Tags" items={[]} isOn={() => false} onSet={() => {}} allLabel="All tags" />
      </div>
    );
  },
};

export const Rows: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div className="w-96 divide-y divide-border overflow-hidden rounded-xl border border-border">
        <CheckRow checked={a} onChange={setA} title="Keep transfers" meta="24" />
        <CheckRow checked={b} onChange={setB} title="Keep cash" hint="Off rows are struck through" />
        <CheckRow checked disabled onChange={() => {}} title="Locked row" hint="Needed by a kept rule" />
      </div>
    );
  },
};
