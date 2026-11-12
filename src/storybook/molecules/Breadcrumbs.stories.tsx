import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../../molecules/BreadcrumbNav';

const meta = {
  title: 'Molecules/Breadcrumbs',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { label: 'Imports', to: '/imports' },
  { label: 'March statement', to: '/imports/42' },
  { label: 'Rules' },
];

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <Breadcrumbs items={ITEMS} />
    </MemoryRouter>
  ),
};

export const ChevronSeparator: Story = {
  name: 'custom separator',
  render: () => (
    <MemoryRouter>
      <Breadcrumbs items={ITEMS} separator={<ChevronRight />} />
    </MemoryRouter>
  ),
};

export const Dark: Story = {
  name: 'dark',
  render: () => (
    <MemoryRouter>
      <div className="dark bg-background p-4">
        <Breadcrumbs items={ITEMS} />
      </div>
    </MemoryRouter>
  ),
};
