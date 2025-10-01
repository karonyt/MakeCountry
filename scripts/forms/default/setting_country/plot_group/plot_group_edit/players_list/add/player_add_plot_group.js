import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../api/country/plotgroup";
import { plotGroupEditPlayersListDefaultForm } from "../players_list";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 * @param {boolean} search 
 * @param {string} keyword 
 */
export function playerAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin, search = false, keyword = ``) {
    const form = new ActionFormData();
    let players = world.getPlayers();
    form.title({ translate: `form.plot.addplayer.list.title` });
    form.button({ translate: `form.plot.addplayer.button.serch` });
    if (search) {
        players = players.filter(p => p.name.includes(keyword));
    };
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.players) plotGroupData.players = [];
    /**
     * @type {Array<Player>}
     */
    let showPlayers = [];
    for (const p of players) {
        if (plotGroupData.players.find(d => d?.id == p.id)) continue;
        form.button(`${p.name}§r\n${p.id}`);
        showPlayers.push(p);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                const target = showPlayers[rs.selection - 1];
                plotGroupData.players.push({ id: target.id, permissions: [] });
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
                return;
            };
        };
    });
};