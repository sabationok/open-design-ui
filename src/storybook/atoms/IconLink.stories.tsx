import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import { IconLink } from '../../atoms/IconLink';

const meta = {
  title: 'Atoms/IconLink',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Bar = () => (
  <div className="flex items-center gap-1">
    <IconLink to="/search" label="Search" icon={Search} />
    <IconLink to="/notifications" label="Notifications" icon={Bell} />
    <IconLink to="/settings" label="Settings" icon={Settings} />
  </div>
);

export const TopBar: Story = {
  name: 'top bar (settings route open)',
  render: () => (
    <MemoryRouter initialEntries={['/settings']}>
      <Bar />
    </MemoryRouter>
  ),
};

export const Sizes: Story = {
  name: 'sizes (xs / sm / md)',
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <div className="flex items-center gap-2">
        <IconLink size="xs" to="/a" label="Settings" icon={Settings} />
        <IconLink size="sm" to="/b" label="Settings" icon={Settings} />
        <IconLink size="md" to="/c" label="Settings" icon={Settings} />
      </div>
    </MemoryRouter>
  ),
};

export const Dark: Story = {
  name: 'dark',
  render: () => (
    <MemoryRouter initialEntries={['/settings']}>
      <div className="dark bg-background p-4">
        <Bar />
      </div>
    </MemoryRouter>
  ),
};
