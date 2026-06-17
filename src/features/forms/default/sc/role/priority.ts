import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { RoleManager } from "@/domain/country/role-manager.js";
import { settingCountryRoleDefaultForm } from "@/features/forms/default/sc/role/main.js";
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

function getPlayerCountryData(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return { playerData: undefined, countryData: undefined };
    const playerData = JSON.parse(rawPlayerData);
    const rawCountryData = countryDataBase.get(`country_${playerData.country}`);
    if (!rawCountryData) return { playerData: playerData, countryData: undefined };
    return { playerData: playerData, countryData: JSON.parse(rawCountryData) };
}

function getOrderedRoles(countryData: any) {
    const roleDataBase = new DynamicProperties('role');
    const roles = [];
    for (const roleId of countryData?.roles ?? []) {
        const rawRoleData = roleDataBase.get(`role_${roleId}`);
        if (!rawRoleData) continue;
        roles.push(JSON.parse(rawRoleData));
    };
    return roles;
}

/**
 * @param {Player} player
 */
export function RolePriorityDefaultForm(player: any) {
    if (CheckPermission(player, 'admin')) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const { countryData } = getPlayerCountryData(player);
    const roles = getOrderedRoles(countryData);
    const form = new ActionFormData();
    form.title({ translate: `form.role.priority.title` });
    form.body({ translate: `form.role.priority.body` });
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        form.button(`§f#${i + 1} §r${role.name ?? 'Unknown Name Role'}`, role.icon);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryRoleDefaultForm(player);
            return;
        };
        const targetRole = roles[rs.selection ?? 0];
        if (!targetRole) {
            settingCountryRoleDefaultForm(player);
            return;
        };
        RolePriorityChangeDefaultForm(player, targetRole);
        return;
    });
};

/**
 * @param {Player} player
 * @param {RoleData} roleData
 */
export function RolePriorityChangeDefaultForm(player: any, roleData: any) {
    if (CheckPermission(player, 'admin')) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const { playerData, countryData } = getPlayerCountryData(player);
    const roles = getOrderedRoles(countryData);
    const currentIndex = Math.max(0, roles.findIndex((role: any) => role.id == roleData.id));
    const options = roles.map((role: any, index: any) => `#${index + 1} ${role.name ?? 'Unknown Name Role'}`);
    const form = new ModalFormData();
    form.title({ translate: `form.role.priority.change.title`, with: [roleData.name ?? 'Unknown Name Role'] });
    form.dropdown({ translate: `form.role.priority.change.dropdown` }, options, { defaultValueIndex: currentIndex });
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            RolePriorityDefaultForm(player);
            return;
        };
        const targetIndex = Number(rs.formValues?.[0] ?? currentIndex);
        const roleManager = new RoleManager();
        roleManager.moveCountryRole(playerData?.country, roleData.id, targetIndex);
        player.sendMessage({ translate: `updated` });
        RolePriorityDefaultForm(player);
        return;
    });
}
