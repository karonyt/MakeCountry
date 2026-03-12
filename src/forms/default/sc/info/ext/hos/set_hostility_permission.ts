import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../api/country/country.js";
import { ModalFormData } from "@minecraft/server-ui";
import { landPermissions } from "../../../../../../data/permission.js";
import { HostilityMainDefaultForm } from "./hostility_main.js";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 敵対国の権限を編集
 * @param {Player} player 
 */
export function setHostilityPermissionDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `hostility.permission.edit` });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: countryData.hostilityPermission.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            HostilityMainDefaultForm(player);
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
        countryData.hostilityPermission = newLandPermissions;
        countryDataBase.set(`country_${countryData.id}`, countryData);
        HostilityMainDefaultForm(player);
        return;
    });
};