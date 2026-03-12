import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { CheckPermission } from "../../../lib/util.js";
import { Player, system } from "@minecraft/server";
import { treasuryMainDefaultForm } from "./treasury/treasury_main.js";
import { inviteMainDefaultForm } from "./invite/main.js";
import { settingCountryMembersDefaultForm } from "./members/setting_members.js";
import { settingCountryRoleDefaultForm } from "./role/main.js";
import { settingCountryPlotGroupDefaultForm } from "./plot_group/main.js";
import { settingCountryInfoDefaultForm } from "./info/info.js";
import { countryDeleteCheckDefaultForm } from "./del/main.js";
import { nationalTierLevelDefaultForm } from "./ntlv/ntlv.js";
import national_tier_level from "../../../national_tier_level.js";

/**
 * 
 * 国の設定
 * @param {Player} player 
 */
export function settingCountryDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.title` });
    form.body({ translate: `form.setting.body` });
    form.button({ translate: `form.setting.button.info` });
    form.button({ translate: `national.tier.level` });
    form.button({ translate: `form.setting.button.treasury` });
    form.button({ translate: `form.setting.button.invite` });
    form.button({ translate: `form.setting.button.members` });
    form.button({ translate: `form.setting.button.role` });
    form.button({ translate: `form.setting.button.plotgroup` });
    if (!CheckPermission(player, `owner`)) form.button({ translate: `form.setting.button.delete` });

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    settingCountryDefaultForm(player);
                    return;
                }, 10);
                return;
            };
            //player.sendMessage({ translate: `form.cancel.message` });
            return;
        };
        switch (rs.selection) {
            case 0: {
                settingCountryInfoDefaultForm(player);
                break;
            };
            case 1: {
                if(!national_tier_level.enabled) {
                    player.sendMessage({translate: 'national.tier.level.novalidity'});
                    return;
                }
                nationalTierLevelDefaultForm(player);
                break;
            };
            case 2: {
                treasuryMainDefaultForm(player);
                break;
            };
            case 3: {
                inviteMainDefaultForm(player);
                break;
            };
            case 4: {
                settingCountryMembersDefaultForm(player);
                break;
            };
            case 5: {
                settingCountryRoleDefaultForm(player);
                break;
            };
            case 6: {
                settingCountryPlotGroupDefaultForm(player);
                break;
            };
            case 7: {
                countryDeleteCheckDefaultForm(player);
                break;
            };
        };
    });
};