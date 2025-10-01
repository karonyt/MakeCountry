import { ModalFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../lib/util";
import { selectRoleEditTypeDefaultForm } from "./select_role_edit_type";
import { RoleManager } from "../../../../../api/country/role";
import { Player } from "@minecraft/server";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * ロールの名前を変更
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function RoleNameChangeDefaultForm(player, roleData) {
    if (!CheckPermission(player, 'admin')) {
        const form = new ModalFormData();
        form.title({ translate: 'form.role.namechange.title', with: [roleData.name] });
        form.textField({ translate: 'form.role.namechange.label' }, { translate: 'form.role.namechange.input' }, { defaultValue: roleData.name });
        form.submitButton({ translate: 'mc.button.change' });
        form.show(player).then(rs => {
            if (rs.canceled) {
                selectRoleEditTypeDefaultForm(player, roleData);
                return;
            };
            const roleManager = new RoleManager();
            roleManager.setName(roleData.id, rs.formValues[0] ?? 'None');
            roleData = roleManager.getRole(roleData.id)
            selectRoleEditTypeDefaultForm(player, roleData);
            return;
        });
    };
};
