import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackLink } from './BackLink';
import { BackButton } from './BackButton';

const meta = {
  title: 'Molecules/BackLink',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'BackLink',
  render: () => <BackLink onClick={() => {}}>← Back to Events</BackLink>,
};

export const Legacy: Story = {
  name: 'BackButton (legacy)',
  render: () => <BackButton onClick={() => {}}>← Back</BackButton>,
};
