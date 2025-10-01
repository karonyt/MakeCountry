import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { HostilityMainDefaultForm } from "../hostility_main";
import { AddHostilityListDefaultForm } from "./add_hostility_list/add_hostility_list";
import { HostilityCountryFromListDefaultForm } from "./hostility_country_from_list/hostility_country_from_list";
/** @typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 敵対国リストフォーム
 * @param {Player} player 
 */
export function HostilityListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
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
                HostilityCountryFromListDefaultForm(player, hostilityCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};