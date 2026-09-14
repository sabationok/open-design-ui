import { cpSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'atoms/index': 'src/atoms/index.ts',
    'molecules/index': 'src/molecules/index.ts',
    'data-table/index': 'src/data-table/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  onSuccess: async () => {
    const from = 'src/styles/theme.css';
    const to = 'dist/styles/theme.css';
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to);
  },
});
