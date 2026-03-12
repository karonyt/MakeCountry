import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../api/country/country.js";
import config from "../../../../../../config.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util.js";
import { externalAffairsMainDefaultForm } from "../main.js";
import { sendMergeRequestFromListDefaultForm } from "./req_from_list.js";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 併合申請を送信する国のリスト
 * @param {Player} player 
 */
export function sendMergeRequestListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    if (playerCountryData.days < config.mergeProtectionDuration) return;
    if (Date.now() - (playerCountryData?.lastInvated || 0) < 3 * 24 * 60 * 60 * 1000) {
        return;
    };
    let mergeRequestSend = playerCountryData?.mergeRequestSend ?? [];
    const form = new ActionFormData();
    form.title({ translate: `form.merge.send.title` });
    let countryIds = countryDataBase.idList.filter((id: any) => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter((id: any) => {
        const filterCountryManager = new CountryManager(id.split('_')[1]);
        return !mergeRequestSend.includes(id) && filterCountryManager?.countryData?.days >= config.mergeProtectionDuration;
    });
    form.button({ translate: `mc.button.close` });
    let lands: any = [];
    for (const countryId of filtered1) {
        const countryManager = new CountryManager(countryId.split('_')[1]);
        if (!countryManager.isVaildProperty) continue;
        const countryData = countryManager.countryData;
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                sendMergeRequestFromListDefaultForm(player, lands[rs.selection - 1]);
                break;
            };
        };
    });
};
