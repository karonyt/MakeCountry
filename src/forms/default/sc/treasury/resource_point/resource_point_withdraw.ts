import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { CountryManager } from "../../../../../api/country/country.js";
import { ModalFormData } from "@minecraft/server-ui";
import { resourcepointSelectDefaultForm } from "./resource_point_select.js";
import { isDecimalNumber } from "../../../../../lib/util.js";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * リソースポイント→金フォーム
 * @param {Player} player 
 */
export function resourcepointWithdrawDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        let needMoney = Number(rs.formValues[0]);;
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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

        countryData.resourcePointLog ||= [];

        if (countryData.resourcePointLog.length > 50) {
            countryData.resourcePointLog.shift();
        }

        countryData.resourcePointLog.push({
            timestamp: Date.now(),
            actor: player.name,
            action: 'withdraw',
            amount: -needMoney,
            reason: 'treasurybudget.withdraw'
        });

        const countryDataBase = new DynamicProperties('country');
        playerDataBase.set(`player_${player.id}`, playerData2);
        countryDataBase.set(`country_${playerData.country}`, countryData);
        resourcepointSelectDefaultForm(player);
        return;
    });
};