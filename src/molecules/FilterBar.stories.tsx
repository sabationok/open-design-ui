import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar } from './FilterBar';
import { FilterSelect } from './FilterSelect';
import { SearchInput } from './SearchInput';

const FILTER_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'RETRYING', label: 'Retrying' },
];

const meta = {
  title: 'Molecules/FilterBar',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    return (
      <FilterBar>
        <FilterSelect value={status} onChange={(e) => setStatus(e.target.value)}>
          {FILTER_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FilterSelect>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or URL…"
        />
      </FilterBar>
    );
  },
};
