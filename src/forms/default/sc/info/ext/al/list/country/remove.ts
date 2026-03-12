import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AllianceCountryFromListDefaultForm } from "./list.js";
import { DynamicProperties } from "../../../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../../../api/country/country.js";
import { CheckPermission } from "../../../../../../../../lib/util.js";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 同盟解除チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkAllianceRemoveDefaultForm(player: any, countryId: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.alliance.remove.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.remove.alliance` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            AllianceCountryFromListDefaultForm(player, countryId);
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
                countryManager.removeAlliance(countryId, player);
                return;
            };
        };
    });
};