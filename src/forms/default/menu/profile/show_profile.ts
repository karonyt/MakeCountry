import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp.js";
import { ActionFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu.js";
import { ensureMarriageData, getPlayerNameById, showMarriageMainForm } from "../../../../api/player/marriage.js";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * Show profile.
 * @param {Player} player
 */
export function showProfileDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    /**
     * @type {PlayerData}
     */
    // @ts-ignore
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    ensureMarriageData(playerData);
    const spouseName = playerData?.marriage?.spouseId ? getPlayerNameById(playerData.marriage.spouseId) : "None";

    const showProfile = [
        { translate: "msg.name" }, { text: `${playerData?.name}\n` },
        { translate: "msg.lv" }, { text: `${player.level}\n` },
        { translate: "msg.havemoney" }, { text: `${playerData?.money}\n` },
        { translate: "msg.days" }, { text: `${playerData?.days}\n` },
        { translate: "msg.country" }, { text: `${playerData?.country ?? "None"}\n` },
        { text: `Marriage: ${spouseName}\n` },
        { translate: "msg.invite" }, { text: `${playerData?.invite.length ?? "None"}\n` },
        { translate: "msg.havechunks" }, { text: `${playerData?.chunks.length}` }
    ];

    const form = new ActionFormData();
    form.title({ translate: "form.profile.title" });
    form.body({ rawtext: showProfile });
    form.button("Marriage");
    form.button({ translate: "mc.button.back" });
    form.button({ translate: "mc.button.close" });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            playerMainMenuDefaultForm(player);
            return;
        }
        switch (rs.selection) {
            case 0: {
                showMarriageMainForm(player);
                break;
            }
            case 1: {
                playerMainMenuDefaultForm(player);
                break;
            }
            case 2: {
                break;
            }
        }
    });
}
