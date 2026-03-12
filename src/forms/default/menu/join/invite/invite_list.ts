import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../api/country/country.js";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { joinTypeSelectDefaultForm } from "../join_type_select.js";
import { ActionFormData } from "@minecraft/server-ui";
import { joinCheckFromInviteDefaultForm } from "./check.js";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 */
export function countryInvitesListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    let playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countriesData: any = [];
    const form = new ActionFormData();
    for (const id of playerData?.invite) {
        const countryManager = new CountryManager(id);
        if (!countryManager.isVaildProperty) {
            playerData.invite = playerData?.invite.filter((i: any) => i != id);
            continue;
        };
        const countryData = countryManager.countryData;
        countriesData.push(countryData);
        form.button(`${countryData.name}\nID: ${countryData.id}`);

    };
    playerDataBase.set(`player_${player.id}`, playerData);
    if (countriesData.length === 0) {
        form.body({ translate: `no.invite.country` });
        form.button({ translate: `mc.button.close` });
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            joinTypeSelectDefaultForm(player);
            return;
        };
        if (countriesData.length === 0) {
            //閉じる
            return;
        };
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        joinCheckFromInviteDefaultForm(player, countriesData[rs.selection]);
        return;
    });
};
