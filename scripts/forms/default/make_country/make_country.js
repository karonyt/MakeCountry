import { Player, system } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import config from "../../../config";
import { MakeCountry } from "../../../lib/land";
import { country } from "../../../api/api";

/**
 * @param {Player} player 
 */
export function MakeCountryDefaultForm(player) {
    const form = new ModalFormData();
    form.title({ translate: `form.makecountry.title` });
    form.textField({ translate: `form.makecountry.name.label` }, { translate: `form.makecountry.name.input` });
    form.toggle({ translate: `form.makecountry.invite` }, { defaultValue: true });
    //form.toggle({ translate: `form.makecountry.peace` }, { defaultValue: config.defaultPeace });
    form.submitButton({ translate: `form.makecountry.submit` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    MakeCountryDefaultForm(player);
                    return;
                }, 10);
                return;
            };
            player.sendMessage({ translate: `form.cancel.message` });
            return;
        };
        if (rs.formValues) {
            const eventData = { player, countryName: rs.formValues[0], invite: rs.formValues[1], peace: rs.formValues[2], type: 'player', cancel: false };
            const isCanceled = country.beforeEvents.create.emit(eventData);
            if (isCanceled) return;
            MakeCountry(player, 'player', rs.formValues[0], rs.formValues[1], true); //rs.formValues[2]);
            return;
        };
    });
};