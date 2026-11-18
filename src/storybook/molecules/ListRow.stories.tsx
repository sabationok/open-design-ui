import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { CreditCard, PiggyBank, Pencil, Trash2 } from 'lucide-react';
import { ListRow } from '../../molecules/ListRow';
import { Frame } from '../../molecules/SectionCard';
import { Button } from '../../components/ui/button';

const meta = {
  title: 'Molecules/ListRow',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InFrame: Story = {
  name: 'ListRow (link, button, static, actions)',
  render: () => (
    <MemoryRouter>
      <div className="w-full max-w-xl">
        <Frame>
          <ListRow icon={CreditCard} title="Main card" subtitle="UAH · Monobank" trailing={<span className="text-sm tabular-nums">12 450 ₴</span>} to="/wallets/1" />
          <ListRow icon={PiggyBank} title="Savings" subtitle="USD" trailing={<span className="text-sm tabular-nums">$1 200</span>} onClick={() => {}} />
          <ListRow
            icon={CreditCard}
            title="Static row with actions"
            subtitle="Not clickable as a whole"
            actions={
              <>
                <Button size="icon" variant="ghost" aria-label="Edit"><Pencil /></Button>
                <Button size="icon" variant="ghost" aria-label="Delete"><Trash2 /></Button>
              </>
            }
          />
        </Frame>
      </div>
    </MemoryRouter>
  ),
};
