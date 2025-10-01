import { Player, system, world } from "@minecraft/server";
import * as DyProp from "./DyProp";
import { CheckPermission, GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "./util";
import config from "../config";
import { nameSet } from "./nameset";
import { country } from "../api/api";
import { DynamicProperties } from "../api/dyp";

/**
 * @type {DynamicProperties}
 */
let countryDataBase;

world.afterEvents.worldLoad.subscribe(() => {
    countryDataBase = new DynamicProperties('country');
});

/**
 * 国を作る
 * @param {Player} owner 
 * @param {string} name 
 * @param {string} reason 
 * @param {boolean} invite 
 * @param {boolean} peace 
 */
export function MakeCountry(owner, reason, name = `country`, invite = true, peace = config.defaultPeace) {
    const { x, z } = owner.location;
    const dimensionId = owner.dimension.id;
    const ownerData = GetAndParsePropertyData(`player_${owner.id}`);
    if (ownerData.country) {
        owner.sendMessage({ translate: `already.country.join` });
        return;
    };
    const chunkId = GetPlayerChunkPropertyId(owner);
    let chunkData = GetAndParsePropertyData(chunkId);
    if (chunkData && chunkData.countryId) {
        owner.sendMessage({ translate: `already.country.here` });
        return;
    };
    if (chunkData && chunkData?.noTerritory) {
        owner.sendMessage({ translate: `this.chunk.cannot.territory` });
        return;
    };
    if (chunkData && chunkData?.special) {
        owner.sendMessage({ translate: `this.chunk.cannot.territory` });
        return;
    };
    if (ownerData.money < config.MakeCountryCost) {
        owner.sendMessage({ translate: `not.enough.makecountry.money`, with: [`${config.MoneyName} ${config.MakeCountryCost - ownerData.money}`] });
        return;
    };
    const idString = world.getDynamicProperty(`countryId`) ?? "1"
    let id = Number(idString);
    world.setDynamicProperty(`countryId`, `${id + 1}`);
    if (!chunkData) chunkData = GenerateChunkData(x, z, dimensionId, undefined, id, undefined, false);
    chunkData.countryId = id;
    ownerData.country = id;
    ownerData.money -= config.MakeCountryCost;
    const [ownerRole, adminRole, peopleRole] = CreateRole([
        { name: `Owner`, permissions: [`admin`], iconTextureId: `gold_block`, color: `e` },
        { name: `Admin`, permissions: [`admin`], iconTextureId: `iron_block`, color: `f` },
        { name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`, `publicHomeUse`, `setHome`, `openContainer`], iconTextureId: `stone`, color: `a` }
    ]);
    ownerData.roles.push(ownerRole);
    const countryData = {
        name: name,
        id: id,
        owner: owner.id,
        lore: ``,
        //通貨のID(0が共通通貨)
        currencyUnitId: 0,
        days: 0,
        banner: "",
        colorcode: "#ffff00",
        members: [owner.id],
        peaceChangeCooltime: 0,
        territories: [chunkId],
        ownerRole: ownerRole,
        adminRole: adminRole,
        peopleRole: peopleRole,
        spawn: undefined,
        publicSpawn: false,
        roles: [ownerRole, adminRole, peopleRole],
        resourcePoint: config.initialCountryResourcePoint,
        money: config.initialCountryMoney,
        taxPer: config.taxPer,
        taxInstitutionIsPer: config.taxInstitutionIsPer,
        //国庫、リソースポイント公開
        hideMoney: config.hideCountryMoney,
        peace: peace,
        //色
        color: `e`,
        //同盟国
        alliance: [],
        //敵対国
        hostility: [],
        //友好国
        friendly: [],
        //中立国の権限
        neutralityPermission: [`blockUse`, `entityUse`, `noTarget`, `setHome`, `publicHomeUse`],
        //同盟国の権限
        alliancePermission: [`blockUse`, `entityUse`, `noTarget`, `setHome`, `publicHomeUse`],
        //敵対国の権限
        hostilityPermission: [],
        //友好国の権限
        friendlyPermission: [`noTarget`, `setHome`, `publicHomeUse`],
        //加盟している国際組織
        internationalOrganizations: [],
        //戦争中
        isWarNow: false,
        //戦争中
        warNowCountries: [],
        //受け取った戦線布告の国
        declarationReceive: [],
        //送った戦線布告
        declarationSend: [],
        //受け取った同盟申請
        allianceRequestReceive: [],
        //送った同盟申請
        allianceRequestSend: [],
        //受け取った友好申請
        friendlyRequestReceive: [],
        //送った友好申請
        friendlyRequestSend: [],
        //受け取った講和申請
        applicationPeaceRequestReceive: [],
        //送った講和申請
        applicationPeaceRequestSend: [],
        //招待制
        invite: invite,
        //プロットグループ
        plotgroup: [],
        //送った併合申請
        mergeRequestSend: [],
        //受け取った併合申請
        mergeRequestReceive: []
    };
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `born.country`, with: [name] }] });
    const ownerRoleData = GetAndParsePropertyData(`role_${ownerRole}`);
    ownerRoleData.members.push(`${owner.id}`);
    StringifyAndSavePropertyData(`country_${id}`, countryData);
    StringifyAndSavePropertyData(`role_${ownerRole}`, ownerRoleData);
    StringifyAndSavePropertyData(`player_${owner.id}`, ownerData);
    StringifyAndSavePropertyData(chunkData.id, chunkData);
    const eventData = { countryName: name, invite, peace, type: reason, id, player: owner };
    country.afterEvents.create.emit(eventData);
    system.runTimeout(() => {
        if (config.countryNameDisplayOnPlayerNameTag) {
            nameSet(owner);
        };
    }, 2);
};

export function GenerateChunkData(x, z, dimensionId, ownerId = undefined, countryId = undefined, price = config.defaultChunkPrice, special = false) {
    const chunkData = {
        x: x,
        z: z,
        id: GetChunkPropertyId(x, z, dimensionId),
        owner: ownerId,
        countryId: countryId,
        special: special,
        noTerritory: false,
        price: price,
        plot: {
            group: undefined,
            is_selling: false,
            name: undefined,
            owner: undefined,
            players: [],
            roles: [],
            type: "public",
            price: 0,
            countries: [],
            permissions: [],
        }
    };
    return chunkData
};

/**完成
 * 国力の計算
 * @param {string} countryId 
 * @returns {number}
 */
export function calculationCountryPower(countryId) {
    const countryData = GetAndParsePropertyData(countryId);
    let countryPower = 0;
    countryPower = countryData.money + countryData.members.length * 20 + countryData.territories.length * 10 + countryData.resourcePoint + countryData.alliance.length * 5 - countryData.hostility.length * 15;
    return countryPower;
};

/**
 * 国を削除
 * @param {string} countryId 
 */
export function DeleteCountry(countryId) {
    const rawCountryData = countryDataBase.get(`country_${countryId}`);
    /**
     * @type {import("../jsdoc/country.js").CountryData}
     */
    const countryData = JSON.parse(rawCountryData);
    const playerDataBase = new DynamicProperties('player');
    const rawOwnerData = playerDataBase.get(`player_${countryData?.owner}`);
    if (rawOwnerData) {
        const ownerData = JSON.parse(rawOwnerData);
        ownerData.money = ownerData?.money + countryData?.money + countryData?.resourcePoint;
        playerDataBase.set(`player_${ownerData.id}`, JSON.stringify(ownerData));
    };

    const countryName = countryData.name;

    const isCancel = country.beforeEvents.delete.emit({
        countryId: countryId,
        countryName: countryName,
        type: 'delete',
        cancel: false
    });

    if (isCancel) return;

    system.runTimeout(() => {
        if (countryData?.members) {
            try {
                for (const m of countryData?.members ?? []) {
                    try {
                        const playerRawData = playerDataBase.get(`player_${m}`)
                        const playerData = JSON.parse(playerRawData);
                        if (playerData) {
                            playerData.roles = [];
                            playerData.country = undefined;
                            playerDataBase.set(`player_${m}`, JSON.stringify(playerData));
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    });
    system.runTimeout(() => {
        try {
            const chunkDataBase = new DynamicProperties('chunk')
            system.runJob(findAndDeleteChunks(chunkDataBase, countryId))
            function* findAndDeleteChunks(chunkDataBase, targetCountryId) {
                const ids = chunkDataBase.idList;
                for (let i = 0; i < ids.length; i++) {
                    const id = ids[i];
                    /**
                     * @type {{plot: {}, countryId: undefined|number}}
                     */
                    const chunkRawData = chunkDataBase.get(id);
                    if (chunkRawData) {
                        const chunkData = JSON.parse(chunkRawData);
                        if (chunkData?.countryId != Number(targetCountryId)) continue;
                        chunkDataBase.delete(id);
                        yield id; // 削除したidを返す
                    }
                }
            }
        } catch (error) {
        }
    })
    system.runTimeout(() => {
        if (countryData?.alliance) {
            try {
                for (const a of countryData?.alliance ?? []) {
                    try {
                        const targetcountryRawData = countryDataBase.get(`country_${a}`);
                        const targetcountryData = JSON.parse(targetcountryRawData);
                        targetcountryData.alliance = targetcountryData.alliance.filter(id => id != Number(countryId));
                        countryDataBase.set(`country_${a}`, JSON.stringify(targetcountryData));
                    } catch (error) {
                    }
                };
            } catch (error) {
            }
        };
    }, 3);
    system.runTimeout(() => {
        if (countryData?.hostility) {
            try {
                for (const h of countryData?.hostility ?? []) {
                    try {
                        RemoveHostility(countryId, h);
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    }, 4);
    system.runTimeout(() => {
        if (countryData?.roles) {
            try {
                const roleDataBase = new DynamicProperties('role');

                for (const r of countryData?.roles ?? []) {
                    try {
                        roleDataBase.delete(`role_${r}`);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 5);
    system.runTimeout(() => {
        if (countryData?.allianceRequestSend) {
            try {
                for (const a of countryData?.allianceRequestSend ?? []) {
                    try {
                        const aRawCountry = countryDataBase.get(`country_${a}`);
                        const aCountry = JSON.parse(aRawCountry);
                        aCountry.allianceRequestReceive = aCountry.allianceRequestReceive.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 6);
    system.runTimeout(() => {
        if (countryData?.allianceRequestReceive) {
            try {
                for (const a of countryData?.allianceRequestReceive ?? []) {
                    try {
                        const aRawCountry = countryDataBase.get(`country_${a}`);
                        const aCountry = JSON.parse(aRawCountry);
                        if (aCountry) {
                            aCountry.allianceRequestSend = aCountry.allianceRequestSend.filter(r => r != countryData.id);
                            countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 7);
    system.runTimeout(() => {
        if (countryData?.applicationPeaceRequestSend) {
            for (const a of countryData?.applicationPeaceRequestSend ?? []) {
                try {
                    const aRawCountry = countryDataBase.get(`country_${a}`);
                    const aCountry = JSON.parse(aRawCountry);
                    if (aCountry) {
                        aCountry.applicationPeaceRequestReceive = aCountry.applicationPeaceRequestReceive.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    };
                } catch (error) {
                };
            };
        };
    }, 8);
    system.runTimeout(() => {
        if (countryData?.applicationPeaceRequestReceive) {
            for (const a of countryData?.applicationPeaceRequestReceive ?? []) {
                try {
                    const aRawCountry = countryDataBase.get(`country_${a}`);
                    const aCountry = JSON.parse(aRawCountry);
                    if (aCountry) {
                        aCountry.applicationPeaceRequestSend = aCountry.applicationPeaceRequestSend.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    };
                } catch (error) {
                };
            };
        };
    }, 9);
    system.runTimeout(() => {
        if (countryData?.declarationSend) {
            for (const a of countryData?.declarationSend ?? []) {
                try {
                    const aRawCountry = countryDataBase.get(`country_${a}`);
                    const aCountry = JSON.parse(aRawCountry);
                    if (aCountry) {
                        aCountry.declarationReceive = aCountry.declarationReceive.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    };
                } catch (error) {
                };
            };
        };
    }, 10);
    system.runTimeout(() => {
        if (countryData?.declarationReceive) {
            for (const a of countryData?.declarationReceive ?? []) {
                try {
                    const aRawCountry = countryDataBase.get(`country_${a}`);
                    const aCountry = JSON.parse(aRawCountry);
                    if (aCountry) {
                        aCountry.declarationSend = aCountry.declarationSend.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    };
                } catch (error) {
                };
            };
        };
    }, 11);
    system.runTimeout(() => {
        if (countryData?.warNowCountries) {
            try {
                for (const a of countryData?.warNowCountries ?? []) {
                    try {
                        const aRawCountry = countryDataBase.get(`country_${a}`);
                        const aCountry = JSON.parse(aRawCountry);
                        if (aCountry) {
                            aCountry.warNowCountries = aCountry.warNowCountries.filter(r => r != countryData.id);
                            countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                        };
                    } catch (error) {
                    };
                }
            } catch (error) {
            };
        };
    }, 12);
    system.runTimeout(() => {
        if (countryData?.plotgroup) {
            try {
                const plotgroupDataBase = new DynamicProperties('plotgroup');
                for (const g of countryData?.plotgroup ?? []) {
                    try {
                        plotgroupDataBase.delete(`plotgroup_${g}`);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 13);
    system.runTimeout(() => {
        if (countryData?.mergeRequestSend) {
            try {
                for (const a of countryData?.mergeRequestSend ?? []) {
                    try {
                        const aRawCountry = countryDataBase.get(`country_${a}`);
                        const aCountry = JSON.parse(aRawCountry);
                        aCountry.mergeRequestReceive = aCountry.mergeRequestReceive.filter(r => r != countryData.id);
                        countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 14);
    system.runTimeout(() => {
        if (countryData?.mergeRequestReceive) {
            try {
                for (const a of countryData?.mergeRequestReceive ?? []) {
                    try {
                        const aRawCountry = countryDataBase.get(`country_${a}`);
                        const aCountry = JSON.parse(aRawCountry);
                        if (aCountry) {
                            aCountry.mergeRequestSend = aCountry.mergeRequestSend.filter(r => r != countryData.id);
                            countryDataBase.set(`country_${a}`, JSON.stringify(aCountry));
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 15);
    system.runTimeout(() => {
        if (countryData?.friendly) {
            try {
                for (const h of countryData?.friendly ?? []) {
                    try {
                        RemoveFriendly(fromCountryId, h);
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    }, 16);
    system.runTimeout(() => {
        if (countryData?.friendlyRequestSend) {
            try {
                for (const a of countryData?.friendlyRequestSend ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        aCountry.friendlyRequestReceive = aCountry.friendlyRequestReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 17);
    system.runTimeout(() => {
        if (countryData?.friendlyRequestReceive) {
            try {
                for (const a of countryData?.friendlyRequestReceive ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        if (aCountry) {
                            aCountry.friendlyRequestSend = aCountry.friendlyRequestSend.filter(r => r != countryData.id);
                            StringifyAndSavePropertyData(`country_${a}`, aCountry);
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 18);
    system.runTimeout(() => {
        world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `deleted.country`, with: [`${countryData?.name}`] }] });
        //ここら辺に国際組織から抜ける処理を追加しておく
        countryDataBase.delete(`country_${countryId}`);
    }, 19);
    system.runTimeout(() => {
        const players = world.getPlayers();
        for (const p of players) {
            if (config.countryNameDisplayOnPlayerNameTag) {
                nameSet(p);
            };
        };
    }, 20);

    system.runTimeout(() => {
        country.afterEvents.delete.emit({
            countryId: countryId,
            countryName: countryName,
            type: 'delete'
        });
    }, 21);
}

/**
 * 指定した国でロールを作成
 * @param {string} countryId 
 * @param {string} name 
 * @param {Array<string>} permissions 
 * @param {string} iconTextureId 
 * @param {string} color 
 */
export function CreateRoleToCountry(countryId, name, permissions = [], iconTextureId = `stone`, color = `e`) {
    const countryDataBase = new DynamicProperties('country');
    const roleId = CreateRole([{ name: name, permissions: permissions, iconTextureId: iconTextureId, color: color }])[0];
    const countryRawData = countryDataBase.get(`country_${countryId}`);
    const countryData = JSON.parse(countryRawData);
    countryData.roles.push(roleId);
    countryDataBase.set(`country_${countryId}`, JSON.stringify(countryData));
    return roleId;
};

/**
 * 完了
 * ロール作成
 * @param {string} name 
 * @param {Array<string>} permissions 
 * @returns {string} RoleId
 */
export function CreateRole(roleDatas = [{ name: ``, permissions: [], iconTextureId: `stone`, color: `e` }]) {
    const roleIdString = world.getDynamicProperty(`roleId`) ?? "1";
    let id = Number(roleIdString);
    let returns = [];
    roleDatas.forEach(role => {
        const roleData = {
            name: role.name,
            color: `§a${role.color}`,
            icon: `textures/blocks/${role.iconTextureId}`,
            id: id,
            members: [],
            permissions: role.permissions
        };
        StringifyAndSavePropertyData(`role_${id}`, roleData);
        returns.push(roleData.id);
        id++
    });
    world.setDynamicProperty(`roleId`, `${id++}`);
    return returns;
};

/**
 * 完了
 * ロールを削除
 * @param {Player} player 
 * @param {number} roleId 
 * @param {number} countryId 
 * @param {boolean} deleteCountry 
 * @returns 
 */
export function DeleteRole(player, roleId, countryId, deleteCountry = false) {
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    if (!deleteCountry) {
        if (roleId == countryData.ownerRole || roleId == countryData.adminRole || roleId == countryData.peopleRole) {
            player.sendMessage({ translate: `cannot.delete.role` });
            return;
        };
    };
    if (deleteCountry) {
        DyProp.setDynamicProperty(`role_${roleId}`);
        return;
    };
    const roleData = GetAndParsePropertyData(`role_${roleId}`);
    roleData.members.forEach(memberId => {
        try {
            const memberData = GetAndParsePropertyData(`player_${memberId}`);
            memberData.roles = memberData.roles.filter(r => r != roleId);
            StringifyAndSavePropertyData(`player_${memberId}`, memberData);
        } catch (error) {
            console.warn(error);
        };
    });
    countryData.roles = countryData.roles.filter(r => r != roleId);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    DyProp.setDynamicProperty(`role_${roleId}`);
    player.sendMessage({ translate: `complete.delete.role` })
};

/**完成
 * 敵対国追加
 * @param {string} mainCountryId 
 * @param {string} countryId 
 */
export function AddHostility(mainCountryId, countryId) {
    const mainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    try {
        mainCountryData.hostility.push(Number(countryId));
        CountryData.hostility.push(Number(mainCountryId));
        StringifyAndSavePropertyData(`country_${mainCountryId}`, mainCountryData);
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
    } catch (error) {
        console.warn(error);
    };
};

/**完成
 * 敵対を解除
 * @param {string} mainCountryId 
 * @param {string} countryId 
 */
export function RemoveHostility(mainCountryId, countryId) {
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    const MainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    try {
        CountryData.hostility = CountryData.hostility.filter(id => id != Number(mainCountryId));
        MainCountryData.hostility = MainCountryData.hostility.filter(id => id != Number(countryId));
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, MainCountryData);
    } catch (error) {
        console.warn(error);
    };
};

/**完成
 * 友好を解除
 * @param {string} mainCountryId 
 * @param {string} countryId 
 */
export function RemoveFriendly(mainCountryId, countryId) {
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    const MainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    try {
        CountryData.friendly = CountryData.friendly.filter(id => id != Number(mainCountryId));
        MainCountryData.friendly = MainCountryData.friendly.filter(id => id != Number(countryId));
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, MainCountryData);
    } catch (error) {
        console.warn(error);
    };
};

/**完成
 * 同盟を解除
 * @param {string} mainCountryId 
 * @param {string} countryId 
 */
export function RemoveAlliance(mainCountryId, countryId) {
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    const MainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    try {
        CountryData.alliance = CountryData.alliance.filter(id => id != Number(mainCountryId));
        MainCountryData.alliance = MainCountryData.alliance.filter(id => id != Number(countryId));
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, MainCountryData);
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 国際組織を作る
 * @param {Player} owner 
 * @param {string} ownerCountryId
 * @param {string} name 
 */
export function MakeInternationalOrganization(owner, ownerCountryId, name) {
    const ownerData = GetAndParsePropertyData(`country_${ownerCountryId}`);
    if (ownerData.money < config.MakeInternationalOrganizationCost) {
        owner.sendMessage({ translate: `not.enough.country.money`, with: [`${config.MoneyName}${config.MakeInternationalOrganizationCost - ownerData.money}`] });
        return;
    };
    const idString = world.getDynamicProperty(`InternationalOrganizationId`) ?? "1"
    let id = Number(idString);

    const OrganizationData = {
        name: name,
        ownerCountryId: ownerCountryId,
        resourcePoint: 0,
        id: id,
        money: 0,
        //加盟国
        signatory: [ownerCountryId]
    };

    StringifyAndSavePropertyData(`InternationalOrganization_${id}`, OrganizationData);
    world.setDynamicProperty(`InternationalOrganizationId`, `${id++}`);
    return OrganizationData.id;
};

/**
 * 国に参加させる
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function playerCountryJoin(player, countryId) {
    try {
        const countryData = GetAndParsePropertyData(`country_${countryId}`);
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        if (playerData.money < 0) {
            player.sendMessage({ translate: `error.cannnot.in.money.minus` })
            return;
        };
        countryData.members.push(playerData.id);
        playerData.roles.push(countryData.peopleRole);
        playerData.country = countryId;
        playerData.invite = [];
        const memberRoleData = GetAndParsePropertyData(`role_${countryData.peopleRole}`);
        memberRoleData.members.push(`${player.id}`);
        StringifyAndSavePropertyData(`role_${memberRoleData.id}`, memberRoleData);
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `joined.country` }] });
        system.runTimeout(() => {
            if (config.countryNameDisplayOnPlayerNameTag) {
                nameSet(player);
            };
        }, 2);
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 国から抜けさせる
 * @param {Player} player 
 */
export function playerCountryLeave(player) {
    try {
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const countryId = playerData.country;
        const countryData = GetAndParsePropertyData(`country_${countryId}`);
        if (countryData?.members) {
            countryData.members = countryData.members.filter(m => m != playerData.id);
            StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        };
        playerData.roles = [];
        playerData.country = undefined;
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `left.country` }] });
        system.runTimeout(() => {
            if (config.countryNameDisplayOnPlayerNameTag) {
                nameSet(player);
            };
        }, 2);
    } catch (error) {
        console.warn(error);
    };
};

export function playerCountryKick(player) {
    try {
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const countryId = playerData.country;
        const countryData = GetAndParsePropertyData(`country_${countryId}`);
        if (countryData?.members) {
            countryData.members = countryData.members.filter(m => m != playerData.id);
            StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        };
        const playerRoles = playerData.roles ?? [];
        for (const roleId of playerRoles) {
            const role = GetAndParsePropertyData(`role_${roleId}`);
            if (role) {
                role.members = role.members.filter(m => m != playerData.id);
                StringifyAndSavePropertyData(`role_${roleId}`, role);
            };
        };
        playerData.roles = [];
        playerData.country = undefined;
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        const playerEntity = world.getEntity(player.id);
        if (playerEntity) {
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.country` }] });
            system.runTimeout(() => {
                if (config.countryNameDisplayOnPlayerNameTag) {
                    nameSet(player);
                };
            }, 2);
        };
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 
 * @param {Player} player 
 * @param {Player} member 
 * @param {object} countryData 
 */
