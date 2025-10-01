import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { plotGroupEditMainPlotAdminDefaultForm } from "../plot_group_edit_main_plot_admin";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import { playerAddPlotGroupDefaultForm } from "./add/player_add_plot_group";
import { plotGroupPlayerSelectedShowDefaultForm } from "./show/plot_group_player_selected_show";
import { plotGroupEditMainPlotOwnerDefaultForm } from "../plot_group_edit_main_form_plot_owner";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isisPlotAdmin 
 */
export function plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.player` }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.players) plotGroupData.players = [];
    form.button({ translate: `mc.button.player.add` });
    /**
     * @type {Array<PlayerData>}
     */
    const players = [];
    for (const playerRawData of plotGroupData.players) {
        const rawP = playerDataBase.get(`player_${playerRawData}`);
        if(!rawP) continue;
        /**
         * @type {PlayerData}
         */
        const p = JSON.parse(rawP);
        players.push(p);
        form.button(`${p?.name}\n${p?.id}`);
    };
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
            playerAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        plotGroupPlayerSelectedShowDefaultForm(player, players[rs.selection - 1], plotGroupId, isPlotAdmin);
        return;
    });
};