import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
import config from "../../../../../../config";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util";
import { externalAffairsMainDefaultForm } from "../external_affairs_main";
import { sendMergeRequestFromListDefaultForm } from "./send_merge_request_from_list";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 併合申請を送信する国のリスト
 * @param {Player} player 
 */
export function sendMergeRequestListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    if (playerCountryData.days < config.mergeProtectionDuration) return;
    let mergeRequestSend = playerCountryData?.mergeRequestSend ?? [];
    const form = new ActionFormData();
    form.title({ translate: `form.merge.send.title` });
    let countryIds = countryDataBase.idList.filter(id => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter(id => {
        const filterCountryManager = new CountryManager(id.split('_')[1]);
        return !mergeRequestSend.includes(id) && filterCountryManager?.countryData?.days >= config.mergeProtectionDuration;
    });
    form.button({ translate: `mc.button.close` });
    let lands = [];
    for (const countryId of filtered1) {
        const countryManager = new CountryManager(countryId.split('_')[1]);
        if(!countryManager.isVaildProperty) continue;
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
                sendMergeRequestFromListDefaultForm(player, lands[rs.selection - 1]);
                break;
            };
        };
    });
};
