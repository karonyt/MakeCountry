import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../api/dyp";
import { resourcepointSelectDefaultForm } from "./resource_point_select";
import { isDecimalNumber } from "../../../../../lib/util";
import { CountryManager } from "../../../../../api/country/country";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * リソースポイントの入金フォーム
 * @param {Player} player 
 */
export function resourcepointDepositDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `resourcepoint.conversion` });
    form.textField({ rawtext: [{ translate: `conversion` }, { text: ` : ${playerData.money}` }] }, { translate: `input.number` });
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
        let hasMoney = playerData2.money;
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.money` });
            return;
        };
        countryData.resourcePoint += needMoney;
        playerData2.money -= needMoney;
        playerData2.money = Math.floor(playerData2.money * 100) / 100;
        countryData.money = Math.floor(countryData.money * 100) / 100;

        countryData.resourcePointLog ||= [];

        if (countryData.resourcePointLog.length > 50) {
            countryData.resourcePointLog.shift();
        }

        countryData.resourcePointLog.push({
            timestamp: Date.now(),
            actor: player.name,
            action: 'deposit',
            amount: needMoney,
            reason: 'treasurybudget.deposit'
        });

        const countryDataBase = new DynamicProperties('country');
        playerDataBase.set(`player_${player.id}`, playerData2);
        countryDataBase.set(`country_${playerData2.country}`, countryData);
        resourcepointSelectDefaultForm(player);
        return;
    });
};