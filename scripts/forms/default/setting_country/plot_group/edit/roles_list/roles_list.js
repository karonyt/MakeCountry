import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import { plotGroupEditMainPlotAdminDefaultForm } from "../edit_main__admin";
import { plotGroupEditMainPlotOwnerDefaultForm } from "../edit_main_owner";
import { roleAddPlotGroupDefaultForm } from "./add/role_add";
import { plotGroupRoleSelectedShowDefaultForm } from "./show/selected_show";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * プロットロールリストフォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin
 */
export function plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const roleDataBase = new DynamicProperties('role');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.role` }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.roles) plotGroupData.roles = [];
    form.button({ translate: `mc.button.role.add` });
    let aliveRoles = [];
    let aliveRolesData = [];

    for (const plotGroupDataRole of plotGroupData.roles) {
        const rawRoleData = roleDataBase.get(`role_${plotGroupDataRole.id}`)
        if (rawRoleData) {
            const roleData = JSON.parse(rawRoleData);
            aliveRoles.push(roleData.id);
            aliveRolesData.push(roleData);
            form.button(`${roleData.name}\nID: ${roleData.id}`);
        };
    };
    plotGroupData.roles = plotGroupData.roles.filter(d => aliveRoles.includes(d.id));
    plotGroupManager.set(plotGroupId, plotGroupData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                return;
            };
            plotGroupEditMainPlotOwnerDefaultForm(player, plotGroupId);
            return;
        };
        if (rs.selection == 0) {
            roleAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        plotGroupRoleSelectedShowDefaultForm(player, aliveRolesData[rs.selection - 1], plotGroupId, isPlotAdmin);
        return;
    });
};