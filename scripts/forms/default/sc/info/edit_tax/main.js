import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../api/dyp";
import { CountryManager } from "../../../../../api/country/country";
import { settingCountryInfoDefaultForm } from "../info";
import { CheckPermission, isDecimalNumberZeroOK } from "../../../../../lib/util";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 税金管理メインフォーム
 * @param {Player} player 
 */
export function editTaxMainDefaultForm(player) {
    const form = new ModalFormData();
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');

    /**
     * @type {PlayerData}
     */
    const lastPlayerData = JSON.parse(playerDataBase.get(`player_${player.id}`))
    const countryManager = new CountryManager(lastPlayerData.country);
    const lastountryData = countryManager.countryData;
    let taxMessageLabel = `label.input.taxnum`;
    if (lastountryData.taxInstitutionIsPer) taxMessageLabel = `label.input.taxper`;
    form.title({ translate: `form.setting.info.button.tax` })
    form.toggle({ translate: `tax.select.toggle.label` }, { defaultValue: lastountryData.taxInstitutionIsPer });
    form.textField({ translate: taxMessageLabel }, { translate: `input.number` }, { defaultValue: `${lastountryData.taxPer}` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player);
            return;
        };
        const cancel = CheckPermission(player, `taxAdmin`);
        if (cancel) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        let value = rs.formValues[1];
        if (!isDecimalNumberZeroOK(value)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        if (100 < Number(rs.formValues[1]) && rs.formValues[0] == true) {
            player.sendMessage({ translate: `input.error.over100` });
            return;
        };
        if (Number(rs.formValues[1]) < 0) {
            player.sendMessage({ translate: `input.error.under0` });
            return;
        };
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        countryManager.reload();
        const countryData = countryManager.countryData;
        countryData.taxInstitutionIsPer = rs.formValues[0];
        countryData.taxPer = Number(rs.formValues[1]);
        countryDataBase.set(`country_${countryData.id}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};
