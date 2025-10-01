import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { settingCountryDefaultForm } from "../setting_country";
import { memberSelectedShowDefaultForm } from "./member_selected_show";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 国民一覧
 * @param {Player} player 
 */
export function settingCountryMembersDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.members.title` });
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const members = [];
    for (const memberId of countryData.members) {
        /**
         * @type {PlayerData}
         */
        const memberData = JSON.parse(playerDataBase.get(`player_${memberId}`));
        if (!memberData.country || memberData.country != countryData.id) continue;
        members.push(memberData);
        form.button(`${memberData.name}\n${memberData.id}`)
    };
    //処理書け
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        memberSelectedShowDefaultForm(player, members[rs.selection], countryData);
        return;
    });
};
