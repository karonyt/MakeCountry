/**
 * 機能パック用: プレイヤーの所属国の国家ランク。
 * Lite がスコアボード `mc_country_lv` に書き出した値を読む (-1 は所属国なし)。
 */
import { world, type Player } from "@minecraft/server";

export const COUNTRY_LEVEL_OBJECTIVE = "mc_country_lv";

export function getPlayerCountryLevel(player: Player): number | undefined {
    try {
        const score = world.scoreboard.getObjective(COUNTRY_LEVEL_OBJECTIVE)?.getScore(player);
        if (score === undefined || score < 0) return undefined;
        return score;
    } catch {
        return undefined;
    }
}
