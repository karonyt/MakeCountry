import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { RewardBuff } from "../../../api/rewardbuff.js";
import { DynamicProperties } from "../../../api/dyp.js";
import config from "../../../config.js";
import { playerSettingDefaultForm } from "./setting/setting.js";
import { penNameMainDefaultForm } from "./pen_name/main.js";
import { joinTypeSelectDefaultForm } from "./join/join_type_select.js";
import { sendMoneyDefaultForm } from "./send_money/send_money.js";
import { showProfileDefaultForm } from "./profile/show_profile.js";
import { TimeManager } from "../../../api/time/time.js";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 */
export function playerMainMenuDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.mainmenu.title` });
    const rewardBuff = new RewardBuff();
    const jobsBuffs = rewardBuff.getAllBuffs();
    const keys = Object.keys(jobsBuffs);
    let body = `§b-JobsBuffList-§r\n`;
    for (const key of keys) {
        let buffLore = `[${key}]\n`
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        for (const buff of jobsBuffs[key]) {
            buffLore += `§ax ${buff.multiplier} §e[${buff.remainingTime}s]§r\n`
        };
        body += buffLore;
    };

    const timeManager = new TimeManager(1000);
    const date = timeManager.getCalendar();
    form.body(body);
    form.divider();
    form.label({
        rawtext: [{ text: `` }, { translate: 'day.year', with: [`${date.year}`] }, { text: `` }, { translate: 'day.month', with: [`${date.month}`] }, { text: `` }, { translate: 'day.day', with: [`${date.day}`] }, { text: '(' }, { translate: `day.${date.weekday}` }, { text: `) - ` }, { translate: `day.${date.season}` },
        { text: `\n${date.hours}:${date.minutes < 10 ? '0' : ''}${date.minutes} - ` }, { translate: `day.${date.period}` }]
    });
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
                // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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