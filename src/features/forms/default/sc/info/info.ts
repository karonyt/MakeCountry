import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import config from "@/config/server.js";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "@/features/forms/default/sc/setting_country.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { editCountryNameDefaultForm } from "@/features/forms/default/sc/info/name.js";
import { editCountryLoreDefaultForm } from "@/features/forms/default/sc/info/lore.js";
import { editCountryPeaceDefaultForm } from "@/features/forms/default/sc/info/peace.js";
import { editCountryInviteDefaultForm } from "@/features/forms/default/sc/info/invite.js";
import { editTaxMainDefaultForm } from "@/features/forms/default/sc/info/edit_tax/main.js";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";
import { publicSpawnDefaultForm, publicSpawnManageForm } from "@/features/forms/default/sc/info/public_spawn.js";
import { publicSettingDefaultForm } from "@/features/forms/default/sc/info/public_setting.js";
import { webSettingDefaultForm } from "@/features/forms/default/sc/info/web_setting.js";
/** @typedef {import("@/domain/country/country-manager.js").CountryData} CountryData */
/** @typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 
 * 自国の情報表示
 * @param {Player} player 
 * @param {undefined|CountryData} countryData
 */
export function settingCountryInfoDefaultForm(player: any, countryData = undefined) {
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

    const showBody = countryManager.getCountryInfoRawText();

    const form = new ActionFormData();
    form.title({ translate: `form.setting.info.title` });
    form.body(showBody);
    form.button({ translate: `form.setting.info.button.name` });
    form.button({ translate: `form.setting.info.button.lore` });
    form.button({ translate: `form.setting.info.button.peace` });
    form.button({ translate: `form.setting.info.button.invite` });
    form.button({ translate: `form.setting.info.button.tax` });
    form.button({ translate: `form.setting.info.button.external.affairs` });
    form.button({ translate: `form.setting.info.button.publicspawn` });
    form.button({ translate: `form.setting.info.button.publicsetting` });
    form.button({ translate: `form.setting.info.button.web` });

    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (!CheckPermission(player, `editCountryName`)) {
                    editCountryNameDefaultForm(player, countryData);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 1: {
                if (!CheckPermission(player, `editCountryLore`)) {
                    editCountryLoreDefaultForm(player, countryData);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 2: {
                if (!CheckPermission(player, `peaceChange`)) {
                    editCountryPeaceDefaultForm(player, countryData);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 3: {
                if (!CheckPermission(player, `inviteChange`)) {
                    editCountryInviteDefaultForm(player, countryData);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 4: {
                if (!CheckPermission(player, `taxAdmin`)) {
                    editTaxMainDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 5: {
                externalAffairsMainDefaultForm(player);
                break;
            };
            case 6: {
                if (!CheckPermission(player, `publicHomeAdmin`)) {
                    publicSpawnManageForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 7: {
                if (!CheckPermission(player, `admin`)) {
                    publicSettingDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
            case 8: {
                if (!CheckPermission(player, `admin`)) {
                    webSettingDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                };
                break;
            };
        };
    });
};
