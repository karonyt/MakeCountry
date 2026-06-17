import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionForm } from "@/shared/ui/form-class.js";
import { joinTypeSelectDefaultForm } from "@/features/forms/default/menu/join/join_type_select.js";
import { joinCheckFromListDefaultForm } from "@/features/forms/default/menu/join/allow_list/check.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

/**
 * 
 * @param {Player} player 
 */
export function allowJoinCountriesListDefaultForm(player: any) {
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {Array<CountryData>}
     */
    const countriesData: any = [];
    const form = new ActionForm();
    for (const id of countryDataBase.idList) {
        const rawD = countryDataBase.get(id);
        if (!rawD) continue;
        /**
         * @type {CountryData}
         */
        const d = JSON.parse(rawD);
        if (!d.invite) {
            countriesData.push(d)
            form.button(`${d.name}\nID: ${d.id}`);
        };
    };
    if (countriesData.length === 0) {
        form.body({ translate: `no.allowjoin.country` })
        form.button({ translate: `mc.button.close` });
    };
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            joinTypeSelectDefaultForm(player);
            return;
        };
        if (countriesData.length === 0) {
            //閉じる
            return;
        };
        joinCheckFromListDefaultForm(player, countriesData[rs.selection]);
        return;
    });
};
