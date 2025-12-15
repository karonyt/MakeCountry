import { Player } from "@minecraft/server";
import { GetAndParsePropertyData } from "./util";
import { recipe_config } from "../recipe_config";

/**
 * 国家レベルに応じたレシピのロック、及びアンロック
 * @param {Player} player 
 */
export function updateRecipe(player) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const nowLv = player.getDynamicProperty('countryLv') ?? 0;
    let lv = 0;
    if (!playerData?.country || playerData?.country < 1) {
        lv = 0;
    } else {
        const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
        lv = playerCountryData.lv ?? 0;
    };
    const allow = recipe_config.filter(a => a.lv <= lv && a.lv > nowLv);
    const deny = recipe_config.filter(a => a.lv > lv && a.lv <= nowLv);
    for (const a of allow) {
        player.runCommand(`recipe give @s ${a.id}`);
    };
    for (const d of deny) {
        player.runCommand(`recipe take @s ${d.id}`);
    };
};