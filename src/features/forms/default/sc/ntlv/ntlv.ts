import { CountryActionForm as ActionFormData, CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import nationalTierLevel from "@/config/national-tier-level.js";
import { planNationalTierUpgrade } from "@/domain/country/national-tier-batch.js";
import { ItemStack } from "@minecraft/server";

import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { callSettingCountryForm } from "@/features/forms/form-registry.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
/** @typedef {import("@/domain/country/country-manager.js").CountryData} CountryData */
/** @typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 
 * 国家レベル
 * @param {Player} player 
 */
export function nationalTierLevelDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return;
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(rawPlayerData);
    if (!playerData.country || playerData.country < 1) return;
    const countryManager = new CountryManager(playerData.country);
    if (!countryManager.isVaildProperty) return;
    const countryData = countryManager.countryData;

    const showBody = countryManager.nationTierLevelNeed();

    const isMax = showBody == 'max';

    const form = new ActionFormData();
    form.title({ translate: `national.tier.level` });
    form.label({ translate: 'national.tier.level.now', with: [`${countryData.lv ?? 0}`] });
    form.divider();
    form.label(isMax ? { translate: 'national.tier.level.max' } : { rawtext: showBody });
    if (isMax) {
        form.button({ translate: 'mc.button.close' });
    } else {
        form.button({ translate: `national.tier.level.form.check.button` });
        form.button({ translate: `national.tier.level.form.levelup.button` });
        form.button("まとめてレベルアップ");
    };

    form.show(player).then(rs => {
        if (rs.canceled) {
            callSettingCountryForm(player);
            return;
        };
        if (isMax) {
            return;
        } else {
            switch (rs.selection) {
                case 0: {
                    if (!CheckPermission(player, `nationalTierLevelAdmin`)) {
                        countryManager.reload();
                        countryManager.nationTierLevelCheck(player);
                    } else {
                        player.sendMessage({ translate: `no.permission` });
                    };
                    break;
                };
                case 2: {
                    if (CheckPermission(player, 'nationalTierLevelAdmin')) {
                        player.sendMessage({ translate: 'no.permission' });
                        return;
                    }
                    nationalTierBatchForm(player, playerData.country);
                    break;
                }
                case 1: {
                    if (!CheckPermission(player, `nationalTierLevelAdmin`)) {
                        countryManager.reload();
                        countryManager.nationTierLevelTryUp(player);
                    } else {
                        player.sendMessage({ translate: `no.permission` });
                    };
                    break;
                };
            };
        }
    });
};

function nationalTierBatchForm(player: any, countryId: number) {
    const form = new ModalFormData();
    form.title("まとめてレベルアップ");
    form.textField("上げるレベル数（必要素材とRPの合計を次の画面で確認）", "例: 5", { defaultValue: "1" });
    form.show(player).then((rs) => {
        if (rs.canceled) { nationalTierLevelDefaultForm(player); return; }
        const manager = new CountryManager(countryId);
        if (!manager.isVaildProperty) return;
        const current = manager.countryData.lv ?? 0;
        const count = Number(rs.formValues?.[0]);
        const plan = planNationalTierUpgrade(current, count, nationalTierLevel.needs);
        if (!plan) {
            player.sendMessage("§c上げるレベル数は、上限までの正の整数で入力してください。");
            nationalTierBatchForm(player, countryId);
            return;
        }
        const confirm = new ActionFormData();
        confirm.title("まとめてレベルアップ：確認");
        confirm.body({ rawtext: [
            { text: `国家レベル ${plan.from} → ${plan.to}（${count}レベル）\n必要RP: ${plan.point}\n必要素材の合計:\n` },
            ...plan.item.flatMap((item) => [
                { translate: new ItemStack(item.typeId).localizationKey }, { text: ` × ${item.amount}\n` }
            ])
        ] });
        confirm.button("キャンセル");
        confirm.button("素材・RPを消費してレベルアップ");
        confirm.show(player).then((result) => {
            if (!result.canceled && result.selection === 1) manager.nationTierLevelTryUp(player, count, current);
            nationalTierLevelDefaultForm(player);
        });
    });
}
