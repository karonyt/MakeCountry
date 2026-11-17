//@ts-check
import { defineConfig } from 'tsdown';
import { gameUiLocalization } from './tools/game-ui-localization.mjs';
import { configModules } from './tools/config-modules.mjs';

export default defineConfig({
  entry: 'src/index.ts',
  // 設定ファイルは scripts/config/*.js として別に残す (ユーザーが編集できるように)
  plugins: [configModules(import.meta.dirname), gameUiLocalization('makecountry')],
  outDir: 'scripts',
  target: 'ES2024',
  external: /^@minecraft\/(?!vanilla-data|math)/,
  // discord-mcbe との連携に使う。ゲーム内では npm パッケージを読み込めないので、バンドルに含める
  noExternal: ['mcbe-ipc'],
  inlineOnly: ['mcbe-ipc'],
  outExtensions: () => ({ js: '.js' }),
  sourcemap: false,
});
