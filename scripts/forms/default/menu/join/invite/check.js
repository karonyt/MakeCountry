import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../api/country/country";
import { DynamicProperties } from "../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { countryInvitesListDefaultForm } from "./invite_list";
/**@typedef {import("../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function joinCheckFromInviteDefaultForm(player, countryData) {
    try {
        const countryManager = new CountryManager(countryData.id);
        const showBody = countryManager.getCountryInfoRawText();
        /**
         * @type {PlayerData}
         */
        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.join` });
        form.button({ translate: `mc.button.close` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                countryInvitesListDefaultForm(player);
                return;
            };
            switch (rs.selection) {
                case 0: {
                    countryManager.memberManager.add(player);
                    return;
                };
                case 1: {
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
