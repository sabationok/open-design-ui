import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTableFilters, type FilterConfig } from '../molecules/DataTableFilters';
import { FilterBar } from '../molecules/FilterBar';
import { SearchInput } from '../molecules/SearchInput';
import { JSONViewer } from '../molecules/JSONViewer';

const MOCK_FILTERS: FilterConfig[] = [
  {
    key: 'provider',
    label: 'Provider',
    children: [
      { value: 'stripe', label: 'Stripe' },
      { value: 'novapost', label: 'Nova Post' },
      { value: 'telegram', label: 'Telegram' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    children: [
      { value: 'payments', label: 'Payments' },
      { value: 'deliveries', label: 'Deliveries' },
      { value: 'notifications', label: 'Notifications' },
    ],
  },
];

const meta = {
  title: 'Molecules/DataTableFilters',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideFilterBar: Story = {
  name: 'inside FilterBar — dynamic selects from FilterConfig[]',
  render: () => {
    const [values, setValues] = useState<Record<string, string>>({});
    const onChange = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));
    return (
      <div className="w-full">
        <FilterBar>
          <DataTableFilters filters={MOCK_FILTERS} values={values} onChange={onChange} />
          <SearchInput placeholder="Search ID…" />
        </FilterBar>
        {Object.keys(values).some((k) => values[k]) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(values)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <span
                  key={k}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-700"
                >
                  {k}: <span className="font-semibold">{v}</span>
                </span>
              ))}
          </div>
        )}
      </div>
    );
  },
};

export const FilterConfigShape: Story = {
  name: 'FilterConfig[] shape (via JSONViewer)',
  render: () => (
    <div className="w-full">
      <JSONViewer value={MOCK_FILTERS} defaultExpandDepth={2} />
    </div>
  ),
};
