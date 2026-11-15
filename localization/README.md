# ゲーム表示の多言語化

フォーム・HUD・通知などの日本語の表示文字列は、ビルド時に `tools/game-ui-localization.mjs`(tsdown プラグイン)が
`game.ui.<ハッシュ>` の翻訳キーに置き換え、端末の言語で表示する。訳文は MakeCountryResourcePack の `texts/*.lang` にある。

- `catalog/all.js` … 原文と翻訳キーの対応表 (ビルド時に参照)
- `ui-makecountry.js` / `runtime.js` … 実行時の翻訳ヘルパー
- `artisan-text.js` / `primitive-text.js` / `item-presentation.js` … 職人UI・TextPrimitive・取引表示用

新しい日本語の表示文字列を追加した場合は、対応する `game.ui.*` キーを RP の全言語ファイルに追加すること。
キーがない文字列は、そのまま原文で表示される。
