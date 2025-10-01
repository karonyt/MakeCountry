import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { addFriendlyCountryFromListDefaultForm } from "./add_list";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../../api/country/country";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 友好申請送信チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkAddFriendlyDefaultForm(player, countryId) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.friendly.send.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            addFriendlyCountryFromListDefaultForm(player, countryId);
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

                countryManager.sendFriendlyRequest(countryId, player);
                return;
            };
        };
    });
};