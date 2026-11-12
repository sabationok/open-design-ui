import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Palette } from 'lucide-react';
import { SettingsGroup, SettingsRow } from '../../molecules/SettingsGroup';
import { Switch } from '../../components/ui/switch';

const meta = {
  title: 'Molecules/SettingsGroup',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'SettingsGroup + SettingsRow',
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <SettingsGroup icon={Palette} title="Appearance" summary="System">
        <SettingsRow label="Compact rows" htmlFor="compact" control={<Switch id="compact" />} />
        <SettingsRow label="Show cents" description="Display minor units in amounts" htmlFor="cents" control={<Switch id="cents" defaultChecked />} />
      </SettingsGroup>
      <SettingsGroup icon={Bell} title="Notifications" summary="Email, push" defaultOpen>
        <SettingsRow label="Weekly digest" description="A summary every Monday" stack control={<Switch aria-label="Weekly digest" />} />
      </SettingsGroup>
    </div>
  ),
};
