# @open_design/ui

## 0.3.0

### Minor Changes

- 373a1c1: Second batch of components ported from fintrack (`@lib` markers). No breaking changes.
  
  **New peer dependencies:** `@radix-ui/react-dropdown-menu` and `@radix-ui/react-context-menu`.
  
  New:
  
  - **Atoms:**
    - `TabsGroup`: one tab row in `inmemory`, `url` or `hash` mode, with `marks`
    - `IconButton`, `IconLink`
    - `SectionHeading`, with an `info` tip
    - `ToggleChip`, `CodeChip`
    - `TransitionRows`, `IssueEdge`
  - **Menus:**
    - `DropdownMenu`: flyout or drill-down nesting
    - `CtxMenu`: with a preview
  - **Search:**
    - `SearchBox`: field and mode options menu, with `searchFields`/`searchPath` utils and `matchesSearch`
  - **Selection:**
    - `MultiSelect` + `useMultiSelect`
    - `RemovableChips`
    - `CheckRow` / `CheckGroup`
    - `SelectAllBar`
    - `TreePicker`: single or multiple, cascade, async levels, create
  - **Feedback and layout:**
    - `IssueList`
    - `StickyAlert`
    - `Countdown`
    - `StickyActionBar`
    - `Fold` / `FoldList`
    - `SlideSwap`
    - `NotesDialog`
    - `PagerButtons`
    - `Breadcrumbs`
  - **Size scale:** `ComponentSize` (`xs`/`sm`/`md` = 24/32/36px) with `CONTROL_HEIGHT` and `CONTROL_SQUARE`, exported from the root.
  
  Extended:
  
  - `Input`: new `suggestions` prop, rendered as a native datalist.
  - `SearchSelect`: new `align` and `keepOpen` props.
  - `Note`: new `compact` prop, and it passes through div attributes.
  - `Section`: new `info` prop.
  - `BackLink`: new `label` prop.
  - `NavTabs` is now the url preset of `TabsGroup`, with optional `size` and `marks`. Parent tabs need `end` for an exact match.
  - `BackButton` is deprecated in favour of `BackLink`.
  
  Fix: dark mode now works with `.dark` on any wrapper, not only on `<html>`. The semantic tokens (`--background`, `--border`, `--vui-*`, `--json-*`, …) and `--ds-shadow-border` moved into a `:root, .dark` block. Before, they were resolved once at `:root`, so a nested `.dark` changed the primitives while components kept the light values.
- 373a1c1: Components ported from fintrack (`@lib` markers) and webhooxy (`TODO(open_design/ui)`). No breaking changes: existing props render as before.
  
  New components:
  
  - **Atoms:**
    - `IconTile`
    - `PathLabel` / `PathFlow`: a hierarchy path with muted ancestors and a primary leaf
    - `InfoTip`
    - `TimelineIconDot`
  - **Feedback:**
    - `Note`: inline alert with `neutral | info | success | warning | danger` tones
    - `Toaster` + `toast`: `success`, `error`, `info`, `promise` and `dismiss`, with no store dependency
  - **Layout:**
    - `AppShell`: sidebar plus a mobile drawer
    - `ListRow`
    - `SettingsGroup` / `SettingsRow`
    - `LoadMore`: infinite scroll that works with a react-query infinite query without depending on it
    - `Page`
    - `Section` / `Frame`
    - `NavTabs`
    - `NavItem`, an alias of `SidebarNavLink`
  - **Overlays and pickers:**
    - `Modal`: a preset on the Dialog primitives (`wide`, `tall`, `split`, `footer`)
    - `Sheet`
    - `OptionsMenu`
    - `ActionButton`: a split button with a menu
    - `SearchSelect`: a combobox
    - `OptionList`
    - `QueueSelect`
    - `ChipPicker`
    - `ChipMultiSelect`
    - `Insight`
  - **Charts:**
    - `TimelineChart`: multi-series stacked bar, line or area
    - `ChartTypeToggle`, now exported
    - `CHART_SERIES_COLORS` / `chartSeriesColor`
  
  Extended:
  
  - `Badge`:
    - New tones `neutral`, `accent` and `danger`.
    - New `icon` and `title` props.
    - `appearance="bordered"` now also applies to `variant="tone"`, which gives the chip look.
  - `EmptyState`:
    - `icon` also accepts a component type, and `title` and `description` accept a ReactNode.
    - New `variant="dashed"` and `className`.
    - Without an `icon`, it now shows the lucide `Inbox` icon instead of `☐`.
  - `LoadingMessage` / `ErrorMessage`:
    - New `variant="inline"`.
    - `ErrorMessage` gains `title`, `error`, `onRetry` and `retryLabel`.
    - `role` attributes are set.
  - `Timeline`:
    - Compound `Timeline.Root` / `Timeline.Item` with icon dots, tones and nested lists.
    - The plain `Timeline` is unchanged.
  - `PageHeader` renders a heading block when given `title`, `description`, `actions` or `eyebrow`. With only `children` it is unchanged.
  - `SectionCard`: `title` accepts a ReactNode, and there is a new `className`.
  - `SidebarNavLink`: `icon` is optional, and there is a new `className`.
  - `TabBar`: new `className`.
  - `DialogContent`: new `closeLabel` and `hideClose`.
  - `StatPanelView` uses the exported `ChartTypeToggle`, which is h-7, `rounded-md` and has a focus ring.
  
  All user-facing strings default to English and can be overridden through props.
- fb5af62: `ShadcnDataTable` gets opt-in TanStack features: `sortable` (header click), `filterable` (Excel-style funnel per column: distinct values with counts, select all, search; `column.filter: 'text'` adds «contains», `'range'` adds from/to), `resizable` / `storageKey` (drag a header edge, double-click to reset, widths remembered in localStorage), and `virtual` (fixed-height rows, only the visible slice rendered — 5000+ rows). Also `rowClassName`, `toolbar` with a «Showing X of Y» count, overridable `labels`; columns get `size`, `align`, `sortable`, `filter`. A plain `ancestor` column now has a value to sort and filter on. Without the new props the table renders as before.

### Patch Changes

- c6eba60: Tables and chips no longer wrap: `TableHead`/`TableCell`, every `Badge` variant and the `IdCell`/`MonoCell`/`DateCell` atoms get `whitespace-nowrap` (wide rows scroll inside the table's `overflow-auto` wrapper, as in upstream shadcn). Sticky first-column cells now use an opaque hover background and `z-[1]`, so scrolled content no longer shows through them.

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