export function playerChangeOwner(player, member, countryData) {
    const memberData = GetAndParsePropertyData(`player_${member.id}`);
    if (memberData?.country != countryData?.id) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `ownerchange.error` }] });
        return;
    };
    countryData.owner = member.id;
    const playerEntity = world.getEntity(member.id);
    if (playerEntity) {
        playerEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.newowner` }] });
    };
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.sender`, with: [member.name] }] });
    StringifyAndSavePropertyData(`country_${countryData.id}`, countryData);
    return;
};

/**
 * 国王チェンジ
 * @param {Player} member 
 * @returns 
 */
export function changeOwnerScriptEvent(member) {
    const memberData = GetAndParsePropertyData(`player_${member.id}`);
    const countryData = GetAndParsePropertyData(`country_${memberData.country}`)
    countryData.owner = member.id;
    member.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.newowner` }] });
    StringifyAndSavePropertyData(`country_${countryData.id}`, countryData);
    return;
};

/**
 * プレイヤーに招待を送る
 * @param {Player} receivePlayer 
 * @param {Player} sendPlayer 
 * @param {Number} countryId 
 */
export function playerCountryInvite(receivePlayer, sendPlayer) {
    try {
        if (CheckPermission(sendPlayer, `invite`)) {
            sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§c\n` }, { translate: `send.invite.error.permission.message` }] });
            return;
        };
        const sendPlayerData = GetAndParsePropertyData(`player_${sendPlayer.id}`);
        const receivePlayerData = GetAndParsePropertyData(`player_${receivePlayer.id}`);
        const countryId = sendPlayerData.country;
        receivePlayerData.invite = receivePlayerData.invite.filter(v => v != countryId).concat(Number(countryId));
        StringifyAndSavePropertyData(`player_${sendPlayer.id}`, sendPlayerData);
        StringifyAndSavePropertyData(`player_${receivePlayer.id}`, receivePlayerData);
        sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `send.invite.message` }] });
        if (receivePlayerData?.settings?.inviteReceiveMessage) receivePlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `receive.invite.message` }] });
        return;
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 講和申請送信
 * @param {Player} player 
 * @param {number} countryId 
 */
