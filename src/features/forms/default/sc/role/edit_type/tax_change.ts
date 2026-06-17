import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { CheckPermission, isDecimalNumberZeroOK } from "@/shared/utils/minecraft.js";
import { RoleManager } from "@/domain/country/role-manager.js";
import { selectRoleEditTypeDefaultForm } from "@/features/forms/default/sc/role/edit_type/main.js";
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

/**
 * ロール別税金を変更
 * @param {Player} player
 * @param {RoleData} roleData
 */
export function RoleTaxChangeDefaultForm(player: any, roleData: any) {
    if (CheckPermission(player, 'admin')) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const taxOverride = roleData?.taxOverride ?? {};
    const form = new ModalFormData();
    form.title({ translate: 'form.role.taxchange.title', with: [roleData.name ?? 'Unknown Name Role'] });
    form.toggle({ translate: 'form.role.taxchange.override' }, { defaultValue: Boolean(taxOverride.enabled) });
    form.toggle({ translate: `tax.select.toggle.label` }, { defaultValue: Boolean(taxOverride.taxInstitutionIsPer) });
    form.textField({ translate: 'form.role.taxchange.value' }, { translate: `input.number` }, { defaultValue: `${taxOverride.taxPer ?? 0}` });
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            selectRoleEditTypeDefaultForm(player, roleData);
            return;
        };
        const enabled = Boolean(rs.formValues?.[0]);
        const taxInstitutionIsPer = Boolean(rs.formValues?.[1]);
        const rawValue = rs.formValues?.[2] ?? '0';
        if (enabled && !isDecimalNumberZeroOK(rawValue)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        if (enabled && taxInstitutionIsPer && 100 < Number(rawValue)) {
            player.sendMessage({ translate: `input.error.over100` });
            return;
        };
        if (enabled && Number(rawValue) < 0) {
            player.sendMessage({ translate: `input.error.under0` });
            return;
        };
        const roleManager = new RoleManager();
        roleManager.setTaxOverride(roleData.id, {
            enabled: enabled,
            taxInstitutionIsPer: taxInstitutionIsPer,
            taxPer: Number(rawValue) || 0
        });
        const latestRoleData = roleManager.getRole(roleData.id);
        player.sendMessage({ translate: `updated` });
        selectRoleEditTypeDefaultForm(player, latestRoleData ?? roleData);
        return;
    });
};
