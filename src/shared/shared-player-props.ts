/**
 * Lite と機能パックがともに使うプレイヤーの値 (プレイヤーのダイナミックプロパティはパックごとに別なので、分割版では写す)。
 *
 * - LITE_FLAGS: Lite (設定画面) が持ち、機能パックが読む値。分割版では Lite がタグ `mcset_<名前>` に写す (true のときだけ付く)
 * - LITE_WRITABLE: 機能パックが書き、Lite (チャット・名前表示) が読む値。分割版では Lite に書き込みを依頼する
 */
import type { Player } from "@minecraft/server";
import { BUILD_PACK, IS_SPLIT_BUILD } from "@/shared/build-flags.js";
import { callHook } from "@/shared/hooks.js";

export const LITE_FLAGS = ["isSpecialFishing", "isUseOldCookingSystem"] as const;
export const LITE_WRITABLE = ["pennameBefore", "pennameAfter", "chatType"] as const;
export type LiteFlag = (typeof LITE_FLAGS)[number];
export type LiteWritable = (typeof LITE_WRITABLE)[number];

const remote = () => IS_SPLIT_BUILD && BUILD_PACK !== "lite";
export const flagTag = (key: LiteFlag) => `mcset_${key}`;

/** Lite の設定値を読む (true / 'true' を true とみなす)。 */
export function readLiteFlag(player: Player, key: LiteFlag): boolean {
    if (remote()) return player.hasTag(flagTag(key));
    const value = player.getDynamicProperty(key);
    return value === true || value === "true";
}

/** Lite が読む値を書く。 */
export function writeLitePlayerProperty(player: Player, key: LiteWritable, value: string | number | boolean | undefined): void {
    player.setDynamicProperty(key, value);
    if (remote()) callHook("lite.setPlayerProperty", player, key, value);
}
