import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { landPermissions } from "@/domain/country/permissions.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 連邦国の権限を編集
 * @param {Player} player 
 */
export function setFederationPermissionDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country)
    let countryData = countryManager.countryData;
    countryData.federationPermission ??= [`blockUse`, `entityUse`, `openContainer`, `itemUse`, `noTarget`, `setHome`, `publicHomeUse`];
    const form = new ModalFormData();
    form.title({ translate: `federation.permission.edit` });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: countryData.federationPermission.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        for (let i = 0; i < values.length; i++) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        countryManager.reload();
        countryData = countryManager.countryData;
        countryData.federationPermission = newLandPermissions;
        countryDataBase.set(`country_${countryData.id}`, countryData);
        FederationMainDefaultForm(player);
        return;
    });
};
