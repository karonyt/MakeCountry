import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp";
import { CountryManager } from "../../../../../api/country/country";
import { ModalFormData } from "@minecraft/server-ui";
import { treasurybudgetSelectDefaultForm } from "./treasury_budget_select";
import { isDecimalNumber } from "../../../../../lib/util";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * 国家予算の出金フォーム
 * @param {Player} player 
 */
export function treasurybudgetWithdrawDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `treasurybudget.withdraw` });
    form.textField({ rawtext: [{ translate: `withdraw` }, { text: `: ${countryData.money}` }] }, { translate: `input.number` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            treasurybudgetSelectDefaultForm(player);
            return;
        };
        let needMoney = Number(rs.formValues[0]);;
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        /**
         * @type {PlayerData}
         */
        const playerData2 = JSON.parse(playerDataBase.get(`player_${player.id}`));
        countryManager.reload();
        countryData = countryManager.countryData;
        let hasMoney = countryData.money;
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.treasurybudget` });
            return;
        };
        playerData2.money = (Math.floor(playerData2.money * 100) / 100) + needMoney;
        countryData.money = (Math.floor(countryData.money * 100) / 100) - needMoney;

        countryData.treasuryBudgetLog ||= [];

        if (countryData.treasuryBudgetLog.length > 50) {
            countryData.treasuryBudgetLog.shift();
        }

        countryData.treasuryBudgetLog.push({
            timestamp: Date.now(),
            actor: player.name,
            action: 'withdraw',
            amount: -needMoney,
            reason: 'treasurybudget.withdraw'
        });

        const countryDataBase = new DynamicProperties('country');
        playerDataBase.set(`player_${player.id}`, playerData2);
        countryDataBase.set(`country_${playerData2.country}`, countryData);
        treasurybudgetSelectDefaultForm(player);
        return;
    });
};