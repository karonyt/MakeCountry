import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../../api/country/country.js";
import { ActionFormData } from "@minecraft/server-ui";
import { HostilityMainDefaultForm } from "../hostility_main.js";
import { AddHostilityListDefaultForm } from "./add/list.js";
import { HostilityCountryFromListDefaultForm } from "./list/list.js";
/** @typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 敵対国リストフォーム
 * @param {Player} player 
 */
export function HostilityListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const playerCountryData = countryManager.countryData;
    let hostilityCountryIds = playerCountryData.hostility;
    const form = new ActionFormData();
    form.title({ translate: `form.hostility.list.title` });
    form.button({ translate: `form.hostility.list.button.add` });
    for (const countryId of hostilityCountryIds) {
        const countryData = new CountryManager(countryId).countryData;
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            HostilityMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                AddHostilityListDefaultForm(player);
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                HostilityCountryFromListDefaultForm(player, hostilityCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};