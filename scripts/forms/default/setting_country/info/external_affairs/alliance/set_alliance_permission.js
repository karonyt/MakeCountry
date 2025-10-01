import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../../api/dyp";
import { CountryManager } from "../../../../../../api/country/country";
import { landPermissions } from "../../../../../../data/permission";
import { AllianceMainDefaultForm } from "./alliance_main";
/**@typedef {import('../../../../../../jsdoc/player').PlayerData} PlayerData*/

/**
 * 同盟国の権限を編集
 * @param {Player} player 
 */
export function setAlliancePermissionDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country)
    let countryData = countryManager.countryData;
    const form = new ModalFormData();
    form.title({ translate: `alliance.permission.edit` });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: countryData.alliancePermission.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            AllianceMainDefaultForm(player);
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
        countryData.alliancePermission = newLandPermissions;
        countryDataBase.set(`country_${countryData.id}`, countryData);
        AllianceMainDefaultForm(player);
        return;
    });
};
