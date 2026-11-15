import { world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { createEmptyFederationData, defaultFederationPermission, isFederationActive, normalizeFederationData, saveFederationToMembers } from "@/domain/country/relationships/federation.js";

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
    const aliveCountryIds = countryIds.map((a: any) => Number(a.split('_')[1]));
    for (const id of checkCountryIds) {
        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
        const countryData = GetAndParsePropertyData(id, countryDataBase);

        if (!countryData) {
            countryDataBase.delete(id);
            continue;
        }
        const roles = countryData.roles ?? [];
        for (const roleId of roles) {
            const roleDB = new DynamicProperties('role');
            const rawRoleData = roleDB.get(`role_${roleId}`);
            if (rawRoleData) {
                const roleData = JSON.parse(rawRoleData);
                if (!roleData?.permissions) {
                    roleData.permissions = [];
                };
                if (!roleData?.icon) {
                    switch (roleId) {
                        case countryData.ownerRole: {
                            roleData.icon = `textures/blocks/gold_block`
                            break;
                        };
                        case countryData.adminRole: {
                            roleData.icon = `textures/blocks/iron_block`
                            break;
                        };
                        case countryData.peopleRole: {
                            roleData.icon = `textures/blocks/stone`
                            break;
                        };
                        default: {
                            roleData.icon = `textures/blocks/stone`
                            break;
                        };
                    };
                };
                // shop 権限は全国家で既定 ON。既存国の People ロールにも補完する。
                if (roleId === countryData.peopleRole) {
                    roleData.permissions = [...new Set([
                        ...(roleData.permissions ?? []),
                        `shopBuy`,
                        `shopSell`,
                    ])];
                }
                if (!roleData?.permissions) {
                    switch (roleId) {
                        case countryData.ownerRole: {
                            roleData.permissions = [`admin`]
                            break;
                        };
                        case countryData.adminRole: {
                            roleData.permissions = [`admin`]
                            break;
                        };
                        case countryData.peopleRole: {
                            roleData.permissions = [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`]
                            break;
                        };
                        default: {
                            roleData.permissions = []
                            break;
                        };
                    };
                };
                if (!roleData?.members) {
                    switch (roleId) {
                        case countryData.ownerRole: {
                            roleData.members = [countryData.owner]
                            break;
                        };
                        case countryData.adminRole: {
                            roleData.members = []
                            break;
                        };
                        case countryData.peopleRole: {
                            roleData.members = countryData.members ?? []
                            break;
                        };
                        default: {
                            roleData.members = []
                            break;
                        };
                    };
                };
                if (!roleData?.color) {
                    switch (roleId) {
                        case countryData.ownerRole: {
                            roleData.color = 'e'
                            break;
                        };
                        case countryData.adminRole: {
                            roleData.color = 'f'
                            break;
                        };
                        case countryData.peopleRole: {
                            roleData.color = 'a';
                            break;
                        };
                        default: {
                            roleData.color = 'b';
                            break;
                        };
                    };
                };
                roleDB.set(`role_${roleId}`, JSON.stringify(roleData));
            } else {
                switch (roleId) {
                    case countryData.ownerRole: {
                        roleDB.set(`role_${roleId}`, JSON.stringify({ name: `Owner`, permissions: [`admin`], icon: `textures/blocks/gold_block`, color: `e`, members: [countryData.owner] }));
                        break;
                    };
                    case countryData.adminRole: {
                        roleDB.set(`role_${roleId}`, JSON.stringify({ name: `Admin`, permissions: [`admin`], icon: `textures/blocks/iron_block`, color: `f`, members: [] }));
                        break;
                    };
                    case countryData.peopleRole: {
                        roleDB.set(`role_${roleId}`, JSON.stringify({ name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`, `shopBuy`, `shopSell`], icon: `textures/blocks/stone`, color: `a`, members: countryData.members ?? [] }));
                        break;
                    };
                    default: {
                        roleDB.set(`role_${roleId}`, JSON.stringify({ name: `New Role`, permissions: [], icon: `textures/blocks/stone`, color: `b`, members: [] }));
                        break;
                    };
                };
            };
        };

        const allianceIds = countryData.alliance ?? [];
        let aliveAllianceCountryIds = [];
        for (const a of allianceIds) {
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveAllianceCountryIds.push(a);
            };
        };
        countryData.alliance = aliveAllianceCountryIds;

        const federationData = normalizeFederationData(countryData);
        federationData.members = (federationData.members ?? []).filter((a: any) => aliveCountryIds.includes(Number(a)));
        federationData.requests = (federationData.requests ?? []).filter((a: any) => aliveCountryIds.includes(Number(a)));
        if (!federationData.members.length) {
            countryData.federation = createEmptyFederationData();
        } else {
            if (!federationData.members.includes(Number(countryData.id))) federationData.members.push(Number(countryData.id));
            if (!federationData.capital || !aliveCountryIds.includes(Number(federationData.capital))) {
                federationData.capital = federationData.members[0] ?? "";
            }
        }
        countryData.federationPermission ??= [...defaultFederationPermission];

        const hostilityIds = countryData.hostility ?? [];
        let aliveHostilityCountryIds = [];
        for (const a of hostilityIds) {
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveAllianceRequestSendCountryIds.push(a);
            };
        };
        countryData.allianceRequestSend = aliveAllianceRequestSendCountryIds;

        delete countryData.federationRequestReceive;
        delete countryData.federationRequestSend;

        const ApplicationPeaceRequestReceiveIds = countryData.applicationPeaceRequestReceive ?? [];
        let aliveApplicationPeaceRequestReceiveIds = [];
        for (const a of ApplicationPeaceRequestReceiveIds) {
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
            // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
            const allianceCountryData = GetAndParsePropertyData(`country_${a}`, countryDataBase);
            if (!allianceCountryData) continue;
            if (aliveCountryIds.includes(a)) {
                aliveMergeRequestReceiveIds.push(a);
            };
        };
        countryData.mergeRequestReceive = aliveMergeRequestReceiveIds;

        // shop は中立国・同盟国・友好国にも既定で許可する。
        // 国別の上書きがある場合は共通設定より優先されるため、そちらにも補完する。
        for (const key of [`neutralityPermission`, `alliancePermission`, `friendlyPermission`]) {
            countryData[key] = [...new Set([
                ...(countryData[key] ?? []),
                `shopBuy`,
                `shopSell`,
            ])];
        }
        for (const key of [`allianceCountryPermissions`, `friendlyCountryPermissions`]) {
            countryData[key] = (countryData[key] ?? []).map((entry: any) => ({
                ...entry,
                permissions: [...new Set([
                    ...(entry.permissions ?? []),
                    `shopBuy`,
                    `shopSell`,
                ])],
            }));
        }

        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
        StringifyAndSavePropertyData(id, countryData, countryDataBase);
    };

    const syncedFederations = new Set();
    for (const id of countryDataBase.idList) {
        const countryData = GetAndParsePropertyData(id, countryDataBase);
        if (!countryData) continue;
        const federationData = normalizeFederationData(countryData);
        if (!isFederationActive(federationData)) continue;
        const key = `${federationData.name}|${federationData.leader}|${[...federationData.members].sort((a: any, b: any) => a - b).join(",")}`;
        if (syncedFederations.has(key)) continue;
        syncedFederations.add(key);
        saveFederationToMembers(countryDataBase, federationData);
    }
};

