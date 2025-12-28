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
                        roleDB.set(`role_${roleId}`, JSON.stringify({ name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`], icon: `textures/blocks/stone`, color: `a`, members: countryData.members ?? [] }));
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
                    roleDB.set(`role_${roleId}`, JSON.stringify({ id: roleId, name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`], icon: `textures/blocks/stone`, color: `a`, members: countryData.members ?? [] }));
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