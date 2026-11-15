import { CountryListForm as ActionFormData } from "@/shared/ui/country-list-form.js";
import { CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";
import { defaultFederationPermission, getFederationMemberPolicy, normalizeFederationData } from "@/domain/country/relationships/federation.js";

function context(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const manager = playerData?.country ? new CountryManager(playerData.country) : undefined;
    if (!manager || !canManageFederation(player, manager.countryData)) return undefined;
    return { manager, federation: normalizeFederationData(manager.countryData) };
}

function countryName(countryId: any) {
    const raw = new DynamicProperties("country").get(`country_${countryId}`);
    return raw ? JSON.parse(raw).name : `${countryId}`;
}

function cloneGovernance(federation: any) {
    return {
        roles: (federation.roles ?? []).map((role: any) => ({ ...role, permissions: [...role.permissions] })),
        policies: Object.fromEntries(Object.entries(federation.memberPolicies ?? {}).map(([id, policy]: any) => [id, { ...policy, permissions: [...(policy.permissions ?? [])] }]))
    };
}

/** 構成国ごとの連邦ロール・個別権限・税率を編集する。 */
export function setFederationPermissionDefaultForm(player: any) {
    const current = context(player);
    if (!current) {
        player.sendMessage({ translate: "no.permission" });
        return;
    }
    const form = new ActionFormData();
    form.title({ translate: "federation.governance.title" });
    form.button({ translate: "federation.role.manage" });
    for (const countryId of current.federation.members) {
        const policy = getFederationMemberPolicy(current.federation, countryId);
        const role = policy?.mode === "role" ? current.federation.roles.find((item: any) => item.id === policy.roleId) : undefined;
        form.button(`${countryName(countryId)}\n${role?.name ?? (policy ? "Individual" : "Legacy")} / ${policy?.taxRate ?? current.federation.taxRate}%`);
    }
    form.show(player).then((rs) => {
        if (rs.canceled) return FederationMainDefaultForm(player);
        if (rs.selection === 0) return federationRoleListForm(player);
        const countryId = current.federation.members[(rs.selection ?? 0) - 1];
        if (countryId) federationMemberPolicyForm(player, countryId);
    });
}

function federationMemberPolicyForm(player: any, countryId: number) {
    const current = context(player);
    if (!current) return;
    const effective = getFederationMemberPolicy(current.federation, countryId);
    const roles = current.federation.roles ?? [];
    const selectedRole = effective?.mode === "role" ? roles.findIndex((role: any) => role.id === effective.roleId) : -1;
    const form = new ModalFormData();
    form.title(`${countryName(countryId)} - Federation`);
    form.dropdown({ translate: "federation.policy.mode" }, ["Individual", ...roles.map((role: any) => role.name)], { defaultValueIndex: selectedRole + 1 });
    form.textField({ translate: "federation.tax.rate" }, { translate: "input.number" }, { defaultValue: `${effective?.taxRate ?? current.federation.taxRate}` });
    for (const permission of landPermissions) form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled((effective?.permissions ?? defaultFederationPermission), permission) });
    form.submitButton({ translate: "mc.button.save" });
    form.show(player).then((rs) => {
        if (rs.canceled) return setFederationPermissionDefaultForm(player);
        const latest = context(player);
        if (!latest) return;
        const values = rs.formValues ?? [];
        const roleIndex = Number(values[0]) - 1;
        const governance = cloneGovernance(latest.federation);
        governance.policies[countryId] = roleIndex >= 0 && latest.federation.roles[roleIndex]
            ? { mode: "role", roleId: latest.federation.roles[roleIndex].id, permissions: [], taxRate: 0 }
            : { mode: "individual", permissions: permissionsFromToggles(landPermissions, values, 2), taxRate: Number(values[1]) };
        latest.manager.updateFederationGovernance(governance.roles, governance.policies, player);
        setFederationPermissionDefaultForm(player);
    });
}

function federationRoleListForm(player: any) {
    const current = context(player);
    if (!current) return;
    const form = new ActionFormData();
    form.title({ translate: "federation.role.manage" });
    form.button({ translate: "federation.role.create" });
    for (const role of current.federation.roles ?? []) form.button(`${role.name}\n${role.taxRate}%`);
    form.show(player).then((rs) => {
        if (rs.canceled) return setFederationPermissionDefaultForm(player);
        if (rs.selection === 0) return federationRoleEditForm(player);
        const role = current.federation.roles[(rs.selection ?? 0) - 1];
        if (role) federationRoleEditForm(player, role.id);
    });
}

function federationRoleEditForm(player: any, roleId?: string) {
    const current = context(player);
    if (!current) return;
    const role = current.federation.roles.find((item: any) => item.id === roleId);
    const form = new ModalFormData();
    form.title({ translate: role ? "federation.role.edit" : "federation.role.create" });
    form.textField({ translate: "federation.role.name" }, { translate: "input.string" }, { defaultValue: role?.name ?? "" });
    form.textField({ translate: "federation.tax.rate" }, { translate: "input.number" }, { defaultValue: `${role?.taxRate ?? current.federation.taxRate}` });
    for (const permission of landPermissions) form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled((role?.permissions ?? defaultFederationPermission), permission) });
    if (role) form.toggle({ translate: "federation.role.delete" }, { defaultValue: false });
    form.submitButton({ translate: "mc.button.save" });
    form.show(player).then((rs) => {
        if (rs.canceled) return federationRoleListForm(player);
        const latest = context(player);
        if (!latest) return;
        const values = rs.formValues ?? [];
        const governance = cloneGovernance(latest.federation);
        if (role && !!values[landPermissions.length + 2]) {
            governance.roles = governance.roles.filter((item: any) => item.id !== role.id);
            for (const [id, policy] of Object.entries(governance.policies) as Array<[string, any]>) if (policy.mode === "role" && policy.roleId === role.id) delete governance.policies[id];
        } else {
            const name = `${values[0] ?? ""}`.trim();
            if (!name) return federationRoleEditForm(player, roleId);
            const nextRole = { id: role?.id ?? `fcr_${Date.now()}`, name, taxRate: Number(values[1]), permissions: permissionsFromToggles(landPermissions, values, 2) };
            const index = governance.roles.findIndex((item: any) => item.id === nextRole.id);
            if (index >= 0) governance.roles[index] = nextRole;
            else governance.roles.push(nextRole);
        }
        latest.manager.updateFederationGovernance(governance.roles, governance.policies, player);
        federationRoleListForm(player);
    });
}
