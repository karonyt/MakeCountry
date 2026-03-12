import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { ModalFormData } from "@minecraft/server-ui";
import { treasurybudgetSelectDefaultForm } from "./treasury_budget_select.js";
import { isDecimalNumber } from "../../../../../lib/util.js";
import { CountryManager } from "../../../../../api/country/country.js";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * 国家予算の入金フォーム
 * @param {Player} player 
 */
export function treasurybudgetDepositDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `treasurybudget.deposit` });
    form.textField({ rawtext: [{ translate: `deposit` }, { text: `: ${playerData.money}` }] }, { translate: `input.number` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            treasurybudgetSelectDefaultForm(player);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        let needMoney = Number(rs.formValues[0]);
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        /**
         * @type {PlayerData}
         */
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerData2 = JSON.parse(playerDataBase.get(`player_${player.id}`));

        countryManager.reload();
        countryData = countryManager.countryData;
        let hasMoney = playerData2.money;
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.money` });
            return;
        };
        playerData2.money = (Math.floor(playerData2.money * 100) / 100) - needMoney;
        countryData.money = (Math.floor(countryData.money * 100) / 100) + needMoney;

        countryData.treasuryBudgetLog ||= [];

        if (countryData.treasuryBudgetLog.length > 50) {
            countryData.treasuryBudgetLog.shift();
        }

        countryData.treasuryBudgetLog.push({
            timestamp: Date.now(),
            actor: player.name,
            action: 'deposit',
            amount: needMoney,
            reason: 'treasurybudget.deposit'
        });

        const countryDataBase = new DynamicProperties('country');
        playerDataBase.set(`player_${player.id}`, playerData2);
        countryDataBase.set(`country_${playerData2.country}`, countryData);
        treasurybudgetSelectDefaultForm(player);
        return;
    });
};