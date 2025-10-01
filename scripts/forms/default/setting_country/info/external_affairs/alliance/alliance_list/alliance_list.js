import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { AllianceMainDefaultForm } from "../alliance_main";
import { AddAllianceListDefaultForm } from "./add_alliance/add_alliance_list";
import { AllianceCountryFromListDefaultForm } from "./alliance_country_from_list/alliance_country_from_list";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 同盟国リストフォーム
 * @param {Player} player 
 */
export function AllianceListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
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
                AllianceCountryFromListDefaultForm(player, allianceCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};
