---
'@open_design/ui': minor
---

Second batch of components ported from fintrack (`@lib` markers). No breaking changes.

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
