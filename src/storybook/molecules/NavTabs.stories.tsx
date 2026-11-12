import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home, Wallet, Lock } from 'lucide-react';
import { NavTabs } from '../../molecules/TabBar';
import { SidebarNavLink } from '../../molecules/SidebarNavLink';

const meta = {
  title: 'Molecules/NavTabs',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RouteTabs: Story = {
  name: 'NavTabs (route-driven)',
  render: () => (
    <MemoryRouter initialEntries={['/wallet/1/transactions']}>
      <div className="w-full max-w-xl">
        <NavTabs
          label="Wallet sections"
          items={[
            { to: '/wallet/1', label: 'Overview', end: true },
            { to: '/wallet/1/transactions', label: 'Transactions' },
            { to: '/wallet/1/rules', label: 'Rules' },
            { to: '/wallet/1/settings', label: 'Settings' },
          ]}
        />
        <Routes>
          <Route path="*" element={<p className="p-4 text-sm text-muted-foreground">Tab content</p>} />
        </Routes>
      </div>
    </MemoryRouter>
  ),
};

export const SidebarLinks: Story = {
  name: 'SidebarNavLink / NavItem (icon optional, disabled)',
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <nav aria-label="Main" className="flex w-60 flex-col gap-0.5">
        <SidebarNavLink to="/" end icon={Home}>Overview</SidebarNavLink>
        <SidebarNavLink to="/wallets" icon={Wallet}>
          Wallets <span className="ml-auto text-xs tabular-nums text-ds-gray-700">3</span>
        </SidebarNavLink>
        <SidebarNavLink to="/no-icon">No icon</SidebarNavLink>
        <SidebarNavLink to="/locked" icon={Lock} disabled>Disabled</SidebarNavLink>
      </nav>
    </MemoryRouter>
  ),
};
