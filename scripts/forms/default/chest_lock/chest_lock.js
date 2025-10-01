import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../api/dyp";

/**
 * 
 * @param {Player} player 
 * @param {string} id 
 */
export function chestLockDefaultForm(player, id) {
    const chestDataBase = new DynamicProperties('chest');

    const form = new ActionFormData();
    form.title({ translate: `form.chestlock.title` });
    const rawChestData = chestDataBase.get(id);
    /**
     * @type {{id: string,player: id}}
     */
    let chestData = rawChestData ? JSON.parse(rawChestData) : undefined;
    let lock = true;
    if (chestData) {
        form.button({ translate: `form.button.chestlock.disabled` });
        lock = false;
    } else {
        form.button({ translate: `form.button.chestlock.enabled` });
        chestData = { id: id, player: player.id };
        lock = true;
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (lock) {
                    chestDataBase.set(id, chestData);
                } else {
                    chestDataBase.delete(id);
                };
                player.sendMessage({ translate: `updated` });
                break;
            };
        };
    });
};