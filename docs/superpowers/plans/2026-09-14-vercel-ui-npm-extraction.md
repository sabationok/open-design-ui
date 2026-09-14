# vercel-ui → standalone npm package — implementation plan

## Goal

Move `packages/vercel-ui` out of the `webhooks-proxy` monorepo into its own
GitHub repo, published as `@open_design/ui` on public npm, and repoint
`dashboard-app` at the published package. From this point on, all UI-library
changes go through PRs against the new repo — `webhooks-proxy` only ever
consumes a released version.

## Architecture

Two repos after this plan:

- **`open-design-ui`** (new, public GitHub repo, scaffolded at
  `/Users/vitalii/WebstormProjects/open-design-ui`, sibling to
  `webhooks-proxy`) — owns all component source, builds with tsup, previews
  via Storybook, releases via Changesets + GitHub Actions to npm as
  `@open_design/ui`.
- **`webhooks-proxy`** — `packages/dashboard-app` depends on `@open_design/ui`
  as a normal npm dependency. `packages/vercel-ui` is deleted; nothing else
  in this repo references it (confirmed: only `dashboard-app` consumes it).

No source logic changes during the move — every component's internals are
copied as-is. The only edits are package metadata, import paths, build
config, and the demo-page → Storybook port.

## Tech Stack

- New repo: TypeScript, tsup (build), Storybook (`@storybook/react-vite`),
  Changesets, GitHub Actions.
- `webhooks-proxy` side: no new tooling — Vite + Tailwind v4, already in
  place.

## Spec

`docs/superpowers/specs/2026-09-14-vercel-ui-npm-extraction-design.md` — read
in full before starting. Section references below point at specific parts.

## Global Constraints

- **No test files.** Do not add unit/integration/E2E tests or a testing
  section to any task's output unless the user explicitly asks — this
  overrides any stack-default TDD workflow for this plan.
- **Hard-to-reverse steps need an explicit go-ahead at execution time**, even
  though this plan is pre-approved: creating the public GitHub repo (Task 1),
  the first `npm publish` (Task 15), and deleting `packages/vercel-ui` from
  `webhooks-proxy` (Task 21) are each a checkpoint — confirm with the user
  immediately before running the actual create/publish/delete command, not
  just at plan approval time.
- Every file moved from `packages/vercel-ui/src` keeps its exact relative
  path and contents unless a task explicitly says otherwise — this is a
  mechanical relocation, not a rewrite.
- `@open_design/ui`'s peerDependencies/devDependencies mirror
  `packages/vercel-ui/package.json` version-for-version unless a task says
  to change one.
- **Storybook demos (Tasks 5–11) port library primitives only, never
  dashboard-app HOCs/compositions.** Several `*Demos` functions named in
  Tasks 6, 7, and 10 (`WebhookStatusBadgeDemos`, `RequestStatusBadgeDemos`,
  `EventTypeBadgeDemos`, `ProviderBadgeDemos`, `AttemptStatusBadgeDemos`,
  `TransportBadgeDemos`, `HealthDotDemos`, `DestinationCardDemos`,
  `DeliveryTimelineDemos`, and `StatPanelDemos` if it renders through the
  app-level `StatPanel` wrapper rather than `StatPanelView` directly)
  exercise components that live under `dashboard-app/src/app/components/**`
  — thin wrappers hardcoding `@webhooks-proxy/shared` domain enums
  (`WebhookEventStatus`, `DeliveryAttemptStatus`, `DestinationMeta`, ...)
  around a `vercel-ui` primitive. Those wrappers are dashboard-app-only and
  never move into this repo. When a task names one, skip it and, where the
  underlying primitive (`Badge`, `Dot`, `StatPanelView`, ...) doesn't yet
  have its own story, add one with an illustrative example config instead
  of the app's real enum. Confirmed and applied starting Task 6.

---

## Phase 1 — `open-design-ui` repo

### Task 1 — Create the GitHub repo and local scaffold

