import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Pencil, Trash2, Tag } from 'lucide-react';
import { CtxMenu, DropdownMenu, type MenuItem } from '../../molecules/Menu';

const meta = { title: 'Molecules/Menu' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function useItems(): MenuItem[] {
  const [pinned, setPinned] = useState(true);
  const [sort, setSort] = useState('date');
  const [cat, setCat] = useState('food');
  return [
    { label: 'Edit', icon: Pencil, shortcut: '⌘E', onSelect: () => {} },
    { label: 'Duplicate', icon: Copy, onSelect: () => {} },
    { kind: 'check', label: 'Pinned', checked: pinned, onChange: setPinned },
    {
      kind: 'sub',
      label: 'Sort by',
      meta: sort,
      items: [
        {
          kind: 'radio',
          value: sort,
          onChange: setSort,
          options: [
            { value: 'date', label: 'Date' },
            { value: 'amount', label: 'Amount' },
          ],
        },
      ],
    },
    {
      kind: 'sub',
      label: 'Category',
      icon: Tag,
      items: [
        { kind: 'label', label: 'Spending' },
        {
          kind: 'radio',
          value: cat,
          onChange: setCat,
          options: [
            { value: 'food', label: 'Food', depth: 1 },
            { value: 'rent', label: 'Rent', depth: 1 },
          ],
        },
        { kind: 'label', label: 'Income' },
        { kind: 'radio', value: cat, onChange: setCat, options: [{ value: 'salary', label: 'Salary', depth: 1 }] },
      ],
    },
    { kind: 'separator' },
    { label: 'Delete', icon: Trash2, danger: true, onSelect: () => {} },
  ];
}

export const Dropdown: Story = {
  render: () => {
    const items = useItems();
    return (
      <div className="flex justify-end gap-2 p-4">
        <DropdownMenu items={items} />
      </div>
    );
  },
};

export const DropdownDrill: Story = {
  name: 'Dropdown (drill)',
  render: () => {
    const items = useItems();
    return (
      <div className="flex justify-end p-4">
        <DropdownMenu items={items} nested="drill" labels={{ trigger: 'Row actions' }} />
      </div>
    );
  },
};

export const ContextMenu: Story = {
  render: () => {
    const items = useItems();
    return (
      <div className="p-4">
        <CtxMenu items={items}>
          <div className="rounded-md border border-dashed border-ds-gray-alpha-500 px-4 py-8 text-center text-sm text-muted-foreground">
            Right click here
          </div>
        </CtxMenu>
      </div>
    );
  },
};

export const ContextMenuPreview: Story = {
  name: 'Context menu (preview)',
  render: () => {
    const items = useItems();
    return (
      <div className="p-4">
        <CtxMenu items={items} preview nested="drill">
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-sm">
            <span>Groceries</span>
            <span className="font-mono tabular-nums">-42.10</span>
          </div>
        </CtxMenu>
        <p className="mt-2 text-[13px] text-muted-foreground">Right click or long press the row.</p>
      </div>
    );
  },
};
