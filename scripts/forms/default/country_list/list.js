import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../api/dyp";
import { CountryManager } from "../../../api/country/country";
import { showCountryInfoDefaultForm } from "./show";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../jsdoc/country").CountryData} CountryData*/

/**
 * @param {Player} player 
 * @param {string|undefined} type 
 */
export function countryListDefaultForm(player, type = undefined) {
    const form = new ActionFormData();
    form.title({ translate: `form.countrylist.title` });
    const countryDataBase = new DynamicProperties('country');
    let countryIds
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = playerData?.country ? new CountryManager(playerData.country) : undefined;
    const playerCountryData = playerData?.country ? playerCountryManager.countryData : undefined;
    if (!type) countryIds = countryDataBase.idList;
    if (type == 'al') {
        countryIds = playerCountryData.alliance.map(alliance => `country_${alliance}`);
    } else if (type == 'fl') {
        countryIds = playerCountryData.friendly.map(friendly => `country_${friendly}`);
    }
    let countries = [];
    let amount = 0;
    for (const id of countryIds) {
        const rawCountryData = countryDataBase.get(id);
        if (rawCountryData) {
            /**
             * @type {CountryData}
             */
            const countryData = JSON.parse(rawCountryData);
            countries.push(countryData);
            form.button(`${countryData.name} \n§rID: ${countryData.id} Lv: ${countryData.lv ?? 0}`);
            amount++;
        };
    };
    if (amount == 0) {
        form.body({ translate: `no.countries.world` });
        form.button({ translate: `mc.button.close` });
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    countryListDefaultForm(player, al);
                    return;
                }, 10);
                return;
            };
            return;
        };
        if (amount == 0) {
            return;
        };
        showCountryInfoDefaultForm(player, countries[rs.selection], type);
    });
};