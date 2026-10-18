---
'@open_design/ui': patch
---

Drop the `lodash` runtime dependency: `TableColumn`'s `ancestor` path lookup now uses a local dot/bracket `getIn` (same semantics for `a.b` / `items[0].email`). Removes ~530 KB of non-tree-shakeable CommonJS from consumers' data-table chunk.
