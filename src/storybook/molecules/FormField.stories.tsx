import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../../molecules/FormField';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';

const meta = {
  title: 'Molecules/FormField',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  name: 'FormField with Input',
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="w-64">
        <FormField label="Destination URL" hint="Must start with https://">
          <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://…" />
        </FormField>
      </div>
    );
  },
};

export const Validation: Story = {
  name: 'Hint, error, required',
  render: () => {
    const [amount, setAmount] = useState('-5');
    const error = Number(amount) <= 0 ? 'Сума має бути більшою за 0' : undefined;
    return (
      <div className="flex w-72 flex-col gap-4">
        <FormField label="Сума" required error={error} hint="Наприклад, 125,50">
          <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FormField>
        <FormField label="Тип рахунку" hint="Не змінюється після створення">
          <Select defaultValue="card">
            <option value="card">Картка</option>
            <option value="cash">Готівка</option>
            <option value="savings">Заощадження</option>
          </Select>
        </FormField>
        <FormField label="Нотатка" error="Занадто довго">
          <Textarea defaultValue="…" />
        </FormField>
      </div>
    );
  },
};

export const Controls: Story = {
  name: 'Select & Checkbox',
  render: () => {
    const [items, setItems] = useState({ a: true, b: false });
    const all = items.a && items.b;
    const some = items.a !== items.b;
    return (
      <div className="flex w-72 flex-col gap-4">
        <div className="flex gap-2">
          <Select size="sm" wrapperClassName="w-auto">
            <option>sm</option>
          </Select>
          <Select wrapperClassName="w-auto">
            <option>default</option>
          </Select>
          <Select size="lg" wrapperClassName="w-auto">
            <option>lg</option>
          </Select>
        </div>
        <Select disabled defaultValue="x">
          <option value="x">Disabled</option>
        </Select>
        <div className="flex flex-col gap-2">
          <Checkbox
            label="Усі категорії"
            checked={all}
            indeterminate={some}
            onChange={() => setItems({ a: !all, b: !all })}
          />
          <div className="flex flex-col gap-2 pl-6">
            <Checkbox label="Їжа" checked={items.a} onChange={(e) => setItems((s) => ({ ...s, a: e.target.checked }))} />
            <Checkbox label="Транспорт" checked={items.b} onChange={(e) => setItems((s) => ({ ...s, b: e.target.checked }))} />
          </div>
          <Checkbox label="Disabled" disabled defaultChecked />
        </div>
      </div>
    );
  },
};
