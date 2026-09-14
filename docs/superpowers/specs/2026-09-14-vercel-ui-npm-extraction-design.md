# vercel-ui → standalone npm package — design

Status: approved by user, pending implementation plan.

## Goal

Move `packages/vercel-ui` (the workspace-local UI package created by the prior
extraction, see `2026-08-27-vercel-ui-package-extraction-design.md`) out of the
`webhooks-proxy` monorepo entirely, into its own GitHub repo, published as a
public npm package. From this point on, all changes and new components go
through PRs against that repo — `webhooks-proxy` only ever consumes a
published version.

This is possible with zero source changes to the package's internals: the
prior extraction already enforced zero `@webhooks-proxy/*` imports and
peerDependency-only external deps, which is exactly the condition that makes
a clean repo split possible.

## Package identity

- New GitHub repo: `open-design-ui` (public).
- npm package: `@open_design/ui` (scoped). The prior unscoped name `vercel-ui`
  is unavailable on npm — it was published and unpublished by an unrelated
  owner in 2022, and npm blocks reclaiming an unpublished name for a new
  owner.
- Subpath exports unchanged in shape: `.`, `./atoms`, `./molecules`,
  `./data-table`, `./styles/theme.css`.
- All 77 files under `packages/vercel-ui/src` (atoms, molecules, data-table,
  components, lib, styles) move as-is — no internal import changes, since the
  package has no dependency on anything outside itself.

## Build pipeline

- Build tool: **tsup**. Multi-entry config — `index.ts`, `atoms/index.ts`,
  `molecules/index.ts`, `data-table/index.ts` — each producing ESM output +
  bundled `.d.ts` (tsup wraps `rollup-plugin-dts` internally).
- Swappable later: this is an internal build-config decision with no effect
  on the package's public API or on consumers, so it isn't load-bearing for
  the rest of this design. If tsup turns out to be a poor fit, switching to
  Vite library mode (`build.lib.entry` + `vite-plugin-dts` +
  `preserveModules: true`) is a contained change inside the new repo.
- `styles/theme.css` is plain CSS, not JS — it isn't run through the JS
  bundler. A `postbuild` copy step places it at `dist/styles/theme.css`
  unchanged, since it's meant to be processed by the *consumer's* own
  Tailwind pipeline, not pre-compiled here.
- All current peerDependencies stay peerDependencies (`react`, `react-dom`,
  `@radix-ui/*`, `@tanstack/react-table`, `class-variance-authority`, `clsx`,
  `tailwind-merge`, `lucide-react`, `react-router-dom`, `recharts`) —
  consumers keep supplying their own instances, no duplication.

## Component demos → Storybook

- `DevComponentsPage.tsx` (currently in `dashboard-app`) and its demo
  sections move into Storybook stories in the new repo — one `.stories.tsx`
  per component family, mirroring the current demo groupings (Badge
  variants, HealthDot, JSONViewer, etc.).
- `dashboard-app` drops `DevComponentsPage` entirely. It existed as a
  workspace-local dev tool tied to the raw-source pnpm-link setup; once
  components live externally with their own Storybook, it has no reason to
  exist.

## Release flow

- **Changesets** for versioning. Each PR to `open-design-ui` includes a
  changeset file describing the bump (patch/minor/major).
- GitHub Actions, two workflows:
  - **CI** (on every PR): typecheck, build, Storybook build — catches
    breakage before merge.
  - **Release** (on merge to `main`): Changesets release action bumps the
    version, writes `CHANGELOG.md`, publishes to npm. Requires an `NPM_TOKEN`
    secret in the new repo.

## Consuming it from `webhooks-proxy`

- `packages/dashboard-app/package.json`: `"vercel-ui": "workspace:*"` →
  `"@open_design/ui": "^x.y.z"` (installed from public npm).
- All imports across `dashboard-app` — `from 'vercel-ui'`,
  `'vercel-ui/atoms'`, `'vercel-ui/molecules'`, `'vercel-ui/data-table'` —
  rename to the `@open_design/ui` equivalents. Mechanical, no logic changes.
- `src/index.css`:
  - `@import "vercel-ui/styles/theme.css"` →
    `@import "@open_design/ui/styles/theme.css"`.
  - `@source "../../vercel-ui/src"` →
    `@source "../../../node_modules/@open_design/ui/dist"`. Tailwind v4 now
    scans the compiled JS output for class-name strings instead of TS source
    — tsup preserves class strings as literals, so utility-class detection
    keeps working unchanged.
- `vite.config.ts`: drop (or rename) `optimizeDeps.include: [..., 'vercel-ui']`
  — that force-include existed because Vite was pre-bundling a raw-source
  workspace package; a real npm package with proper ESM output typically
  doesn't need it.
- Local dev workflow before a change is published: `pnpm link` the new
  repo's build output into `dashboard-app` for live iteration against
  unpublished changes; unlink and bump to the real published version once
  the change ships through the new repo's release flow.

## Out of scope

- No git submodule or monorepo-merge tooling for the split — it's a clean
  cut, not a shared-history migration. `packages/vercel-ui`'s git history
  stays behind in `webhooks-proxy`; the new repo starts fresh.
- No design-token sync automation between the two repos — a future concern
  if it comes up, not designed here.
