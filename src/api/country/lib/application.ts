/*
講和関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp.js";
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
export function acceptApplicationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
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

    targetCountryData.applicationPeaceRequestReceive = targetCountryData.applicationPeaceRequestReceive.filter((r: any) => r != countryData.country);
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter((r: any) => r != countryId);
    targetCountryData.applicationPeaceRequestSend = targetCountryData.applicationPeaceRequestSend.filter((r: any) => r != countryData.country);
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter((r: any) => r != countryId);
    targetCountryData.hostility = targetCountryData.hostility.filter((h: any) => h != countryData.country);
    countryData.hostility = countryData.hostility.filter((h: any) => h != countryId);
    targetCountryData.warNowCountries = targetCountryData.warNowCountries.filter((w: any) => w != countryData.country);
    countryData.warNowCountries = countryData.warNowCountries.filter((w: any) => w != countryId);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
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
export function denyApplicationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
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
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter((r: any) => r != countryId);
    targetCountryData.applicationPeaceRequestSend = targetCountryData.applicationPeaceRequestSend.filter((r: any) => r != id);

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
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
export function sendApplicationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
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
    targetCountryData.applicationPeaceRequestReceive = targetCountryData.applicationPeaceRequestReceive.filter((r: any) => r != id);
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter((r: any) => r != countryId);
    targetCountryData.applicationPeaceRequestReceive.push(id);
    countryData.applicationPeaceRequestSend.push(countryId);

    countryDataBase.set(`country_${id}`, JSON.stringify(countryData));
    countryDataBase.set(`country_${countryId}`, JSON.stringify(targetCountryData));

    if (player) {
        // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.application.request`, with: [`${targetCountryData.name}`] }] })
    };

    return true;

};