Create a new public GitHub repo `open-design-ui` under the same account as
this repo's `git remote`, clone it locally at
`/Users/vitalii/WebstormProjects/open-design-ui`, and scaffold the base
project files (not yet the component source — that's Task 2).

**Files:**
- Create: `package.json`, `tsconfig.json`, `.gitignore`, `README.md`,
  `LICENSE` (MIT unless the user says otherwise), `components.json`
  (copy from `packages/vercel-ui/components.json` verbatim — same shadcn
  config, paths are already relative to the package root so no edits
  needed)

**Interfaces:**
- Produces: a git repo with an initial commit, pushed to
  `github.com/<account>/open-design-ui`, empty `src/` directory ready for
  Task 2.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#package-identity`
- `package.json` base fields: `"name": "@open_design/ui"`, `"version":
  "0.0.0"`, `"type": "module"`, `"license": "MIT"`, `"private": false`,
  `"publishConfig": { "access": "public" }` (required for a scoped package to
  publish publicly).
- Copy `tsconfig.json` compilerOptions verbatim from
  `packages/vercel-ui/tsconfig.json` (target es2023, jsx react-jsx, strict,
  etc.) — no changes needed, it already has no monorepo-specific paths.

**STOP before running `gh repo create --public`** — confirm with the user
first (see Global Constraints).

---

### Task 2 — Move component source, rename package identity

Copy `packages/vercel-ui/src/*` into the new repo's `src/`, preserving the
exact directory structure (`atoms/`, `molecules/`, `components/`,
`data-table/`, `lib/`, `styles/`, `index.ts`). Update only `package.json`
identity fields — no source file contents change.

**Files:**
- Create: `src/` (mirrors `packages/vercel-ui/src/` exactly, all ~77 files)
- Modify: `package.json` (in `open-design-ui`)

**Interfaces:**
- Produces (package.json `exports` map — must match exactly, this is the
  public API surface consumers bind to):
  ```
  "exports": {
    ".": "./dist/index.js",
    "./atoms": "./dist/atoms/index.js",
    "./molecules": "./dist/molecules/index.js",
    "./data-table": "./dist/data-table/index.js",
    "./styles/theme.css": "./dist/styles/theme.css"
  }
  ```
  (paths point at `dist/` now, not `src/`, since Task 3 adds a real build —
  unlike the current workspace package which points `exports`/`main`
  directly at `src/`.)
- Consumes: `packages/vercel-ui/package.json` peerDependencies and
  devDependencies — copy both blocks verbatim, no version changes.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#package-identity`
- Pattern (for the exact current file tree and peerDeps to copy):
  `packages/vercel-ui/package.json`, `packages/vercel-ui/src/`

---

### Task 3 — Configure the tsup build

Add `tsup.config.ts` with four entries (`index`, `atoms/index`,
`molecules/index`, `data-table/index`), ESM output, bundled `.d.ts`, and a
`postbuild` step that copies `src/styles/theme.css` to
`dist/styles/theme.css` unchanged (tsup's JS bundler doesn't touch plain
CSS files).

**Files:**
- Create: `tsup.config.ts`
- Modify: `package.json` (`scripts.build`, `scripts.dev` for watch mode,
  `scripts.typecheck`)

**Interfaces:**
- Produces: `dist/index.js` + `.d.ts`, `dist/atoms/index.js` + `.d.ts`,
  `dist/molecules/index.js` + `.d.ts`, `dist/data-table/index.js` + `.d.ts`,
  `dist/styles/theme.css` — must exactly match the `exports` map from
  Task 2.
- `scripts.build`: runs tsup then the CSS copy step (or the copy step is a
  tsup `onSuccess` hook — executor's choice, either is fine as long as
  `pnpm build` produces all five output paths above in one command).

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#build-pipeline`
- External dependencies to add to `devDependencies`: `tsup`, and a small
  file-copy utility (e.g. `cpy-cli`) if not doing the copy via tsup's
  `onSuccess` hook.

Run `pnpm build` locally and confirm all five `dist/` paths exist with
non-empty content before moving on.

---

### Task 4 — Storybook infra (no stories yet)

Install and configure Storybook with the `@storybook/react-vite` builder.
Storybook needs Tailwind processing to render components correctly — wire
its preview to import `src/styles/theme.css` plus a minimal Tailwind entry
(the same `@import "tailwindcss"` + `@source` pattern `dashboard-app` uses,
scoped to `../src` instead of a node_modules path since Storybook runs
against source, not `dist/`).

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.ts` (or `.tsx`),
  `.storybook/tailwind.css` (or reuse `src/styles/theme.css` directly if it
  already includes the `@import "tailwindcss"` line — check first)
- Modify: `package.json` (`scripts.storybook`, `scripts.build-storybook`,
  devDependencies)

**Interfaces:**
- Produces: `pnpm storybook` serves an empty Storybook shell (no stories
  registered yet — Tasks 5–11 add them) without errors.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#component-demos--storybook`
- Pattern (to check whether `theme.css` already has the Tailwind import or
  only defines CSS variables): `packages/vercel-ui/src/styles/theme.css`

---

### Task 5 — Port atoms & typography demos to Storybook

Port these `DevComponentsPage.tsx` demo functions into one
`atoms.stories.tsx` (or split per-component file — executor's judgment, but
keep it to one Storybook category so the sidebar groups them together):
`BadgeToneDemos`, `DotIndicatorDemos`, `MonoAtomsDemos`, `TypographyDemos`,
`ButtonsDemos`, `FeedbackDemos`, `UtilityAtomsDemos`.

**Files:**
- Create: `src/atoms/*.stories.tsx` (grouping per executor's judgment)

**Interfaces:**
- N/A — presentational story files, no new exported functions consumed
  elsewhere.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (the seven functions named above — each `Demo*` function's JSX body is
  the story's `render`, its variant/prop combinations become Storybook
  `args`/`argTypes` where it makes sense instead of hardcoded JSX per
  variant)
- The generic wrapper helpers in that file (`DemoTile`, `DemoGrid`,
  `ControlRow`, `ChipPicker`, `TextControl`) are Storybook's job now
  (controls addon, layout) — don't port them, translate their intent into
  Storybook argTypes/decorators instead.

---

### Task 6 — Port badge & status-indicator demos to Storybook

Port: `WebhookStatusBadgeDemos`, `RequestStatusBadgeDemos`,
`EventTypeBadgeDemos`, `ProviderBadgeDemos`, `AttemptStatusBadgeDemos`,
`TransportBadgeDemos`, `BadgeDemos`, `BadgeVariantGroup`, `HealthDotDemos`,
`FilterChipDemos`.

**Files:**
- Create: `src/molecules/*.stories.tsx` (badge-family stories)

**Interfaces:** N/A — presentational story files.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (the ten functions named above)

---

### Task 7 — Port card & layout demos to Storybook

Port: `StatCardsDemos`, `SectionCardDemos`, `MetaFieldsDemos`,
`DetailSidePanelDemos`, `DestinationCardDemos`, `EmptyStateDemos`,
`PageHeaderDemos`, `BackLinkDemos`.

**Files:**
- Create: `src/molecules/*.stories.tsx` (card/layout-family stories)

**Interfaces:** N/A.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (the eight functions named above)

---

### Task 8 — Port form & control demos to Storybook

Port: `FormFieldDemos`, `PaginationBarDemo`, `TabBarDemo`, `FilterBarDemos`,
`JSONPathPickerDemos`.

**Files:**
- Create: `src/molecules/*.stories.tsx` (form/control-family stories)

**Interfaces:** N/A.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (the five functions named above)

---

### Task 9 — Port dialog demos to Storybook

Port `DialogsDemos` (all four dialog variants it covers).

**Files:**
- Create: `src/molecules/Dialogs.stories.tsx`

**Interfaces:** N/A.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (`DialogsDemos`)

---

### Task 10 — Port StatPanel & DeliveryTimeline demos to Storybook

Port `StatPanelDemos`, `DeliveryTimelineDemos`.

**Files:**
- Create: `src/molecules/StatPanel.stories.tsx`,
  `src/molecules/DeliveryTimeline.stories.tsx`

**Interfaces:** N/A.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (`StatPanelDemos`, `DeliveryTimelineDemos`)

---

### Task 11 — Port DataTable demos to Storybook

Port: `DataTableFiltersDemos`, `ColumnToggle`, `EventsTableDemo`,
`RequestsTableDemo`. These use mock row data inline in
`DevComponentsPage.tsx` — carry the mock fixtures over into the story file
(or a co-located `fixtures.ts`) since `data-table` has no other source of
sample data.

**Files:**
- Create: `src/data-table/*.stories.tsx`, optionally
  `src/data-table/fixtures.ts`

**Interfaces:** N/A.

**Context:**
- Pattern: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
  (the four functions named above, plus their inline mock data)

After Tasks 5–11: run `pnpm build-storybook` and confirm it completes with
no errors, then spot-check `pnpm storybook` renders at least one story from
each group in a browser.

---

### Task 12 — Set up Changesets

Initialize Changesets (`pnpm dlx @changesets/cli init`), configure
`.changeset/config.json` for a single-package repo (no linked/fixed groups
needed).

**Files:**
- Create: `.changeset/config.json`, `.changeset/README.md` (generated)
- Modify: `package.json` (devDependencies: `@changesets/cli`)

**Interfaces:**
- Produces: `pnpm changeset` CLI works locally and can generate a changeset
  markdown file.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#release-flow`

---

### Task 13 — GitHub Actions: CI workflow

Add `.github/workflows/ci.yml`, triggered on pull requests: install deps,
typecheck, `pnpm build`, `pnpm build-storybook`.

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: a workflow that fails the PR check if typecheck, build, or the
  Storybook build breaks.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#release-flow`

---

### Task 14 — GitHub Actions: release workflow

Add `.github/workflows/release.yml`, triggered on push to `main`: runs the
Changesets GitHub Action (`changesets/action`), which opens/updates a
"Version Packages" PR when changesets are pending, and on merge of that PR
publishes to npm using an `NPM_TOKEN` secret.

**Files:**
- Create: `.github/workflows/release.yml`

**Interfaces:**
- Consumes: `NPM_TOKEN` repo secret (must be created in GitHub repo settings
  — not something this task can automate; call this out to the user
  explicitly when this task runs).
- Produces: automatic `npm publish` on every merge to `main` that includes
  pending changesets.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#release-flow`

---

### Task 15 — First publish

Add an initial changeset (`minor` or `1.0.0`, user's call), merge to `main`,
let the release workflow publish `@open_design/ui@<version>` to npm. Verify
with `npm view @open_design/ui` that it's live and `npm install
@open_design/ui` resolves in a scratch directory.

**STOP before merging to `main` / before the workflow runs `npm publish`** —
confirm with the user first (see Global Constraints); this is the first
public artifact under the new package name.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#release-flow`

---

## Phase 2 — `webhooks-proxy` consumer migration

### Task 16 — Swap the dependency in `dashboard-app`

**Files:**
- Modify: `packages/dashboard-app/package.json`

**Interfaces:**
- Consumes: `@open_design/ui@<version published in Task 15>`
- Removes: `"vercel-ui": "workspace:*"`

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#consuming-it-from-webhooks-proxy`

Run `pnpm install` at the workspace root after this change.

---

### Task 17 — Rename imports across `dashboard-app`

Find every import from `'vercel-ui'`, `'vercel-ui/atoms'`,
`'vercel-ui/molecules'`, `'vercel-ui/data-table'` under
`packages/dashboard-app/src` and rewrite to the `@open_design/ui`
equivalents. Purely mechanical — no logic changes, no reordering of named
imports.

**Files:**
- Modify: every file under `packages/dashboard-app/src` matching
  `from 'vercel-ui'` (grep first to get the exact file list before editing)

**Interfaces:** N/A — import path rewrite only.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#consuming-it-from-webhooks-proxy`

---

### Task 18 — Update the Tailwind CSS entry

**Files:**
- Modify: `packages/dashboard-app/src/index.css`

**Interfaces:**
- Changes line 4: `@import "vercel-ui/styles/theme.css";` →
  `@import "@open_design/ui/styles/theme.css";`
- Changes line 7: `@source "../../vercel-ui/src";` →
  `@source "../../../node_modules/@open_design/ui/dist";`

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#consuming-it-from-webhooks-proxy`
- Pattern (current state to confirm line numbers haven't drifted):
  `packages/dashboard-app/src/index.css`

---

### Task 19 — Update `vite.config.ts`

Remove (or rename) the `optimizeDeps.include` entry for `vercel-ui`.

**Files:**
- Modify: `packages/dashboard-app/vite.config.ts`

**Interfaces:**
- Changes: `optimizeDeps.include: ['@webhooks-proxy/shared',
  '@webhooks-proxy/sdk', 'vercel-ui']` → drop `'vercel-ui'` from the array
  (leave the other two entries — they're unrelated `@webhooks-proxy/*`
  packages, still workspace-linked).

**Context:**
- Pattern: `packages/dashboard-app/vite.config.ts` (confirm current array
  contents before editing)

---

### Task 20 — Remove `DevComponentsPage` and its route

**Files:**
- Delete: `packages/dashboard-app/src/app/pages/DevComponentsPage.tsx`
- Modify: `packages/dashboard-app/src/App.tsx` (remove the import on line 26
  and the route entry `{ path: '/dev', element: <DevComponentsPage /> }` on
  line 84 — confirm exact lines haven't drifted before editing)

**Interfaces:** N/A — deletion + route removal.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#component-demos--storybook`

---

### Task 21 — Remove `packages/vercel-ui` from the monorepo

Delete the directory. `pnpm-workspace.yaml` needs no edit (it globs
`packages/*`, so it drops out automatically). Confirm no other package
references `vercel-ui` before deleting (grep the whole repo, not just
`dashboard-app` — the design doc's inventory only checked `dashboard-app`
explicitly).

**Files:**
- Delete: `packages/vercel-ui/` (entire directory)

**STOP before deleting** — confirm with the user first (see Global
Constraints), and only after Tasks 16–20 are verified working against the
published package.

**Context:**
- Spec: `2026-09-14-vercel-ui-npm-extraction-design.md#out-of-scope`
  (git history for this directory intentionally stays behind, per the
  "clean cut" decision)

---

### Task 22 — Verify end-to-end

Run, in order: `pnpm install` (root), `pnpm --filter
@webhooks-proxy/dashboard-app build`, `pnpm dev:app`. Confirm the dev server
starts with no missing-module errors, then open it in a browser and
spot-check a page that uses several `@open_design/ui` components (badges,
data table, at least one dialog) to confirm styling (Tailwind classes) and
behavior are unchanged from before the migration.

**Context:**
- No pattern file — this is a manual verification pass, not new code.
