import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util.js";
import { ModalFormData } from "@minecraft/server-ui";
import { rolePermissions } from "../../../../../data/permission.js";
import { selectRoleEditTypeDefaultForm } from "./main.js";
import { RoleManager } from "../../../../../api/country/role.js";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/

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
