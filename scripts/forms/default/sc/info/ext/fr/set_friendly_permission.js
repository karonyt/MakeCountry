import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
import { landPermissions } from "../../../../../../data/permission";
import { FriendlyMainDefaultForm } from "./friendly_main";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 友好国の権限を編集
 * @param {Player} player 
 */
export function setFriendlyPermissionDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country)
    let countryData = countryManager.countryData;
    countryData.friendlyPermission = countryData?.friendlyPermission ? countryData.friendlyPermission : [];
    const form = new ModalFormData();
    form.title({ translate: `friendly.permission.edit` });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: countryData.friendlyPermission.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            FriendlyMainDefaultForm(player);
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
        countryData.friendlyPermission = newLandPermissions;
        countryDataBase.set(`country_${countryData.id}`, countryData);
        FriendlyMainDefaultForm(player);
        return;
    });
};
