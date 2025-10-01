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
import { externalAffairsMainDefaultForm } from "./external_affairs/main";
import { publicSpawnDefaultForm } from "./public_spawn";
import { publicSettingDefaultForm } from "./public_setting";
import { webSettingDefaultForm } from "./web_setting";
/** @typedef {import("../../../../api/country/country").CountryData} CountryData */
/** @typedef {import("../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 
 * 自国の情報表示
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
                    publicSpawnDefaultForm(player);
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