function validStoredPlayerId(value: unknown): value is string {
    return typeof value === "string" && value.length > 0 && value !== "undefined" && value !== "null";
}

function uniqueIds(values: unknown): string[] {
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(String).filter(validStoredPlayerId))];
}

function sameIds(left: unknown, right: unknown): boolean {
    return JSON.stringify(left ?? []) === JSON.stringify(right ?? []);
}

/**
 * country.members / player.country / role.members / player.roles を一度だけ整合させる。
 *
 * player.country は所属先が一つだけなので通常会員の正とし、country.owner は国王の正とする。
 * 実行は自動ではなく `karo:repaircountryconsistency` から明示的に行う。
 */
export function* repairCountryConsistency() {
    const countryDataBase = new DynamicProperties("country");
    const roleDataBase = new DynamicProperties("role");
    const playerDataBase = new DynamicProperties("player");
    const countries = new Map<number, { key: string, data: any }>();
    const players = new Map<string, { key: string, data: any }>();
    const invalidPlayers: Array<{ key: string, data: any }> = [];
    let processed = 0;

    for (const key of countryDataBase.idList) {
        const raw = countryDataBase.get(key);
        if (!raw) continue;
        try {
            const data = JSON.parse(raw);
            const id = Number(data?.id ?? `${key}`.replace(/^country_/, ""));
            if (Number.isFinite(id) && id > 0) countries.set(id, { key, data });
        } catch { }
    }
    for (const key of playerDataBase.idList) {
        const raw = playerDataBase.get(key);
        if (!raw) continue;
        try {
            const data = JSON.parse(raw);
            const id = `${key}`.replace(/^player_/, "");
            if (validStoredPlayerId(id)) players.set(id, { key, data });
            else invalidPlayers.push({ key, data });
        } catch { }
        if (++processed % 200 === 0) yield;
    }

    const ownerCountry = new Map<string, number>();
    let duplicateOwners = 0;
    let ownersWithoutPlayer = 0;
    for (const [countryId, entry] of countries) {
        const owner = `${entry.data?.owner ?? ""}`;
        if (!validStoredPlayerId(owner) || !players.has(owner)) {
            ownersWithoutPlayer++;
            continue;
        }
        if (ownerCountry.has(owner) && ownerCountry.get(owner) !== countryId) {
            duplicateOwners++;
            continue;
        }
        ownerCountry.set(owner, countryId);
    }

    const membersByCountry = new Map<number, Set<string>>();
    for (const countryId of countries.keys()) membersByCountry.set(countryId, new Set());
    for (const [countryId, entry] of countries) {
        const owner = `${entry.data?.owner ?? ""}`;
        if (validStoredPlayerId(owner)) membersByCountry.get(countryId)?.add(owner);
    }
    for (const [playerId, entry] of players) {
        const ownedCountryId = ownerCountry.get(playerId);
        const storedCountryId = Number(entry.data?.country);
        const countryId = ownedCountryId
            ?? (countries.has(storedCountryId) ? storedCountryId : undefined);
        if (countryId !== undefined) membersByCountry.get(countryId)?.add(playerId);
        if (++processed % 200 === 0) yield;
    }

    let changedCountries = 0;
    for (const [countryId, entry] of countries) {
        const expected = membersByCountry.get(countryId) ?? new Set<string>();
        const current = uniqueIds(entry.data.members);
        const next = current.filter((id) => expected.has(id));
        for (const id of expected) if (!next.includes(id)) next.push(id);
        if (!sameIds(entry.data.members, next)) {
            entry.data.members = next;
            countryDataBase.set(entry.key, entry.data);
            changedCountries++;
        }
    }

    const roleCountry = new Map<number, number>();
    const countryRoleIds = new Map<number, number[]>();
    for (const [countryId, entry] of countries) {
        const roleIds = uniqueIds(entry.data.roles)
            .map(Number)
            .filter((id) => Number.isFinite(id));
        countryRoleIds.set(countryId, roleIds);
        for (const roleId of roleIds) roleCountry.set(roleId, countryId);
    }

    const desiredRolesByPlayer = new Map<string, number[]>();
    const desiredMembersByRole = new Map<number, string[]>();
    for (const [playerId, entry] of players) {
        const countryId = ownerCountry.get(playerId) ?? Number(entry.data?.country);
        const country = countries.get(countryId)?.data;
        const allowedRoleIds = new Set(countryRoleIds.get(countryId) ?? []);
        let roleIds = uniqueIds(entry.data?.roles)
            .map(Number)
            .filter((roleId) => allowedRoleIds.has(roleId));
        const ownerRoleId = Number(country?.ownerRole);
        if (country?.owner === playerId && Number.isFinite(ownerRoleId)) {
            roleIds = roleIds.filter((roleId) => roleId !== ownerRoleId);
            roleIds.push(ownerRoleId);
        } else if (Number.isFinite(ownerRoleId)) {
            roleIds = roleIds.filter((roleId) => roleId !== ownerRoleId);
        }
        roleIds = [...new Set(roleIds)];
        desiredRolesByPlayer.set(playerId, roleIds);
        for (const roleId of roleIds) {
            const members = desiredMembersByRole.get(roleId) ?? [];
            if (!members.includes(playerId)) members.push(playerId);
            desiredMembersByRole.set(roleId, members);
        }
        if (++processed % 200 === 0) yield;
    }
    // owner role は player.roles の壊れ方に関係なく、現在の国王一人だけにする。
    for (const [, entry] of countries) {
        const owner = `${entry.data?.owner ?? ""}`;
        const ownerRoleId = Number(entry.data?.ownerRole);
        if (validStoredPlayerId(owner) && Number.isFinite(ownerRoleId)) {
            desiredMembersByRole.set(ownerRoleId, [owner]);
        }
    }

    let changedRoles = 0;
    for (const [roleId] of roleCountry) {
        const key = `role_${roleId}`;
        const raw = roleDataBase.get(key);
        if (!raw) continue;
        try {
            const roleData = JSON.parse(raw);
            const desired = desiredMembersByRole.get(roleId) ?? [];
            const current = uniqueIds(roleData.members);
            const next = current.filter((id) => desired.includes(id));
            for (const id of desired) if (!next.includes(id)) next.push(id);
            if (!sameIds(roleData.members, next)) {
                roleData.members = next;
                roleDataBase.set(key, roleData);
                changedRoles++;
            }
        } catch { }
    }

    let changedPlayers = 0;
    for (const [playerId, entry] of players) {
        const nextCountryId = ownerCountry.get(playerId)
            ?? (countries.has(Number(entry.data?.country)) ? Number(entry.data.country) : undefined);
        const nextRoles = desiredRolesByPlayer.get(playerId) ?? [];
        const rawCurrentCountry = entry.data?.country;
        const currentCountryId = countries.has(Number(rawCurrentCountry))
            ? Number(rawCurrentCountry)
            : undefined;
        const hasStoredCountry = rawCurrentCountry !== undefined
            && rawCurrentCountry !== null
            && rawCurrentCountry !== "";
        const countryChanged = currentCountryId !== nextCountryId
            || (nextCountryId === undefined && hasStoredCountry);
        if (countryChanged || !sameIds(entry.data?.roles, nextRoles)) {
            entry.data.country = nextCountryId;
            entry.data.roles = nextRoles;
            playerDataBase.set(entry.key, entry.data);
            changedPlayers++;
        }
        if (++processed % 200 === 0) yield;
    }
    for (const entry of invalidPlayers) {
        if (entry.data?.country === undefined && (!Array.isArray(entry.data?.roles) || entry.data.roles.length === 0)) continue;
        entry.data.country = undefined;
        entry.data.roles = [];
        playerDataBase.set(entry.key, entry.data);
        changedPlayers++;
    }

    const result = {
        countries: countries.size,
        players: players.size,
        changedCountries,
        changedRoles,
        changedPlayers,
        invalidPlayers: invalidPlayers.length,
        duplicateOwners,
        ownersWithoutPlayer,
    };
    console.warn(`[country-consistency] ${JSON.stringify(result)}`);
    return;
}

