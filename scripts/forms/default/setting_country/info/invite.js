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
export function editCountryInviteDefaultForm(player, countryData) {
    const form = new ModalFormData();
    form.title({ translate: `form.editcountryinvite.title` });
    form.toggle({ translate: `form.editcountryinvite.label` }, { defaultValue: countryData.invite });
    form.submitButton({ translate: `mc.button.change` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        const countryManager = new CountryManager(countryData.id);
        countryData = countryManager.countryData;
        const beforeValue = countryData.invite;
        let value = rs.formValues[0];
        countryData.invite = value;
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.invite` }, { text: `\n§r${beforeValue} ->§r ${value}` }] });
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${countryData.id}`, countryData);
        return;
    });
};