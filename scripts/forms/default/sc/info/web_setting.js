import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { settingCountryInfoDefaultForm } from "./info";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * Web関連設定画面
 * @param {Player} player 
 */
export function webSettingDefaultForm(player) {
    const form = new ModalFormData();
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
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
        countryData.banner = rs.formValues[0];
        countryData.colorcode = rs.formValues[1];
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};