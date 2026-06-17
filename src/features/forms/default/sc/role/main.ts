import { Player, system } from "@minecraft/server";
import { CheckPermission, HasPermission } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "@/features/forms/default/sc/setting_country.js";
import config from "@/config/server.js";
import { selectRoleEditTypeDefaultForm } from "@/features/forms/default/sc/role/edit_type/main.js";
import { RolePriorityDefaultForm } from "@/features/forms/default/sc/role/priority.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

/**
 * @param {Player} player 
 */
export function settingCountryRoleDefaultForm(player: any) {
    const cannot = CheckPermission(player, 'admin');
    if (cannot) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    try {
        /**
         * @type {number}
         */
        let EnableEditRoleIds = [];
        const playerDataBase = new DynamicProperties('player');
        const roleDataBase = new DynamicProperties('role');
        /**
         * @type {PlayerData}
         */
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        const countryManager = new CountryManager(playerData.country);
        let countryData = countryManager.countryData;
        const playerAdminRoles = [];
        if (countryData?.owner === player.id) {
            for (const role of countryData?.roles) {
                EnableEditRoleIds.push(role);
            };
        } else {
            for (const role of countryData?.roles) {
                const rawRoleData = roleDataBase.get(`role_${role}`);
                if (!rawRoleData) continue;
                /**
                 * @type {RoleData}
                 */
                const roleData = JSON.parse(rawRoleData);
                if (roleData.permissions.includes(`admin`)) {
                    playerAdminRoles.push(role);
                } else {
                    EnableEditRoleIds.push(role);
                };
            };
        };
        const form = new ActionFormData();
        if (HasPermission(player, 'admin')) EnableEditRoleIds.push(...playerAdminRoles);
        EnableEditRoleIds = [...new Set(EnableEditRoleIds)].sort((a: any, b: any) => {
            return (countryData.roles ?? []).indexOf(a) - (countryData.roles ?? []).indexOf(b);
        });
        if (EnableEditRoleIds.length === 0) {
            form.title({ translate: `form.setting.button.role` });
            form.body({ translate: `not.exsit.can.accessrole` });
            form.button({ translate: `mc.button.close` });
            form.show(player).then(rs => {
                if (rs.canceled) {
                    settingCountryDefaultForm(player);
                    return;
                };
                return;
            });
        } else {
            form.title({ translate: `form.setting.button.role` });
            form.button({ translate: `mc.button.addrole` });
            form.button({ translate: `form.role.priority.button` });
            /**
             * @type {Array<RoleData>}
             */
            let roles: any = [];
            for (const id of EnableEditRoleIds) {
                const rawRoleData = roleDataBase.get(`role_${id}`);
                /**
                 * @type {RoleData}
                 */
                // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                const roleData = JSON.parse(rawRoleData);
                roles.push(roleData);
            };
            for (const role of roles) {
                const priority = (countryData.roles ?? []).indexOf(role.id) + 1;
                form.button(`§f#${priority} §r${role.name ?? 'Unknown Name Role'}`, role.icon);
            };
            form.show(player).then(rs => {
                countryManager.reload();
                countryData = countryManager.countryData;
                if (rs.canceled) {
                    settingCountryDefaultForm(player);
                    return;
                };
                switch (rs.selection) {
                    case 0: {
                        if (config.maxRoleAmount <= countryData.roles.length) {
                            player.sendMessage({ translate: `error.limit.maxrole` });
                            return;
                        };
                        countryManager.createRole({ name: 'newRole', permissions: [], icon: 'stone' });
                        system.runTimeout(() => {
                            settingCountryRoleDefaultForm(player);
                            return;
                        }, 2);
                        break;
                    };
                    case 1: {
                        RolePriorityDefaultForm(player);
                        break;
                    };
                    default: {
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        selectRoleEditTypeDefaultForm(player, roles[rs.selection - 2]);
                        break;
                    };
                };
            });
        };
    } catch (error) {
        console.warn(error);
    };
};
