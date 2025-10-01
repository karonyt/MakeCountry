import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util";
import { sendMergeRequestFromListDefaultForm } from "./req_from_list";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 併合申請送信チェックフォーム
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function checkSendMergeDefaultForm(player, countryId) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.merge.send.title` });
    form.body({ translate: 'form.check.merge.send.body' });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            sendMergeRequestFromListDefaultForm(player, countryId);
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
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                const playerCountryManager = new CountryManager(playerData.country);
                playerCountryManager.sendMergeRequest(countryId, player);
                return;
            };
        };
    });
};
