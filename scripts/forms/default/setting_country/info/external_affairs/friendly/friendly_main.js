import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../lib/util";
import { externalAffairsMainDefaultForm } from "../external_affairs_main";
import { setFriendlyPermissionDefaultForm } from "./set_friendly_permission";
import { FriendlyListDefaultForm } from "./friendly_list/friendly_list";
/** */

/**
 * 友好国メインフォーム
 * @param {Player} player 
 */
export function FriendlyMainDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.friendly.main.title` });
    form.button({ translate: `friendly.permission.edit` });
    form.button({ translate: `form.friendly.list.title` });
    //ここに一覧ボタン
    //一覧フォームには追加ボタンも用意する
    form.show(player).then((rs) => {
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    //form
                    setFriendlyPermissionDefaultForm(player);
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
                    FriendlyListDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};