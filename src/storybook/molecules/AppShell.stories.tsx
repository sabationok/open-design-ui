import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Home, Settings, Wallet } from 'lucide-react';
import { AppShell } from '../../molecules/AppShell';
import { SidebarNavLink } from '../../molecules/SidebarNavLink';
import { Page } from '../../molecules/PageHeader';
import { Section } from '../../molecules/SectionCard';

const meta = {
  title: 'Molecules/AppShell',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Sidebar = () => (
  <nav aria-label="Main" className="flex flex-col gap-0.5 p-3">
    <div className="mb-3 px-2.5 text-sm font-semibold text-foreground">Fintrack</div>
    <SidebarNavLink to="/" end icon={Home}>Overview</SidebarNavLink>
    <SidebarNavLink to="/wallets" icon={Wallet}>Wallets</SidebarNavLink>
    <SidebarNavLink to="/settings" icon={Settings}>Settings</SidebarNavLink>
  </nav>
);

export const Default: Story = {
  name: 'AppShell (resize below md for the drawer)',
  render: () => (
    <MemoryRouter>
      <AppShell sidebar={<Sidebar />} brand="Fintrack">
        <Page title="Overview" description="Last 30 days">
          <Section title="Accounts" framed>
            <div className="px-4 py-3 text-sm text-foreground">Main card</div>
            <div className="px-4 py-3 text-sm text-foreground">Savings</div>
          </Section>
        </Page>
      </AppShell>
    </MemoryRouter>
  ),
};
