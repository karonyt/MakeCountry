/*
友好国関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp";
/**@typedef {import("../country").CountryData} CountryData*/

/**
 * 友好国申請を受諾
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function acceptFriendlyRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != countryId);
    countryData.friendlyRequestSend = countryData.friendlyRequestSend.filter(r => r != countryId);
    targetCountryData.friendlyRequestSend = targetCountryData.friendlyRequestSend.filter(r => r != id);
    targetCountryData.friendlyRequestReceive = targetCountryData.friendlyRequestReceive.filter(r => r != id);
    countryData.friendly.push(countryId);
    targetCountryData.friendly.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};

/**
 * 友好申請を拒否
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function denyFriendlyRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != countryId);
    targetCountryData.friendlyRequestSend = targetCountryData.friendlyRequestSend.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;
};

/**
 * 友好を解除
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function removeFriendlyFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.friendly = countryData.friendly.filter(r => r != countryId);
    targetCountryData.friendly = targetCountryData.friendly.filter(r => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        //player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.friendly.request`, with: [`${countryData.name}`] }] })
    };

    return true;
};

/**
 * 友好申請を送信
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function sendFriendlyRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    countryData.friendlyRequestSend = countryData.friendlyRequestSend.filter(r => r != countryId);
    targetCountryData.friendlyRequestReceive = targetCountryData.friendlyRequestReceive.filter(r => r != id);
    countryData.friendlyRequestSend.push(countryId);
    targetCountryData.friendlyRequestReceive.push(id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    console.log(`友好申請を送ったよ\n${countryData.name} → ${targetCountryData.name}`);
    if (player) {
        //player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${targetCountryData.name}`] }] })
    };
    return true;
};