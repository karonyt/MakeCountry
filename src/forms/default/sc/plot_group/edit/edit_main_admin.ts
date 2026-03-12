import { Player } from "@minecraft/server";
import { ActionForm } from "../../../../../lib/form_class.js";
import { settingCountryPlotGroupDefaultForm } from "../main.js";
import { PlotGroupManager } from "../../../../../api/country/plotgroup.js";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { plotGroupEditPermissionsDefaultForm } from "./perm/main.js";
import { plotGroupEditSettingPlotAdminDefaultForm } from "./setting/edit_setting.js";
import { plotGroupEditPlayersListDefaultForm } from "./pl/players_list.js";
import { plotGroupEditCountriesListDefaultForm } from "./cl/countries_list.js";
import { plotGroupEditRolesListDefaultForm } from "./rl/roles_list.js";
import { plotGroupOwnerShowDefaultForm } from "./owner/owner.js";
/**@typedef {import("../../../../../jsdoc/plot").PlotGroupData} PlotGroupData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プロットアドミン用のプロットグループ編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId
 */
export function plotGroupEditMainPlotAdminDefaultForm(player: any, plotGroupId: any) {
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
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            settingCountryPlotGroupDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロットグループ設定ModalForm
                // @ts-ignore TS(2554): Expected 2 arguments, but got 3.
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
                // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                plotGroupManager.delete(plotGroupId, playerData.country)
                settingCountryPlotGroupDefaultForm(player);
                break;
            };
        };
    });
};