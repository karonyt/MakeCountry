/*
敵対国関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp.js";
/**@typedef {import("../country").CountryData} CountryData*/

/**
 * 敵対する
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function addHostilityFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.hostility = countryData.hostility.filter((r: any) => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter((r: any) => r != id);
    countryData.hostility.push(countryId);
    targetCountryData.hostility.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `add.hostility.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};

/**
 * 敵対を解除
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function removeHostilityFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.hostility = countryData.hostility.filter((r: any) => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter((r: any) => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        //player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};