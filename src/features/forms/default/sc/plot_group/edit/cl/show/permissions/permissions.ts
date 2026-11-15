import { PlotModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { plotGroupCountrySelectedShowDefaultForm } from "@/features/forms/default/sc/plot_group/edit/cl/show/selected_show.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

/**
 * プロット国権限編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {CountryData} targetData 
 * @param {boolean} isPlotAdmin
 */
export function plotGroupCountryPermissionsEditDefaultForm(player: any, plotGroupId: any, targetData: any, isPlotAdmin = false) {
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
    if (!plotGroupData?.countries) plotGroupData.countries = [];
    let target: any = plotGroupData.countries.find((d: any) => d.id == targetData?.id) ?? { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(target?.permissions, permission) });
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupCountrySelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin);
                return;
            };
            return;
        };
        const values = rs.formValues;
        const newLandPermissions = permissionsFromToggles(landPermissions, values);
        target.permissions = newLandPermissions;
        plotGroupData.countries = plotGroupData.countries.filter((d: any) => d.id != target.id);
        plotGroupData.countries.push(target);
        plotGroupManager.set(plotGroupId, plotGroupData);
        if (isPlotAdmin) {
            plotGroupCountrySelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin);
            return;
        };
        return;
    });
};
