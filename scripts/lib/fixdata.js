import { world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util";
import { DynamicProperties } from "../api/dyp";

world.afterEvents.worldLoad.subscribe(() => {
    fixCountryData();
});

export function fixCountryData() {
    const countryDataBase = new DynamicProperties("country");
    /**
     * @type {Array<string>}
     */
    const countryIds = countryDataBase.idList;
    const checkCountryIds = countryIds;
    const aliveCountryIds = countryIds.map(a => Number(a.split('_')[1]));
    for (const id of checkCountryIds) {
        const countryData = GetAndParsePropertyData(id, countryDataBase);

        if (!countryData) {
            countryDataBase.delete(id);
            continue;
        }
        const allianceIds = countryData.alliance ?? [];
        let aliveAllianceCountryIds = [];
        for (const a of allianceIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveAllianceCountryIds.push(a);
            };
        };
        countryData.alliance = aliveAllianceCountryIds;

        const hostilityIds = countryData.hostility ?? [];
        let aliveHostilityCountryIds = [];
        for (const a of hostilityIds) {
            const hostilityCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!hostilityCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveHostilityCountryIds.push(a);
            };
        };
        countryData.hostility = aliveHostilityCountryIds;

        const friendlyIds = countryData.friendly ?? [];
        let aliveFriendlyCountryIds = [];
        for (const a of friendlyIds) {
            const friendlyCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!friendlyCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveFriendlyCountryIds.push(a);
            };
        };
        countryData.friendly = aliveFriendlyCountryIds;

        const friendlyRequestReceiveIds = countryData.friendlyRequestReceive ?? [];
        let aliveFriendlyRequestReceiveCountryIds = [];
        for (const a of friendlyRequestReceiveIds) {
            const friendlyCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!friendlyCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveFriendlyRequestReceiveCountryIds.push(a);
            };
        };
        countryData.friendlyRequestReceive = aliveFriendlyRequestReceiveCountryIds;

        const FriendlyRequestSendIds = countryData.allianceRequestSend ?? [];
        let aliveFriendlyRequestSendCountryIds = [];
        for (const a of FriendlyRequestSendIds) {
            const friendlyCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!friendlyCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveFriendlyRequestSendCountryIds.push(a);
            };
        };
        countryData.friendlyRequestSend = aliveFriendlyRequestSendCountryIds;

        const allianceRequestReceiveIds = countryData.allianceRequestReceive ?? [];
        let aliveAllianceRequestReceiveCountryIds = [];
        for (const a of allianceRequestReceiveIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveAllianceRequestReceiveCountryIds.push(a);
            };
        };
        countryData.allianceRequestReceive = aliveAllianceRequestReceiveCountryIds;

        const AllianceRequestSendIds = countryData.allianceRequestSend ?? [];
        let aliveAllianceRequestSendCountryIds = [];
        for (const a of AllianceRequestSendIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveAllianceRequestSendCountryIds.push(a);
            };
        };
        countryData.allianceRequestSend = aliveAllianceRequestSendCountryIds;


        const ApplicationPeaceRequestReceiveIds = countryData.applicationPeaceRequestReceive ?? [];
        let aliveApplicationPeaceRequestReceiveIds = [];
        for (const a of ApplicationPeaceRequestReceiveIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveApplicationPeaceRequestReceiveIds.push(a);
            };
        };
        countryData.applicationPeaceRequestReceive = aliveApplicationPeaceRequestReceiveIds;

        const ApplicationPeaceRequestSendIds = countryData.applicationPeaceRequestSend ?? [];
        let alivApplicationPeaceRequestSendIds = [];
        for (const a of ApplicationPeaceRequestSendIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                alivApplicationPeaceRequestSendIds.push(a);
            };
        };
        countryData.applicationPeaceRequestSend = alivApplicationPeaceRequestSendIds;

        const MergeRequestSendIds = countryData.mergeRequestSend ?? [];
        let aliveMergeRequestSendIds = [];
        for (const a of MergeRequestSendIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveMergeRequestSendIds.push(a);
            };
        };
        countryData.mergeRequestSend = aliveMergeRequestSendIds;

        const MergeRequestReceiveIds = countryData.mergeRequestReceive ?? [];
        let aliveMergeRequestReceiveIds = [];
        for (const a of MergeRequestReceiveIds) {
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveMergeRequestReceiveIds.push(a);
            };
        };
        countryData.mergeRequestReceive = aliveMergeRequestReceiveIds;

        StringifyAndSavePropertyData(id, countryData, countryDataBase);
    };
};