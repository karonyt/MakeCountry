/*
連邦政府のfunction
*/

import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

export const defaultFederationPermission = [`blockUse`, `entityUse`, `openContainer`, `itemUse`, `noTarget`, `setHome`, `publicHomeUse`];

export const defaultFederationSettings = {
    showInChat: true,
    showOnTerritoryEnter: true,
    showOnMap: true
};

export function createEmptyFederationData() {
    return {
        name: "",
        description: "",
        leader: "",
        subLeaders: [],
        members: [],
        capital: "",
        treasury: 0,
        taxRate: 0,
        requests: [],
        unpaidTaxes: {},
        settings: { ...defaultFederationSettings }
    };
}

function uniqueNumberList(list: any) {
    if (!Array.isArray(list)) return [];
    return Array.from(new Set(list.map((v: any) => Number(v)).filter((v: any) => Number.isFinite(v) && v > 0)));
}

function removeCountryId(list: any, value: any) {
    const target = Number(value);
    return uniqueNumberList(list).filter((v: any) => v !== target);
}

function normalizeMoney(value: any) {
    const num = Number(value);
    return Number.isFinite(num) ? Math.max(0, num) : 0;
}

function roundMoney(value: any) {
    return Math.floor(normalizeMoney(value) * 100) / 100;
}

function normalizeTaxRate(value: any) {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;
    return Math.min(100, Math.max(0, num));
}

function normalizeUnpaidTaxes(value: any) {
    const result: any = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return result;
    for (const [countryId, amount] of Object.entries(value)) {
        const id = Number(countryId);
        const money = normalizeMoney(amount);
        if (Number.isFinite(id) && id > 0 && money > 0) result[id] = money;
    }
    return result;
}

function federationKey(federation: any) {
    const members = uniqueNumberList(federation?.members).sort((a: any, b: any) => a - b).join(",");
    return `${federation?.name ?? ""}|${federation?.leader ?? ""}|${members}`;
}

function sendFederationMessage(player: any, translate: string, value = "") {
    if (!player) return;
    // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'never'.
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate, with: [`${value}`] }] });
}

function getCountryData(countryDataBase: DynamicProperties, countryId: any) {
    const raw = countryDataBase.get(`country_${countryId}`);
    return raw ? JSON.parse(raw) : undefined;
}

function saveCountryData(countryDataBase: DynamicProperties, countryData: any) {
    if (!countryData?.id) return;
    countryDataBase.set(`country_${countryData.id}`, countryData);
}

export function normalizeFederationData(countryData: any) {
    if (!countryData) return createEmptyFederationData();
    const raw = countryData.federation;

    if (Array.isArray(raw)) {
        const legacyMembers = uniqueNumberList([countryData.id, ...raw]);
        countryData.federation = raw.length > 0
            ? {
                name: `${countryData.name ?? "Federation"}`,
                description: "",
                leader: `${countryData.owner ?? ""}`,
                subLeaders: [],
                members: legacyMembers,
                capital: countryData.id ?? legacyMembers[0] ?? "",
                treasury: 0,
                taxRate: 0,
                requests: [],
                unpaidTaxes: {},
                settings: { ...defaultFederationSettings }
            }
            : createEmptyFederationData();
    } else if (!raw || typeof raw !== "object") {
        countryData.federation = createEmptyFederationData();
    } else {
        countryData.federation.name = `${raw.name ?? ""}`;
        countryData.federation.description = `${raw.description ?? raw.lore ?? ""}`;
        countryData.federation.leader = `${raw.leader ?? ""}`;
        countryData.federation.subLeaders = Array.isArray(raw.subLeaders) ? Array.from(new Set(raw.subLeaders.map((v: any) => `${v}`).filter(Boolean))) : [];
        countryData.federation.members = uniqueNumberList(raw.members);
        countryData.federation.capital = raw.capital === undefined || raw.capital === null ? "" : raw.capital;
        countryData.federation.treasury = normalizeMoney(raw.treasury);
        countryData.federation.taxRate = normalizeTaxRate(raw.taxRate);
        countryData.federation.requests = uniqueNumberList(raw.requests);
        countryData.federation.unpaidTaxes = normalizeUnpaidTaxes(raw.unpaidTaxes);
        countryData.federation.settings = {
            ...defaultFederationSettings,
            ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {})
        };
    }

    countryData.federationPermission ??= [...defaultFederationPermission];
    return countryData.federation;
}

