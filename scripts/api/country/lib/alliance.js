/*
同盟関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp";
/**@typedef {import("../country").CountryData} CountryData*/

/**
 * 同盟申請を受諾
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function acceptAllianceRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
    if (!isVaildProperty) {
        console.log(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.log(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != countryId);
    countryData.allianceRequestSend = countryData.allianceRequestSend.filter(r => r != countryId);
    targetCountryData.allianceRequestSend = targetCountryData.allianceRequestSend.filter(r => r != id);
    targetCountryData.allianceRequestReceive = targetCountryData.allianceRequestReceive.filter(r => r != id);
    countryData.alliance.push(countryId);
    targetCountryData.alliance.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.alliance.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;
};

/**
 * 同盟申請を拒否
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function denyAllianceRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
    if (!isVaildProperty) {
        console.log(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.log(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != countryId);
    targetCountryData.allianceRequestSend = targetCountryData.allianceRequestSend.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.alliance.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;
};

/**
 * 同盟を解除
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function removeAllianceFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
    if (!isVaildProperty) {
        console.log(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.log(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.alliance = countryData.alliance.filter(r => r != countryId);
    targetCountryData.alliance = targetCountryData.alliance.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `remove.alliance`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};

/**
 * 同盟申請を送信
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function sendAllianceRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
    if (!isVaildProperty) {
        console.log(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const rawTargetCountryData = countryDataBase.get(`country_${countryId}`);
    if (!rawTargetCountryData) {
        console.log(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    };

    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(rawTargetCountryData);
    countryData.allianceRequestSend = countryData.allianceRequestSend.filter(r => r != countryId);
    targetCountryData.allianceRequestReceive = targetCountryData.allianceRequestReceive.filter(r => r != id);
    countryData.allianceRequestSend.push(countryId);
    targetCountryData.allianceRequestReceive.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        //player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};