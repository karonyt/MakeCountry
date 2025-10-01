import { Player } from "@minecraft/server";
import { settingCountryDefaultForm } from "./default/sc/setting_country";
import { countryListDefaultForm } from "./default/country_list/list";
import { MakeCountryDefaultForm } from "./default/make_country/make_country";
import { playerMainMenuDefaultForm } from "./default/menu/player_main_menu";
import { joinTypeSelectDefaultForm } from "./default/menu/join/join_type_select";

/**
 * @param {Player} player 
 */
export function callSettingCountryForm(player) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            settingCountryDefaultForm(player);
            break;
        };
        default: {
            settingCountryDefaultForm(player);
            break;
        }
    };
};

/**
 * 
 * @param {Player} player 
 * @param {boolean} al 
 */
export function callCountryListForm(player, al = false) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            countryListDefaultForm(player, al);
            break;
        };
        default: {
            countryListDefaultForm(player, al);
            break;
        };
    };
};

/**
 * 
 * @param {Player} player 
 */
export function callMakeCountryForm(player) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            MakeCountryDefaultForm(player);
            break;
        };
        default: {
            MakeCountryDefaultForm(player);
            break;
        };
    };
};

/**
 * 
 * @param {Player} player 
 */
export function callPlayerMainMenuForm(player) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            playerMainMenuDefaultForm(player);
            break;
        };
        default: {
            playerMainMenuDefaultForm(player);
            break;
        };
    };
};

/**
 * 
 * @param {Player} player 
 */
export function callJoinTypeSelectForm(player) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            joinTypeSelectDefaultForm(player);
            break;
        };
        default: {
            joinTypeSelectDefaultForm(player);
            break;
        }
    };
};