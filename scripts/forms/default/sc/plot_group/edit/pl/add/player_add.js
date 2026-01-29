import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../api/country/plotgroup";
import { plotGroupEditPlayersListDefaultForm } from "../players_list";

/**
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 * @param {boolean} search 
 * @param {string} keyword 
 */
export function playerAddPlotGroupDefaultForm(
    player,
    plotGroupId,
    isPlotAdmin,
    search = false,
    keyword = ""
) {
    const plotGroupManager = new PlotGroupManager();
    const plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) return;

    if (!plotGroupData.players) plotGroupData.players = [];

    const form = new ActionFormData();
    form.title({ translate: "form.plot.addplayer.list.title" });
    form.button({ translate: "form.plot.addplayer.button.search" });

    let players = world.getPlayers();

    // 検索
    if (search && keyword) {
        players = players.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    /** @type {Player[]} */
    const showPlayers = [];

    for (const p of players) {
        // 自分を除外
        if (p.id === player.id) continue;

        // 既にPlotGroupにいるプレイヤーを除外
        if (plotGroupData.players.some(d => d.id === p.id)) continue;

        form.button(`${p.name}§r\n${p.id}`);
        showPlayers.push(p);
    }

    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        }

        // 検索
        if (rs.selection === 0) {
            openSearchForm(player, plotGroupId, isPlotAdmin);
            return;
        }

        // プレイヤー追加
        const target = showPlayers[rs.selection - 1];
        if (!target) return;

        plotGroupData.players.push({
            id: target.id,
            permissions: []
        });

        plotGroupManager.set(plotGroupId, plotGroupData);
        plotGroupEditPlayersListDefaultForm(player, plotGroupId, isPlotAdmin);
    });
}

/**
 * 検索フォーム
 */
function openSearchForm(player, plotGroupId, isPlotAdmin) {
    const form = new ModalFormData()
        .title({ translate: "form.plot.addplayer.search.title" })
        .textField(
            { translate: "form.plot.addplayer.search.label" },
            { translate: "form.plot.addplayer.search.placeholder" }
        );

    form.show(player).then(rs => {
        if (rs.canceled) {
            playerAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        }

        const keyword = rs.formValues[0];
        playerAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin, true, keyword);
    });
}
