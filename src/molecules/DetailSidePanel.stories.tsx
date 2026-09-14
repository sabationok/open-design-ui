import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailSidePanel } from './DetailSidePanel';
import { MetaList } from './MetaList';
import { MetaField } from './MetaField';
import { MonoValue } from '../atoms';
import { Badge } from '../atoms/Badge';

const meta = {
  title: 'Molecules/DetailSidePanel',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'DetailSidePanel (320px)',
  render: () => (
    <div className="w-80 border border-zinc-200">
      <DetailSidePanel>
        <MetaList>
          <MetaField label="Method">
            <MonoValue>POST</MonoValue>
          </MetaField>
          <MetaField label="IP">
            <MonoValue>185.34.22.9</MonoValue>
          </MetaField>
          <MetaField label="Status">
            <Badge variant="tone" size="sm" tone="success">
              PROCESSED
            </Badge>
          </MetaField>
        </MetaList>
      </DetailSidePanel>
    </div>
  ),
};
