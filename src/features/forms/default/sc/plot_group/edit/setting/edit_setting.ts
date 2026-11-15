import { PlotModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { parsePrice, groupSetMapAppearance, PLOT_MAP_PATTERNS, PLOT_MAP_PATTERN_NAMES } from "@/domain/country/plot-service.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import config from "@/config/server.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_admin.js";
import { isDecimalNumberZeroOK } from "@/shared/utils/minecraft.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * プロットアドミンプロット設定フォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 */
export function plotGroupEditSettingPlotAdminDefaultForm(player: any, plotGroupId: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
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
    form.textField("Webマップの色（空欄は本国の色）", "#RRGGBB（例: #3399ff）", { defaultValue: plotGroupData.mapColor || "" });
    form.dropdown("Webマップの柄（公開グループ）", PLOT_MAP_PATTERN_NAMES, { defaultValueIndex: Math.max(0, PLOT_MAP_PATTERNS.indexOf(plotGroupData.mapPattern as any)) });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
            return;
        };
        const appearance = groupSetMapAppearance(player, `#${plotGroupId}`, String(rs.formValues?.[5] ?? ""), PLOT_MAP_PATTERNS[Number(rs.formValues?.[6] ?? 0)] ?? "");
        if (!appearance.ok) {
            player.sendMessage(appearance.message);
            plotGroupEditSettingPlotAdminDefaultForm(player, plotGroupId);
            return;
        }
        // 共通処理で権限を再確認し保存した、最新の柄と色を引き継ぐ。
        plotGroupData = plotGroupManager.get(plotGroupId)!;
        let newPlotName = `${rs.formValues?.[0] ?? ""}`;
        if (newPlotName == '') {
            newPlotName = 'new Plot';
        };
        //値段チェック
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        // 値段は 0 以上の整数だけ。読めない値は前の値段のままにして、そう伝える
        const parsedPrice = parsePrice(rs.formValues?.[2]);
        if (parsedPrice === null) player.sendMessage("§c[プロット] 値段は 0 以上の整数で入れてください。値段は変えていません。");
        let price = `${parsedPrice ?? plotGroupData?.price ?? 0}`;
        plotGroupData.name = newPlotName;
        plotGroupData.price = Math.floor(Number(price));
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        plotGroupData.type = type[Number(rs.formValues?.[1] ?? 0)] as any;
        plotGroupData.is_selling = Boolean(rs.formValues?.[3]);
        plotGroupData.enable = Boolean(rs.formValues?.[4]);
        plotGroupManager.set(plotGroupId, JSON.stringify(plotGroupData));
        plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
        return;
    });
};
