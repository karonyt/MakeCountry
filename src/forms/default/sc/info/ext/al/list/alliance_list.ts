import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../../api/country/country.js";
import { ActionFormData } from "@minecraft/server-ui";
import { AllianceMainDefaultForm } from "../main.js";
import { AddAllianceListDefaultForm } from "./add/add_list.js";
import { AllianceCountryFromListDefaultForm } from "./country/list.js";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 同盟国リストフォーム
 * @param {Player} player 
 */
export function AllianceListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const playerCountryData = countryManager.countryData;
    let allianceCountryIds = playerCountryData.alliance;
    const form = new ActionFormData();
    form.title({ translate: `form.alliance.list.title` });
    form.button({ translate: `form.check.alliance.send.title` });
    for (const countryId of allianceCountryIds) {
        const countryData = new CountryManager(countryId).countryData;
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            AllianceMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //追加フォーム
                AddAllianceListDefaultForm(player);
                break;
            };
            default: {
                //詳細表示＆選択肢
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                AllianceCountryFromListDefaultForm(player, allianceCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};
