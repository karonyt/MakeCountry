import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp.js";
import { CountryManager } from "../../../../api/country/country.js";
import { settingCountryInfoDefaultForm } from "./info.js";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * Web関連設定画面
 * @param {Player} player 
 */
export function webSettingDefaultForm(player: any) {
    const form = new ModalFormData();
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    form.title({ translate: `form.setting.info.button.web` });
    form.textField({ translate: `web.banner.textbox.label` }, { translate: `web.banner.textbox.input` }, { defaultValue: countryData.banner });
    form.textField({ translate: `web.color.textbox.label` }, { translate: `web.color.textbox.input` }, { defaultValue: countryData.colorcode });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        countryData.banner = rs.formValues[0];
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        countryData.colorcode = rs.formValues[1];
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};