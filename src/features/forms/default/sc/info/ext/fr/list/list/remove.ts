import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FriendlyCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/list/list.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 友好解除チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkFriendlyRemoveDefaultForm(player: any, countryId: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.friendly.remove.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.remove.friendly` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            FriendlyCountryFromListDefaultForm(player, countryId);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
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
                countryManager.removeFriendly(countryId, player);
                return;
            };
        };
    });
};