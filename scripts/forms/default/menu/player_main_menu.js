import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { RewardBuff } from "../../../api/rewardbuff";
import { DynamicProperties } from "../../../api/dyp";
import config from "../../../config";
import { playerSettingDefaultForm } from "./setting/setting";
import { penNameMainDefaultForm } from "./pen_name/main";
import { joinTypeSelectDefaultForm } from "./join/join_type_select";
import { sendMoneyDefaultForm } from "./send_money/send_money";
import { showProfileDefaultForm } from "./profile/show_profile";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 */
export function playerMainMenuDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.mainmenu.title` });
    const rewardBuff = new RewardBuff();
    const jobsBuffs = rewardBuff.getAllBuffs();
    const keys = Object.keys(jobsBuffs);
    let body = `§b-JobsBuffList-§r\n`;
    for (const key of keys) {
        let buffLore = `[${key}]\n`
        for (const buff of jobsBuffs[key]) {
            buffLore += `§ax ${buff.multiplier} §e[${buff.remainingTime}s]§r\n`
        };
        body += buffLore;
    };
    form.body(body);
    form.button({ translate: `form.mainmenu.button.profile` });
    form.button({ translate: `form.mainmenu.button.sendmoney` });
    form.button({ translate: `form.mainmenu.button.join` });
    form.button({ translate: `form.mainmenu.button.setting` });
    form.button({ translate: `form.mainmenu.button.penname` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    playerMainMenuDefaultForm(player);
                }, 10);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                showProfileDefaultForm(player);
                break;
            };
            case 1: {
                sendMoneyDefaultForm(player);
                break;
            };
            case 2: {
                const playerDataBase = new DynamicProperties('player');
                /**
                 * @type {PlayerData}
                 */
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                if (playerData.country) {
                    player.sendMessage({ translate: `already.country.join` });
                    return;
                };
                joinTypeSelectDefaultForm(player);
                break;
            };
            case 3: {
                playerSettingDefaultForm(player);
                break;
            };
            case 4: {
                if (config.pennameEnable) {
                    penNameMainDefaultForm(player);
                    return;
                };
                break;
            };
        };
    });
};