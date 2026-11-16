// 生活パックが Lite からの呼び出しに応える処理。
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { provideHook, provideValue } from "@/shared/hooks.js";
import { ensureMarriageData, getPlayerDataById, getPlayerNameById, migrateMarriageReferences, showMarriageMainForm } from "@/domain/player/marriage.js";
import { ensureBountyData, getBounty } from "@/domain/player/bounty.js";
import { penNameMainDefaultForm } from "@/features/forms/default/menu/pen_name/main.js";

provideHook("life.openPenName", player => { if (player) penNameMainDefaultForm(player); });
provideHook("life.openMarriage", player => { if (player) showMarriageMainForm(player); });
provideHook("life.ensurePlayerData", (playerData: any) => {
    if (!playerData) return;
    ensureMarriageData(playerData);
    ensureBountyData(playerData);
});
provideHook("life.migratePlayerId", (oldId: string, newId: string) => {
    migrateMarriageReferences(new DynamicProperties("player"), oldId, newId);
});

provideValue("life.spouseId", playerId => getPlayerDataById(playerId)?.marriage?.spouseId);
provideValue("life.spouseName", playerId => {
    const spouseId = getPlayerDataById(playerId)?.marriage?.spouseId;
    return spouseId ? getPlayerNameById(spouseId) : undefined;
});
provideValue("life.isBountyTarget", playerId => !!getBounty(playerId));
