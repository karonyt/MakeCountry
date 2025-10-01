import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu";
import { countryInvitesListDefaultForm } from "./invite/invite_list";
import { allowJoinCountriesListDefaultForm } from "./allow_list/allow_list";

/**
 * 国に参加するときの形式選択
 * @param {Player} player 
 */
export function joinTypeSelectDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.invite.title` });
    form.button({ translate: `form.invite.check.invite` });
    form.button({ translate: `form.invite.list.allowjoin` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    joinTypeSelectDefaultForm(player);
                }, 10);
                return;
            };
            playerMainMenuDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                countryInvitesListDefaultForm(player);
                break;
            };
            case 1: {
                allowJoinCountriesListDefaultForm(player);
                break;
            };
        };
    });
};