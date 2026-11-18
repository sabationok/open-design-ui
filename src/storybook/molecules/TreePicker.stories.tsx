import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TreePicker, type TreeNode, type TreePickerCreated } from '../../molecules/TreePicker';

const meta = { title: 'Molecules/TreePicker' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const CATEGORIES: TreeNode[] = [
  { id: 'food', name: 'Food' },
  { id: 'food-groceries', name: 'Groceries', parentId: 'food' },
  { id: 'food-cafe', name: 'Cafes', parentId: 'food', hint: 'Coffee, lunch' },
  { id: 'food-delivery', name: 'Delivery', parentId: 'food' },
  { id: 'home', name: 'Home' },
  { id: 'home-rent', name: 'Rent', parentId: 'home', note: 'Paid on the 1st; the amount is fixed for the year.' },
  { id: 'home-utilities', name: 'Utilities', parentId: 'home' },
  { id: 'home-utilities-power', name: 'Electricity', parentId: 'home-utilities' },
  { id: 'home-utilities-water', name: 'Water', parentId: 'home-utilities' },
  { id: 'transport', name: 'Transport' },
  { id: 'transport-fuel', name: 'Fuel', parentId: 'transport' },
  { id: 'transport-taxi', name: 'Taxi', parentId: 'transport' },
  { id: 'income', name: 'Income' },
  { id: 'income-salary', name: 'Salary', parentId: 'income' },
];

const ACCOUNTS: TreeNode[] = [
  { id: 'usd', name: 'USD', selectable: false },
  { id: 'usd-cash', name: 'Cash wallet', parentId: 'usd', selectable: false },
  { id: 'usd-cash-1', name: 'Pocket', parentId: 'usd-cash' },
  { id: 'usd-bank', name: 'Checking', parentId: 'usd', hint: '•••• 4412' },
  { id: 'eur', name: 'EUR', selectable: false },
  { id: 'eur-bank', name: 'Savings', parentId: 'eur', hint: '•••• 0931' },
];

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <TreePicker nodes={CATEGORIES} value={value} onPick={setValue} />
        <p className="text-xs text-muted-foreground">Picked: {value ?? 'none'}</p>
      </div>
    );
  },
};

export const GroupingNodes: Story = {
  name: 'Grouping nodes (drill in only)',
  render: () => {
    const [value, setValue] = useState<string>();
    return (
      <div className="max-w-sm">
        <TreePicker nodes={ACCOUNTS} value={value} onPick={setValue} />
      </div>
    );
  },
};

export const MultipleImplied: Story = {
  name: 'Multiple, cascade implied',
  render: () => {
    const [ids, setIds] = useState<string[]>(['home']);
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <TreePicker nodes={CATEGORIES} multiple={{ value: ids, onChange: setIds, cascade: 'implied' }} />
        <p className="text-xs text-muted-foreground">Ticked: {ids.join(', ') || 'none'}</p>
      </div>
    );
  },
};

export const MultipleExpand: Story = {
  name: 'Multiple, cascade expand',
  render: () => {
    const [ids, setIds] = useState<string[]>([]);
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <TreePicker nodes={ACCOUNTS} multiple={{ value: ids, onChange: setIds, cascade: 'expand' }} />
        <p className="text-xs text-muted-foreground">Ticked: {ids.join(', ') || 'none'}</p>
      </div>
    );
  },
};

export const CreateAndPath: Story = {
  name: 'Create a child or a whole path',
  render: () => {
    const [nodes, setNodes] = useState(CATEGORIES);
    const [value, setValue] = useState<string>();
    const add = (name: string, parentId?: string) => {
      const id = `${parentId ?? 'root'}-${name.toLowerCase().replace(/\s+/g, '-')}-${Math.round(Math.random() * 1e4)}`;
      setNodes((list) => [...list, { id, name, parentId }]);
      return id;
    };
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <TreePicker
          nodes={nodes}
          value={value}
          onPick={setValue}
          create={{
            at: (level) => (level ? 'New subcategory' : 'New category'),
            defaultName: () => '',
            run: async (name, level): Promise<TreePickerCreated> => {
              await wait();
              if (name.toLowerCase() === 'fail') throw new Error('The server refused this name');
              return { pick: add(name, level) };
            },
          }}
          createPath={{
            suggest: ['Income', 'Freelance', 'Design'],
            run: async (segments) => {
              await wait();
              let parent: string | undefined;
              for (const s of segments) {
                const found = nodes.find((n) => n.parentId === parent && n.name.toLowerCase() === s.toLowerCase());
                parent = found ? found.id : add(s, parent);
              }
              return parent!;
            },
          }}
        />
        <p className="text-xs text-muted-foreground">Picked: {value ?? 'none'}. Type "fail" to see an error.</p>
      </div>
    );
  },
};

export const AsyncLevels: Story = {
  name: 'Async levels',
  render: () => {
    const [value, setValue] = useState<string>();
    const load = async (level?: string) => {
      await wait(700);
      return CATEGORIES.filter((n) => n.parentId === level);
    };
    return (
      <div className="max-w-sm">
        <TreePicker nodes={[]} getChildrenAsync={load} value={value} onPick={setValue} />
      </div>
    );
  },
};

export const Dark: Story = {
  render: () => {
    const [value, setValue] = useState<string>('food-cafe');
    return (
      <div className="dark max-w-sm bg-background p-4 text-foreground">
        <TreePicker nodes={CATEGORIES} value={value} onPick={setValue} initialLevel="food" />
      </div>
    );
  },
};
