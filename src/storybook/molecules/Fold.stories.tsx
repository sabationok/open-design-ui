import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fold, FoldList } from '../../molecules/Fold';

const meta = { title: 'Molecules/Fold' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Body = ({ lines }: { lines: string[] }) => (
  <>
    {lines.map((l) => (
      <p key={l} className="text-xs text-muted-foreground">
        {l}
      </p>
    ))}
  </>
);

const Folds = () => (
  <FoldList className="max-w-sm">
    <Fold title="Columns" meta="Date, Amount, Payee">
      <Body lines={['Date: column A', 'Amount: column D', 'Payee: column C']} />
    </Fold>
    <Fold title="Skipped rows" meta="3 rows">
      <Body lines={['Row 12: no amount', 'Row 40: no date', 'Row 41: duplicate']} />
    </Fold>
    <Fold title="Currency" meta="USD" defaultOpen>
      <Body lines={['Every row is booked in USD.']} />
    </Fold>
  </FoldList>
);

export const Default: Story = { render: () => <Folds /> };

export const Single: Story = {
  render: () => (
    <Fold title="Details" meta="2 fields">
      <Body lines={['Created 12 Nov', 'Updated 13 Nov']} />
    </Fold>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-background p-4">
      <Folds />
    </div>
  ),
};
