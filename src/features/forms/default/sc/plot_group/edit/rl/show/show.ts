import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { plotGroupRolePermissionsEditDefaultForm } from "@/features/forms/default/sc/plot_group/edit/rl/show/perm/perm.js";
import { plotGroupEditRolesListDefaultForm } from "@/features/forms/default/sc/plot_group/edit/rl/roles_list.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/
/**@typedef {import("@/types/legacy/role").RoleData} RoleData*/

/**
 * 
 * @param {Player} player 
 * @param {RoleData} targetData 
 * @param {boolean} isPlotAdmin 
 * @param {number} plotGroupId 
 */
export function plotGroupRoleSelectedShowDefaultForm(player: any, targetData: any, plotGroupId: any, isPlotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name ?? 'Unknown Name Role'}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 1: {
                plotGroupRolePermissionsEditDefaultForm(player, plotGroupId, targetData, isPlotAdmin);
                break;
            };
            case 2: {
                const plotGroupManager = new PlotGroupManager();
                let plotGroupData = plotGroupManager.get(plotGroupId);
                if (!plotGroupData) {
                    return;
                };
                if (!plotGroupData?.roles) plotGroupData.roles = [];
                plotGroupData.roles = plotGroupData.roles.filter((d: any) => d.id != targetData.id);
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditRolesListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 3: {
                break;
            };
        };
    });
};