import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShadcnDataTable } from '../../data-table/ShadcnDataTable';
import { IdColumn } from '../../data-table/molecules/IdColumn';
import { MonoColumn } from '../../data-table/molecules/MonoColumn';
import { LinkColumn } from '../../data-table/molecules/LinkColumn';
import { DateColumn } from '../../data-table/molecules/DateColumn';
import type { DataTableColumn } from '../../data-table/DataTable';
import { Badge, type BadgeConfig } from '../../atoms/Badge';

// Illustrative row shape — real apps supply their own domain type (see e.g.
// dashboard-app's WebhookEventType) and their own status/provider Badge configs
// via the StatusColumn/ProviderColumn HOCs excluded from this package (Task 6).
interface MockRow {
  id: string;
  status: string;
  provider: string;
  destinationId: string;
  createdAt: string;
}

const STATUS_CONFIG: BadgeConfig = {
  delivered: { tone: 'success' },
  failed: { tone: 'destructive' },
  retrying: { tone: 'warning' },
  pending: { tone: 'default' },
};

const MOCK_ROWS: MockRow[] = [
  { id: 'evt_4aBc1234novaP7z', status: 'delivered', provider: 'stripe', destinationId: 'dest_abc1', createdAt: '2026-07-20T14:20:11Z' },
  { id: 'evt_9xKp5YrwLmT3bCq', status: 'failed', provider: 'novapost', destinationId: 'dest_abc1', createdAt: '2026-07-20T13:11:44Z' },
  { id: 'evt_2mWvQ8zHjNdXsUo', status: 'retrying', provider: 'telegram', destinationId: 'dest_def2', createdAt: '2026-07-20T12:05:33Z' },
  { id: 'evt_7nRsE1fGhIoJkLm', status: 'pending', provider: 'stripe', destinationId: 'dest_def2', createdAt: '2026-07-20T11:59:02Z' },
];

const BASE_COLUMNS: DataTableColumn<MockRow>[] = [
  IdColumn({ label: 'Event ID' }),
  {
    key: 'status',
    header: 'Status',
    getValue: ({ row }) => row.data.status,
    render: ({ value }) => (
      <Badge variant="status" appearance="bordered" value={value as string} config={STATUS_CONFIG} />
    ),
  },
  MonoColumn({ key: 'provider', header: 'Provider', getValue: ({ row }) => row.data.provider }),
  LinkColumn({
    key: 'destinationId',
    header: 'Destination',
    getValue: ({ row }) => row.data.destinationId,
    href: (id) => `/destinations/${id}`,
  }),
  DateColumn<MockRow>({ key: 'createdAt', header: 'Created', getValue: ({ row }) => row.data.createdAt }),
];

function ColumnToggle({
  columns,
  visibleKeys,
  onToggle,
}: {
  columns: DataTableColumn<MockRow>[];
  visibleKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-zinc-400">columns</span>
      {columns.map((col) => (
        <button
          key={col.key}
          type="button"
          onClick={() => onToggle(col.key)}
          className={
            visibleKeys.has(col.key)
              ? 'rounded bg-zinc-900 px-2 py-0.5 text-[11px] text-white transition-colors'
              : 'rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-400 line-through transition-colors'
          }
        >
          {col.key}
        </button>
      ))}
    </div>
  );
}

const meta = {
  title: 'DataTable/ShadcnDataTable',
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EventsTable: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState(() => new Set(BASE_COLUMNS.map((c) => c.key)));

    const toggle = (key: string) =>
      setVisibleKeys((prev) => {
        const n = new Set(prev);
        n.has(key) ? n.delete(key) : n.add(key);
        return n;
      });

    const columns = BASE_COLUMNS.map((c) => ({ ...c, visible: visibleKeys.has(c.key) }));

    return (
      <>
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2.5">
          <label className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} />
            loading
          </label>
          <ColumnToggle columns={BASE_COLUMNS} visibleKeys={visibleKeys} onToggle={toggle} />
        </div>
        <ShadcnDataTable columns={columns} rows={MOCK_ROWS} loading={loading} emptyTitle="No events" />
      </>
    );
  },
};

// 5000 generated ledger rows: sorting, Excel filters, resizable widths (remembered) and virtual rows.
interface LedgerRow {
  id: string;
  date: string;
  kind: string;
  amount: number;
  currency: string;
  account: string;
  note: string;
}

const KINDS = ['expense', 'income', 'transfer'];
const CURRENCIES = ['UAH', 'PLN', 'EUR', 'USD'];
const ACCOUNTS = ['Cash', 'Main card', 'Savings', 'Business', 'Credit card'];
const NOTES = ['Groceries', 'Salary', 'Rent', 'Taxi', 'Coffee', 'Pharmacy', ''];

const LEDGER_ROWS: LedgerRow[] = Array.from({ length: 5000 }, (_, i) => ({
  id: `tx_${i + 1}`,
  date: new Date(Date.UTC(2026, 0, 1) + i * 3_600_000 * 2).toISOString(),
  kind: KINDS[(i * 7) % KINDS.length],
  amount: Math.round(((i * 7919) % 100_000) / 10) / 10,
  currency: CURRENCIES[(i * 3) % CURRENCIES.length],
  account: ACCOUNTS[(i * 3) % ACCOUNTS.length],
  note: NOTES[(i * 11) % NOTES.length],
}));

const LEDGER_COLUMNS: DataTableColumn<LedgerRow>[] = [
  { key: 'id', header: 'ID', size: 90, ancestor: 'id', filter: false, render: ({ value }) => value as string },
  DateColumn<LedgerRow>({ key: 'date', header: 'Date', size: 170, ancestor: 'date', filter: 'range' }),
  { key: 'kind', header: 'Kind', size: 110, ancestor: 'kind', render: ({ value }) => value as string },
  {
    key: 'amount',
    header: 'Amount',
    size: 110,
    align: 'right',
    filter: 'range',
    ancestor: 'amount',
    render: ({ value }) => (value as number).toFixed(2),
  },
  { key: 'currency', header: 'Cur', size: 80, ancestor: 'currency', render: ({ value }) => value as string },
  { key: 'account', header: 'Account', size: 150, ancestor: 'account', filter: 'text', render: ({ value }) => value as string },
  { key: 'note', header: 'Note', size: 200, ancestor: 'note', filter: 'text', render: ({ value }) => value as string },
];

export const ExcelFeatures: Story = {
  name: 'sortable · filterable · resizable · virtual (5000 rows)',
  render: () => (
    <ShadcnDataTable
      columns={LEDGER_COLUMNS}
      rows={LEDGER_ROWS}
      sortable
      filterable
      storageKey="storybook:ledger"
      virtual
      height={480}
      rowClassName={(r) => (r.kind === 'transfer' ? 'text-ds-blue-900' : undefined)}
    />
  ),
};
