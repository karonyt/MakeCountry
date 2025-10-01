import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util";
import { ModalFormData } from "@minecraft/server-ui";
import { rolePermissions } from "../../../../../data/permission";
import { selectRoleEditTypeDefaultForm } from "./select_role_edit_type";
import { RoleManager } from "../../../../../api/country/role";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function setRolePermissionDefaultForm(player, roleData) {
    if (!CheckPermission(player, `admin`)) {
        const form = new ModalFormData();
        form.title({ translate: `role.permission.edit`, with: [roleData.name] });
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
            for (let i = 0; i < values.length; i++) {
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
