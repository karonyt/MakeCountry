import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import config from "../../../../config.js";
import { playerMainMenuDefaultForm } from "../player_main_menu.js";
import { penNameBeforeDefaultForm } from "./before.js";
import { penNameAfterDefaultForm } from "./after.js";

/**
 * 二つ名メインフォーム
 * @param {Player} player 
 */
export function penNameMainDefaultForm(player: any) {
    const form = new ActionFormData();
    let penNameBefore = player.getDynamicProperty(`pennameBefore`) || config.initialPennameBefore;
    let penNameAfter = player.getDynamicProperty(`pennameAfter`) || config.initialPennameAfter;
    form.body(`${penNameBefore}${penNameAfter}`);
    form.button({ rawtext: [{ translate: `form.penname.button.before` }, { text: `\n${penNameBefore}` }] });
    form.button({ rawtext: [{ translate: `form.penname.button.after` }, { text: `\n${penNameAfter}` }] });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            playerMainMenuDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                penNameBeforeDefaultForm(player);
                break;
            };
            case 1: {
                penNameAfterDefaultForm(player);
                break;
            };
        };
    });
};
