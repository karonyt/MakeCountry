import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../../api/country/country";
import { ReceivedFriendlyRequestDefaultForm } from "./received_friendly_request";
import { DynamicProperties } from "../../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 受信リストから選択した国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function friendlyRequestCountryDefaultForm(player, countryId) {
    try {
        const targetCountryManager = new CountryManager(countryId);
        const targetCountryData = targetCountryManager.countryData;

        const showBody = targetCountryManager.getCountryInfoRawText()

        const form = new ActionFormData();
        form.title(targetCountryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.approval` });
        form.button({ translate: `mc.button.delete` });
        form.show(player).then(rs => {
            if (CheckPermission(player, `allyAdmin`)) {
                player.sendMessage({ translate: `no.permission` });
                return;
            };
            if (rs.canceled) {
                ReceivedFriendlyRequestDefaultForm(player);
                return;
            };
            const playerDataBase = new DynamicProperties('player');
            /**
             * @type {PlayerData}
             */
            const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
            const countryManager = new CountryManager(playerData.country);
            switch (rs.selection) {
                case 0: {
                    //閉じる
                    break;
                };
                case 1: {
                    countryManager.acceptFriendlyRequest(countryId, player);
                    break;
                };
                case 2: {
                    countryManager.denyFriendlyRequest(countryId, player)
                    break;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};