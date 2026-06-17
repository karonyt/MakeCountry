import { Player } from "@minecraft/server";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";

/**
 * プレイヤーの名前に国名セット
 * @param {Player} player 
 */
export function nameSet(player: any) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if(!playerData?.country || playerData?.country < 1 ) {
        player.nameTag = player.name;
        return;
    };
    const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    if (!playerCountryData?.name) {
        player.nameTag = player.name;
        return;
    }
    const federation = normalizeFederationData(playerCountryData);
    const federationName = isFederationActive(federation) ? ` / ${federation.name}` : ``;
    player.nameTag = `[${playerCountryData.name}${federationName}]\n${player.name}`;
};
