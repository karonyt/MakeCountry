import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { CheckPermission } from "../../../lib/util";
import { Player, system } from "@minecraft/server";
import { treasuryMainDefaultForm } from "./treasury/treasury_main";
import { inviteMainDefaultForm } from "./invite/main";
import { settingCountryMembersDefaultForm } from "./members/setting_members";
import { settingCountryRoleDefaultForm } from "./role/setting_country_role";
import { settingCountryPlotGroupDefaultForm } from "./plot_group/setting_country_plot_group";
import { settingCountryInfoDefaultForm } from "./info/info";
import { countryDeleteCheckDefaultForm } from "./delete/delete";

/**
 * 
 * 国の設定
 * @param {Player} player 
 */
export function settingCountryDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.title` });
    form.body({ translate: `form.setting.body` });
    form.button({ translate: `form.setting.button.info` });
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
                treasuryMainDefaultForm(player);
                break;
            };
            case 2: {
                inviteMainDefaultForm(player);
                break;
            };
            case 3: {
                settingCountryMembersDefaultForm(player);
                break;
            };
            case 4: {
                settingCountryRoleDefaultForm(player);
                break;
            };
            case 5: {
                settingCountryPlotGroupDefaultForm(player);
                break;
            };
            case 6: {
                countryDeleteCheckDefaultForm(player);
                break;
            };
        };
    });
};