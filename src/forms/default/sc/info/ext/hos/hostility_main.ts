import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { externalAffairsMainDefaultForm } from "../main.js";
import { CheckPermission } from "../../../../../../lib/util.js";
import { setHostilityPermissionDefaultForm } from "./set_hostility_permission.js";
import { HostilityListDefaultForm } from "./list/hostility_list.js";

/**
 * 敵対国メインフォーム
 * @param {Player} player 
 */
export function HostilityMainDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.hostility.main.title` });
    form.button({ translate: `hostility.permission.edit` });
    form.button({ translate: `form.hostility.list.title` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    setHostilityPermissionDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 1: {
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    HostilityListDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};
