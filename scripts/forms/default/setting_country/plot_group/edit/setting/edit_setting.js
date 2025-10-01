import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../../../../api/dyp";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import config from "../../../../../../config";
import { plotGroupEditMainPlotAdminDefaultForm } from "../edit_main__admin";
import { isDecimalNumberZeroOK } from "../../../../../../lib/util";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プロットアドミンプロット設定フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 */
export function plotGroupEditSettingPlotAdminDefaultForm(player, plotGroupId) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get('player_${player.id}'));
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: 'plot.edit.menu.button.settings' }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };

    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: 'plot.public' }] },
        { rawtext: [{ translate: 'plot.private' }] },
        { rawtext: [{ translate: 'plot.embassy' }] },
    ];
    form.textField({ rawtext: [{ translate: 'plot.name' }] }, { rawtext: [{ translate: `input.plot.name` }] }, { defaultValue: plotGroupData?.name || 'new Plot' });
    form.dropdown({ rawtext: [{ translate: 'plot.type' }] }, typeMessges, { defaultValueIndex: type.indexOf(plotGroupData.type || 'public') });
    form.textField({ translate: 'plot.price', with: [`${config.MoneyName} ${plotGroupData?.price ?? 0}`] }, { translate: 'plot.price.input' }, { defaultValue: `${plotGroupData?.price || 0}` });
    form.toggle({ translate: 'plot.selling' }, { defaultValue: plotGroupData?.is_selling });
    form.toggle({ translate: 'plot.enable' }, { defaultValue: plotGroupData?.enable });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
            return;
        };
        let newPlotName = rs.formValues[0];
        if (newPlotName == '') {
            newPlotName = 'new Plot';
        };
        //値段チェック
        let price = rs.formValues[2];
        if (isDecimalNumberZeroOK(price)) {
            price = '0';
        };
        if (Number(price) < 0) {
            price = '0';
        };
        plotGroupData.name = newPlotName;
        plotGroupData.price = Math.floor(Number(price));
        plotGroupData.type = type[rs.formValues[1]];
        plotGroupData.is_selling = rs.formValues[3];
        plotGroupData.enable = rs.formValues[4];
        plotGroupManager.set(plotGroupId, plotGroupData);
        plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
        return;
    });
};