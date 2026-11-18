import type { Meta, StoryObj } from '@storybook/react-vite';
import { Insight } from '../../molecules/Insight';

const meta = { title: 'Molecules/Insight' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const long =
  'Spending on groceries rose by 18% compared with the previous month. Most of the increase comes from three large purchases in the second week, all at the same store. ' +
  'Excluding them, the month is within 2% of your six-month average. Recurring subscriptions stayed flat, and transport fell slightly after the fare change.';

export const Default: Story = {
  name: 'In place and in a modal',
  render: () => (
    <div className="flex w-96 flex-col gap-3 p-4">
      <Insight title="Why is this higher than usual?">Three large purchases in the second week account for most of it.</Insight>
      <Insight title="Monthly summary">{long}</Insight>
    </div>
  ),
};
