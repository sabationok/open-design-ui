---
'@open_design/ui': minor
---

`ShadcnDataTable` gets opt-in TanStack features: `sortable` (header click), `filterable` (Excel-style funnel per column: distinct values with counts, select all, search; `column.filter: 'text'` adds «contains», `'range'` adds from/to), `resizable` / `storageKey` (drag a header edge, double-click to reset, widths remembered in localStorage), and `virtual` (fixed-height rows, only the visible slice rendered — 5000+ rows). Also `rowClassName`, `toolbar` with a «Showing X of Y» count, overridable `labels`; columns get `size`, `align`, `sortable`, `filter`. A plain `ancestor` column now has a value to sort and filter on. Without the new props the table renders as before.
