import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { inviteMainDefaultForm } from "./invite_main";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 
 * @param {Player} player 
 * @param {string} keyword 
 */
export function serchInviteDefaultForm(player, keyword) {
    const form = new ModalFormData();
    form.title({ translate: `form.serchinvite.title` });
    form.textField({ translate: `form.serchinvite.word.label` }, { translate: `form.serchinvite.word.input` }, { defaultValue: keyword });
    form.submitButton({ translate: `mc.button.serch` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            inviteMainDefaultForm(player);
            return;
        };
        inviteMainDefaultForm(player, true, rs.formValues[0]);
        return;
    });
};