export function sendApplicationForPeace(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    /**
     * @type {{applicationPeaceRequestReceive: Array<Number>,applicationPeaceRequestSend: Array<Number>}}
     */
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.applicationPeaceRequestSend = playerCountryData.applicationPeaceRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.application.request`, with: [`${countryData.name}`] }] })
};

/**
 * 同盟申請送信
 * @param {Player} player 
 * @param {number} countryId 
 */
export function sendAllianceRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.allianceRequestSend = playerCountryData.allianceRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.alliance.request`, with: [`${countryData.name}`] }] })
};

/**
 * 講和申請キャンセル
 * @param {Player} player 
 * @param {number} countryId 
*/
export function cancelSendApplicationForPeace(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.applicationPeaceRequestSend = playerCountryData.applicationPeaceRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `cancel.application.request`, with: [`${countryData.name}`] }] })
};

/**
 * 同盟申請キャンセル
 * @param {Player} player 
 * @param {number} countryId 
 */
export function cancelAllianceRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.allianceRequestSend = playerCountryData.allianceRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `cancel.alliance.request`, with: [`${countryData.name}`] }] })
};

/**
 * 同盟追加
 * @param {Player} player 
 * @param {number} countryId 
 */
export function acceptAlliance(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != playerData.country);
    playerCountryData.allianceRequestSend = playerCountryData.allianceRequestSend.filter(r => r != Number(countryId));
    playerCountryData.allianceRequestReceive = playerCountryData.allianceRequestReceive.filter(r => r != Number(countryId));
    countryData.alliance.push(playerData.country);
    playerCountryData.alliance.push(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.alliance.request`, with: [`${countryData.name}`] }] })
};

/**
 * 同盟申請を拒否
 * @param {Player} player 
 * @param {number} countryId 
 */
export function denyAllianceRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.allianceRequestSend = countryData.allianceRequestSend.filter(r => r != playerData.country);
    playerCountryData.allianceRequestReceive = playerCountryData.allianceRequestReceive.filter(r => r != Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.alliance.request`, with: [`${countryData.name}`] }] })
};

