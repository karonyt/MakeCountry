/*
敵対国関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp";
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
export function addHostilityFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.hostility = countryData.hostility.filter(r => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter(r => r != id);
    countryData.hostility.push(countryId);
    targetCountryData.hostility.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
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
export function removeHostilityFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.hostility = countryData.hostility.filter(r => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        //player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};