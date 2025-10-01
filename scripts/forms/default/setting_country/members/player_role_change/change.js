import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../api/country/country";
import { DynamicProperties } from "../../../../../api/dyp";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { memberSelectedShowDefaultForm } from "../member_selected_show";
/**@typedef {import("../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerRoleChangeDefaultForm(player, member, countryData) {
    let EnableEditRoleIds = [];
    const countryManager = new CountryManager(countryData.id);
    const memberData = countryManager.memberManager.get(member.id);
    const roleDataBase = new DynamicProperties('role')
    const playerDataBase = new DynamicProperties('player')
    if (countryData?.owner === player.id) {
        for (const role of countryData?.roles) {
            EnableEditRoleIds.push(role);
        };
    } else {
        const playerAdminRoles = [];
        for (const role of countryData?.roles) {
            const rawRoleData = roleDataBase.get(`role_${role}`);
            if (!rawRoleData) continue;
            const roleData = JSON.parse(rawRoleData);
            if (roleData.permissions.includes(`admin`)) {
                playerAdminRoles.push(role);
            } else {
                EnableEditRoleIds.push(role);
            };
        };
    };
    if (EnableEditRoleIds.length === 0) {
        const form = new ActionFormData();
        form.title({ translate: `error.message` });
        form.body({ translate: `not.exsit.can.accessrole` });
        form.button({ translate: `mc.button.close` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                memberSelectedShowDefaultForm(player, member, countryData);
                return;
            };
            return;
        });
    } else {
        let memberRoleExsits = [];
        const form = new ModalFormData();
        form.title({ translate: `form.role.change.title` });
        for (const roleId of EnableEditRoleIds) {
            const rawRoleData = roleDataBase.get(`role_${roleId}`);
            if (!rawRoleData) continue;
            const role = JSON.parse(rawRoleData);
            const value = memberData.roles.includes(roleId);
            if (value) memberData.roles.splice(memberData.roles.indexOf(roleId), 1);
            memberRoleExsits.push(value);
            form.toggle(role.name, { defaultValue: value });
        };
        form.submitButton({ translate: `mc.button.update` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                memberSelectedShowDefaultForm(player, member, countryData);
                return;
            };
            for (let i = 0; i < memberRoleExsits.length; i++) {
                if (rs.formValues[i]) {
                    memberData.roles.push(EnableEditRoleIds[i]);
                    const rawRoleData = roleDataBase.get(`role_${EnableEditRoleIds[i]}`);
                    if (!rawRoleData) continue;
                    const roleData = JSON.parse(rawRoleData);
                    roleData.members.push(`${memberData.id}`);
                    roleDataBase.set(`role_${EnableEditRoleIds[i]}`, roleData);
                } else {
                    const rawRoleData = roleDataBase.get(`role_${EnableEditRoleIds[i]}`)
                    const roleData = JSON.parse(rawRoleData);
                    roleData.members.splice(roleData.members.indexOf(memberData.id), 1);
                    roleDataBase.set(`role_${EnableEditRoleIds[i]}`, roleData);
                };
            };
            playerDataBase.set(`player_${memberData.id}`, memberData, playerDataBase);
            memberSelectedShowDefaultForm(player, member, countryData);
            return;
        });
    };
};