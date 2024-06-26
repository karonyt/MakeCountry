import { Player, world } from "@minecraft/server";
import * as DyProp from "./DyProp";
import { CheckPermission, GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "./util";
import config from "../config";

/**
 * 国を作る
 * @param {Player} owner 
 * @param {string} name 
 * @param {boolean} invite 
 * @param {boolean} peace 
 */
export function MakeCountry(owner, name = `country`, invite = true, peace = config.defaultPeace) {
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
    if (chunkData && chunkData.noTerritory) {
        owner.sendMessage({ translate: `this.chunk.cannot.territory` });
        return;
    };
    if (ownerData.money < config.MakeCountryCost) {
        owner.sendMessage({ translate: `not.enough.makecountry.money`, with: [`${config.MoneyName} ${config.MakeCountryCost - ownerData.money}`] });
        return;
    };
    const idString = world.getDynamicProperty(`countryId`) ?? "1"
    let id = Number(idString);
    if (!chunkData) chunkData = GenerateChunkData(x, z, dimensionId, undefined, id, undefined, false);
    chunkData.countryId = id;
    ownerData.country = id;
    ownerData.money -= config.MakeCountryCost;
    const [ownerRole, adminRole, peopleRole] = CreateRole([
        { name: `Owner`, permissions: [`admin`], iconTextureId: `gold_block`, color: `e` },
        { name: `Admin`, permissions: [`admin`], iconTextureId: `iron_block`, color: `f` },
        { name: `People`, permissions: [`place`, `break`, `blockUse`, `entityUse`, `noTarget`, `invite`], iconTextureId: `stone`, color: `a` }
    ]);
    ownerData.roles.push(ownerRole)
    const countryData = {
        name: name,
        id: id,
        owner: owner.id,
        lore: ``,
        //通貨のID(0が共通通貨)
        currencyUnitId: 0,
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
        hideMoney: config.hideCountryMoney,
        peace: peace,
        //色
        color: `e`,
        //同盟国
        alliance: [],
        //敵対国
        hostility: [],
        //中立国の権限
        neutralityPermission: [`blockUse`, `entityUse`, `noTarget`, `setHome`],
        //同盟国の権限
        alliancePermission: [`blockUse`, `entityUse`, `noTarget`, `setHome`],
        //敵対国の権限
        hostilityPermission: [],
        //加盟している国際組織
        internationalOrganizations: [],
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
        //招待制
        invite: invite,
    };
    ownerData.roles.push(ownerRole)
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `born.country`, with: [name] }] });
    StringifyAndSavePropertyData(`country_${id}`, countryData);
    StringifyAndSavePropertyData(`player_${owner.id}`, ownerData);
    StringifyAndSavePropertyData(chunkData.id, chunkData);
    world.setDynamicProperty(`countryId`, `${id++}`);
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
        adminRestriction: false,
        adminAllow: [],
        placeRestriction: false,
        placeAllow: [],
        breakRestriction: false,
        breakAllow: [],
        blockUseRestriction: false,
        blockUseAllow: [],
        entityUseRestriction: false,
        entityUseAllow: [],
        setHomeRestriction: false,
        setHomeAllow: [],
        noTargetRestriction: false,
        noTargetAllow: [],
        editStructureRestriction: false,
        editStructureAllow: [],
    };
    return chunkData;
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
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    const ownerData = GetAndParsePropertyData(`player_${countryData.owner}`)
    ownerData.money = ownerData.money + countryData.money + countryData.resourcePoint;
    StringifyAndSavePropertyData(`player_${ownerData.id}`, ownerData);
    countryData.members.forEach(m => {
        const playerData = GetAndParsePropertyData(`player_${m}`);
        playerData.roles = [];
        playerData.country = undefined;
        StringifyAndSavePropertyData(`player_${m}`, playerData);
    });
    countryData.territories.forEach(t => {
        const chunkData = GetAndParsePropertyData(t);
        chunkData.countryId = undefined;
        StringifyAndSavePropertyData(t, chunkData);
    });
    countryData.alliance.forEach(a => {
        RemoveAlliance(countryId, a);
    });
    countryData.hostility.forEach(h => {
        RemoveHostility(countryId, h);
    });
    countryData.roles.forEach(r => {
        DyProp.setDynamicProperty(`role_${r}`);
    });
    //ここら辺に国際組織から抜ける処理を追加しておく
    DyProp.setDynamicProperty(`country_${countryData.id}`);
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `deleted.country`, with: [`${countryData.name}`] }] });
};

