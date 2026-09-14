import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { BreadcrumbNav } from './BreadcrumbNav';
import { PageTitle } from '../atoms';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Molecules/PageHeader',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flat: Story = {
  name: 'PageHeader (flat)',
  render: () => (
    <PageHeader className="w-full border border-zinc-200">
      <PageTitle>Webhooks</PageTitle>
    </PageHeader>
  ),
};

export const WithBreadcrumbNav: Story = {
  name: 'PageHeader with BreadcrumbNav',
  render: () => (
    <PageHeader className="w-full border border-zinc-200">
      <BreadcrumbNav
        backLabel="Events"
        onBack={() => {}}
        id="evt_44novaP7z"
        actions={<Button variant="outline">Copy JSON</Button>}
      />
    </PageHeader>
  ),
};