/**
 * 講和申請を拒否
 * @param {Player} player 
 * @param {number} countryId 
 */
export function denyApplicationRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter(r => r != playerData.country);
    playerCountryData.applicationPeaceRequestReceive = playerCountryData.applicationPeaceRequestReceive.filter(r => r != Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.application.request`, with: [`${countryData.name}`] }] })
};

/**
 * 講和申請を受諾
 * @param {Player} player 
 * @param {number} countryId 
 */
export function acceptApplicationRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != playerData.country);
    playerCountryData.applicationPeaceRequestSend = playerCountryData.applicationPeaceRequestSend.filter(r => r != Number(countryId));
    countryData.applicationPeaceRequestSend = countryData.applicationPeaceRequestSend.filter(r => r != playerData.country);
    playerCountryData.applicationPeaceRequestReceive = playerCountryData.applicationPeaceRequestReceive.filter(r => r != Number(countryId));
    countryData.hostility = countryData.hostility.filter(h => h != playerData.country);
    playerCountryData.hostility = playerCountryData.hostility.filter(h => h != Number(countryId));
    countryData.warNowCountries = countryData.warNowCountries.filter(w => w != playerData.country);
    playerCountryData.warNowCountries = playerCountryData.warNowCountries.filter(w => w != Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.application.request`, with: [`${countryData.name}`] }] })
};

