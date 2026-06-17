import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionFormData } from "@minecraft/server-ui";
import { countryInvitesListDefaultForm } from "@/features/forms/default/menu/join/invite/invite_list.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function joinCheckFromInviteDefaultForm(player: any, countryData: any) {
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
