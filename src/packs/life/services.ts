/**
 * 生活パックが持つプレイヤー記録の更新 (分割版のみ)。
 *
 * 結婚・懸賞金の情報は生活パックの領域に保存する。名前とプレイ日数は Lite のものを写す
 * (プレイ日数は Lite がスコアボード `mc_days_view` に書き出した値)。お金は持たない (Lite に依頼する)。
 */
import { Player, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { ensureMarriageData } from "@/domain/player/marriage.js";
import { ensureBountyData } from "@/domain/player/bounty.js";
import { viewDays } from "@/shared/economy-client.js";

function syncRecord(player: Player) {
    try {
        const key = `player_${player.id}`;
        const data = GetAndParsePropertyData(key) ?? { id: player.id };
        data.id = player.id;
        data.name = player.name;
        const days = viewDays(player);
        if (days !== undefined) data.days = days;
        ensureMarriageData(data);
        ensureBountyData(data);
        StringifyAndSavePropertyData(key, data);
    } catch (error) {
        console.warn(`[MakeCountry life] player record: ${error instanceof Error ? error.message : error}`);
    }
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) system.runTimeout(() => { if (player.isValid) syncRecord(player); }, 60);
});
world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => { for (const player of world.getPlayers()) syncRecord(player); }, 20 * 60);
});
