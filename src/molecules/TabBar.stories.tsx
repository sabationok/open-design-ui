import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';
import { TabButton } from './TabButton';
import { TabButtons } from './TabButtons';

const DEMO_TABS = ['Inbound', 'Outbound', 'Analytics'] as const;
type DemoTab = (typeof DEMO_TABS)[number];

const meta = {
  title: 'Molecules/TabBar',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  name: 'TabBar + TabButton (underline, desktop)',
  render: () => {
    const [active, setActive] = useState<DemoTab>('Inbound');
    return (
      <TabBar>
        {DEMO_TABS.map((tab) => (
          <TabButton key={tab} active={active === tab} onClick={() => setActive(tab)}>
            {tab}
          </TabButton>
        ))}
      </TabBar>
    );
  },
};

export const Segmented: Story = {
  name: 'TabButtons (segmented / iPhone-style)',
  render: () => {
    const [seg, setSeg] = useState<DemoTab>('Inbound');
    return (
      <TabButtons
        tabs={DEMO_TABS.map((key) => ({ key, label: key }))}
        value={seg}
        onChange={setSeg}
      />
    );
  },
};
