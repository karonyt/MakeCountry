import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu";

/**
 * 
 * @param {Player} player 
 */
export function playerSettingDefaultForm(player) {
    const form = new ModalFormData();
    const uiTypes = [undefined, 'kingdoms', 'towny'];
    const index = uiTypes.indexOf(player.getDynamicProperty('uiType'));
    form.title({ translate: 'form.mainmenu.button.setting' });
    form.dropdown('UI Type', ['default', 'kingdoms', 'towny'], { defaultValueIndex: index });
    form.submitButton({ translate: 'mc.button.update' });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            playerMainMenuDefaultForm(player);
            return;
        };
        player.setDynamicProperty('uiType', uiTypes[rs.formValues[0]]);
        player.sendMessage({ translate: 'updated' });
    });
};
