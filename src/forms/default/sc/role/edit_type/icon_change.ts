import { ModalFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../lib/util.js";
import { selectRoleEditTypeDefaultForm } from "./main.js";
import { RoleManager } from "../../../../../api/country/role.js";
import { Player } from "@minecraft/server";
/**@typedef {import("../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * ロールのアイコンを変更
 * @param {Player} player 
 * @param {RoleData} roleData 
 */
export function RoleIconChangeDefaultForm(player: any, roleData: any) {
    if (!CheckPermission(player, 'admin')) {
        const form = new ModalFormData();
        form.title({ translate: 'form.role.iconchange.title', with: [roleData.icon ?? 'textures/blocks/stone'] });
        form.textField({ translate: 'form.role.iconchange.label' }, { translate: 'form.role.iconchange.input' }, { defaultValue: roleData.icon ?? 'textures/blocks/stone' });
        form.submitButton({ translate: `mc.button.change` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                selectRoleEditTypeDefaultForm(player, roleData);
                return;
            };
            const roleManager = new RoleManager();
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            roleManager.setIcon(roleData.id, rs.formValues[0] ?? 'textures/blocks/stone');
            roleData = roleManager.getRole(roleData.id);
            selectRoleEditTypeDefaultForm(player, roleData);
            return;
        });
    };
};
