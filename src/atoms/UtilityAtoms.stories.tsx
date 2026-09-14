import type { Meta, StoryObj } from '@storybook/react-vite';
import { UrlBox } from './UrlBox';

const meta = {
  title: 'Atoms/UrlBox',
  component: UrlBox,
  tags: ['autodocs'],
  args: {
    children: 'https://api.railway.app/hooks/inbound/wh_3a71novaP7z',
  },
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof UrlBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <UrlBox className="w-full max-w-lg">{args.children}</UrlBox>,
};
