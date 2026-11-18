---
'@open_design/ui': patch
---

Tables and chips no longer wrap: `TableHead`/`TableCell`, every `Badge` variant and the `IdCell`/`MonoCell`/`DateCell` atoms get `whitespace-nowrap` (wide rows scroll inside the table's `overflow-auto` wrapper, as in upstream shadcn). Sticky first-column cells now use an opaque hover background and `z-[1]`, so scrolled content no longer shows through them.
