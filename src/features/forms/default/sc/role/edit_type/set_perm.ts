import { Player } from "@minecraft/server";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { ModalFormData } from "@minecraft/server-ui";
import { rolePermissions } from "@/domain/country/permissions.js";
import { selectRoleEditTypeDefaultForm } from "@/features/forms/default/sc/role/edit_type/main.js";
import { RoleManager } from "@/domain/country/role-manager.js";
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

/**
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function setRolePermissionDefaultForm(player: any, roleData: any) {
    if (!CheckPermission(player, `admin`)) {
        const form = new ModalFormData();
        form.title({ translate: `role.permission.edit`, with: [`${roleData?.name ?? 'Unknown Name Role'}`] });
        for (const permission of rolePermissions) {
            form.toggle({ translate: `permission.${permission}` }, { defaultValue: roleData.permissions.includes(permission) });
        };
        form.submitButton({ translate: `mc.button.save` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                selectRoleEditTypeDefaultForm(player, roleData);
                return;
            };
            const values = rs.formValues;
            let newRolePermissions = [];
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            for (let i = 0; i < values.length; i++) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                if (values[i]) {
                    newRolePermissions.push(rolePermissions[i]);
                };
            };
            const roleManager = new RoleManager();
            roleManager.setPermissions(roleData.id, newRolePermissions);
            selectRoleEditTypeDefaultForm(player, roleData);
            return;
        });
    };
};
