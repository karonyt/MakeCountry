import { ModalFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { selectRoleEditTypeDefaultForm } from "@/features/forms/default/sc/role/edit_type/main.js";
import { RoleManager } from "@/domain/country/role-manager.js";
import { Player } from "@minecraft/server";
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

/**
 * ロールの名前を変更
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function RoleNameChangeDefaultForm(player: any, roleData: any) {
    if (!CheckPermission(player, 'admin')) {
        const form = new ModalFormData();
        form.title({ translate: 'form.role.namechange.title', with: [roleData.name ?? 'Unknown Name Role'] });
        form.textField({ translate: 'form.role.namechange.label' }, { translate: 'form.role.namechange.input' }, { defaultValue: roleData.name ?? 'Unknown Name Role' });
        form.submitButton({ translate: 'mc.button.change' });
        form.show(player).then(rs => {
            if (rs.canceled) {
                selectRoleEditTypeDefaultForm(player, roleData);
                return;
            };
            const roleManager = new RoleManager();
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            roleManager.setName(roleData.id, rs.formValues[0] ?? 'None');
            roleData = roleManager.getRole(roleData.id)
            selectRoleEditTypeDefaultForm(player, roleData);
            return;
        });
    };
};
