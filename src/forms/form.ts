import { Player } from "@minecraft/server";
import { settingCountryDefaultForm } from "./default/sc/setting_country.js";
import { countryListDefaultForm } from "./default/country_list/list.js";
import { MakeCountryDefaultForm } from "./default/make_country/make_country.js";
import { playerMainMenuDefaultForm } from "./default/menu/player_main_menu.js";
import { joinTypeSelectDefaultForm } from "./default/menu/join/join_type_select.js";

/**
 * @param {Player} player 
 */
export function callSettingCountryForm(player: any) {
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
export function callCountryListForm(player: any, al = false) {
    const uiType = player.getDynamicProperty('uiType') ?? 'default';
    switch (uiType) {
        case 'default': {
            // @ts-ignore TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
            countryListDefaultForm(player, al);
            break;
        };
        default: {
            // @ts-ignore TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
            countryListDefaultForm(player, al);
            break;
        };
    };
};

/**
 * 
 * @param {Player} player 
 */
export function callMakeCountryForm(player: any) {
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
export function callPlayerMainMenuForm(player: any) {
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
export function callJoinTypeSelectForm(player: any) {
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