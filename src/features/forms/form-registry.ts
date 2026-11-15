import { Player } from "@minecraft/server";
import { settingCountryDefaultForm } from "@/features/forms/default/sc/setting_country.js";
import { countryListDefaultForm } from "@/features/forms/default/country_list/list.js";
import { MakeCountryDefaultForm } from "@/features/forms/default/make_country/make_country.js";
import { playerMainMenuDefaultForm } from "@/features/forms/default/menu/player_main_menu.js";
import { joinTypeSelectDefaultForm } from "@/features/forms/default/menu/join/join_type_select.js";
import { playerMainMenuKingdomsForm, settingCountryKingdomsForm } from "@/features/forms/kingdoms/index.js";
import { joinTypeSelectKingdomsForm } from "@/features/forms/kingdoms/join.js";
import { playerMainMenuTownyForm, settingCountryTownyForm, joinTypeSelectTownyForm } from "@/features/forms/towny/index.js";

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
        case 'kingdoms': {
            settingCountryKingdomsForm(player);
            break;
        };
        case 'towny': {
            settingCountryTownyForm(player);
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
        case 'kingdoms': {
            playerMainMenuKingdomsForm(player);
            break;
        };
        case 'towny': {
            playerMainMenuTownyForm(player);
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
        case 'kingdoms': {
            joinTypeSelectKingdomsForm(player);
            break;
        };
        case 'towny': {
            joinTypeSelectTownyForm(player);
            break;
        };
        default: {
            joinTypeSelectDefaultForm(player);
            break;
        }
    };
};
