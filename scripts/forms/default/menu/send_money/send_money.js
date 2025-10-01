import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu";
import { sendMoneyCheckDefaultForm } from "./check";
import { searchSendMoneyDefaultForm } from "./search";

/**
 * 金を送れるプレイヤーのリスト
 * @param {Player} player 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function sendMoneyDefaultForm(player, serch = false, keyword = ``) {
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
            playerMainMenuDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                searchSendMoneyDefaultForm(player, keyword);
                break;
            };
            default: {
                sendMoneyCheckDefaultForm(player, players[rs.selection - 1]);
                break;
            };
        };
    });
};