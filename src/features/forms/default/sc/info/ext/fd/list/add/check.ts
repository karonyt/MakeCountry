import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { addFederationCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/add/add.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 連邦申請送信チェックフォーム
 * @param {Player} player 
 * @param {number} countryId 
 */
export function checkAddFederationDefaultForm(player: any, countryId: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.federation.join.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `federationPermission`) && CheckPermission(player, `federationAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            addFederationCountryFromListDefaultForm(player, countryId);
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

                countryManager.sendFederationRequest(countryId, player);
                FederationMainDefaultForm(player);
                return;
            };
        };
    });
};
