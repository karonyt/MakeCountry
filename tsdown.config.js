//@ts-check
import { defineConfig } from 'tsdown';
import { gameUiLocalization } from './tools/game-ui-localization.mjs';

export default defineConfig({
  entry: 'src/index.ts',
  plugins: [gameUiLocalization('makecountry')],
  outDir: 'scripts',
  target: 'ES2024',
  external: /^@minecraft\/(?!vanilla-data|math)/,
  // discord-mcbe との連携に使う。ゲーム内では npm パッケージを読み込めないので、バンドルに含める
  noExternal: ['mcbe-ipc'],
  inlineOnly: ['mcbe-ipc'],
  outExtensions: () => ({ js: '.js' }),
  sourcemap: false,
});
