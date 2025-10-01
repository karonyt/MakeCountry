import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { ModalFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../../api/country/plotgroup";
import { landPermissions } from "../../../../../../../../data/permission";
import { plotGroupRoleSelectedShowDefaultForm } from "../selected_show";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../../../../jsdoc/role").RoleData} RoleData*/

/**
 * プロットロール権限編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {RoleData} targetData 
 * @param {boolean} isPlotAdmin
 */
export function plotGroupRolePermissionsEditDefaultForm(player, plotGroupId, targetData, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.roles) plotGroupData.roles = [];
    let target = plotGroupData.roles.find(d => d.id == targetData?.id) || { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: target?.permissions.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupRoleSelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin);
                return;
            };
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        target.permissions = newLandPermissions;
        const index = plotGroupData?.roles.findIndex(d => d.id == target.id);
        if (index != -1) {
            plotGroupData.roles[index] = target;
        } else {
            plotGroupData?.roles.push(target);
        };
        plotGroupManager.set(plotGroupId, plotGroupData);
        if (isPlotAdmin) {
            plotGroupRoleSelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin);
            return;
        };
        return;
    });
};