import { CommerceActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Player, world } from "@minecraft/server";
import { callPlayerMainMenuForm } from "@/features/forms/form-registry.js";
import { sendMoneyCheckDefaultForm } from "@/features/forms/default/menu/send_money/check.js";
import { searchSendMoneyDefaultForm } from "@/features/forms/default/menu/send_money/search.js";

/**
 * 金を送れるプレイヤーのリスト
 * @param {Player} player 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function sendMoneyDefaultForm(player: any, serch = false, keyword = ``) {
    const form = new ActionFormData();
    let players = world.getPlayers().filter(p => p.id != player.id);
    form.title({ translate: `form.sendmoney.list.title` });
    form.button({ translate: `form.sendmoney.button.serch` });
    if (serch) {
        players = players.filter(p => p.name.includes(keyword));
    };
    for (const p of players) {
        if (p.id === player.id) continue;
        form.button(`${p.name}§r\n${p.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            callPlayerMainMenuForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                searchSendMoneyDefaultForm(player, keyword);
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                sendMoneyCheckDefaultForm(player, players[rs.selection - 1]);
                break;
            };
        };
    });
};