/**
 * 敵対国追加
 * @param {Player} player 
 * @param {number} countryId 
 */
export function AddHostilityByPlayer(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.allianceRequestReceive = countryData.allianceRequestReceive.filter(r => r != playerData.country);
    countryData.allianceRequestSend = countryData.allianceRequestSend.filter(r => r != playerData.country);
    playerCountryData.allianceRequestSend = playerCountryData.allianceRequestSend.filter(r => r != Number(countryId));
    playerCountryData.allianceRequestReceive = playerCountryData.allianceRequestReceive.filter(r => r != Number(countryId));
    countryData.alliance = countryData.alliance.filter(r => r != playerData.country);
    playerCountryData.alliance = playerCountryData.alliance.filter(r => r != Number(countryId));

    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != playerData.country);
    countryData.friendlyRequestSend = countryData.friendlyRequestSend.filter(r => r != playerData.country);
    playerCountryData.friendlyRequestSend = playerCountryData.friendlyRequestSend.filter(r => r != Number(countryId));
    playerCountryData.friendlyRequestReceive = playerCountryData.friendlyRequestReceive.filter(r => r != Number(countryId));
    countryData.friendly = countryData.friendly.filter(r => r != playerData.country);
    playerCountryData.friendly = playerCountryData.friendly.filter(r => r != Number(countryId));


    countryData.applicationPeaceRequestReceive = countryData.applicationPeaceRequestReceive.filter(r => r != playerData.country);
    playerCountryData.applicationPeaceRequestSend = playerCountryData.applicationPeaceRequestSend.filter(r => r != Number(countryId));
    countryData.hostility.push(playerData.country);
    playerCountryData.hostility.push(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `add.hostility.request`, with: [`${countryData.name}`] }] })
};

