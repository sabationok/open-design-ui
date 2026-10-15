import { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarList, type BarListNode } from '../../molecules/BarList';

const meta = {
  title: 'Molecules/BarList',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Shape of an app store: entities + a stats map keyed by id. Metrics are free-form jsonb per period plus live.
type Category = { id: string; parentId: string | null; name: string };
type Metrics = { expense?: number; income?: number; count?: number };
type Stats = { periods: Record<'7d' | '30d', Metrics>; live: Metrics };

const CATEGORIES: Category[] = [
  { id: 'food', parentId: null, name: 'Їжа' },
  { id: 'groceries', parentId: 'food', name: 'Продукти' },
  { id: 'cafe', parentId: 'food', name: 'Кафе' },
  { id: 'coffee', parentId: 'cafe', name: 'Кава' },
  { id: 'home', parentId: null, name: 'Дім' },
  { id: 'rent', parentId: 'home', name: 'Оренда' },
  { id: 'utilities', parentId: 'home', name: 'Комуналка' },
  { id: 'transport', parentId: null, name: 'Транспорт' },
  { id: 'taxi', parentId: 'transport', name: 'Таксі' },
  { id: 'fuel', parentId: 'transport', name: 'Пальне' },
  { id: 'fun', parentId: null, name: 'Розваги' },
  { id: 'health', parentId: null, name: 'Здоровʼя' },
  { id: 'gifts', parentId: null, name: 'Подарунки' },
  { id: 'empty', parentId: null, name: 'Без витрат' },
];

const s = (e7: number, e30: number): Stats => ({ periods: { '7d': { expense: e7 }, '30d': { expense: e30 } }, live: {} });
const STATS = new Map<string, Stats>([
  ['groceries', s(320_000, 1_420_000)],
  ['cafe', s(40_000, 210_000)],
  ['coffee', s(18_000, 96_000)],
  ['rent', s(0, 1_800_000)],
  ['utilities', s(0, 340_000)],
  ['taxi', s(52_000, 230_000)],
  ['fuel', s(90_000, 410_000)],
  ['fun', s(60_000, 150_000)],
  ['health', s(0, 120_000)],
  ['gifts', s(25_000, 80_000)],
]);
// Snapshots arrive aggregated up the tree (the backend bubbles every delta to all ancestors) — mimic that here.
for (const c of [...CATEGORIES].reverse()) {
  const own = STATS.get(c.id);
  if (!own || !c.parentId) continue;
  const parent = STATS.get(c.parentId) ?? s(0, 0);
  for (const p of ['7d', '30d'] as const) {
    parent.periods[p].expense = (parent.periods[p].expense ?? 0) + (own.periods[p].expense ?? 0);
  }
  STATS.set(c.parentId, parent);
}
const stats = { get: (id: string) => STATS.get(id) };

const uah = (minor: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(minor / 100);

export const CategoryTree: Story = {
  name: 'Tree (categories × stats.get)',
  render: () => {
    const [period, setPeriod] = useState<'7d' | '30d'>('30d');
    const [picked, setPicked] = useState<string>();
    const nodes = useMemo<BarListNode<Category>[]>(
      () => CATEGORIES.map((c) => ({ id: c.id, parentId: c.parentId, label: c.name, data: c })),
      [],
    );
    // Stable callback: BarList memoises the tree on it.
    const getValue = useCallback((n: BarListNode<Category>) => stats.get(n.id)?.periods[period]?.expense, [period]);
    return (
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          {(['7d', '30d'] as const).map((p) => (
            <button key={p} type="button" onClick={() => setPeriod(p)} className={p === period ? 'font-semibold text-foreground' : ''}>
              {p}
            </button>
          ))}
          {picked && <span className="ml-auto">selected: {picked}</span>}
        </div>
        <BarList nodes={nodes} getValue={getValue} format={uah} limit={4} defaultExpandedDepth={1} onSelect={(n) => setPicked(n.id)} />
      </div>
    );
  },
};

export const Flat: Story = {
  name: 'Flat (no parents)',
  render: () => (
    <div className="w-full max-w-md">
      <BarList
        nodes={[
          { id: 'stripe', label: 'stripe' },
          { id: 'novapost', label: 'novapost' },
          { id: 'telegram', label: 'telegram' },
        ]}
        getValue={(n) => ({ stripe: 1893, novapost: 414, telegram: 108 })[n.id]}
      />
    </div>
  ),
};
