import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from '../../molecules/PageHeader';
import { Section } from '../../molecules/SectionCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const meta = {
  title: 'Molecules/Page',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <div key={i} className="px-4 py-3 text-sm text-foreground">Transaction {i + 1}</div>
  ));

export const Basic: Story = {
  name: 'Page + Section',
  render: () => (
    <Page
      eyebrow="Wallets"
      title="Main card"
      description="UAH · updated 2 min ago"
      actions={<Button variant="outline">Edit</Button>}
    >
      <Section title="Recent" description="Last 7 days" actions={<Button variant="ghost" size="sm">All</Button>} framed>
        {rows(4)}
      </Section>
      <Section title="Unframed section">
        <p className="text-sm text-muted-foreground">Any content.</p>
      </Section>
    </Page>
  ),
};

export const Sticky: Story = {
  name: 'Page (sticky header + toolbar)',
  render: () => (
    <div className="h-[32rem] overflow-auto">
      <Page title="Transactions" sticky width="lg" toolbar={<Input placeholder="Search" aria-label="Search" />}>
        <Section framed>{rows(30)}</Section>
      </Page>
    </div>
  ),
};
