import type { Meta, StoryObj } from '@storybook/react-vite';
import { MonoId } from './MonoId';
import { MonoValue } from './MonoValue';
import { MonoChip } from './MonoChip';
import { BreadcrumbSep } from './BreadcrumbSep';

type Args = { value: string };

const meta: Meta<Args> = {
  title: 'Atoms/MonoAtoms',
  args: {
    value: 'evt_44novaP7z',
  },
  argTypes: {
    value: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const MonoIdStory: Story = {
  name: 'MonoId',
  render: ({ value }) => <MonoId>{value}</MonoId>,
};

export const MonoValueStory: Story = {
  name: 'MonoValue',
  render: ({ value }) => <MonoValue>{value}</MonoValue>,
};

export const MonoChipStatic: Story = {
  name: 'MonoChip (static)',
  render: ({ value }) => <MonoChip>{value}</MonoChip>,
};

export const MonoChipClickable: Story = {
  name: 'MonoChip (clickable)',
  render: () => <MonoChip onClick={() => {}}>click me</MonoChip>,
};

export const BreadcrumbSepStory: Story = {
  name: 'BreadcrumbSep',
  render: () => <BreadcrumbSep />,
};
