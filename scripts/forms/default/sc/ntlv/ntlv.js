import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "../setting_country";
import { CheckPermission } from "../../../../lib/util";
/** @typedef {import("../../../../api/country/country").CountryData} CountryData */
/** @typedef {import("../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 
 * 国家レベル
 * @param {Player} player 
 */
export function nationalTierLevelDefaultForm(player) {
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
    };

    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
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
