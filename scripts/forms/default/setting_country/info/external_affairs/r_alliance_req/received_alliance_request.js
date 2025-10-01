import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util";
import { externalAffairsMainDefaultForm } from "../main";
import { allianceRequestCountryDefaultForm } from "./alliance_request_country";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 受信した同盟申請
 * @param {Player} player 
 */
export function ReceivedAllianceRequestDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    let receivedAllianceRequests = playerCountryData.allianceRequestReceive
    const form = new ActionFormData();
    form.title({ translate: `received.alliance.request` });
    form.button({ translate: `mc.button.close` });
    for (const countryId of receivedAllianceRequests) {
        const countryManager = new CountryManager(countryId);
        if(!countryManager.isVaildProperty) continue;
        const countryData = countryManager.countryData;
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
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
                allianceRequestCountryDefaultForm(player, receivedAllianceRequests[rs.selection - 1]);
                break;
            };
        };
    });
};