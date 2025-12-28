import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../api/country/plotgroup";
import { plotGroupEditRolesListDefaultForm } from "../roles_list";
import { DynamicProperties } from "../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../api/country/country";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * 
 * @param {Player} player 
 * @param {string} plotGroupId 
 * @param {boolean} isPlotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function roleAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin, search = false, keyword = ``) {
    const form = new ActionFormData();
    form.title({ translate: `form.plot.addrole.list.title` });
    form.button({ translate: `form.plot.addrole.button.serch` });
    const playerDataBase = new DynamicProperties('player');
    const roleDataBase = new DynamicProperties('role');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData?.country)
    const playerCountryData = playerCountryManager.countryData;;
    const roleIds = playerCountryData?.roles || [];

    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };

    if (!plotGroupData?.roles) plotGroupData.roles = [];
    let aliveRoles = [];

    for (const id of roleIds) {
        const rawRoleData = roleDataBase.get(`role_${id}`);
        if (!rawRoleData) continue;
        /**
         * @type {RoleData}
         */
        const roleData = JSON.parse(rawRoleData);
        if (roleData.name == undefined) roleData.name = 'Unknown Name Role';
        if (search) {
            if (!roleData.name.includes(keyword)) continue;
        };
        if (plotGroupData.roles.find(d => d?.id == roleData.id)) continue;
        aliveRoles.push(roleData)
        form.button(`${roleData.name ?? 'Unknown Name Role'}§r\nID: ${roleData.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                const target = aliveRoles[rs.selection - 1];
                plotGroupData.roles = plotGroupData.roles.filter(r => r.id != target.id);
                plotGroupData.roles.push({ id: target.id, permissions: [] });
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin);
                return;
            };
        };
    });
};