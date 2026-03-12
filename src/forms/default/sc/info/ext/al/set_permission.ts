import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../api/country/country.js";
import { landPermissions } from "../../../../../../data/permission.js";
import { AllianceMainDefaultForm } from "./main.js";
/**@typedef {import('../../../../../../jsdoc/player').PlayerData} PlayerData*/

/**
 * 同盟国の権限を編集
 * @param {Player} player 
 */
export function setAlliancePermissionDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        for (let i = 0; i < values.length; i++) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
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
