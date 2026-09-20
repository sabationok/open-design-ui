import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnchorNav, type AnchorNavItem } from '../../molecules/AnchorNav';
import { newBadgeDecorator } from '../lib/newBadge';

const meta = {
  title: 'Molecules/AnchorNav',
  tags: ['autodocs'],
  decorators: [newBadgeDecorator('Molecules/AnchorNav')],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: AnchorNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'systemic', label: 'Systemic causes' },
  { id: 'security', label: 'Security-critical' },
  { id: 'plan', label: 'Execution plan' },
];

export const Static: Story = {
  render: () => <AnchorNav items={ITEMS} activeId="systemic" />,
};

export const Interactive: Story = {
  name: 'Interactive (click to select)',
  render: () => {
    const [activeId, setActiveId] = useState('overview');
    return <AnchorNav items={ITEMS} activeId={activeId} onSelect={setActiveId} />;
  },
};

/** Drive `activeId` from your own scroll/IntersectionObserver logic to get real scrollspy behavior. */
export const NoActive: Story = {
  name: 'Nothing active yet',
  render: () => <AnchorNav items={ITEMS} />,
};
