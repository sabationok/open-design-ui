# @open_design/ui

Shared React UI component library — atoms, molecules, and a DataTable system, extracted from the webhooks-proxy dashboard.

> This package is under active migration. Source is being ported over incrementally; expect gaps until the extraction is complete.

## Setup

Tailwind v4 app. In the CSS entry:

```css
@import 'tailwindcss';
@import '@open_design/ui/styles/theme.css'; /* Geist tokens + @theme mappings */
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';
@source '../node_modules/@open_design/ui/dist';

@custom-variant dark (&:is(.dark *));

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans; }
}
```

Keep app-wide defaults (`* { border-color }`, `body { font-family }`) **inside `@layer base`**. An unlayered rule beats
every `@layer utilities` class, so a bare `* { border-color: … }` silently cancels `border-ds-red-700`, `border-vui-*`
and every other border color in the library, and a bare `body { font-family }` replaces Geist.

Re-theme by overriding the semantic tokens (`--background`, `--border`, `--ring`, `--vui-*`) after the import. The
`--ds-*` scales are Geist primitives.

## DataTable

`ShadcnDataTable` (from `@open_design/ui/data-table`) renders `DataTableColumn`s — `key`, `header`, `getValue`,
`render`, or the factories (`IdColumn`, `DateColumn`, `MonoColumn`, `LinkColumn`, `TableColumn`) — on TanStack Table v8.
Everything below is opt-in; without these props the table renders as before.

| Prop | Effect |
| --- | --- |
| `sortable` | Header click sorts (asc → desc → off) every column with a value; `column.sortable` overrides. |
| `filterable` | Excel-style funnel on every column with a value; a row-count bar («Showing X of Y», «Reset filters») above. |
| `resizable` / `storageKey` | Drag a header edge to resize, double-click for the default. `storageKey` remembers widths in `localStorage['<storageKey>:sizing']` (written when the drag ends; storage errors are ignored) and turns resizing on. |
| `virtual`, `rowHeight` (40), `height` (70vh) | Renders only the rows in view: fixed-height rows inside a scrolling body, so 5000+ rows stay smooth. |
| `rowClassName(row)`, `toolbar`, `labels` | Per-row classes; content next to the row count; UI texts (English by default). |

Column options: `filter` — `'values'` (distinct values with counts, «Select all», search), `'text'` (+ «contains»),
`'range'` (+ from/to: number inputs for numbers, date inputs for ISO strings), `false` (off); `size` — default width in px
when resizable; `align: 'right'` — right-aligned mono digits. A column sorts and filters on its `getValue` (or `ancestor`)
value, so return something plain (a number, an ISO date, a joined path) and format it in `render`.

```tsx
<ShadcnDataTable
  rows={rows}
  sortable
  filterable
  storageKey="app:table:ledger"
  virtual
  columns={[
    DateColumn({ key: 'date', header: 'Date', ancestor: 'date', size: 170, filter: 'range' }),
    { key: 'amount', header: 'Amount', ancestor: 'amount', align: 'right', filter: 'range', render: ({ value }) => fmt(value) },
    { key: 'account', header: 'Account', ancestor: 'account', filter: 'text', render: ({ value }) => value as string },
  ]}
/>
```

Why virtualization, not memoization alone: sorting or filtering re-renders every row anyway. With a fixed row height
the visible slice is arithmetic (`scrollTop / rowHeight` ± overscan) — no measuring, no dependency. The trade-off is
one-line cells (clipped, full value in `title`). The filter popover lists at most 200 values and asks to narrow by search.
