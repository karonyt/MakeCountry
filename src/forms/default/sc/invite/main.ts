import { Player, world } from "@minecraft/server";
import { CheckPermission } from "../../../../lib/util.js";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp.js";
import { settingCountryDefaultForm } from "../setting_country.js";
import { serchInviteDefaultForm } from "./search.js";
import { sendInviteCheckDefaultForm } from "./check.js";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 招待を送れるプレイヤーのリスト
 * @param {Player} player 
 * @param {boolean} search 
 * @param {string} keyword 
 */
export function inviteMainDefaultForm(player: any, search = false, keyword = ``) {
    if (CheckPermission(player, `invite`)) {
        player.sendMessage({ translate: `send.invite.error.permission.message` });
        return;
    };
    const playerDataBase = new DynamicProperties('player');
    const form = new ActionFormData();
    let players = world.getPlayers().filter(p => {
        /**
         * @type {PlayerData}
         */
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerData = JSON.parse(playerDataBase.get(`player_${p.id}`));
        return !playerData?.country
    });
    players.filter(p => p.id !== player.id);
    form.title({ translate: `form.sendinvite.list.title` })
    form.button({ translate: `form.invite.button.serch` });
    if (search) {
        players = players.filter(p => p.name.includes(keyword));
    };
    players.forEach(p => {
        form.button(`${p.name}§r\n${p.id}`);
    });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                serchInviteDefaultForm(player, keyword);
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                sendInviteCheckDefaultForm(player, players[rs.selection - 1]);
                break;
            };
        };
    });
};