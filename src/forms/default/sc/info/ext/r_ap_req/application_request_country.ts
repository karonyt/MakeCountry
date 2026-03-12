import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../../api/country/country.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util.js";
import { ReceivedAllianceRequestDefaultForm } from "../r_al_req/received_alliance_request.js";
import { DynamicProperties } from "../../../../../../api/dyp.js";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 受信リストから選択した国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function applicationRequestCountryDefaultForm(player: any, countryId: any) {
    try {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;

        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
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
                ReceivedAllianceRequestDefaultForm(player);
                return;
            };
            const playerDataBase = new DynamicProperties('player');
            /**
             * @type {PlayerData}
             */
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
            const playerCountryManager = new CountryManager(playerData.country);
            switch (rs.selection) {
                case 0: {
                    //閉じる
                    break;
                };
                case 1: {
                    playerCountryManager.acceptApplicationRequest(countryId, player);
                    break;
                };
                case 2: {
                    playerCountryManager.denyApplicationRequest(countryId, player);
                    break;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};