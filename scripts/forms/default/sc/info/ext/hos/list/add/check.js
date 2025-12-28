import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { addHostilityCountryFromListDefaultForm } from "./add_list";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../../api/country/country";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 敵対追加チェックフォーム
 * @param {Player} player 
 * @param {number} countryId 
 */
export function checkAddHostilityDefaultForm(player, countryId) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.hostility.add.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.add` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `hostilityAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            addHostilityCountryFromListDefaultForm(player, countryId);
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
                countryManager.AddHostility(countryId, player);
                return;
            };
        };
    });
};
