---
'@open_design/ui': minor
---

Components ported from fintrack (`@lib` markers) and webhooxy (`TODO(open_design/ui)`). No breaking changes: existing props render as before.

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