export function isFederationActive(federation: any) {
    return !!federation?.name && Array.isArray(federation.members) && federation.members.length > 0;
}

export function getFederationMemberIds(countryData: any) {
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return [];
    return uniqueNumberList(federation.members);
}

export function getFederationRequestCountryIds(countryData: any) {
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return [];
    return uniqueNumberList(federation.requests);
}

export function areCountriesInSameFederation(firstCountryData: any, secondCountryData: any) {
    if (!firstCountryData || !secondCountryData || firstCountryData.id === secondCountryData.id) return false;
    const firstFederation = normalizeFederationData(firstCountryData);
    const secondFederation = normalizeFederationData(secondCountryData);
    if (!isFederationActive(firstFederation) || !isFederationActive(secondFederation)) return false;

    const firstMembers = uniqueNumberList(firstFederation.members);
    const secondMembers = uniqueNumberList(secondFederation.members);
    return firstMembers.includes(Number(secondCountryData.id)) || secondMembers.includes(Number(firstCountryData.id));
}

export function isFederationLeader(player: Player, countryData: any) {
    const federation = normalizeFederationData(countryData);
    return isFederationActive(federation) && federation.leader === player.id;
}

export function isFederationSubLeader(player: Player, countryData: any) {
    const federation = normalizeFederationData(countryData);
    return isFederationActive(federation) && federation.subLeaders?.includes(player.id);
}

export function saveFederationToMembers(countryDataBase: DynamicProperties, federationData: any) {
    const federation = {
        name: `${federationData?.name ?? ""}`,
        description: `${federationData?.description ?? ""}`,
        leader: `${federationData?.leader ?? ""}`,
        subLeaders: Array.isArray(federationData?.subLeaders) ? Array.from(new Set(federationData.subLeaders.map((v: any) => `${v}`).filter(Boolean))) : [],
        members: uniqueNumberList(federationData?.members),
        capital: federationData?.capital ?? "",
        treasury: normalizeMoney(federationData?.treasury),
        taxRate: normalizeTaxRate(federationData?.taxRate),
        requests: uniqueNumberList(federationData?.requests),
        unpaidTaxes: normalizeUnpaidTaxes(federationData?.unpaidTaxes),
        settings: {
            ...defaultFederationSettings,
            ...(federationData?.settings && typeof federationData.settings === "object" ? federationData.settings : {})
        }
    };

    if (!isFederationActive(federation)) return;

    const aliveMembers = [];
    for (const countryId of federation.members) {
        const memberData = getCountryData(countryDataBase, countryId);
        if (!memberData) continue;
        aliveMembers.push(Number(countryId));
    }
    federation.members = aliveMembers;
    if (!federation.members.includes(Number(federation.capital))) {
        federation.capital = federation.members[0] ?? "";
    }

    for (const countryId of federation.members) {
        const memberData = getCountryData(countryDataBase, countryId);
        if (!memberData) continue;
        memberData.federation = {
            ...federation,
            subLeaders: [...federation.subLeaders],
            members: [...federation.members],
            requests: [...federation.requests],
            unpaidTaxes: { ...federation.unpaidTaxes },
            settings: { ...federation.settings }
        };
        memberData.federationPermission ??= [...defaultFederationPermission];
        saveCountryData(countryDataBase, memberData);
    }
}

