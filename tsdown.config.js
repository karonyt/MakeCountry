//@ts-check
import { defineConfig } from 'tsdown';
import { gameUiLocalization } from './tools/game-ui-localization.mjs';

export default defineConfig({
  entry: 'src/index.ts',
  plugins: [gameUiLocalization('makecountry')],
  outDir: 'scripts',
  target: 'ES2024',
  external: /^@minecraft\/(?!vanilla-data|math)/,
  outExtensions: () => ({ js: '.js' }),
  sourcemap: false,
});
