import { ActionFormData } from "@minecraft/server-ui";
import { penNameMainDefaultForm } from "./main.js";
import { Player } from "@minecraft/server";
import config from "../../../../config.js";

/**
 * 二つ名(前)設定
 * @param {Player} player 
 */
export function penNameBeforeDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.penname.button.before` });
    let tags = player.getTags().filter((tag: any) => tag.startsWith(`mcPenNameBefore`));
    tags.unshift(`${config.initialPennameBefore}`);
    for (const penname of tags) {
        form.button(`${penname.replace(`mcPenNameBefore`, ``)}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            penNameMainDefaultForm(player);
            return;
        };
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        player.setDynamicProperty(`pennameBefore`, tags[rs.selection].replace(`mcPenNameBefore`, ``));
        player.sendMessage({ translate: `updated` });
    });
};