export function listFederationGovernments(countryDataBase: DynamicProperties) {
    const result: any = [];
    const seen = new Set();
    for (const key of countryDataBase.idList) {
        const raw = countryDataBase.get(key);
        if (!raw) continue;
        const countryData = JSON.parse(raw);
        const federation = normalizeFederationData(countryData);
        if (!isFederationActive(federation)) continue;
        const keyName = federationKey(federation);
        if (seen.has(keyName)) continue;
        seen.add(keyName);
        result.push({ countryData, federation });
    }
    return result;
}

function clearFederation(countryData: any) {
    countryData.federation = createEmptyFederationData();
}

function removeMutualRelations(countryData: any, targetCountryData: any) {
    const ownCountryId = Number(countryData.id);
    const targetCountryId = Number(targetCountryData.id);
    for (const key of [`alliance`, `friendly`, `hostility`, `warNowCountries`, `declarationSend`, `declarationReceive`]) {
        countryData[key] = removeCountryId(countryData[key], targetCountryId);
        targetCountryData[key] = removeCountryId(targetCountryData[key], ownCountryId);
    }
}

function ensureLeaderStillInFederation(countryDataBase: DynamicProperties, federation: any) {
    for (const countryId of federation.members) {
        const countryData = getCountryData(countryDataBase, countryId);
        if (!countryData) continue;
        if (countryData.members?.includes(federation.leader)) return;
    }

    const firstCountryData = getCountryData(countryDataBase, federation.members[0]);
    federation.leader = firstCountryData?.owner ?? "";
}

