import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import config from "../../../../config";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "../setting_country";
import { CheckPermission } from "../../../../lib/util";
import { editCountryNameDefaultForm } from "./name";
import { editCountryLoreDefaultForm } from "./lore";
import { editCountryPeaceDefaultForm } from "./peace";
import { editCountryInviteDefaultForm } from "./invite";
import { editTaxMainDefaultForm } from "./edit_tax/main";
import { externalAffairsMainDefaultForm } from "./ext/main";
import { publicSpawnDefaultForm } from "./public_spawn";
import { publicSettingDefaultForm } from "./public_setting";
import { webSettingDefaultForm } from "./web_setting";
/** @typedef {import("../../../../api/country/country").CountryData} CountryData */
/** @typedef {import("../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 
 * 国家レベル
 * @param {Player} player 
 * @param {undefined|CountryData} countryData
 */
export function settingCountryInfoDefaultForm(player, countryData = undefined) {
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
    if (!countryData) countryData = countryManager.countryData;

    const showBody = countryManager.nationTierLevelNeed();

    const form = new ActionFormData();
    form.title({ translate: `national.tier.level` });
    form.header({ translate: 'national.tier.level', with: [`${countryData.lv}`] });
    form.label({ rawtext: showBody });
    form.button({ translate: `national.tier.level.form.check.button` });
    form.button({ translate: `national.tier.level.form.levelup.button` });

    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (!CheckPermission(player, `editCountryName`)) {
                    countryManager.reload();
                    countryManager.nationTierLevelCheck(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 1: {
                if (!CheckPermission(player, `editCountryLore`)) {
                    countryManager.reload();
                    countryManager.nationTierLevelTryUp(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};
