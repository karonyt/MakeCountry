/*
講和関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp";
/**@typedef {import("../country").CountryData} CountryData*/

/**
 * 講和国申請を受諾
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function acceptApplicationRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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

    targetCountryData.applicationPeaceRequestReceive = targetCountryData.applicationPeaceRequestReceive.filter(r => r != countryData.country);
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter(r => r != countryId);
    targetCountryData.applicationPeaceRequestSend = targetCountryData.applicationPeaceRequestSend.filter(r => r != countryData.country);
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter(h => h != countryData.country);
    countryData.hostility = countryData.hostility.filter(h => h != countryId);
    targetCountryData.warNowCountries = targetCountryData.warNowCountries.filter(w => w != countryData.country);
    countryData.warNowCountries = countryData.warNowCountries.filter(w => w != countryId);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.application.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};

/**
 * 講和申請を拒否
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function denyApplicationRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != countryId);
    targetCountryData.applicationPeaceRequestSend = targetCountryData.applicationPeaceRequestSend.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.application.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;

};

/**
 * 講和申請を送信
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function sendApplicationRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    targetCountryData.applicationPeaceRequestReceive = targetCountryData.applicationPeaceRequestReceive.filter(r => r != id);
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter(r => r != countryId);
    targetCountryData.applicationPeaceRequestReceive.push(id);
    countryData.applicationPeaceRequestSend.push(countryId);

    countryDataBase.set(`country_${id}`, JSON.stringify(countryData));
    countryDataBase.set(`country_${countryId}`, JSON.stringify(targetCountryData));

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.application.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;

};