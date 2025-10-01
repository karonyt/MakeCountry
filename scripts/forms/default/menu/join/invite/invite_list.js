import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../api/country/country";
import { DynamicProperties } from "../../../../../api/dyp";
import { joinTypeSelectDefaultForm } from "../join_type_select";
import { ActionFormData } from "@minecraft/server-ui";
import { joinCheckFromInviteDefaultForm } from "./check";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 */
export function countryInvitesListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    let playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countriesData = [];
    const form = new ActionFormData();
    for (const id of playerData?.invite) {
        const countryManager = new CountryManager(id);
        if (!countryManager.isVaildProperty) {
            playerData.invite = playerData?.invite.filter(i => i != id);
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
        joinCheckFromInviteDefaultForm(player, countriesData[rs.selection]);
        return;
    });
};
