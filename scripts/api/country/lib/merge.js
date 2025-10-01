/*
併合関係のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../dyp";
import { country } from "../../api";
/**@typedef {import("../country").CountryData} CountryData*/

/**
 * 併合申請を送信
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function sendMergeRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    };
    const isCanceled = country.beforeEvents.sendMergeRequest.emit({
        countryId: id,
        targetCountryId: countryId,
        sender: player || undefined,
        type: player ? 'player' : 'system',
        cancel: false
    });
    if (isCanceled) return false;
    /**
     * @type {CountryData}
     */
    const targetCountryData = JSON.parse(countryDataBase.get(`country_${countryId}`));
    const receive = countryData?.mergeRequestReceive ?? [];
    receive.splice(receive.indexOf(countryData.id), 1);
    receive.push(countryData.id);
    targetCountryData.mergeRequestReceive = receive;
    const send = countryData?.mergeRequestSend ?? [];
    send.splice(send.indexOf(Number(countryId)), 1);
    send.push(Number(countryId));
    countryData.mergeRequestSend = send;
    countryDataBase.set(`country_${countryData.id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);
    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.merge.request`, with: [`${targetCountryData.name}`] }] })
    }
    country.afterEvents.sendMergeRequest.emit({
        countryId: id,
        targetCountryId: countryId,
        sender: player || undefined,
        type: player ? 'player' : 'system'
    });
    return true;
};

/**
 * 併合申請を拒否
 * @param {number} countryId 
 * @param {CountryData} countryData 
 * @param {number} id 
 * @param {boolean} isVaildProperty 
 * @param {DynamicProperties} countryDataBase 
 * @param {Player|undefined} player 
 * @returns {boolean}
 */
export function denyMergeRequestFunction(countryId, countryData, id, isVaildProperty, countryDataBase, player = undefined) {
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
    const send = countryData?.mergeRequestSend ? countryData.mergeRequestSend.splice(countryData.mergeRequestSend.indexOf(playerData.country), 1) : [];
    const receive = countryData?.mergeRequestReceive ? countryData.mergeRequestReceive.splice(countryData.mergeRequestReceive.indexOf(Number(id)), 1) : [];
    targetCountryData.mergeRequestSend = send;
    countryData.mergeRequestReceive = receive;

    countryDataBase.set(`country_${id}`, countryData);
    countryDataBase.set(`country_${countryId}`, targetCountryData);

    if (player) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.merge.request`, with: [`${countryData.name}`] }] })
    };

    return true;
};