/**
 * 連邦政府を作成
 * @param {string} federationName
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function createFederationFunction(federationName: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const name = `${federationName ?? ""}`.trim();
    if (!name) {
        sendFederationMessage(player, `federation.error.name`);
        return false;
    }

    const federation = normalizeFederationData(countryData);
    if (isFederationActive(federation)) {
        sendFederationMessage(player, `federation.government.already`, federation.name);
        return false;
    }

    countryData.federation = {
        name,
        description: "",
        leader: (player as any)?.id ?? countryData.owner ?? "",
        subLeaders: [],
        members: [Number(id)],
        capital: Number(id),
        treasury: 0,
        taxRate: 0,
        requests: [],
        unpaidTaxes: {},
        settings: { ...defaultFederationSettings }
    };
    countryData.federationPermission ??= [...defaultFederationPermission];
    saveCountryData(countryDataBase, countryData);
    sendFederationMessage(player, `federation.government.created`, name);
    return true;
}

/**
 * 連邦加盟申請を送信
 * @param {number} countryId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function sendFederationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    const targetCountryId = Number(countryId);
    const ownCountryId = Number(id);
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const targetCountryData = getCountryData(countryDataBase, targetCountryId);
    if (!targetCountryData || targetCountryId === ownCountryId) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    }

    const ownFederation = normalizeFederationData(countryData);
    if (isFederationActive(ownFederation)) {
        sendFederationMessage(player, `federation.government.already`, ownFederation.name);
        return false;
    }

    const targetFederation = normalizeFederationData(targetCountryData);
    if (!isFederationActive(targetFederation)) {
        sendFederationMessage(player, `federation.error.not_found`);
        return false;
    }

    targetFederation.requests = removeCountryId(targetFederation.requests, ownCountryId);
    targetFederation.requests.push(ownCountryId);
    saveFederationToMembers(countryDataBase, targetFederation);
    sendFederationMessage(player, `sent.federation.request`, targetFederation.name);
    return true;
}

/**
 * 連邦加盟申請を受諾
 * @param {number} countryId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function acceptFederationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    const targetCountryId = Number(countryId);
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const targetCountryData = getCountryData(countryDataBase, targetCountryId);
    if (!targetCountryData) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    }

    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation) || !federation.requests.includes(targetCountryId)) return false;

    const targetFederation = normalizeFederationData(targetCountryData);
    if (isFederationActive(targetFederation)) {
        federation.requests = removeCountryId(federation.requests, targetCountryId);
        saveFederationToMembers(countryDataBase, federation);
        return false;
    }

    for (const memberId of federation.members) {
        const memberData = getCountryData(countryDataBase, memberId);
        if (!memberData) continue;
        removeMutualRelations(memberData, targetCountryData);
        saveCountryData(countryDataBase, memberData);
    }

    federation.requests = removeCountryId(federation.requests, targetCountryId);
    federation.members = uniqueNumberList([...federation.members, targetCountryId]);
    targetCountryData.federation = { ...federation, members: [...federation.members], requests: [...federation.requests] };
    targetCountryData.federationPermission ??= [...defaultFederationPermission];
    saveCountryData(countryDataBase, targetCountryData);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `accept.federation.request`, targetCountryData.name);
    return true;
}

/**
 * 連邦加盟申請を拒否
 * @param {number} countryId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function denyFederationRequestFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    const targetCountryId = Number(countryId);
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const targetCountryData = getCountryData(countryDataBase, targetCountryId);
    if (!targetCountryData) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    }

    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    federation.requests = removeCountryId(federation.requests, targetCountryId);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `deny.federation.request`, targetCountryData.name);
    return true;
}

/**
 * 連邦から構成国を除名
 * @param {number} countryId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function removeFederationFunction(countryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    const targetCountryId = Number(countryId);
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const targetCountryData = getCountryData(countryDataBase, targetCountryId);
    if (!targetCountryData) {
        console.error(`[MakeCountry CountryManager] The Country ${countryId} is not vaild.`);
        return false;
    }

    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation) || !federation.members.includes(targetCountryId)) return false;

    federation.members = removeCountryId(federation.members, targetCountryId);
    federation.requests = removeCountryId(federation.requests, targetCountryId);
    if (Number(federation.capital) === targetCountryId) federation.capital = federation.members[0] ?? "";
    clearFederation(targetCountryData);
    saveCountryData(countryDataBase, targetCountryData);

    if (federation.members.length === 0) {
        sendFederationMessage(player, `remove.federation`, targetCountryData.name);
        return true;
    }

    ensureLeaderStillInFederation(countryDataBase, federation);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `remove.federation`, targetCountryData.name);
    return true;
}

/**
 * 自国が連邦から脱退
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function leaveFederationFunction(countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;

    federation.members = removeCountryId(federation.members, id);
    federation.requests = removeCountryId(federation.requests, id);
    if (Number(federation.capital) === Number(id)) federation.capital = federation.members[0] ?? "";
    clearFederation(countryData);
    saveCountryData(countryDataBase, countryData);

    if (federation.members.length > 0) {
        ensureLeaderStillInFederation(countryDataBase, federation);
        saveFederationToMembers(countryDataBase, federation);
    }

    sendFederationMessage(player, `federation.left`, federation.name);
    return true;
}

/**
 * 連邦首都を設定
 * @param {number} capitalCountryId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function setFederationCapitalFunction(capitalCountryId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const federation = normalizeFederationData(countryData);
    const capitalId = Number(capitalCountryId);
    if (!isFederationActive(federation) || !federation.members.includes(capitalId)) return false;
    const capitalCountryData = getCountryData(countryDataBase, capitalId);
    if (!capitalCountryData) return false;

    federation.capital = capitalId;
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.capital.changed`, capitalCountryData.name);
    return true;
}

/**
 * 連邦代表を譲渡
 * @param {string} playerId
 * @param {CountryData} countryData
 * @param {number} id
 * @param {boolean} isVaildProperty
 * @param {DynamicProperties} countryDataBase
 * @param {Player|undefined} player
 * @returns {boolean}
 */
