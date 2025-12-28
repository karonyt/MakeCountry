import { Player, system } from "@minecraft/server";
import { GetAndParsePropertyData } from "./util";
import { recipe_config } from "../recipe_config";
import { DynamicProperties } from "../api/dyp";

/**
 * 国家レベルに応じたレシピのロック、及びアンロック
 * @param {Player} player 
 */
export function updateRecipe(player, lv = undefined) {
    if (typeof lv == 'undefined') {
        const playerDataBase = new DynamicProperties('player');
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        if (!playerData?.country || playerData?.country < 1) {
            lv = 0;
        } else {
            const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
            lv = playerCountryData.lv ?? 0;
        };
    };
    const detectLv = lv;
    //const nowLv = Number(player.getDynamicProperty('countryLv') ?? '0');
    player.runCommand(`recipe give @s *`);
    system.runTimeout(() => {
        const allow = recipe_config.filter(a => a.lv <= detectLv)//&& a.lv > nowLv);
        const deny = recipe_config.filter(a => a.lv > detectLv) //&& a.lv <= nowLv);
        for (const a of allow) {
            player.runCommand(`recipe give @s ${a.id}`);
        };
        system.runTimeout(() => {
            for (const d of deny) {
                player.runCommand(`recipe take @s ${d.id}`);
            };
            //player.setDynamicProperty('countryLv', `${detectLv}`);
        }, 1);
    }, 1);
};