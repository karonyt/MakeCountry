import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../api/country/plotgroup";
import { system } from "@minecraft/server";

/**
 * 所有者用の編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId
 */
export function plotGroupEditMainPlotOwnerDefaultForm(player, plotGroupId) {
    const plotGroupManager = new PlotGroupManager();
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `${plot?.name}` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    plotGroupEditMainPlotOwnerDefaultForm(player, plotGroupId);
                }, 10);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロット設定ModalForm
                plotGroupEditSettingFormPlotOwner(player, plotGroupId);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotGroupEditPermissionsForm(player, plotGroupId);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotGroupEditPlayersListForm(player, plotGroupId);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotGroupEditCountriesListForm(player, plotGroupId);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotGroupEditRolesListForm(player, plotGroupId);
                break;
            };
        };
    });
};