import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util.js";
import { externalAffairsMainDefaultForm } from "../main.js";
import { setAlliancePermissionDefaultForm } from "./set_permission.js";
import { AllianceListDefaultForm } from "./list/alliance_list.js";
/** */

/**
 * 同盟国メインフォーム
 * @param {Player} player 
 */
export function AllianceMainDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.alliance.main.title` });
    form.button({ translate: `alliance.permission.edit` });
    form.button({ translate: `form.alliance.list.title` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    setAlliancePermissionDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            //1 一覧フォーム
            case 1: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    //form
                    AllianceListDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};