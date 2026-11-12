import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackLink } from '../../molecules/BackLink';
import { BackButton } from '../../molecules/BackButton';

const meta = {
  title: 'Molecules/BackLink',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'BackLink',
  render: () => <BackLink onClick={() => {}}>← Back to Events</BackLink>,
};

export const WithLabel: Story = {
  name: 'BackLink label (arrow icon)',
  render: () => <BackLink label="Events" onClick={() => {}} />,
};

export const Dark: Story = {
  name: 'dark',
  render: () => (
    <div className="dark bg-background p-4">
      <BackLink label="Events" onClick={() => {}} />
    </div>
  ),
};

export const Legacy: Story = {
  name: 'BackButton (legacy)',
  render: () => <BackButton onClick={() => {}}>← Back</BackButton>,
};
