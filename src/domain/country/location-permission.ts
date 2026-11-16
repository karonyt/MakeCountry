/**
 * 場所に対する権限の確認 (機能のコードから使う)。
 *
 * フル版・Lite では土地データをその場で読む。
 * 機能パック (分割版) では remote/location-permission.ts に差し替わり、Lite に問い合わせた結果を使う。
 */
import { system, type Player } from "@minecraft/server";
import { CheckPermissionFromLocation } from "@/shared/utils/minecraft.js";

export type LocationCheck = { x: number; z: number; dimension: string; permission: string };

/** その場所でその操作が禁止されているか。 */
export function isLocationDenied(player: Player, x: number, z: number, dimension: string, permission: string): boolean {
    return !!CheckPermissionFromLocation(player, x, z, dimension, permission);
}

/** 権限の確認に必要な情報をそろえてから fn を次のティックで実行する (フル版・Lite ではそのまま次のティック)。 */
export function runAfterPermissionCheck(_player: Player, _checks: LocationCheck[], fn: () => void): void {
    system.run(fn);
}
