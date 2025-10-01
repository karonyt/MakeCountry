import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
import { ModalFormData } from "@minecraft/server-ui";
import { landPermissions } from "../../../../../../data/permission";
import { HostilityMainDefaultForm } from "./hostility_main";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 敵対国の権限を編集
 * @param {Player} player 
 */
export function setHostilityPermissionDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
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
        for (let i = 0; i < values.length; i++) {
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