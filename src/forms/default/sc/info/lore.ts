import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info.js";
import { DynamicProperties } from "../../../../api/dyp.js";
import { CountryManager } from "../../../../api/country/country.js";
/** @typedef {import("../../../../jsdoc/country").CountryData} CountryData*/

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function editCountryLoreDefaultForm(player: any, countryData: any) {
    const form = new ModalFormData();
    form.title({ translate: `form.editcountrylore.title` });
    form.textField({ translate: `form.editcountrylore.label` }, { translate: `form.editcountrylore.input` }, { defaultValue: countryData.lore });
    form.submitButton({ translate: `mc.button.change` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        let value = rs.formValues[0];
        const countryManager = new CountryManager(countryData.id);
        countryData = countryManager.countryData;
        const beforeLore = countryData.lore;
        countryData.lore = value;
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.countrylore` }, { text: `\n§r${beforeLore} ->§r ${value}` }] });
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${countryData.id}`, countryData);
        settingCountryInfoDefaultForm(player, countryData);
        return;
    });
};