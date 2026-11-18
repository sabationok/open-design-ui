import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TabsGroup } from '../../atoms/TabsGroup';
import type { ComponentSize } from '../../lib/componentSize';

const meta = {
  title: 'Atoms/TabsGroup',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const VIEWS = [
  { key: 'overview', label: 'Overview' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'rules', label: 'Rules' },
  { key: 'archived', label: 'Archived', disabled: true },
] as const;
type View = (typeof VIEWS)[number]['key'];

export const InMemory: Story = {
  name: 'inmemory (value + onChange)',
  render: () => {
    const [value, setValue] = useState<View>('overview');
    return (
      <div className="flex w-full max-w-xl flex-col gap-3">
        <TabsGroup label="Wallet views" items={VIEWS} value={value} onChange={setValue} />
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  name: 'sizes (xs / sm / md)',
  render: () => {
    const [value, setValue] = useState<View>('transactions');
    return (
      <div className="flex w-full max-w-xl flex-col gap-6">
        {(['xs', 'sm', 'md'] as ComponentSize[]).map((size) => (
          <TabsGroup key={size} size={size} label={`Size ${size}`} items={VIEWS} value={value} onChange={setValue} />
        ))}
      </div>
    );
  },
};

export const Marked: Story = {
  name: 'marks (is-set dot per tab)',
  render: () => {
    const [value, setValue] = useState<View>('overview');
    return (
      <div className="w-full max-w-xl">
        <TabsGroup
          label="Filter sections"
          items={VIEWS}
          value={value}
          onChange={setValue}
          marks={{ overview: true, transactions: false, rules: true }}
        />
      </div>
    );
  },
};

export const Url: Story = {
  name: 'url (route tabs, NavTabs preset)',
  render: () => (
    <MemoryRouter initialEntries={['/wallet/1/transactions']}>
      <div className="w-full max-w-xl">
        <TabsGroup
          navType="url"
          label="Wallet sections"
          items={[
            { to: '/wallet/1', label: 'Overview', end: true },
            { to: '/wallet/1/transactions', label: 'Transactions' },
            { to: '/wallet/1/rules', label: 'Rules' },
          ]}
        />
        <Routes>
          <Route path="*" element={<p className="p-4 text-sm text-muted-foreground">Tab content</p>} />
        </Routes>
      </div>
    </MemoryRouter>
  ),
};

export const Hash: Story = {
  name: 'hash (#key links on one page)',
  render: () => (
    <MemoryRouter initialEntries={['/settings?x=1#billing']}>
      <div className="w-full max-w-xl">
        <TabsGroup
          navType="hash"
          label="Settings"
          items={[
            { key: 'general', label: 'General' },
            { key: 'billing', label: 'Billing' },
            { key: 'members', label: 'Members' },
          ]}
        />
      </div>
    </MemoryRouter>
  ),
};

export const Dark: Story = {
  name: 'dark',
  render: () => {
    const [value, setValue] = useState<View>('rules');
    return (
      <div className="dark w-full max-w-xl bg-background p-4 text-foreground">
        <TabsGroup label="Wallet views" items={VIEWS} value={value} onChange={setValue} marks={{ rules: true }} />
      </div>
    );
  },
};
