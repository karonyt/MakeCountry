import { Player, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import config from "../../../../config";
import { nameSet } from "../../../../lib/nameset";
/** @typedef {import("../../../../jsdoc/country").CountryData} CountryData */

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function editCountryNameDefaultForm(player, countryData) {
    const form = new ModalFormData();
    form.title({ translate: `form.editcountryname.title` });
    form.textField({ translate: `form.editcountryname.label` }, { translate: `form.editcountryname.input` }, {defaultValue: countryData.name});
    form.submitButton({ translate: `mc.button.change` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        let value = rs.formValues[0];
        if (value === ``) value === `Country`;
        const beforeName = countryData.name;
        countryData.name = value;
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.countryname` }, { text: `\n§r${beforeName} ->§r ${value}` }] });
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${countryData.id}`, countryData);
        const countryManager = new CountryManager(countryData.id);
        settingCountryInfoDefaultForm(player, countryManager.countryData);
        system.runTimeout(() => {
            if (config.countryNameDisplayOnPlayerNameTag) {
                const players = world.getPlayers();
                for (const p of players) {
                    nameSet(p);
                };
            };
        }, 2);
        return;
    });
};