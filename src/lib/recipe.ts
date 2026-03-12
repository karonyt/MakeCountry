import { Player, system } from "@minecraft/server";
import { GetAndParsePropertyData } from "./util.js";
import { recipe_config } from "../recipe_config.js";
import { DynamicProperties } from "../api/dyp.js";

/**
 * 国家レベルに応じたレシピのロック、及びアンロック
 * @param {Player} player 
 */
export function updateRecipe(player: any, lv = undefined) {
    if (typeof lv == 'undefined') {
        const playerDataBase = new DynamicProperties('player');
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        if (!playerData?.country || playerData?.country < 1) {
            // @ts-ignore TS(2322): Type '0' is not assignable to type 'undefined'.
            lv = 0;
        } else {
            const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
            lv = playerCountryData.lv || 0;
        };
    };
    const detectLv = lv;
    //const nowLv = Number(player.getDynamicProperty('countryLv') ?? '0');
    player.runCommand(`recipe give @s *`);
    system.runTimeout(() => {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const allow = recipe_config.filter(a => a.lv <= detectLv)//&& a.lv > nowLv);
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
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