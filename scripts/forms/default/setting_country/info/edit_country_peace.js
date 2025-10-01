import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
/**@typedef {import("../../../../jsdoc/country").CountryData} CountryData */

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function editCountryPeaceDefaultForm(player, countryData) {
    const form = new ModalFormData();
    form.title({ translate: `form.editcountrypeace.title` });
    form.toggle({ translate: `form.editcountrypeace.label` }, {defaultValue: countryData.peace});
    form.submitButton({ translate: `mc.button.change` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        if (0 < countryData.peaceChangeCooltime) {
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `peace.cooltime` }, { text: ` (${countryData.peaceChangeCooltime})` }] });
            return;
        };
        const beforeValue = countryData.peace;
        let value = rs.formValues[0];
        if (rs.formValues[0] == beforeValue) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        const countryManager = new CountryManager(`country_${countryData.id}`);
        countryData = countryManager.countryData;
        countryData.peace = value;
        countryData.peaceChangeCooltime = config.peaceChangeCooltime;
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.peace` }, { text: `\n§r${beforeValue} ->§r ${value}` }] });
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${countryData.id}`, countryData);
        return;
    });
};
