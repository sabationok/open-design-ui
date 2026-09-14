import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { JSONPathPicker } from './JSONPathPicker';

const MOCK_PATH_PICKER_SAMPLE = {
  event: 'payment_intent.succeeded',
  data: {
    id: 'pi_3P4a1234abcXYZ',
    amount: 4999,
    currency: 'usd',
    customer: { id: 'cus_Nz1234', email: 'jane@example.com' },
  },
  items: [{ sku: 'sku_123', qty: 2 }],
};

const meta = {
  title: 'Molecules/JSONPathPicker',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSample: Story = {
  name: 'manual entry + pick from a sample JSON body',
  render: () => {
    const [path, setPath] = useState('data.customer.email');
    return (
      <div className="w-full max-w-lg">
        <JSONPathPicker value={path} onChange={setPath} sample={MOCK_PATH_PICKER_SAMPLE} />
      </div>
    );
  },
};

export const ManualOnly: Story = {
  name: 'manual entry only (no `sample` — e.g. path unknown ahead of time)',
  render: () => {
    const [path, setPath] = useState('data.customer.email');
    return <JSONPathPicker value={path} onChange={setPath} />;
  },
};
