import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp.js";
import { CountryManager } from "../../../../api/country/country.js";
import { settingCountryDefaultForm } from "../setting_country.js";
import { memberSelectedShowDefaultForm } from "./member_show.js";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 国民一覧
 * @param {Player} player 
 */
export function settingCountryMembersDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.members.title` });
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const members: any = [];
    for (const memberId of countryData.members) {
        /**
         * @type {PlayerData}
         */
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        memberSelectedShowDefaultForm(player, members[rs.selection], countryData);
        return;
    });
};
