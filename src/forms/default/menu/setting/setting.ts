import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu.js";
import national_tier_level from "../../../../national_tier_level.js";
import { PlayerManager } from "../../../../api/player/player.js";
import { playerChatMuteMenuForm } from "./chat_mute.js";

/**
 * 
 * @param {Player} player 
 */
export function playerSettingDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: 'form.mainmenu.button.setting' });
    form.body("設定したい項目を選んでください");
    form.button("基本設定");
    form.button("個別チャットミュート");
    form.button("メインメニューに戻る");

    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    playerSettingDefaultForm(player);
                }, 10);
            }
            return;
        }

        switch (rs.selection) {
            case 0:
                playerBasicSettingDefaultForm(player);
                break;
            case 1:
                playerChatMuteMenuForm(player);
                break;
            default:
                playerMainMenuDefaultForm(player);
                break;
        }
    });
};

function playerBasicSettingDefaultForm(player: any) {
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
        {
            translate: 'mute.killlog',
            dypKey: 'isMuteKillLog',
            lv: 0
        },
        {
            translate: 'mute.generalchat',
            dypKey: 'isMuteGeneralChat',
            lv: 0
        },
        {
            translate: 'mute.countrychat',
            dypKey: 'isMuteCountryChat',
            lv: 0
        },
        {
            translate: 'mute.alliancechat',
            dypKey: 'isMuteAllianceChat',
            lv: 0
        },
        {
            translate: 'mute.friendlychat',
            dypKey: 'isMuteFriendlyChat',
            lv: 0
        },
        {
            translate: 'mute.localchat',
            dypKey: 'isMuteLocalChat',
            lv: 0
        },
    ];

    if (national_tier_level.enabled) {
        const playerManager = new PlayerManager(player.id);
        const countryData = playerManager.country;
        let lv = 0;
        if (countryData) lv = countryData.lv ?? 0;
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
            playerSettingDefaultForm(player);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        player.setDynamicProperty('uiType', uiTypes[rs.formValues[0]]);
        for (let i = 0; i < settings.length; i++) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            player.setDynamicProperty(settings[i].dypKey, `${rs.formValues[i + 1]}`);
        };
        player.sendMessage({ translate: 'updated' });
    });
}