/**
 * 指定した国でロールを作成
 * @param {string} countryId 
 * @param {string} name 
 * @param {Array<string>} permissions 
 * @param {string} iconTextureId 
 * @param {string} color 
 */
export function CreateRoleToCountry(countryId, name, permissions = [], iconTextureId = `stone`, color = `e`) {
    const roleId = CreateRole(name, permissions, iconTextureId, color);
    const countryData = GetAndParsePropertyData(`country_${countryId}`);
    countryData.roles.push(roleId);
    StringifyAndSavePropertyData(`country_${countryId}`, countryData);
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
    const roleData = GetAndParsePropertyData(`role_${roleId}`);
    roleData.members.forEach(memberId => {
        try {
            const memberData = GetAndParsePropertyData(`player_${memberId}`);
            memberData.roles.splice(memberData.roles.indexOf(roleId), 1);
        } catch (error) {
            console.warn(error);
        };
    });
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
        mainCountryData.hostility.push(countryId);
        CountryData.hostility.push(mainCountryId);
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
    const mainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    try {
        mainCountryData.hostility.splice(mainCountryData.hostility.indexOf(countryId), 1);
        CountryData.hostility.splice(CountryData.hostility.indexOf(mainCountryId), 1);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, mainCountryData);
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
    } catch (error) {
        console.warn(error);
    };
};

/**完成
 * 同盟追加
 * @param {string} mainCountryId 
 * @param {string} countryId 
 */
export function AddAlliance(mainCountryId, countryId) {
    const mainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    try {
        mainCountryData.alliance.push(countryId);
        CountryData.alliance.push(mainCountryId);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, mainCountryData);
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
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
    const mainCountryData = GetAndParsePropertyData(`country_${mainCountryId}`);
    const CountryData = GetAndParsePropertyData(`country_${countryId}`);
    try {
        mainCountryData.alliance.splice(mainCountryData.alliance.indexOf(countryId), 1);
        CountryData.alliance.splice(CountryData.alliance.indexOf(mainCountryId), 1);
        StringifyAndSavePropertyData(`country_${mainCountryId}`, mainCountryData);
        StringifyAndSavePropertyData(`country_${countryId}`, CountryData);
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
        countryData.members.push(playerData.id);
        playerData.roles.push(countryData.peopleRole);
        playerData.country = countryId;
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `joined.country` }] });
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 国から抜けさせる
 * @param {Player} player 
 * @param {Number} countryId 
 */
export function playerCountryLeave(player) {
    try {
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const countryId = playerData.country;
        const countryData = GetAndParsePropertyData(`country_${countryId}`);
        countryData.members.splice(countryData.members.indexOf(playerData.id), 1);
        playerData.roles = [];
        playerData.country = undefined;
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `left.country` }] });
    } catch (error) {
        console.warn(error);
    };
};

export function playerCountryKick(player) {
    try {
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const countryId = playerData.country;
        const countryData = GetAndParsePropertyData(`country_${countryId}`);
        countryData.members.splice(countryData.members.indexOf(playerData.id), 1);
        playerData.roles = [];
        playerData.country = undefined;
        StringifyAndSavePropertyData(`player_${playerData.id}`, playerData);
        StringifyAndSavePropertyData(`country_${countryId}`, countryData);
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.country` }] });
    } catch (error) {
        console.warn(error);
    };
};

/**
 * プレイヤーに招待を送る
 * @param {Player} receivePlayer 
 * @param {Player} sendPlayer 
 * @param {Number} countryId 
 */
export function playerCountryInvite(receivePlayer, sendPlayer) {
    try {
        if (!CheckPermission(sendPlayer, `invite`)) {
            sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§c\n` }, { translate: `send.invite.error.permission.message` }] });
            return;
        };
        const sendPlayerData = GetAndParsePropertyData(`player_${sendPlayer.id}`);
        const receivePlayerData = GetAndParsePropertyData(`player_${receivePlayer.id}`);
        const countryId = sendPlayerData.country;
        receivePlayerData.invite.splice(receivePlayerData.invite.indexOf(countryId), 1);
        receivePlayer.invite.push(countryId);
        StringifyAndSavePropertyData(`player_${sendPlayer.id}`, sendPlayerData);
        StringifyAndSavePropertyData(`country_${receivePlayer.id}`, receivePlayerData);
        sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `send.invite.message` }] });
        if (receivePlayerData.settings.inviteReceiveMessage) receivePlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `receive.invite.message` }] });
        return;
    } catch (error) {
        console.warn(error);
    };
};