import { Player } from "@minecraft/server";
import { landPermissions } from "../../../../../data/permission";
import { DynamicProperties } from "../../../../../api/dyp";
import { CountryManager } from "../../../../../api/country/country";
import { ModalFormData } from "@minecraft/server-ui";
import { externalAffairsMainDefaultForm } from "./main";
/**@typedef {import("../info").PlayerData} PlayerData */

/**
 * 中立国の権限を編集
 * @param {Player} player 
 */
export function setNeutralityPermissionDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
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
        for (let i = 0; i < values.length; i++) {
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

