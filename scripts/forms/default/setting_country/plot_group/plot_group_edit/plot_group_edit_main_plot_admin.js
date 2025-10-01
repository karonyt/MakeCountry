import { Player } from "@minecraft/server";
import { ActionForm } from "../../../../../lib/form_class";
import { settingCountryPlotGroupDefaultForm } from "../setting_country_plot_group";
import { PlotGroupManager } from "../../../../../api/country/plotgroup";
import { DynamicProperties } from "../../../../../api/dyp";
import { plotGroupEditPermissionsDefaultForm } from "./permissions/permissions";
import { plotGroupEditSettingPlotAdminDefaultForm } from "./setting/plot_group_edit_setting_plot_admin";
import { plotGroupEditPlayersListDefaultForm } from "./players_list/players_list";
import { plotGroupEditCountriesListDefaultForm } from "./countries_list/countries_list";
import { plotGroupEditRolesListDefaultForm } from "./roles_list/roles_list";
import { plotGroupOwnerShowDefaultForm } from "./owner/owner";
/**@typedef {import("../../../../../jsdoc/plot").PlotGroupData} PlotGroupData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プロットアドミン用のプロットグループ編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId
 */
export function plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId) {
    const plotGroupManager = new PlotGroupManager();
    const plotGroupData = plotGroupManager.get(plotGroupId);
    const form = new ActionForm();
    form.title({ rawtext: [{ translate: `${plotGroupData.name}` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.button({ translate: `plot.edit.menu.button.owner` });
    form.button({ translate: `mc.button.delete` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryPlotGroupDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロットグループ設定ModalForm
                plotGroupEditSettingPlotAdminDefaultForm(player, plotGroupId, true);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotGroupEditPermissionsDefaultForm(player, plotGroupId, true);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotGroupEditPlayersListDefaultForm(player, plotGroupId, true);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotGroupEditCountriesListDefaultForm(player, plotGroupId, true);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotGroupEditRolesListDefaultForm(player, plotGroupId, true);
                break;
            };
            case 5: {
                //プロットの所有者管理ActionForm
                plotGroupOwnerShowDefaultForm(player, plotGroupId, true);
                break;
            };
            case 6: {
                const playerDataBase = new DynamicProperties('player');
                /**
                 * @type {PlayerData}
                 */
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                plotGroupManager.delete(plotGroupId, playerData.country)
                settingCountryPlotGroupDefaultForm(player);
                break;
            };
        };
    });
};