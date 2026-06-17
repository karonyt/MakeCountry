import { Player } from "@minecraft/server";
import { landPermissions } from "@/domain/country/permissions.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ModalFormData } from "@minecraft/server-ui";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";
/**@typedef {import("@/features/forms/default/sc/info/info.js").PlayerData} PlayerData */

/**
 * 中立国の権限を編集
 * @param {Player} player 
 */
export function setNeutralityPermissionDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const countryDataBase = new DynamicProperties('country');
    const form = new ModalFormData();
    form.title({ translate: `neutrality.permission.edit` });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: countryData.neutralityPermission.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
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
        countryData.neutralityPermission = newLandPermissions;
        countryDataBase.set(`country_${countryData.id}`, countryData);
        externalAffairsMainDefaultForm(player);
        return;
    });
};

