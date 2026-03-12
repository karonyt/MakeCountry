import { ModalFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup.js";
import { DynamicProperties } from "../../../../../../api/dyp.js";
import { landPermissions } from "../../../../../../data/permission.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "../edit_main_admin.js";

/**
 * プロットデフォルト権限編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} [isPlotAdmin] 
 */
export function plotGroupEditPermissionsDefaultForm(player: any, plotGroupId: any, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: plotGroupData?.permissions.includes(permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                return;
            };
            plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        for (let i = 0; i < values.length; i++) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
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