/**
 * 友好申請送信
 * @param {Player} player 
 * @param {number} countryId 
 */
export function sendFriendlyRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.friendlyRequestSend = playerCountryData.friendlyRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.friendly.request`, with: [`${countryData.name}`] }] })
};

/**
 * 友好申請キャンセル
 * @param {Player} player 
 * @param {number} countryId 
 */
export function cancelFriendlyRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != playerData.country).concat(playerData.country);
    playerCountryData.friendlyRequestSend = playerCountryData.friendlyRequestSend.filter(r => r != Number(countryId)).concat(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `cancel.friendly.request`, with: [`${countryData.name}`] }] })
};

/**
 * 友好追加
 * @param {Player} player 
 * @param {number} countryId 
 */
export function acceptFriendly(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.friendlyRequestReceive = countryData.friendlyRequestReceive.filter(r => r != playerData.country);
    playerCountryData.friendlyRequestSend = playerCountryData.friendlyRequestSend.filter(r => r != Number(countryId));
    playerCountryData.friendlyRequestReceive = playerCountryData.friendlyRequestReceive.filter(r => r != Number(countryId));
    countryData.friendly.push(playerData.country);
    playerCountryData.friendly.push(Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `accept.friendly.request`, with: [`${countryData.name}`] }] })
};

/**
 * 同盟申請を拒否
 * @param {Player} player 
 * @param {number} countryId 
 */
export function denyFriendlyRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.friendlyRequestSend = countryData.friendlyRequestSend.filter(r => r != playerData.country);
    playerCountryData.friendlyRequestReceive = playerCountryData.friendlyRequestReceive.filter(r => r != Number(countryId));
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.friendly.request`, with: [`${countryData.name}`] }] })
};


/**
 * プロットグループの作成
 * @param {Player} player 
 * @param {number} country 
 * @param {string} name 
 * @returns 
 */
export function createPlotGroup(player, country, name, type = "public") {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) {
        player.sendMessage({ translate: `cannnot.use.nojoin.country` });
        return;
    };
    const idString = world.getDynamicProperty(`plotgroupId`) ?? "1"
    let id = Number(idString);
    world.setDynamicProperty(`plotgroupId`, `${id + 1}`);
    let countryData = GetAndParsePropertyData(`country_${country}`);
    const plotGroup = countryData?.plotgroup ?? [];
    const plotGroupData = {
        id: id,
        is_selling: false,
        name: `${name}`,
        owner: null,
        players: [],
        permissions: [],
        type: type,
        price: 0,
        countries: [],
    };
    plotGroup.push(id);
    countryData.plotgroup = plotGroup;
    StringifyAndSavePropertyData(`plotgroup_${id}`, plotGroupData);
    StringifyAndSavePropertyData(`country_${country}`, countryData);
    player.sendMessage({ rawtext: [{ translate: `plotgroup.created`, with: [`${name}`] }] });
    return plotGroupData;
};

/**
 * プロットの作成
 * @param {Player} player 
 * @param {number} country 
 * @param {string} name 
 * @returns 
 */
export function createPlot(player, name, chunkId, type = "public") {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) {
        player.sendMessage({ translate: `cannnot.use.nojoin.country` });
        return;
    };
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    if (!chunkData?.plot?.name) {
        const plotData = {
            group: undefined,
            is_selling: false,
            name: `${name}`,
            owner: null,
            players: [],
            permissions: [],
            type: type,
            price: 0,
            countries: [],
            roles: [],
            enable: true,
        };
        chunkData.plot = plotData;
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        player.sendMessage({ rawtext: [{ translate: `plot.created`, with: [`${name}`] }] });
        return plotData;
    };
};

/**
 * プロットをプロットグループに作成
 * @param {Player} player 
 * @param {number} country 
 * @param {number} group 
 * @returns 
 */
