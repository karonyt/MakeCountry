import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";
import { MergeRequestCountryDefaultForm } from "@/features/forms/default/sc/info/ext/r_mrg_req/merge_request_country.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 受信した併合申請
 * @param {Player} player 
 */
export function ReceivedMergeRequestDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    let receivedMergeRequests = playerCountryData.mergeRequestReceive ?? [];
    if (Date.now() - (playerCountryData?.lastInvated || 0) < 3 * 24 * 60 * 60 * 1000) {
        return;
    };
    const form = new ActionFormData();
    form.title({ translate: `received.merge.request` });
    form.button({ translate: `mc.button.close` });
    for (const countryId of receivedMergeRequests) {
        const countryManager = new CountryManager(countryId);
        if (!countryManager.isVaildProperty) continue;
        const countryData = countryManager.countryData;
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `hostilityAdmin`)) {
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
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                MergeRequestCountryDefaultForm(player, receivedMergeRequests[rs.selection - 1]);
                break;
            };
        };
    });
};

