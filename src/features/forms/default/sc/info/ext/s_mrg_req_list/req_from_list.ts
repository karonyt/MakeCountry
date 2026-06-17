import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { sendMergeRequestListDefaultForm } from "@/features/forms/default/sc/info/ext/s_mrg_req_list/send_req_list.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { checkSendMergeDefaultForm } from "@/features/forms/default/sc/info/ext/s_mrg_req_list/check.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 併合申請送信候補一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function sendMergeRequestFromListDefaultForm(player: any, countryId: any) {
    try {
        const playerDataBase = new DynamicProperties('player');
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerDataFirst = JSON.parse(playerDataBase.get(`player_${player.id}`));
        const playerCountryManagerFirst = new CountryManager(playerDataFirst.country);
        const playerCountryDataFirst = playerCountryManagerFirst.countryData;

        if (Date.now() - (playerCountryDataFirst?.lastInvated || 0) < 3 * 24 * 60 * 60 * 1000) {
            return;
        };

        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.divider();
        form.label({ translate: `form.merge.send.confirm.description` });
        form.divider();
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.send` });
        form.show(player).then(rs => {
            if (CheckPermission(player, `allyAdmin`)) {
                player.sendMessage({ translate: `no.permission` });
                return;
            };
            if (rs.canceled) {
                sendMergeRequestListDefaultForm(player);
                return;
            };
            /**
             * @type {PlayerData}
             */
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
            const playerCountryManager = new CountryManager(playerData.country);
            const playerCountryData = playerCountryManager.countryData;
            if (Date.now() - (playerCountryData?.lastInvated || 0) < 3 * 24 * 60 * 60 * 1000) {
                return;
            };
            switch (rs.selection) {
                case 0: {
                    return;
                };
                case 1: {
                    checkSendMergeDefaultForm(player, countryData.id);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
