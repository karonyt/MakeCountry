# MakeCountry

**統合版で建国鯖を作りたい**、そう思ってませんか？  

そんなあなたにぴったりのアドオンがMakeCountryです  

> java版のプラグインをモデルにしているため建国鯖を立てるのに最適
  
・建国、同盟、戦争などの要素が入っています。  
・通貨も専用のスコアボードを用意しているためコマンドでの拡張が可能  
・領土はチャンク単位で構成されます  
・オフラインのプレイヤーからも税金を徴収可能  
・簡単なフォームでの国管理  
  
> 使ってみよう

ワールドに導入したらチャットで /setup  
これだけです  
なんて簡単なのだろう

> どんなコマンドがあるの？
  
/helpで表示可能です  
  
> 詳しい仕様を知りたい  
  
[wiki](https://github.com/karonyt/MakeCountry/wiki)を見てください  
  
> カスタマイズしたい？

もちろんそんなことも考えて簡単にカスタマイズできる機能を用意しました。  
ソースの `src/config/` (ビルド前)
こちらのフォルダ内のファイルで簡単に色々な設定を行えます  
設定項目は300種類以上あるのでオリジナリティあふれるサーバーにできます  

> 紹介動画
  
[![Audi R8](http://img.youtube.com/vi/BynnE727OiI/0.jpg)](https://www.youtube.com/watch?v=BynnE727OiI "Audi R8")

> ロードマップ  
  
| Milestone                                | Complete |
|------------------------------------------|----------|
| **チャンクデータ**                     | ✅ |
| **プレイヤーデータ**                    | ✅ |
| **国のデータ**                 | ✅ |
| **建国システム**                      | ✅ |
| **対外関係**             | ✅ |
| **国際組織**                |  |
| **職業システム**              | ✅ |
| **プレイヤーマーケット**    | ✅ |
| **戦争** | ✅ |
| **API**        | ✅ |
| **コンバットタグ**        | ✅ |
| **scripteventからの各種機能の実行**        | ✅ |
| **プロット機能**        | ✅ |
| **結婚機能**        |  |
| **税金回収**        | ✅ |
| **tp申請**        | ✅ |
| **カスタムコマンド**        | ✅ |

> 導入に必要なもの

- ワールド設定で「ベータ API」の実験的機能をオンにしてください
- ビヘイビアパックとリソースパックの両方が必要です(リリースの `.mcaddon` に両方入っています)

> 開発者向け: ビルド

```bash
npm ci
npm run typecheck
npm run build   # scripts/index.js が生成されます
```

- 設定は `src/config/server.ts` などを編集してからビルドします
- レシピ検索用の生成ファイル(`src/generated/`)を作り直すときは、隣に MakeCountryResourcePack を置いて `npm run generate` を実行します
  (バニラの名前も含める場合は `VANILLA_TEXTS` に BDS の `resource_packs/vanilla/texts` を指定)

> 開発者向け: リリース

GitHub Actions の「Build and release mcaddon」で自動ビルドします。

- Releases で `v2.5.0` のようなタグのリリースを作成する、または
- Actions から Run workflow でバージョン(例: `2.5.0`)を入力する

と、両パックの manifest をそのバージョンにしてビルドし、`MakeCountry-v2.5.0.mcaddon` をリリースに添付します。
リソースパックは非公開リポジトリ karonyt/MakeCountryResourcePack から取得するため、読み取り権限のあるトークンを Secrets の `OTHER_REPO_TOKEN` に登録しておいてください。

> ライセンス
  
N1C1ライセンス  
https://4cil.nyao.me/n1c1
