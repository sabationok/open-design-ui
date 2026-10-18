# @open_design/ui

## 0.2.1

### Patch Changes

- 8d5691d: Drop the `lodash` runtime dependency: `TableColumn`'s `ancestor` path lookup now uses a local dot/bracket `getIn` (same semantics for `a.b` / `items[0].email`). Removes ~530 KB of non-tree-shakeable CommonJS from consumers' data-table chunk.

## 0.2.0

### Minor Changes

- 796893f: Add new indicator and navigation components: `AnchorDot` and `IndicatorBox` (atoms), `ProgressLine` and `AnchorNav` (molecules). Reorganize Storybook stories under `src/storybook/` and add a `newBadge` decorator that flags recently added components.
- 1f6e06f: Align the library with Vercel Geist.
  
  - `theme.css` now ships Geist primitives (`--ds-background-*`, `--ds-gray-*`, `--ds-gray-alpha-*`, blue/red/amber/green scales, shadows) for light and dark, and derives the shadcn and `--vui-*` tokens from them.
  - `theme.css` now includes the `@theme inline` mappings (`bg-background`, `border-border`, `bg-ds-gray-100`, `shadow-ds-small`…), so apps no longer need to redeclare them.
  - Components no longer hardcode `zinc-*`/hex colors. Everything reads tokens, so app-level overrides and dark mode apply everywhere.
  - Button/Input follow the Geist size scale (sm 24px, default 32px, lg 40px) and Geist focus rings. Cards and dialogs use a 12px radius and Geist shadows.
  - `SidebarNavLink` active state is neutral gray instead of the webhooxy indigo, and the chart accent is Geist blue.
  
  New components (moved from fintrack):
  
  - `MetricGrid` / `Metric` take a data-driven list of metrics: `format`, `prev` → delta coloured by `good` direction (`up | down | none`), `series` → sparkline, and a loading state.
  - `Sparkline` atom.
  - `BarList` builds a ranked bar list or a collapsible tree from flat `{ id, parentId }` nodes. Values come from `getValue(node)`, so the app decides the period, live data and the jsonb key. Expects values already aggregated up the tree (`rollup` is off by default; turn it on for own-only values). Supports `hideEmpty`, a per-level `limit` and `onSelect`.
  
  Deprecated: `StatsGrid` → use `MetricGrid`. `StatCard` stays: it is a different component.
  
  Forms:
  
  - `Select` is a native select in the style of `Input`, sizes `sm`/`default`/`lg`. `FilterSelect` is deprecated and now wraps it.
  - `Checkbox` is native, Geist style, with `indeterminate` and `label`.
  - `FormField` gains `hint`, `error` and `required`. It wires `id`, `aria-describedby` and `aria-invalid` into its control.
  - `Input`, `Textarea` and `Select` get a red border on `aria-invalid`.
  - `TabButtons` becomes a segmented `radiogroup` with `size` and `label`.
  
  **Apps must keep `* { border-color }` and `body { font-family }` inside `@layer base`** (see README → Setup).
  Otherwise every library border colour and the Geist font are overridden.
  
  Card, Dialog, AlertDialog, TableRow and the outline Badge now set `border-border` themselves. Before, they relied on the
  app's base `* { border-color }`; without it, Tailwind v4 draws a bare `border` in `currentColor`. FilterChip's
  `directory` variant uses the accent tokens instead of `cyan-*`.

## 0.1.1

### Patch Changes

- 398493b: Verify automated npm publish via CI after resolving the first-publish token limitation.

## 0.1.0

### Minor Changes

- c931d45: Initial public release of @open_design/ui — shared React UI component library (atoms, molecules, DataTable system) extracted from the webhooks-proxy dashboard-app.
