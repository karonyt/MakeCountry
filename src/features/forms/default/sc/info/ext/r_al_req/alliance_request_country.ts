import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ReceivedAllianceRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_al_req/received_alliance_request.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 受信リストから選択した国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function allianceRequestCountryDefaultForm(player: any, countryId: any) {
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
                ReceivedAllianceRequestDefaultForm(player);
                return;
            };
            const playerDataBase = new DynamicProperties('player');
            /**
             * @type {PlayerData}
             */
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
            const countryManager = new CountryManager(playerData.country);
            switch (rs.selection) {
                case 0: {
                    //閉じる
                    break;
                };
                case 1: {
                    countryManager.acceptAllianceRequest(countryId, player);
                    break;
                };
                case 2: {
                    countryManager.denyAllianceRequest(countryId, player)
                    break;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};