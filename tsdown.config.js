//@ts-check
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'scripts',
  target: 'ES2024',
  external: /^@minecraft\/(?!vanilla-data|math)/,
  outExtensions: () => ({ js: '.js' }),
  sourcemap: true,
});
