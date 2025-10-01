import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util";
import { DynamicProperties } from "../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryRoleDefaultForm } from "../setting_country_role";
import { RoleNameChangeDefaultForm } from "./role_name_change";
import { RoleIconChangeDefaultForm } from "./role_icon_change";
import { setRolePermissionDefaultForm } from "./set_role_permission";
import { RoleManager } from "../../../../../api/country/role";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function selectRoleEditTypeDefaultForm(player, roleData) {
    if (!CheckPermission(player, `admin`)) {
        const playerDataBase = new DynamicProperties('player');
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        const form = new ActionFormData();
        form.title({ translate: `form.role.edit.select.title`, with: [roleData.name] });
        form.button({ translate: `form.role.edit.select.button.name` });
        form.button({ translate: `form.role.edit.select.button.icon` });
        //form.button({translate: `form.role.edit.select.button.members`});
        form.button({ translate: `form.role.edit.select.button.permission` });
        form.button({ translate: `form.role.edit.select.button.delete` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                settingCountryRoleDefaultForm(player);
                return;
            };
            switch (rs.selection) {
                case 0: {
                    RoleNameChangeDefaultForm(player, roleData);
                    break;
                };
                case 1: {
                    RoleIconChangeDefaultForm(player, roleData);
                    break;
                };
                case 2: {
                    setRolePermissionDefaultForm(player, roleData);
                    break;
                };
                case 3: {
                    const playerDataBase = new DynamicProperties('player');
                    /**
                     * @type {PlayerData}
                     */
                    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                    const roleManager = new RoleManager();
                    roleManager.deleteRole(roleData.id, playerData.country);
                    break;
                };
            };
        });
    };
};
