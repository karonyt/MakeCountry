/**
 * ビルドの種類。tools/build-packs.mjs が分割版 (MakeCountryLite と機能パック) のビルド時に埋め込む。
 * フル版 (tsdown.config.js) では埋め込まれないので false / "full" になる。
 */
declare const __MC_SPLIT__: boolean;
declare const __MC_PACK__: string;

/** 分割版 (Lite または機能パック) としてビルドされているか。 */
export const IS_SPLIT_BUILD: boolean = typeof __MC_SPLIT__ !== "undefined" && __MC_SPLIT__;
/** このパックの ID (`lite` / `jobs` など)。フル版は `full`。 */
export const BUILD_PACK: string = typeof __MC_PACK__ !== "undefined" ? __MC_PACK__ : "full";
