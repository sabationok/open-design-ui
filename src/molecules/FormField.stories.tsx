import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '../components/ui/input';

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
        <FormField label="Destination URL">
          <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://…" />
        </FormField>
      </div>
    );
  },
};
