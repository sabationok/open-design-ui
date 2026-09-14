import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageTitle } from './PageTitle';
import { SectionLabel } from './SectionLabel';
import { MetaLabel } from './MetaLabel';
import { MetricCount } from './MetricCount';

const meta = {
  title: 'Atoms/Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageTitleStory: Story = {
  name: 'PageTitle',
  render: () => <PageTitle>Dashboard</PageTitle>,
};

export const SectionLabelStory: Story = {
  name: 'SectionLabel',
  render: () => <SectionLabel>Section heading</SectionLabel>,
};

export const MetaLabelStory: Story = {
  name: 'MetaLabel',
  render: () => <MetaLabel>meta label</MetaLabel>,
};

export const MetricCountStory: Story = {
  name: 'MetricCount',
  render: () => <MetricCount>1 893</MetricCount>,
};
