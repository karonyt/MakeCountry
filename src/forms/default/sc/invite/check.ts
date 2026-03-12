import { ActionFormData } from "@minecraft/server-ui";
import { inviteMainDefaultForm } from "./main.js";
import { CountryManager } from "../../../../api/country/country.js";
import { DynamicProperties } from "../../../../api/dyp.js";
import { Player } from "@minecraft/server";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 招待チェックフォーム
 * @param {Player} sendPlayer 
 * @param {PlayerData} receivePlayer 
 */
export function sendInviteCheckDefaultForm(sendPlayer: any, receivePlayer: any) {
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
                // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                const playerData = JSON.parse(playerDataBase.get(`player_${sendPlayer.id}`))
                const countryManager = new CountryManager(playerData.country);
                countryManager.invite(receivePlayer.id, sendPlayer)
                break;
            };
        };
    });
};
