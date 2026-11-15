import { CountryActionForm as ActionFormData, CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { memberSelectedShowDefaultForm } from "@/features/forms/default/sc/members/member_show.js";
import { HasPermission } from "@/shared/utils/minecraft.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerRoleChangeDefaultForm(player: any, member: any, countryData: any) {
    let EnableEditRoleIds: any = [];
    const countryManager = new CountryManager(countryData.id);
    let memberData = countryManager.memberManager.get(member.id);
    countryData = countryManager.countryData ?? countryData;
    const roleDataBase = new DynamicProperties('role')
    const playerDataBase = new DynamicProperties('player')
    const playerAdminRoles = [];
    // owner role は国王交代フォームだけが扱う。通常のRole画面から付け外しすると
    // country.owner と role.members が食い違い、国王権限が壊れる。
    const editableCountryRoles = (countryData?.roles ?? [])
        .filter((roleId: any) => Number(roleId) !== Number(countryData?.ownerRole));
    if (countryData?.owner === player.id) {
        for (const role of editableCountryRoles) {
            EnableEditRoleIds.push(role);
        };
    } else {
        for (const role of editableCountryRoles) {
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
    if (HasPermission(player, 'admin')) EnableEditRoleIds.push(...playerAdminRoles)
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
            memberRoleExsits.push(value);
            form.toggle(role?.name ?? 'Unknown Name Role', { defaultValue: value });
        };
        form.submitButton({ translate: `mc.button.update` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                memberSelectedShowDefaultForm(player, member, countryData);
                return;
            };
            countryManager.reload();
            countryData = countryManager.countryData;
            memberData = countryManager.memberManager?.get(member.id);
            if (!memberData || Number(memberData.country) !== Number(countryData?.id)
                || !countryData?.members?.map(String).includes(`${member.id}`)) {
                player.sendMessage({ translate: `ownerchange.error` });
                return;
            }
            memberData.roles = [...new Set(
                (Array.isArray(memberData.roles) ? memberData.roles : [])
                    .map(Number)
                    .filter((roleId: number) => Number.isFinite(roleId))
            )];
            for (let i = 0; i < memberRoleExsits.length; i++) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                if (rs.formValues[i]) {
                    memberData.roles = memberData.roles.filter((r: any) => r != EnableEditRoleIds[i]);
                    memberData.roles.push(EnableEditRoleIds[i]);
                    const rawRoleData = roleDataBase.get(`role_${EnableEditRoleIds[i]}`);
                    if (!rawRoleData) continue;
                    const roleData = JSON.parse(rawRoleData);
                    roleData.members = (Array.isArray(roleData.members) ? roleData.members : [])
                        .map(String)
                        .filter((m: string) => m !== `${memberData.id}`);
                    roleData.members.push(`${memberData.id}`);
                    roleDataBase.set(`role_${EnableEditRoleIds[i]}`, roleData);
                } else {
                    const rawRoleData = roleDataBase.get(`role_${EnableEditRoleIds[i]}`)
                    if (!rawRoleData) continue;
                    const roleData = JSON.parse(rawRoleData);
                    memberData.roles = memberData.roles.filter((roleId: any) => roleId != EnableEditRoleIds[i]);
                    roleData.members = (Array.isArray(roleData.members) ? roleData.members : [])
                        .map(String)
                        .filter((id: string) => id !== `${memberData.id}`);
                    roleDataBase.set(`role_${EnableEditRoleIds[i]}`, roleData);
                };
            };
            playerDataBase.set(`player_${memberData.id}`, JSON.stringify(memberData));
            memberSelectedShowDefaultForm(player, member, countryData);
            return;
        });
    };
};
