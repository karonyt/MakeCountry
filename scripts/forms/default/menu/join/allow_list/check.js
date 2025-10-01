import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { allowJoinCountriesListDefaultForm } from "./allow_list";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../jsdoc/country").CountryData} CountryData*/

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function joinCheckFromListDefaultForm(player, countryData) {
    try {
        const countryManager = new CountryManager(countryData.id);
        const showBody = countryManager.getCountryInfoRawText();
        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.join` });
        form.button({ translate: `mc.button.close` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                allowJoinCountriesListDefaultForm(player);
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