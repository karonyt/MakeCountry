# 管理者向けの機能

[← README に戻る](../README.md)

導入方法は [README](../README.md#導入方法-サーバー管理者向け) を見てください。

- **管理者モード**: 土地の権限に関係なく操作できます
- **土地の管理**: 特別区域の設定 (`/adminchunk`)、土地のリセット (`/resetchunk`)
- **国データ**: 国の削除 (`/deletecountry`)、国データの修復 (`/fixcountrydata`)
- **補償**: アイテムを補償としてプレイヤーに配布 (`/compensation`)
- **国家ティア**: 国の発展度の変更 (`/nationaltierlevel`)
- **徴税時刻**: 次の徴税までの時間を確認 (`/taxtime`)
- `scriptevent` から各種機能を実行でき、他のアドオン向けのイベント API もあります
- **Discord 連携**: [discord-mcbe](https://github.com/tutinoko2048/discord-mcbe) を一緒に導入すると、全体チャットを Discord と相互にやり取りできます ([discord-mcbe との連携](discord-mcbe.md))

## 設定の変更

建国費用・税金・戦争のルールなどは、ビヘイビアパックの `scripts/config/` にあるファイルで変更できます。
ファイルをテキストエディタで開き、値を書き換えてからワールドを開き直してください (各項目の説明はファイル内のコメントにあります)。

| ファイル | 主な内容 |
| --- | --- |
| `server.js` | 建国費用・チャンクの価格・税金・維持費・戦争・コンバットタグ・TPA・マーケット・二つ名など |
| `jobs.js` | 職業の種類・報酬・1 日の上限 |
| `shop.js` | 管理者ショップの商品と価格 |
| `national-tier-level.js` | 国家ランクごとに解放される機能 |
| `fishing.js` | 釣れる魚 |
| `use-items.js` | 使用を制限するアイテム |
| `territory-exceptions.js` | 土地のルールの例外 |
| `consumable-effects.js` | 料理・飲み物を食べたときの効果 |

- `textures.js`・`custom-item-ids.js` と、`scripts/content/`・`scripts/domain/` のファイルはアドオンの内部で使うデータです。変更しないでください
- 書き換えるときは、`'` や `,` などの記号を消さないように注意してください。文法が崩れるとアドオンが動かなくなります
- **MakeCountryLite と機能パックを使っている場合**: 設定ファイルは、それを使うパックごとに入っています
  (例: `server.js` は Lite と各機能パックの両方)。同じ名前のファイルはすべてのパックで同じ内容にしてください
