/**
 * プレイヤーの所属国の国家ランク (国家レベル)。所属国が無ければ undefined。
 * 機能パック (分割版) では remote/player-country-level.ts に差し替わり、Lite が書き出したスコアボードを読む。
 */
import type { Player } from "@minecraft/server";
import { PlayerManager } from "@/domain/player/player-manager.js";

export function getPlayerCountryLevel(player: Player): number | undefined {
    const country = new PlayerManager(player.id).country;
    if (!country) return undefined;
    return Number(country.lv ?? 0) || 0;
}
