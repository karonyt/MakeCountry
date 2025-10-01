import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import { plotGroupEditMainPlotAdminDefaultForm } from "../plot_group_edit_main_plot_admin";
import { DynamicProperties } from "../../../../../../api/dyp";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 所有者の管理
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 */
export function plotGroupOwnerShowDefaultForm(player, plotGroupId, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.owner) plotGroupData.owner = null;
    const form = new ActionFormData();
    /**
     * @type {PlayerData|undefined}
     */
    let ownerData;
    if (plotGroupData?.owner) {
        const rawOwnerData = playerDataBase.get(`player_${plotGroupData?.owner}`);
        if (rawOwnerData) {
            ownerData = JSON.parse(rawOwnerData);
            form.title({ text: `${ownerData?.name}` });
            form.body({ rawtext: [{ translate: `owner` }, { text: `: ${ownerData?.name}` }] });
        };
    };
    if (!plotGroupData?.owner) form.title({ translate: `not.owned` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.close` });
    if (plotGroupData?.owner) form.button({ translate: `mc.button.delete` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (isPlotAdmin) {
                    plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                    return;
                };
                break;
            };
            case 1: {
                break;
            };
            case 2: {
                let afterPlot = plotGroupManager.get(plotGroupId);
                afterPlot.owner = null;
                plotGroupManager.set(plotGroupId, afterPlot);
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                break;
            };
        };
    });
};