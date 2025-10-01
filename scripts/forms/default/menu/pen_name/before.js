import { ActionFormData } from "@minecraft/server-ui";
import { penNameMainDefaultForm } from "./main";
import { Player } from "@minecraft/server";
import config from "../../../../config";

/**
 * 二つ名(前)設定
 * @param {Player} player 
 */
export function penNameBeforeDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.penname.button.before` });
    let tags = player.getTags().filter(tag => tag.startsWith(`mcPenNameBefore`));
    tags.unshift(`${config.initialPennameBefore}`);
    for (const penname of tags) {
        form.button(`${penname.replace(`mcPenNameBefore`, ``)}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            penNameMainDefaultForm(player);
            return;
        };
        player.setDynamicProperty(`pennameBefore`, tags[rs.selection].replace(`mcPenNameBefore`, ``));
        player.sendMessage({ translate: `updated` });
    });
};
