import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { penNameMainDefaultForm } from "./main.js";
import config from "../../../../config.js";

/**
 * 二つ名(後)設定
 * @param {Player} player 
 */
export function penNameAfterDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.penname.button.after` });
    let tags = player.getTags().filter((tag: any) => tag.startsWith(`mcPenNameAfter`));
    tags.unshift(`${config.initialPennameAfter}`);
    for (const penname of tags) {
        form.button(`${penname.replace(`mcPenNameAfter`, ``)}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            penNameMainDefaultForm(player);
            return;
        };
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        player.setDynamicProperty(`pennameAfter`, tags[rs.selection].replace(`mcPenNameAfter`, ``));
        player.sendMessage({ translate: `updated` });
    });
};
