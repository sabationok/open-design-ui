import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultiSelect } from '../../molecules/MultiSelect';
import { RemovableChips } from '../../molecules/RemovableChips';
import { SearchSelect } from '../../molecules/SearchSelect';
import { useMultiSelect } from '../../molecules/useMultiSelect';

const meta = { title: 'Molecules/MultiSelect' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'mono', label: 'Monobank' },
  { value: 'privat', label: 'PrivatBank' },
  { value: 'cash', label: 'Cash', hint: 'UAH' },
  { value: 'wise', label: 'Wise', hint: 'EUR' },
];

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(['cash']);
    return (
      <div className="flex w-80 justify-end p-4">
        <MultiSelect label="Skip accounts" placeholder="Add account" options={options} value={v} onChange={setV} />
      </div>
    );
  },
};

export const HookApart: Story = {
  name: 'useMultiSelect: dropdown and chips apart',
  render: () => {
    const [v, setV] = useState(['mono', 'wise']);
    const { select, chips, selected } = useMultiSelect({ label: 'Accounts', placeholder: 'Add', options, value: v, onChange: setV });
    return (
      <div className="flex w-96 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 text-sm">
          Accounts
          <SearchSelect {...select} />
        </div>
        {selected && <RemovableChips {...chips} />}
      </div>
    );
  },
};
