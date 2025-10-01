import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { ModalFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../../api/country/plotgroup";
import { landPermissions } from "../../../../../../../../data/permission";
import { plotGroupCountrySelectedShowDefaultForm } from "../plot_group_country_selected_show";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../../../jsdoc/country").CountryData} CountryData*/

/**
 * プロット国権限編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {CountryData} targetData 
 * @param {boolean} isPlotAdmin
 */
export function plotGroupCountryPermissionsEditDefaultForm(player, plotGroupId, targetData, isPlotAdmin = false) {
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
    if (!plotGroupData?.countries) plotGroupData.countries = [];
    let target = plotGroupData.countries.find(d => d.id == targetData?.id) ?? { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: target?.permissions.includes(permission) });
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
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        target.permissions = newLandPermissions;
        plotGroupData.countries = plotGroupData.countries.filter(d => d.id != target.id);
        plotGroupData.countries.push(target);
        plotGroupManager.set(plotGroupId, plotGroupData);
        if (isPlotAdmin) {
            plotGroupCountrySelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin);
            return;
        };
        return;
    });
};