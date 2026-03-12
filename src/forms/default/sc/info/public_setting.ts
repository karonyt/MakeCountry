import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp.js";
import { CountryManager } from "../../../../api/country/country.js";
import { settingCountryInfoDefaultForm } from "./info.js";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 公開設定画面
 * @param {Player} player 
 */
export function publicSettingDefaultForm(player: any) {
    const form = new ModalFormData();
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        countryData.hideMoney = rs.formValues[0];
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};
