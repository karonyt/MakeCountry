import { CountryActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { settingCountryInfoDefaultForm } from "@/features/forms/default/sc/info/info.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { setNeutralityPermissionDefaultForm } from "@/features/forms/default/sc/info/ext/set_ntr_perm.js";
import { AllianceMainDefaultForm } from "@/features/forms/default/sc/info/ext/al/main.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { FriendlyMainDefaultForm } from "@/features/forms/default/sc/info/ext/fr/friendly_main.js";
import { HostilityMainDefaultForm } from "@/features/forms/default/sc/info/ext/hos/hostility_main.js";
import { ReceivedAllianceRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_al_req/received_alliance_request.js";
import { ReceivedApplicationRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_ap_req/received_application_request.js";
import { ReceivedMergeRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_mrg_req/received_merge_request.js";
import { sendMergeRequestListDefaultForm } from "@/features/forms/default/sc/info/ext/s_mrg_req_list/send_req_list.js";
import { ReceivedFriendlyRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_fr_req/received_friendly_request.js";
import { ReceivedFederationRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_fd_req/received_federation_request.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";
import { permissionButton } from "@/features/forms/default/sc/permission_button.js";
import { countryPlayerPermissionsDefaultForm } from "@/features/forms/default/sc/info/ext/player_permissions.js";
import { landTransferForm } from "@/features/forms/country/land-transfer-form.js";

function canOpenFederationMenu(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    if (!playerData?.country) return !CheckPermission(player, `federationPermission`) || !CheckPermission(player, `federationAdmin`);
    const countryManager = new CountryManager(playerData.country);
    return canManageFederation(player, countryManager.countryData);
}

/**
 * 対外関係メインフォーム
 * @param {Player} player 
 */
export function externalAffairsMainDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.setting.info.button.external.affairs` });
    //中立国の権限設定
    form.button(permissionButton(player, `neutrality.permission.edit`, `neutralityPermission`));
    form.button(permissionButton(player, `external.player.permission`, `neutralityPermission`));
    //同盟国
    form.button(permissionButton(player, `alliance`, `allyAdmin`));
    //連邦国
    form.button(permissionButton(player, `federation`, Boolean(canOpenFederationMenu(player))));
    //友好国
    form.button(permissionButton(player, `friendly`, `allyAdmin`));
    //敵対国
    form.button(permissionButton(player, `hostility`, `hostilityAdmin`));
    //受信した同盟申請
    form.button(permissionButton(player, `received.alliance.request`, `allyAdmin`));
    //受信した連邦申請
    form.button(permissionButton(player, `received.federation.request`, Boolean(canOpenFederationMenu(player))));
    //受信した友好申請
    form.button(permissionButton(player, `received.friendly.request`, `allyAdmin`));
    //受信した講和申請
    form.button(permissionButton(player, `received.application.request`, `hostilityAdmin`));

    //受信した併合申請
    form.button(permissionButton(player, `received.merge.request`, `owner`));
    //併合申請を送信
    form.button(permissionButton(player, `send.merge.request`, `owner`));
    form.button(permissionButton(player, `land.transfer.title`, `owner`));

    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 12: {
                void landTransferForm(player);
                return;
            }
            case 0: {
                //中立国の権限設定
                if (!CheckPermission(player, `neutralityPermission`)) {
                    //form
                    setNeutralityPermissionDefaultForm(player);
                    break;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 1: {
                if (!CheckPermission(player, `neutralityPermission`)) {
                    countryPlayerPermissionsDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 2: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    AllianceMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 3: {
                if (canOpenFederationMenu(player)) {
                    FederationMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 4: {
                if (!CheckPermission(player, `allyAdmin`)) {
                    FriendlyMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 5: {
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    HostilityMainDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 6: {
                //受信した同盟申請
                if (!CheckPermission(player, `allyAdmin`)) {
                    ReceivedAllianceRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 7: {
                //受信した連邦申請
                if (canOpenFederationMenu(player)) {
                    ReceivedFederationRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 8: {
                //受信した友好申請
                if (!CheckPermission(player, `allyAdmin`)) {
                    ReceivedFriendlyRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 9: {
                //受信した講和申請
                if (!CheckPermission(player, `hostilityAdmin`)) {
                    ReceivedApplicationRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 10: {
                //受信した併合申請
                if (!CheckPermission(player, `owner`)) {
                    ReceivedMergeRequestDefaultForm(player);
                    return;
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 11: {
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
