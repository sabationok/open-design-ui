import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingMessage } from './LoadingMessage';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Atoms/Feedback',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => (
    <div className="flex h-48 w-full items-stretch border border-zinc-200">
      <LoadingMessage msg="Loading events…" />
    </div>
  ),
};

export const ErrorWithMessage: Story = {
  name: 'Error (msg)',
  render: () => (
    <div className="flex h-48 w-full items-stretch border border-zinc-200">
      <ErrorMessage msg="Failed to load events." />
    </div>
  ),
};

export const ErrorWithCode: Story = {
  name: 'Error (code + msg)',
  render: () => (
    <div className="flex h-48 w-full items-stretch border border-zinc-200">
      <ErrorMessage code={404} msg="Event not found." />
    </div>
  ),
};
