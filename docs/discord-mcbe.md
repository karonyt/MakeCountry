# discord-mcbe との連携

[← README に戻る](../README.md)

[discord-mcbe](https://github.com/tutinoko2048/discord-mcbe) は、Minecraft のチャットと Discord をつなぐアドオンです。
MakeCountry と一緒に導入すると、全体チャットを Discord と相互にやり取りできます。

## できること

- **Minecraft → Discord**: 全体チャットが Discord に送信されます。国名・二つ名などの表示も付きます (色は除かれます)
  - 国チャット・同盟チャット・DM など、全体チャット以外は送信されません
- **Discord → Minecraft**: Discord のメッセージがゲーム内に表示されます
  - 全体チャットをミュートしているプレイヤーには表示されません

## 導入

1. [discord-mcbe のドキュメント](https://discord-mcbe.retomc.dev/) に従って discord-mcbe を導入します
2. MakeCountry (フル版) または MakeCountryLite と同じワールドに、discord-mcbe のビヘイビアパックを追加します

MakeCountry 側の操作は要りません。ワールドを開いたときに discord-mcbe を自動で見つけて連携します。
discord-mcbe を入れていないワールドでは何も起きません。

- チャット連携に対応した discord-mcbe v4.1.0以上が必要です
- discord-mcbe の `config.json` で `bot.allow_addon_messages` を `false` にしていると連携しません
- 機能パックだけでは連携しません。連携するのは MakeCountry (フル版) と MakeCountryLite です

## MakeCountry 側の設定

`scripts/config/server.js` で変更できます ([設定の変更](admin.md#設定の変更))。

| 項目 | 内容 | 初期値 |
| --- | --- | --- |
| `discordMcbeIntegration` | discord-mcbe と連携するか | `true` |
| `discordNoCountryName` | 国に所属していないプレイヤーの国名として Discord に表示する文字列 | `無所属` |

## discord-mcbe 側のおすすめ設定

discord-mcbe の初期設定では、国名などは `<>` の中に表示されます。

```
<[日本] Steve> こんにちは
```

国名を `<>` の外に出したいときは、discord-mcbe の `config.json` に次の設定を足します。

```json
"translation_overrides": {
  "discord.chat": "%3<%2%4> %1"
}
```

```
[日本] <Steve> こんにちは
```

- 複数のワールドをつないでいる場合は、`"discord.chat.multipleWorlds": "[%0] %4<%3%5> %2"` も足します
- Webhook を使っている場合は、国名付きの名前がそのまま送信者名になるので、この設定は要りません
- Discord からのメッセージをゲーム内でどう表示するかも、同じ `translation_overrides` で変えられます
  ([表示メッセージの変更](https://discord-mcbe.retomc.dev/guides/translation-overrides/))

## うまく動かないとき

- **Minecraft のチャットが Discord に出ない**: discord-mcbe が古いか、`bot.allow_addon_messages` が `false` になっていないか確認してください
- **国チャットが Discord に出ない**: 仕様です。全体チャットだけを送信します
- **ミュートしているのに Discord のメッセージが表示される**: 効くのは全体チャットのミュートだけです。プレイヤーごとのミュートは Discord のメッセージには効きません
