import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBox, type SearchField, type SearchGroups, type SearchParams } from '../../molecules/SearchBox';

const meta = { title: 'Molecules/SearchBox' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const FIELDS: SearchField[] = [
  { path: 'note', label: 'Note' },
  { path: 'out.account', label: 'Account' },
  { path: 'out.category', label: 'Category' },
  { path: 'in.account', label: 'Account' },
];
const GROUPS: SearchGroups = { out: { label: 'From' }, in: { label: 'To' } };

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<SearchParams>();
    const [deep, setDeep] = useState(false);
    return (
      <div className="flex max-w-md flex-col gap-3 p-4">
        <SearchBox
          value={value}
          onChange={setValue}
          fields={FIELDS}
          groups={GROUPS}
          placeholder="Search transactions"
          extraItems={[{ kind: 'check', label: 'On all levels', checked: deep, onChange: setDeep }]}
        />
        <code className="font-mono text-xs text-muted-foreground">{JSON.stringify(value ?? null)}</code>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState<SearchParams>();
    return (
      <div className="flex max-w-md flex-col gap-3 p-4">
        {(['xs', 'sm', 'md'] as const).map((size) => (
          <SearchBox key={size} size={size} value={value} onChange={setValue} fields={FIELDS} groups={GROUPS} display="flat" placeholder={`Size ${size}`} />
        ))}
      </div>
    );
  },
};
