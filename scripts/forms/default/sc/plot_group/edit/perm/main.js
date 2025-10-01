import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import { DynamicProperties } from "../../../../../../api/dyp";
import { landPermissions } from "../../../../../../data/permission";
import { plotGroupEditMainPlotAdminDefaultForm } from "../edit_main_admin";

/**
 * プロットデフォルト権限編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} [isPlotAdmin] 
 */
export function plotGroupEditPermissionsDefaultForm(player, plotGroupId, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.permissions) plotGroupData.permissions = [];
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, plotGroupData?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupData, plotGroupId);
                return;
            };
            plotGroupEditMainFormPlotOwner(player, plotGroupData, plotGroupId);
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        plotGroupData.permissions = newLandPermissions;
        plotGroupManager.set(plotGroupId, plotGroupData);
        if (isPlotAdmin) {
            plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
            return;
        };
        return;
    });
};