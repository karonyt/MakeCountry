import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../api/country/plotgroup.js";
import { system } from "@minecraft/server";

/**
 * 所有者用の編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId
 */
export function plotGroupEditMainPlotOwnerDefaultForm(player: any, plotGroupId: any) {
    const plotGroupManager = new PlotGroupManager();
    // @ts-ignore TS(2304): Cannot find name 'GetAndParsePropertyData'.
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
            // @ts-ignore TS(2304): Cannot find name 'FormCancelationReason'.
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
                // @ts-ignore TS(2304): Cannot find name 'plotGroupEditSettingFormPlotOwne... Remove this comment to see the full error message
                plotGroupEditSettingFormPlotOwner(player, plotGroupId);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                // @ts-ignore TS(2304): Cannot find name 'plotGroupEditPermissionsForm'.
                plotGroupEditPermissionsForm(player, plotGroupId);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                // @ts-ignore TS(2304): Cannot find name 'plotGroupEditPlayersListForm'.
                plotGroupEditPlayersListForm(player, plotGroupId);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                // @ts-ignore TS(2304): Cannot find name 'plotGroupEditCountriesListForm'.
                plotGroupEditCountriesListForm(player, plotGroupId);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                // @ts-ignore TS(2304): Cannot find name 'plotGroupEditRolesListForm'.
                plotGroupEditRolesListForm(player, plotGroupId);
                break;
            };
        };
    });
};