export function createPlotToGroup(player, group, chunkId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) {
        player.sendMessage({ translate: `cannnot.use.nojoin.country` });
        return;
    };
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plotData = chunkData?.plot;
    if (!chunkData?.plot?.name) {
        plotData = {
            group: group,
            is_selling: false,
            name: `new Plot`,
            owner: null,
            players: [],
            permissions: [],
            roles: [],
            type: "public",
            price: 0,
            countries: [],
            enable: false,
        };
    };
    plotData.group = group;
    chunkData.plot = plotData;
    StringifyAndSavePropertyData(`${dypId}`, chunkData);
    const groupData = GetAndParsePropertyData(`plotgroup_${group}`);
    player.sendMessage({ rawtext: [{ translate: `plot.created.group`, with: [`${groupData?.name}`] }] });
    return plotData;
};

/**
 * 国をマージ
 * @param {string} fromCountryId 
 * @param {string} toCountryId 
 * @param {Player|undefined} player
 */
export function MergeCountry(fromCountryId, toCountryId, player = undefined) {
    const countryData = GetAndParsePropertyData(`country_${fromCountryId}`);
    const toCountryData = GetAndParsePropertyData(`country_${toCountryId}`);
    if (!countryData) return;
    if (!toCountryData) return;
    const limit = config.chunkLimit || 3200;
    if (player) {
        if ((countryData?.territories.length + toCountryData?.territories.length) >= limit) {
            player.sendMessage({ translate: 'chunk.limit', with: [`${limit}`] });
            return;
        };
    };
    toCountryData.money += (countryData?.money ?? 0) + (countryData?.resourcePoint ?? 0);
    toCountryData.members = toCountryData.members.concat(countryData.members);
    toCountryData.territories = toCountryData.territories.concat(countryData.territories);
    StringifyAndSavePropertyData(`country_${toCountryId}`, toCountryData);
    system.runTimeout(() => {
        if (countryData?.members) {
            try {
                for (const m of countryData?.members ?? []) {
                    try {
                        const playerData = GetAndParsePropertyData(`player_${m}`);
                        if (playerData) {
                            playerData.roles = [toCountryData.peopleRole];
                            playerData.country = toCountryData.id;
                            StringifyAndSavePropertyData(`player_${m}`, playerData);
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    });
    system.runTimeout(() => {
        try {
            const chunkDataBase = new DynamicProperties('chunk')
            const ids = chunkDataBase.idList;
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                /**
                 * @type {{plot: {},countryId: undefined|number}}
                 */
                const chunkData = GetAndParsePropertyData(id);
                if (chunkData) {
                    if (chunkData?.countryId != Number(fromCountryId)) continue;
                    chunkData.countryId = toCountryData.id;
                    chunkData.plot = undefined;
                    StringifyAndSavePropertyData(id, chunkData);
                };
            };
        } catch (error) {
        }
    }, 2);
    system.runTimeout(() => {
        if (countryData?.alliance) {
            try {
                for (const a of countryData?.alliance ?? []) {
                    try {
                        RemoveAlliance(fromCountryId, a);
                    } catch (error) {
                    }
                };
            } catch (error) {
            }
        };
    }, 3);
    system.runTimeout(() => {
        if (countryData?.hostility) {
            try {
                for (const h of countryData?.hostility ?? []) {
                    try {
                        RemoveHostility(fromCountryId, h);
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    }, 4);
    system.runTimeout(() => {
        if (countryData?.roles) {
            try {
                for (const r of countryData?.roles ?? []) {
                    try {
                        DyProp.setDynamicProperty(`role_${r}`);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 5);
    system.runTimeout(() => {
        if (countryData?.allianceRequestSend) {
            try {
                for (const a of countryData?.allianceRequestSend ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        aCountry.allianceRequestReceive = aCountry.allianceRequestReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 6);
    system.runTimeout(() => {
        if (countryData?.allianceRequestReceive) {
            try {
                for (const a of countryData?.allianceRequestReceive ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        if (aCountry) {
                            aCountry.allianceRequestSend = aCountry.allianceRequestSend.filter(r => r != countryData.id);
                            StringifyAndSavePropertyData(`country_${a}`, aCountry);
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 7);
    system.runTimeout(() => {
        if (countryData?.applicationPeaceRequestSend) {
            for (const a of countryData?.applicationPeaceRequestSend ?? []) {
                try {
                    const aCountry = GetAndParsePropertyData(`country_${a}`);
                    if (aCountry) {
                        aCountry.applicationPeaceRequestReceive = aCountry.applicationPeaceRequestReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    };
                } catch (error) {
                };
            };
        };
    }, 8);
    system.runTimeout(() => {
        if (countryData?.applicationPeaceRequestReceive) {
            for (const a of countryData?.applicationPeaceRequestReceive ?? []) {
                try {
                    const aCountry = GetAndParsePropertyData(`country_${a}`);
                    if (aCountry) {
                        aCountry.applicationPeaceRequestSend = aCountry.applicationPeaceRequestSend.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    };
                } catch (error) {
                };
            };
        };
    }, 9);
    system.runTimeout(() => {
        if (countryData?.declarationSend) {
            for (const a of countryData?.declarationSend ?? []) {
                try {
                    const aCountry = GetAndParsePropertyData(`country_${a}`);
                    if (aCountry) {
                        aCountry.declarationReceive = aCountry.declarationReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    };
                } catch (error) {
                };
            };
        };
    }, 10);
    system.runTimeout(() => {
        if (countryData?.declarationReceive) {
            for (const a of countryData?.declarationReceive ?? []) {
                try {
                    const aCountry = GetAndParsePropertyData(`country_${a}`);
                    if (aCountry) {
                        aCountry.declarationSend = aCountry.declarationSend.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    };
                } catch (error) {
                };
            };
        };
    }, 11);
    system.runTimeout(() => {
        if (countryData?.warNowCountries) {
            try {
                for (const a of countryData?.warNowCountries ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        if (aCountry) {
                            aCountry.warNowCountries = aCountry.warNowCountries.filter(r => r != countryData.id);
                            StringifyAndSavePropertyData(`country_${a}`, aCountry);
                        };
                    } catch (error) {
                    };
                }
            } catch (error) {
            };
        };
    }, 12);
    system.runTimeout(() => {
        if (countryData?.plotgroup) {
            try {
                for (const g of countryData?.plotgroup ?? []) {
                    try {
                        StringifyAndSavePropertyData(`plotgroup_${g}`);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 13);
    system.runTimeout(() => {
        if (countryData?.mergeRequestSend) {
            try {
                for (const a of countryData?.mergeRequestSend ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        aCountry.mergeRequestReceive = aCountry.mergeRequestReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 14);
    system.runTimeout(() => {
        if (countryData?.mergeRequestReceive) {
            try {
                for (const a of countryData?.mergeRequestReceive ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        if (aCountry) {
                            aCountry.mergeRequestSend = aCountry.mergeRequestSend.filter(r => r != countryData.id);
                            StringifyAndSavePropertyData(`country_${a}`, aCountry);
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 15);
    system.runTimeout(() => {
        if (countryData?.friendly) {
            try {
                for (const h of countryData?.friendly ?? []) {
                    try {
                        RemoveFriendly(fromCountryId, h);
                    } catch (error) {
                    };
                };
            } catch (error) {
            }
        };
    }, 16);
    system.runTimeout(() => {
        if (countryData?.friendlyRequestSend) {
            try {
                for (const a of countryData?.friendlyRequestSend ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        aCountry.friendlyRequestReceive = aCountry.friendlyRequestReceive.filter(r => r != countryData.id);
                        StringifyAndSavePropertyData(`country_${a}`, aCountry);
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 17);
    system.runTimeout(() => {
        if (countryData?.friendlyRequestReceive) {
            try {
                for (const a of countryData?.friendlyRequestReceive ?? []) {
                    try {
                        const aCountry = GetAndParsePropertyData(`country_${a}`);
                        if (aCountry) {
                            aCountry.friendlyRequestSend = aCountry.friendlyRequestSend.filter(r => r != countryData.id);
                            StringifyAndSavePropertyData(`country_${a}`, aCountry);
                        };
                    } catch (error) {
                    };
                };
            } catch (error) {
            };
        };
    }, 18);
    system.runTimeout(() => {
        world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `merged.country`, with: [`${countryData?.name}`, `${toCountryData?.name}`] }] });
        //ここら辺に国際組織から抜ける処理を追加しておく
        countryDataBase.delete(`country_${fromCountryId}`);
    }, 19);
    system.runTimeout(() => {
        const players = world.getPlayers();
        for (const p of players) {
            if (config.countryNameDisplayOnPlayerNameTag) {
                nameSet(p);
            };
        };
    }, 20);
}

/**
 * マージ申請送信
 * @param {Player} player 
 * @param {number} countryId 
 */
export function sendMergeRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    const receive = countryData?.mergeRequestReceive ?? [];
    receive.splice(receive.indexOf(playerData.country), 1);
    receive.push(playerData.country);
    countryData.mergeRequestReceive = receive;
    const send = playerCountryData?.mergeRequestSend ?? [];
    send.splice(send.indexOf(Number(countryId)), 1);
    send.push(Number(countryId));
    playerCountryData.mergeRequestSend = send;
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `sent.merge.request`, with: [`${countryData.name}`] }] })
};

/**
 * マージ申請キャンセル
 * @param {Player} player 
 * @param {number} countryId 
*/
export function cancelMergeRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    const receive = countryData?.mergeRequestReceive ? countryData.mergeRequestReceive.splice(countryData.mergeRequestReceive.indexOf(playerData.country), 1) : [];
    const send = playerCountryData?.mergeRequestSend ? playerCountryData.mergeRequestSend.splice(playerCountryData.mergeRequestSend.indexOf(Number(countryId)), 1) : [];
    countryData.mergeRequestReceive = receive;
    playerCountryData.mergeRequestSend = send;
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `cancel.merge.request`, with: [`${countryData.name}`] }] })
};

/**
 * マージ申請を拒否
 * @param {Player} player 
 * @param {number} countryId 
 */
export function denyMergeRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    const send = countryData?.mergeRequestSend ? countryData.mergeRequestSend.splice(countryData.mergeRequestSend.indexOf(playerData.country), 1) : [];
    const receive = playerCountryData?.mergeRequestReceive ? playerCountryData.mergeRequestReceive.splice(playerCountryData.mergeRequestReceive.indexOf(Number(countryId)), 1) : [];
    countryData.mergeRequestSend = send;
    playerCountryData.mergeRequestReceive = receive;
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `deny.merge.request`, with: [`${countryData.name}`] }] })
};

/**
 * マージ申請を受諾
 * @param {Player} player 
 * @param {number} countryId 
 */
export function acceptMergeRequest(player, countryId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    MergeCountry(countryId, playerData.country, player);
    return;
};

/**
 * プロットをプロットグループに割り当てる
 * @param {Player} player 
 * @param {number} country 
 * @param {number} group 
 * @returns 
 */
export function addPlotToGroup(player, group, chunkId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) {
        player.sendMessage({ translate: `cannnot.use.nojoin.country` });
        return;
    };
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plotData = chunkData?.plot;
    if (!chunkData?.plot?.name) {
        plotData = {
            group: group,
            is_selling: false,
            name: `new Plot`,
            owner: null,
            players: [],
            permissions: [],
            roles: [],
            type: "public",
            price: 0,
            countries: [],
            enable: false,
        };
    };
    plotData.group = group;
    chunkData.plot = plotData;
    StringifyAndSavePropertyData(`${dypId}`, chunkData);
    const groupData = GetAndParsePropertyData(`plotgroup_${group}`);
    player.sendMessage({ rawtext: [{ translate: `plot.added.group`, with: [`${groupData?.name}`] }] });
    return plotData;
};
