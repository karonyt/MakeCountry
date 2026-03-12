import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util.js";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryRoleDefaultForm } from "../main.js";
import { RoleNameChangeDefaultForm } from "./name_change.js";
import { RoleIconChangeDefaultForm } from "./icon_change.js";
import { setRolePermissionDefaultForm } from "./set_perm.js";
import { RoleManager } from "../../../../../api/country/role.js";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function selectRoleEditTypeDefaultForm(player: any, roleData: any) {
    if (!CheckPermission(player, `admin`)) {
        const form = new ActionFormData();
        form.title({ translate: `form.role.edit.select.title`, with: [roleData.name ?? 'Unknown Name Role'] });
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
                    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                    const roleManager = new RoleManager();
                    roleManager.deleteRole(roleData.id, playerData.country);
                    break;
                };
            };
        });
    };
};
