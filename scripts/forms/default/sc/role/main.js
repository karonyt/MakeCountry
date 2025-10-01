import { Player, system } from "@minecraft/server";
import { CheckPermission } from "../../../../lib/util";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "../setting_country";
import config from "../../../../config";
import { selectRoleEditTypeDefaultForm } from "./edit_type/main";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../jsdoc/role").RoleData} RoleData*/

/**
 * @param {Player} player 
 */
export function settingCountryRoleDefaultForm(player) {
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
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        const countryManager = new CountryManager(playerData.country);
        let countryData = countryManager.countryData;
        if (countryData?.owner === player.id) {
            for (const role of countryData?.roles) {
                EnableEditRoleIds.push(role);
            };
        } else {
            const playerAdminRoles = [];
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
            /**
             * @type {Array<RoleData>}
             */
            let roles = [];
            for (const id of EnableEditRoleIds) {
                const rawRoleData = roleDataBase.get(`role_${id}`);
                /**
                 * @type {RoleData}
                 */
                const roleData = JSON.parse(rawRoleData);
                roles.push(roleData);
            };
            for (const role of roles) {
                form.button(role.name, role.icon);
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
                    default: {
                        selectRoleEditTypeDefaultForm(player, roles[rs.selection - 1]);
                        break;
                    };
                };
            });
        };
    } catch (error) {
        console.warn(error);
    };
};