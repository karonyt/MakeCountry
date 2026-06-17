import { Player } from "@minecraft/server";
import { HasPermission } from "@/shared/utils/minecraft.js";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { settingCountryDefaultForm } from "@/features/forms/default/sc/setting_country.js";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { CreatePlotGroupDefaultForm } from "@/features/forms/default/sc/plot_group/create/main.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_admin.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/plot").PlotGroupData} PlotGroupData*/

/**
 * プロットグループメインフォーム
 * @param {Player} player 
 */
export function settingCountryPlotGroupDefaultForm(player: any) {
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
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    const plotGroupIds = playerCountryData?.plotgroup ?? [];
    const plotGroupManager = new PlotGroupManager();
    let plotGroupsData: any = [];
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
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupsData[rs.selection - 1]?.id);
                break;
            };
        };
    });
};