import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp";
import { CountryManager } from "../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../lib/util";
import { treasuryMainDefaultForm } from "../treasury_main";
import { resourcepointDepositDefaultForm } from "./resource_point_deposit";
import { resourcepointWithdrawDefaultForm } from "./resource_point_withdraw";
import config from "../../../../../config";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * リソースポイントのメインフォーム
 * @param {Player} player 
 */
export function resourcepointSelectDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const form = new ActionFormData();
    form.title({ translate: `resourcepoint` });
    form.body({ rawtext: [{ translate: `resourcepoint` }, { text: `${config.MoneyName} ${countryData.resourcePoint}` }] });
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