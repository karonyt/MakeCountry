import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FederationCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/country/list.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 連邦解除チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkFederationRemoveDefaultForm(player: any, countryId: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.federation.remove.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.remove.federation` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationCountryFromListDefaultForm(player, countryId);
            return;
        };
        switch (rs.selection) {
            case 0: {
                return;
            };
            case 1: {
                const playerDataBase = new DynamicProperties('player');
                /**
                 * @type {PlayerData}
                 */
                // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                const countryManager = new CountryManager(playerData.country);
                if (Number(countryId) === Number(playerData.country)) {
                    countryManager.leaveFederation(player);
                    return;
                }
                if (canManageFederation(player, countryManager.countryData)) {
                    countryManager.removeFederation(countryId, player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                return;
            };
        };
    });
};
