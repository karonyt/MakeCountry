import { Player, world } from "@minecraft/server";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

function withoutRole(roles: unknown, roleId: number): any[] {
    if (!Array.isArray(roles)) return [];
    return roles.filter((id: any) => Number(id) !== roleId);
}

/**
 * country.owner / owner role / player.roles を一緒に切り替える。
 * country.owner だけ先に変えると、旧国王が owner role を持ち続けたり
 * 新国王が管理フォームを開けない状態になるため、ここを唯一の更新口にする。
 */
export function applyCountryOwnerChange(countryId: any, rawNewOwnerId: any) {
    const newOwnerId = `${rawNewOwnerId ?? ""}`;
    if (!newOwnerId || newOwnerId === "undefined" || newOwnerId === "null") return undefined;

    const countryDataBase = new DynamicProperties('country');
    const playerDataBase = new DynamicProperties('player');
    const roleDataBase = new DynamicProperties('role');
    const rawCountryData = countryDataBase.get(`country_${countryId}`);
    const rawNewOwnerData = playerDataBase.get(`player_${newOwnerId}`);
    if (!rawCountryData || !rawNewOwnerData) return undefined;

    const countryData = JSON.parse(rawCountryData);
    const newOwnerData = JSON.parse(rawNewOwnerData);
    const members = Array.isArray(countryData.members) ? countryData.members.map(String) : [];
    if (!members.includes(newOwnerId) || Number(newOwnerData.country) !== Number(countryData.id)) {
        return undefined;
    }

    const ownerRoleId = Number(countryData.ownerRole);
    const rawOwnerRoleData = roleDataBase.get(`role_${ownerRoleId}`);
    if (!Number.isFinite(ownerRoleId) || !rawOwnerRoleData) return undefined;
    const ownerRoleData = JSON.parse(rawOwnerRoleData);

    // owner role に残っている歴代国王から、この国の owner role だけを外す。
    const previousRoleMembers = Array.isArray(ownerRoleData.members)
        ? [...new Set(ownerRoleData.members.map(String))]
        : [];
    for (const memberId of previousRoleMembers) {
        if (memberId === newOwnerId) continue;
        const rawMemberData = playerDataBase.get(`player_${memberId}`);
        if (!rawMemberData) continue;
        const memberData = JSON.parse(rawMemberData);
        memberData.roles = withoutRole(memberData.roles, ownerRoleId);
        playerDataBase.set(`player_${memberId}`, memberData);
    }

    newOwnerData.roles = [...withoutRole(newOwnerData.roles, ownerRoleId), ownerRoleId];
    ownerRoleData.members = [newOwnerId];
    countryData.owner = newOwnerId;

    // Role と player を先に揃え、最後に owner を切り替える。
    roleDataBase.set(`role_${ownerRoleId}`, ownerRoleData);
    playerDataBase.set(`player_${newOwnerId}`, newOwnerData);
    countryDataBase.set(`country_${countryData.id}`, countryData);
    return { countryData, newOwnerData };
}

/**
 * プレイヤーに招待を送る
 * @param {Player|string} newOwner 
 * @param {(Player|string)|undefined} player 
 * @param {number} countryId 
 */
export function setNewOwnerFunction(countryId: any, newOwner: any, player = undefined) {
    try {
        if (player) {
            if (CheckPermission(player, `invite`)) {
                // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
                if (player instanceof Player) {
                    // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§c\n` }, { translate: `send.invite.error.permission.message` }] });
                };
                return;
            };
        };
        let newOwnerId = '';
        if (newOwner instanceof Player) {
            newOwnerId = newOwner.id;
        } else if (typeof newOwner == 'string') {
            newOwnerId = newOwner;
        } else {
            return false;
        };

        let playerId = '';
        if (player) {
            // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
            if (player instanceof Player) {
                // @ts-ignore TS(2339): Property 'id' does not exist on type 'never'.
                playerId = player.id;
            } else if (typeof player == 'string') {
                playerId = player;
            } else {
                return false;
            };
        };
        const changed = applyCountryOwnerChange(countryId, newOwnerId);
        if (!changed) return false;
        const newOwnerData = changed.newOwnerData;
        if (player) {
            const playerEntity = world.getEntity(playerId);
            //playerDataBase.set(`player_${playerId}`, playerData)
            if (playerEntity && playerEntity instanceof Player) {
                playerEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.sender`, with: [newOwnerData.name] }] });
            };
        };
        //playerDataBase.set(`player_${newOwnerId}`, newOwnerData);
        const newOwnerEntity = world.getEntity(newOwnerId);
        if (newOwnerEntity && newOwnerEntity instanceof Player) {
            newOwnerEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.newowner` }] });
        };
        return true;
    } catch (error) {
        console.warn(error);
    };
};
