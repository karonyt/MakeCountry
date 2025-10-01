import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プロフィールを表示
 * @param {Player} player 
 */
export function showProfileDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const showProfile = [
        { translate: `msg.name` }, { text: `${playerData?.name} §r\n` },
        { translate: `msg.lv` }, { text: `${player.level} §r\n` },
        { translate: `msg.havemoney` }, { text: `${playerData?.money} §r\n` },
        { translate: `msg.days` }, { text: `${playerData?.days} §r\n` },
        { translate: `msg.country` }, { text: `${playerData?.country ?? `None`} §r\n` },
        { translate: `msg.invite` }, { text: `${playerData?.invite.length ?? `None`} §r\n` },
        { translate: `msg.havechunks` }, { text: `${playerData?.chunks.length} §r` }
    ];
    const form = new ActionFormData();
    form.title({ translate: `form.profile.title` });
    form.body({ rawtext: showProfile })
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            playerMainMenuDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                playerMainMenuDefaultForm(player);
                break;
            };
            case 1: {
                break;
            };
        };
        return;
    });
};
