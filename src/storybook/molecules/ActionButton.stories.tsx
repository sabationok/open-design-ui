import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton } from '../../molecules/ActionButton';

const meta = { title: 'Molecules/ActionButton' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { key: 'draft', label: 'Save as draft', hint: 'Not counted in balances', onSelect: () => {} },
  { key: 'new', label: 'Save and add another', onSelect: () => {} },
  { key: 'tpl', label: 'Save as template', disabled: true, onSelect: () => {} },
];

export const Variants: Story = {
  name: 'Tones and sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <ActionButton label="Save" onClick={() => {}} items={items} tone="primary" />
      <ActionButton label="Export" onClick={() => {}} items={items} />
      <ActionButton label="Paste" onClick={() => {}} items={items} size="xs" />
      <ActionButton label="Plain" onClick={() => {}} items={[]} />
      <ActionButton label="Disabled" onClick={() => {}} items={items} disabled />
    </div>
  ),
};
