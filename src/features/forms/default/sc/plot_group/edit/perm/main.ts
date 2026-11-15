import { PlotModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_admin.js";

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
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(plotGroupData?.permissions, permission) });
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
        const newLandPermissions = permissionsFromToggles(landPermissions, values);
        plotGroupData.permissions = newLandPermissions;
        plotGroupManager.set(plotGroupId, plotGroupData);
        if (isPlotAdmin) {
            plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
            return;
        };
        return;
    });
};