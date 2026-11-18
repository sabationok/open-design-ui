import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from '../../atoms/SectionHeading';
import { Badge } from '../../atoms/Badge';
import { Section } from '../../molecules/SectionCard';

const meta = {
  title: 'Atoms/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
  args: { children: 'Matching' },
  render: (args) => (
    <div className="pt-16">
      <SectionHeading {...args} />
    </div>
  ),
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInfo: Story = {
  name: 'info (i)',
  args: { info: 'A transaction matches when every condition below is true.' },
};

export const WithAside: Story = {
  name: 'info + aside',
  args: {
    info: 'Rules run top to bottom; the first match wins.',
    aside: <Badge size="sm">3</Badge>,
  },
};

export const InSection: Story = {
  name: 'Section info prop',
  render: () => (
    <div className="w-96 pt-16">
      <Section title="Accounts" info="Balances are converted to your main currency." framed>
        <p className="px-4 py-3 text-sm text-muted-foreground">Section body</p>
      </Section>
    </div>
  ),
};

export const Dark: Story = {
  name: 'dark',
  render: () => (
    <div className="dark bg-background p-4 pt-16">
      <SectionHeading info="Explanation of the heading.">Matching</SectionHeading>
    </div>
  ),
};
