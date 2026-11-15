/**
 * 配布版(単体ワールド)用の連携ポイント。
 *
 * KaroEarth 版では外部サーバー(Core)やハンター/ゲート系パックと連携していた処理の
 * 呼び出し口だけを残し、単体ワールドで期待される動作(何もしない・常に安全)を返す。
 */
import type { Player } from "@minecraft/server";

/** 外部サーバーとの同期待ちなどでプレイを止める必要があるか。単体ワールドでは常に false。 */
export function isUnsafeToPlay(): boolean {
    return false;
}

/** 外部サーバーへ接続済みか。単体ワールドでは常に false。 */
export function isCoreReady(): boolean {
    return false;
}

/** 職業の実績を外部サーバーへ報告する。単体ワールドでは何もしない。 */
export function reportJobAchievement(_player: Player, _achievement: string): void {}

/** 次の所持金書き込みに理由を付ける(外部サーバー監査用)。単体ワールドでは何もしない。 */
export function annotateNextMoneyWrite(_name: string, _reason: string): void {}

/** シーズン別の二つ名取得履歴を記録する。単体ワールドでは何もしない。 */
export function recordCurrentSeasonTitle(_player: unknown, _tag: string): void {}

/** ハンター系 HUD が表示中か。単体ワールドでは常に false。 */
export function hasHunterHudLease(_player: { getTags?(): string[] }): boolean {
    return false;
}

/** ゲート(ダンジョン入口)周辺のブロック編集を止めるか。単体ワールドでは常に false。 */
export function cancelGateBlockEdit(_event: unknown): boolean {
    return false;
}

/** ゲート周辺の地形操作を止めるか。単体ワールドでは常に false。 */
export function cancelGateTerrainInteraction(_event: unknown): boolean {
    return false;
}

/** ゲート保護の中心座標。単体ワールドでは存在しない。 */
export function gateProtectionCenters(_dimension: unknown): readonly unknown[] {
    return [];
}

/** 座標がゲート保護範囲内か。単体ワールドでは常に false。 */
export function gateBlockProtectedByCenters(_location: unknown, _centers: readonly unknown[]): boolean {
    return false;
}

/** ブロックがゲート保護範囲内か。単体ワールドでは常に false。 */
export function isGateBlockProtected(_dimension: unknown, _location: unknown): boolean {
    return false;
}
