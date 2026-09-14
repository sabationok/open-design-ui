import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetaField } from './MetaField';
import { MetaList } from './MetaList';
import { KeyValueRow } from './KeyValueRow';
import { MonoId, MonoValue } from '../atoms';
import { Badge } from '../atoms/Badge';

const meta = {
  title: 'Molecules/MetaFields',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetaFieldList: Story = {
  name: 'MetaField / MetaList',
  render: () => (
    <MetaList>
      <MetaField label="Event ID">
        <MonoId>evt_44novaP7z</MonoId>
      </MetaField>
      <MetaField label="Status">
        <Badge variant="tone" size="sm" tone="destructive">
          FAILED
        </Badge>
      </MetaField>
      <MetaField label="Destination">
        <MonoValue>railway-prod</MonoValue>
      </MetaField>
    </MetaList>
  ),
};

export const KeyValueRows: Story = {
  name: 'KeyValueRow',
  render: () => (
    <div className="flex w-72 flex-col gap-1">
      <KeyValueRow label="content-type" value="application/json" />
      <KeyValueRow label="x-request-id" value="123e4567-e89b-12d3" />
      <KeyValueRow label="user-agent" value="NovaPost-Webhook/1.0" />
    </div>
  ),
};
