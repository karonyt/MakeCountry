import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../../../lib/util.js";
import { DynamicProperties } from "../../../../../api/dyp.js";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryPlotGroupDefaultForm } from "../main.js";
import { PlotGroupManager } from "../../../../../api/country/plotgroup.js";

/**
 * プロットグループ作成フォーム
 * @param {Player} player  
 */
export function CreatePlotGroupDefaultForm(player: any) {
    const isnotPlotAdmin = CheckPermission(player, `plotAdmin`);
    if (isnotPlotAdmin) {
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const playerDataBase = new DynamicProperties('player');
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        plotGroupManager.create(playerData?.country, rs.formValues[0], type[rs.formValues[1]], player);
        return;
    });
};