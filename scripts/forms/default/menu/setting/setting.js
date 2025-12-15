import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu";
import national_tier_level from "../../../../national_tier_level";
import { PlayerManager } from "../../../../api/player/player";

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

    let settings = [
        {
            translate: 'special.fishing',
            dypKey: 'isSpecialFishing',
            lv: national_tier_level.releaseSpeciallFishing
        },
        {
            translate: 'streamer.settings',
            dypKey: 'isStreamerSettings',
            lv: 0
        },
    ];

    if (national_tier_level.enabled) {
        const playerManager = new PlayerManager(player.id);
        const countryData = playerManager.country;
        let lv = 0;
        if (countryData) lv = countryData.lv;
        settings = settings.filter(s => lv >= s.lv);
    };
    for (const setting of settings) {
        const isEnabled = player.getDynamicProperty(setting.dypKey) ?? false;
        form.toggle({ translate: setting.translate }, {
            defaultValue: isEnabled ? (isEnabled == 'true' ? true : false) : false
        });
    };
    form.submitButton({ translate: 'mc.button.update' });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            playerMainMenuDefaultForm(player);
            return;
        };
        player.setDynamicProperty('uiType', uiTypes[rs.formValues[0]]);
        player.setDynamicProperty('isSpecialFishing', `${rs.formValues[1]}`);
        for (let i = 0; i < settings.length; i++) {
            player.setDynamicProperty(settings[i].dypKey, `${rs.formValues[i + 2]}`);
        };
        player.sendMessage({ translate: 'updated' });
    });
};