export function resetRoleData() {
    const countryDataBase = new DynamicProperties("country");
    const roleDB = new DynamicProperties('role');
    const playerDB = new DynamicProperties('player');
    /**
     * @type {Array<string>}
     */
    const countryIds = countryDataBase.idList;
    const checkCountryIds = countryIds;
    let max = 0;
    for (const id of checkCountryIds) {
        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
        const countryData = GetAndParsePropertyData(id, countryDataBase);

        if (!countryData) {
            countryDataBase.delete(id);
            continue;
        }
        const roles = [((countryData.id * 3) - 2), ((countryData.id * 3) - 1), (countryData.id * 3)];
        countryData.roles = roles;
        max = Math.max(max, (countryData.id * 3));
        countryData.ownerRole = (countryData.id * 3) - 2;
        countryData.adminRole = (countryData.id * 3) - 1;
        countryData.peopleRole = (countryData.id * 3);
        for (const roleId of roles) {
            switch (roleId) {
                case countryData.ownerRole: {
                    roleDB.set(`role_${roleId}`, JSON.stringify({ id: roleId, name: `Owner`, permissions: [`admin`], icon: `textures/blocks/gold_block`, color: `e`, members: [countryData.owner] }));
                    break;
                };
                case countryData.adminRole: {
                    roleDB.set(`role_${roleId}`, JSON.stringify({ id: roleId, name: `Admin`, permissions: [`admin`], icon: `textures/blocks/iron_block`, color: `f`, members: [] }));
                    break;
                };
                case countryData.peopleRole: {
                    roleDB.set(`role_${roleId}`, JSON.stringify({ id: roleId, name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`, `shopBuy`, `shopSell`], icon: `textures/blocks/stone`, color: `a`, members: countryData.members ?? [] }));
                    break;
                };
                default: {
                    roleDB.set(`role_${roleId}`, JSON.stringify({ id: roleId, name: `New Role`, permissions: [], icon: `textures/blocks/stone`, color: `b`, members: [] }));
                    break;
                };
            };
        };
        countryDataBase.set(`country_${countryData.id}`, countryData);
        for (const memberId of countryData.members) {
            const rawMemberData = playerDB.get(`player_${memberId}`);
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const memberData = JSON.parse(rawMemberData);
            if (memberId == countryData.owner) {
                memberData.roles = [countryData.ownerRole, countryData.peopleRole];
            } else {
                memberData.roles = [countryData.peopleRole];
            };
            playerDB.set(`player_${memberId}`, JSON.stringify(memberData));
        };
    };
    world.setDynamicProperty('roleId', `${max}`);
};

export function resetPlotData() {
    const countryDataBase = new DynamicProperties("country");
    const plotgroupDB = new DynamicProperties('plotgroup');
    const chunkDB = new DynamicProperties('chunk');
    /**
     * @type {Array<string>}
     */
    const countryIds = countryDataBase.idList;
    const checkCountryIds = countryIds;
    let max = 0;
    for (const id of checkCountryIds) {
        // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
        const countryData = GetAndParsePropertyData(id, countryDataBase);

        if (!countryData) {
            countryDataBase.delete(id);
            continue;
        }
        countryData.plotgroup = [];
        countryDataBase.set(`country_${countryData.id}`, countryData);
        for (let i = 0; i < 100; i++) {
            plotgroupDB.delete(`plotgroup_${i}`)
        }
        for (const chunkID of chunkDB.idList) {
            const rawChunkData = chunkDB.get(`${chunkID}`);
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const chunkData = JSON.parse(rawChunkData);
            if (chunkData?.plot) {
                chunkData.plot = undefined;
                chunkDB.set(chunkID, JSON.stringify(chunkData));
            }
        };
    };
    world.setDynamicProperty('plotgroupId', `1`);
};
