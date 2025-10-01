import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp";
import { CountryManager } from "../../../../../api/country/country";
import { ModalFormData } from "@minecraft/server-ui";
import { resourcepointSelectDefaultForm } from "./resource_point_select";
import { isDecimalNumber } from "../../../../../lib/util";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * リソースポイント→金フォーム
 * @param {Player} player 
 */
export function resourcepointWithdrawDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `resourcepoint.withdraw` });
    form.textField({ rawtext: [{ translate: `withdraw` }, { text: ` : ${countryData.resourcePoint}` }] }, { translate: `input.number` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            resourcepointSelectDefaultForm(player);
            return;
        };
        let needMoney = Number(rs.formValues[0]);;
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        const playerData2 = JSON.parse(playerDataBase.get(`player_${player.id}`));
        countryManager.reload();
        countryData = countryManager.countryData;
        let hasMoney = countryData.resourcePoint;
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.resourcepoint` });
            return;
        };
        countryData.resourcePoint -= needMoney;
        playerData2.money += needMoney;
        playerData2.money = Math.floor(playerData2.money * 100) / 100;
        countryData.money = Math.floor(countryData.money * 100) / 100;
        const countryDataBase = new DynamicProperties('country');
        playerDataBase.set(`player_${player.id}`, playerData2);
        countryDataBase.set(`country_${playerData.country}`, countryData);
        resourcepointSelectDefaultForm(player);
        return;
    });
};