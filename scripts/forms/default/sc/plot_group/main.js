import { Player } from "@minecraft/server";
import { HasPermission } from "../../../../lib/util";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { settingCountryDefaultForm } from "../setting_country";
import { PlotGroupManager } from "../../../../api/country/plotgroup";
import { CreatePlotGroupDefaultForm } from "./create/main";
import { plotGroupEditMainPlotAdminDefaultForm } from "./edit/edit_main_admin";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../jsdoc/plot").PlotGroupData} PlotGroupData*/

/**
 * プロットグループメインフォーム
 * @param {Player} player 
 */
export function settingCountryPlotGroupDefaultForm(player) {
    const isPlotAdmin = HasPermission(player, `plotAdmin`);
    if (!isPlotAdmin) {
        //権限がない場合
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const playerDataBase = new DynamicProperties('player');
    const form = new ActionFormData();
    form.title({ translate: `form.setting.button.plotgroup` });
    form.button({ translate: `create.plotgroup.button` });
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    const plotGroupIds = playerCountryData?.plotgroup ?? [];
    const plotGroupManager = new PlotGroupManager();
    let plotGroupsData = [];
    for (const pgid of plotGroupIds) {
        const data = plotGroupManager.get(pgid);
        if (data) {
            plotGroupsData.push(data);
            form.button(`${data?.name}\n§rID:${data?.id}`);

        };
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロットグループ作成フォーム表示
                CreatePlotGroupDefaultForm(player);
                break;
            };
            default: {
                //既存のプロットグループの編集
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupsData[rs.selection - 1]?.id);
                break;
            };
        };
    });
};