export function transferFederationLeaderFunction(playerId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) {
        console.error(`[MakeCountry CountryManager] The Country ${id} is not vaild.`);
        return false;
    }
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;

    let found = false;
    for (const countryId of federation.members) {
        const memberCountryData = getCountryData(countryDataBase, countryId);
        if (memberCountryData?.members?.includes(playerId)) {
            found = true;
            break;
        }
    }
    if (!found) return false;

    federation.leader = `${playerId}`;
    federation.subLeaders = federation.subLeaders.filter((id: any) => id !== `${playerId}`);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.leader.transferred`);
    return true;
}

export function updateFederationBasicFunction(name: any, description: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    const nextName = `${name ?? ""}`.trim();
    if (!nextName) {
        sendFederationMessage(player, `federation.error.name`);
        return false;
    }
    federation.name = nextName;
    federation.description = `${description ?? ""}`;
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.settings.saved`);
    return true;
}

export function updateFederationSettingsFunction(settings: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    federation.settings = {
        ...defaultFederationSettings,
        ...(settings && typeof settings === "object" ? settings : {})
    };
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.settings.saved`);
    return true;
}

export function setFederationTaxRateFunction(taxRate: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    federation.taxRate = normalizeTaxRate(taxRate);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.tax.saved`, `${federation.taxRate}`);
    return true;
}

export function addFederationSubLeaderFunction(playerId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    const targetId = `${playerId ?? ""}`;
    if (!targetId || targetId === federation.leader) return false;

    let found = false;
    for (const countryId of federation.members) {
        const memberCountryData = getCountryData(countryDataBase, countryId);
        if (memberCountryData?.members?.includes(targetId)) {
            found = true;
            break;
        }
    }
    if (!found) return false;

    federation.subLeaders = Array.from(new Set([...(federation.subLeaders ?? []), targetId]));
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.subleader.added`);
    return true;
}

export function removeFederationSubLeaderFunction(playerId: any, countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    federation.subLeaders = (federation.subLeaders ?? []).filter((id: any) => id !== `${playerId}`);
    saveFederationToMembers(countryDataBase, federation);
    sendFederationMessage(player, `federation.subleader.removed`);
    return true;
}

export function disbandFederationFunction(countryData: any, id: any, isVaildProperty: any, countryDataBase: any, player = undefined) {
    if (!isVaildProperty) return false;
    const federation = normalizeFederationData(countryData);
    if (!isFederationActive(federation)) return false;
    const federationName = federation.name;
    for (const countryId of federation.members) {
        const memberData = getCountryData(countryDataBase, countryId);
        if (!memberData) continue;
        clearFederation(memberData);
        saveCountryData(countryDataBase, memberData);
    }
    sendFederationMessage(player, `federation.disbanded`, federationName);
    return true;
}

export function collectFederationTaxes(countryDataBase: DynamicProperties) {
    for (const { federation } of listFederationGovernments(countryDataBase)) {
        if (!isFederationActive(federation) || Number(federation.taxRate) <= 0) continue;
        let changed = false;
        federation.treasury = roundMoney(federation.treasury);
        federation.unpaidTaxes = normalizeUnpaidTaxes(federation.unpaidTaxes);

        for (const countryId of federation.members) {
            const countryData = getCountryData(countryDataBase, countryId);
            if (!countryData) continue;
            const countryMoney = roundMoney(countryData.money);
            const baseDue = roundMoney(countryMoney * (Number(federation.taxRate) / 100));
            const previousUnpaid = roundMoney(federation.unpaidTaxes[countryId] ?? 0);
            const due = roundMoney(baseDue + previousUnpaid);
            if (due <= 0) continue;

            const payment = Math.min(countryMoney, due);
            const unpaid = roundMoney(due - payment);

            if (payment > 0) {
                countryData.money = roundMoney(countryMoney - payment);
                federation.treasury = roundMoney(federation.treasury + payment);
                saveCountryData(countryDataBase, countryData);
            }

            if (unpaid > 0) {
                federation.unpaidTaxes[countryId] = unpaid;
            } else {
                delete federation.unpaidTaxes[countryId];
            }
            changed = true;
        }

        if (changed) saveFederationToMembers(countryDataBase, federation);
    }
}
