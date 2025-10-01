import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { plotGroupEditPlayersListDefaultForm } from "../players_list";
import { PlotGroupManager } from "../../../../../../../api/country/plotgroup";
import { plotGroupPlayerPermissionsEditDefaultForm } from "./permissions/permissions";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {PlayerData} targetData 
 * @param {boolean} isPlotAdmin 
 * @param {number} plotGroupId 
 */
export function plotGroupPlayerSelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 1: {
                plotGroupPlayerPermissionsEditDefaultForm(player, plotGroupId, targetData, isPlotAdmin);
                break;
            };
            case 2: {
                const plotGroupManager = new PlotGroupManager();
                let plotGroupData = plotGroupManager.get(plotGroupId);
                if (!plotGroupData) {
                    return;
                };
                if (!plotGroupData?.players) plotGroupData.players = [];
                plotGroupData.players.filter(d => d.id != targetData.id);
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 3: {
                break;
            };
        };
    });
};