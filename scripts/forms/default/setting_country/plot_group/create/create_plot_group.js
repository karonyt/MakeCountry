import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util";
import { DynamicProperties } from "../../../../../api/dyp";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryPlotGroupDefaultForm } from "../setting_country_plot_group";
import { PlotGroupManager } from "../../../../../api/country/plotgroup";

/**
 * プロットグループ作成フォーム
 * @param {Player} player  
 */
export function CreatePlotGroupDefaultForm(player) {
    const isnotPlotAdmin = CheckPermission(player, `plotAdmin`);
    if (isnotPlotAdmin) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: `plot.public` }] },
        { rawtext: [{ translate: `plot.private` }] },
        { rawtext: [{ translate: `plot.embassy` }] },
    ];
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `form.plot.create` }] });
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] });
    form.dropdown({ rawtext: [{ translate: `plot.type` }] }, typeMessges);
    form.submitButton({ rawtext: [{ translate: `create.plotgroup.button` }] });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return settingCountryPlotGroupDefaultForm(player);
        };
        const plotGroupManager = new PlotGroupManager();
        plotGroupManager.create(playerData?.country, rs.formValues[0], type[rs.formValues[1]], player);
        return;
    });
};