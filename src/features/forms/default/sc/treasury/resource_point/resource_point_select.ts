import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { treasuryMainDefaultForm } from "@/features/forms/default/sc/treasury/treasury_main.js";
import { resourcepointDepositDefaultForm } from "@/features/forms/default/sc/treasury/resource_point/resource_point_deposit.js";
import { resourcepointWithdrawDefaultForm } from "@/features/forms/default/sc/treasury/resource_point/resource_point_withdraw.js";
import config from "@/config/server.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 
 * リソースポイントのメインフォーム
 * @param {Player} player 
 */
export function resourcepointSelectDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const resourcePointLog = countryData?.resourcePointLog || [];
    let logLabelText = [];

    for (const log of resourcePointLog) {
        const date = new Date(log.timestamp);
        const time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} `
            + `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

        const sign = log.amount >= 0 ? '§a+' : '§c';
        const reason = log.reason ? `（${log.reason}）` : '';

        logLabelText.unshift({ text: `[${time}] \n${log.actor} : ${log.action.toUpperCase()} \n${sign}${log.amount} §r(` }, { translate: `${reason}` }, { text: ')\n' });
    }
    const form = new ActionFormData();
    form.title({ translate: `resourcepoint` });
    form.body({ rawtext: [{ translate: `resourcepoint` }, { text: `${config.MoneyName} ${countryData.resourcePoint}` }] });
    form.divider();
    form.label({ translate: 'resource.point.log' });
    if (logLabelText.length != 0) form.label({rawtext: logLabelText});
    form.button({ translate: `conversion` });
    if (!CheckPermission(player, `withDrawResourcepoint`)) form.button({ translate: `withdraw` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            treasuryMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                resourcepointDepositDefaultForm(player);
                break;
            };
            case 1: {
                resourcepointWithdrawDefaultForm(player);
                break;
            };
        };
    });
};