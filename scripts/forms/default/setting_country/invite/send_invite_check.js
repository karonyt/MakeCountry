import { ActionFormData } from "@minecraft/server-ui";
import { inviteMainDefaultForm } from "./invite_main";
import { CountryManager } from "../../../../api/country/country";
import { DynamicProperties } from "../../../../api/dyp";
import { Player } from "@minecraft/server";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 招待チェックフォーム
 * @param {Player} sendPlayer 
 * @param {PlayerData} receivePlayer 
 */
export function sendInviteCheckDefaultForm(sendPlayer, receivePlayer) {
    const form = new ActionFormData();
    form.title({ translate: `form.sendinvite.check.title` });
    form.body({ translate: `form.sendinvite.check.body`, with: [receivePlayer.name] });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(sendPlayer).then(rs => {
        if (rs.canceled) {
            inviteMainDefaultForm(sendPlayer);
            return;
        };
        switch (rs.selection) {
            case 0: {
                break;
            };
            case 1: {
                const playerDataBase = new DynamicProperties('player');
                /**
                 * @type {PlayerData}
                 */
                const playerData = JSON.parse(playerDataBase.get(`player_${sendPlayer.id}`))
                const countryManager = new CountryManager(playerData.country);
                countryManager.invite(receivePlayer.id, sendPlayer)
                break;
            };
        };
    });
};
