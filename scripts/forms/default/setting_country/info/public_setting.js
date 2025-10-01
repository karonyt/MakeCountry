import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { settingCountryInfoDefaultForm } from "./info";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 公開設定画面
 * @param {Player} player 
 */
export function publicSettingDefaultForm(player) {
    const form = new ModalFormData();
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    form.title({ translate: `form.setting.info.button.publicsetting` });
    form.toggle({ translate: `toggle.publicsetting.country.money` }, { defaultValue: countryData.hideMoney });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player, countryData);
            return;
        };
        countryData.hideMoney = rs.formValues[0];
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};
