import { Player } from "@minecraft/server";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryRoleDefaultForm } from "@/features/forms/default/sc/role/main.js";
import { RoleNameChangeDefaultForm } from "@/features/forms/default/sc/role/edit_type/name_change.js";
import { RoleIconChangeDefaultForm } from "@/features/forms/default/sc/role/edit_type/icon_change.js";
import { setRolePermissionDefaultForm } from "@/features/forms/default/sc/role/edit_type/set_perm.js";
import { RoleManager } from "@/domain/country/role-manager.js";
import { RoleTaxChangeDefaultForm } from "@/features/forms/default/sc/role/edit_type/tax_change.js";
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

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
        form.button({ translate: `form.role.edit.select.button.tax` });
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
                    RoleTaxChangeDefaultForm(player, roleData);
                    break;
                };
                case 4: {
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
