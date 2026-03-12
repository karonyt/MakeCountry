import { Player, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info.js";
import { DynamicProperties } from "../../../../api/dyp.js";
import { CountryManager } from "../../../../api/country/country.js";
import config from "../../../../config.js";
import { nameSet } from "../../../../lib/nameset.js";
/** @typedef {import("../../../../jsdoc/country").CountryData} CountryData */

/**
 * 
 * @param {Player} player 
 * @param {CountryData} countryData 
 */
export function editCountryNameDefaultForm(player: any, countryData: any) {
    const form = new ModalFormData();
    form.title({ translate: `form.editcountryname.title` });
    form.textField({ translate: `form.editcountryname.label` }, { translate: `form.editcountryname.input` }, {defaultValue: countryData.name});
    form.submitButton({ translate: `mc.button.change` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        let value = rs.formValues[0];
        // @ts-ignore TS(2367): This condition will always return 'false' since th... Remove this comment to see the full error message
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