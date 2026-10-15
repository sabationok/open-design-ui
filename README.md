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
