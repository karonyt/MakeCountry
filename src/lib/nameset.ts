import { Player } from "@minecraft/server";
import { GetAndParsePropertyData } from "./util.js";

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
    player.nameTag = `${playerCountryData?.name}\n${player.name}`;
};