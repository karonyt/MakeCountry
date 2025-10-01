import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FriendlyCountryFromListDefaultForm } from "./list";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../../api/country/country";
import { CheckPermission } from "../../../../../../../../lib/util";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 友好解除チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkFriendlyRemoveDefaultForm(player, countryId) {
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
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                const countryManager = new CountryManager(playerData.country);
                countryManager.removeFriendly(countryId, player);
                return;
            };
        };
    });
};