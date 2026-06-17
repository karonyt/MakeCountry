import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_admin.js";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { playerAddPlotGroupDefaultForm } from "@/features/forms/default/sc/plot_group/edit/pl/add/player_add.js";
import { plotGroupPlayerSelectedShowDefaultForm } from "@/features/forms/default/sc/plot_group/edit/pl/show/plot_group_player_selected_show.js";
import { plotGroupEditMainPlotOwnerDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_owner.js";
import { PlayerData } from "@/types/legacy/player";

/**
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isisPlotAdmin 
 */
export function plotGroupEditPlayersListDefaultForm(player: Player, plotGroupId: any, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
    const players: PlayerData[] = [];
    for (const playerRawData of plotGroupData.players) {
        const rawP = playerDataBase.get(`player_${playerRawData.id}`);
        if(!rawP) continue;
        const p: PlayerData = JSON.parse(rawP);
        players.push(p);
        form.button(`${p?.name}\n${p?.id}`);
    };
    form.show(player as any).then(rs => {
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        plotGroupPlayerSelectedShowDefaultForm(player, players[rs.selection - 1], plotGroupId, isPlotAdmin);
        return;
    });
};