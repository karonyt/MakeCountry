import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "../info";
import { CheckPermission } from "../../../../../lib/util";
import { setNeutralityPermissionDefaultForm } from "./set_neutrality_permission";
import { AllianceMainDefaultForm } from "./alliance/alliance_main";
import { FriendlyMainDefaultForm } from "./friendly/friendly_main";
import { HostilityMainDefaultForm } from "./hostility/hostility_main";
import { ReceivedAllianceRequestDefaultForm } from "./received_alliance_request/received_alliance_request";
import { ReceivedApplicationRequestDefaultForm } from "./received_application_request/received_application_request";
import { ReceivedMergeRequestDefaultForm } from "./received_merge_request/received_merge_request";
import { sendMergeRequestListDefaultForm } from "./send_merge_request_list/send_merge_request_list";
import { ReceivedFriendlyRequestDefaultForm } from "./received_friendly_request/received_friendly_request";

/**
 * 対外関係メインフォーム
 * @param {Player} player 
 */
export function externalAffairsMainDefaultForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.info.button.external.affairs` });
    //中立国の権限設定
    form.button({ translate: `neutrality.permission.edit` });
    //同盟国
    form.button({ translate: `alliance` });
    //友好国
    form.button({ translate: `friendly` });
    //敵対国
    form.button({ translate: `hostility` });
    //受信した同盟申請
    form.button({ translate: `received.alliance.request` });
    //受信した友好申請
    form.button({ translate: `received.friendly.request` });
    //受信した講和申請
    form.button({ translate: `received.application.request` });

    //受信した併合申請
    form.button({ translate: `received.merge.request` });
    //併合申請を送信
    form.button({ translate: `send.merge.request` });

    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //中立国の権限設定
                if (!CheckPermission(player, `neutralityPermission`)) {
                    //form
                    setNeutralityPermissionDefaultForm(player);
                    break;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
            };
            case 1: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    AllianceMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 2: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    FriendlyMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 3: {
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    HostilityMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 4: {
                //受信した同盟申請
                if (!CheckPermission(player, `allyAdmin`)) {
                    ReceivedAllianceRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 5: {
                //受信した友好申請
                if (!CheckPermission(player, `allyAdmin`)) {
                    ReceivedFriendlyRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 6: {
                //受信した講和申請
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    ReceivedApplicationRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 7: {
                //受信した併合申請
                if (!CheckPermission(player, `owner`)) {
                    ReceivedMergeRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 8: {
                //併合申請を送信
                if (!CheckPermission(player, `owner`)) {
                    sendMergeRequestListDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};
