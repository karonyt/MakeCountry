import { Player, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";

function createDefaultGroupChatData() {
    return {
        currentOwnerId: undefined,
        ownedGroup: undefined,
    };
}

export function ensureGroupChatData(playerData: any) {
    if (!playerData) return playerData;
    playerData.groupChat ??= createDefaultGroupChatData();
    if (playerData.groupChat.currentOwnerId === null) playerData.groupChat.currentOwnerId = undefined;
    if (playerData.groupChat.ownedGroup === null) playerData.groupChat.ownedGroup = undefined;
    if (playerData.groupChat.ownedGroup) {
        playerData.groupChat.ownedGroup.name ??= "Group";
        playerData.groupChat.ownedGroup.memberIds ??= [];
        playerData.groupChat.ownedGroup.createdAt ??= Date.now();
        playerData.groupChat.ownedGroup.memberIds = [...new Set(playerData.groupChat.ownedGroup.memberIds.filter((id: any) => typeof id === "string"))];
    }
    return playerData;
}

export function getGroupChatPlayerData(playerId: any) {
    return ensureGroupChatData(GetAndParsePropertyData(`player_${playerId}`));
}

function savePlayerData(playerId: any, playerData: any) {
    ensureGroupChatData(playerData);
    StringifyAndSavePropertyData(`player_${playerId}`, playerData);
}

function findOnlinePlayerById(playerId: any) {
    const playerData = getGroupChatPlayerData(playerId);
    if (!playerData?.name) return undefined;
    return world.getPlayers({ name: playerData.name })[0];
}

export function getActiveGroupOwnerId(playerData: any) {
    ensureGroupChatData(playerData);
    if (!playerData?.id) return undefined;
    if (playerData.groupChat.ownedGroup) {
        const currentOwnerId = playerData.groupChat.currentOwnerId;
        if (!currentOwnerId || currentOwnerId === playerData.id) return playerData.id;
    }
    return playerData.groupChat.currentOwnerId;
}

export function getGroupOwnerDataForPlayer(playerData: any) {
    const ownerId = getActiveGroupOwnerId(playerData);
    if (!ownerId) return undefined;
    const ownerData = getGroupChatPlayerData(ownerId);
    if (!ownerData?.groupChat?.ownedGroup) return undefined;
    if (ownerId !== playerData?.id && !ownerData.groupChat.ownedGroup.memberIds.includes(playerData?.id)) return undefined;
    return ownerData;
}

export function switchToGroupChat(player: any) {
    const playerData = getGroupChatPlayerData(player.id);
    const ownerData = getGroupOwnerDataForPlayer(playerData);
    if (!ownerData) {
        player.sendMessage({ translate: "groupchat.error.not_in_chat" });
        return;
    }
    playerData.groupChat.currentOwnerId = ownerData.id;
    savePlayerData(player.id, playerData);
    player.setDynamicProperty("chatType", "group");
    player.sendMessage({ translate: "groupchat.switched", with: [ownerData.groupChat.ownedGroup.name] });
}

export function createGroupChat(player: any, rawName: any) {
    const name = `${rawName ?? ""}`.trim();
    if (!name) {
        player.sendMessage({ translate: "groupchat.usage.create" });
        return;
    }

    const playerData = getGroupChatPlayerData(player.id);
    const currentOwnerData = getGroupOwnerDataForPlayer(playerData);
    if (playerData?.groupChat?.ownedGroup) {
        player.sendMessage({ translate: "groupchat.error.already_own" });
        return;
    }
    if (currentOwnerData && currentOwnerData.id !== player.id) {
        player.sendMessage({ translate: "groupchat.error.leave_current_first" });
        return;
    }

    playerData.groupChat.ownedGroup = {
        name,
        memberIds: [],
        createdAt: Date.now(),
    };
    playerData.groupChat.currentOwnerId = player.id;
    savePlayerData(player.id, playerData);
    player.setDynamicProperty("chatType", "group");
    player.sendMessage({ translate: "groupchat.created", with: [name] });
}

export function addPlayerToGroupChat(owner: any, target: any) {
    if (!(target instanceof Player)) {
        owner.sendMessage({ translate: "groupchat.error.target_not_found" });
        return;
    }
    if (owner.id === target.id) {
        owner.sendMessage({ translate: "groupchat.error.already_in_own" });
        return;
    }

    const ownerData = getGroupChatPlayerData(owner.id);
    const targetData = getGroupChatPlayerData(target.id);
    if (!ownerData?.groupChat?.ownedGroup || getActiveGroupOwnerId(ownerData) !== owner.id) {
        owner.sendMessage({ translate: "groupchat.error.owner_only_add" });
        return;
    }
    if (targetData?.groupChat?.ownedGroup) {
        owner.sendMessage({ translate: "groupchat.error.target_owns", with: [target.name] });
        return;
    }

    const targetOwnerData = getGroupOwnerDataForPlayer(targetData);
    if (targetOwnerData) {
        owner.sendMessage({ translate: "groupchat.error.target_in_another", with: [target.name] });
        return;
    }
    if (ownerData.groupChat.ownedGroup.memberIds.includes(target.id)) {
        owner.sendMessage({ translate: "groupchat.error.target_in_your_group", with: [target.name] });
        return;
    }

    ownerData.groupChat.ownedGroup.memberIds.push(target.id);
    targetData.groupChat.currentOwnerId = owner.id;
    savePlayerData(owner.id, ownerData);
    savePlayerData(target.id, targetData);
    owner.sendMessage({ translate: "groupchat.added_owner", with: [target.name] });
    target.sendMessage({ translate: "groupchat.joined_target", with: [owner.name] });
}

export function removePlayerFromGroupChat(owner: any, target: any) {
    if (!(target instanceof Player)) {
        owner.sendMessage({ translate: "groupchat.error.target_not_found" });
        return;
    }

    const ownerData = getGroupChatPlayerData(owner.id);
    const targetData = getGroupChatPlayerData(target.id);
    if (!ownerData?.groupChat?.ownedGroup || getActiveGroupOwnerId(ownerData) !== owner.id) {
        owner.sendMessage({ translate: "groupchat.error.owner_only_remove" });
        return;
    }

    const beforeCount = ownerData.groupChat.ownedGroup.memberIds.length;
    ownerData.groupChat.ownedGroup.memberIds = ownerData.groupChat.ownedGroup.memberIds.filter((id: any) => id !== target.id);
    if (beforeCount === ownerData.groupChat.ownedGroup.memberIds.length) {
        owner.sendMessage({ translate: "groupchat.error.target_not_in_group", with: [target.name] });
        return;
    }

    if (targetData?.groupChat?.currentOwnerId === owner.id) {
        targetData.groupChat.currentOwnerId = undefined;
        savePlayerData(target.id, targetData);
        if (target.getDynamicProperty("chatType") === "group") {
            target.setDynamicProperty("chatType", "general");
            target.sendMessage({ translate: "groupchat.removed_to_general" });
        } else {
            target.sendMessage({ translate: "groupchat.removed_from_group" });
        }
    }

    savePlayerData(owner.id, ownerData);
    owner.sendMessage({ translate: "groupchat.removed_owner", with: [target.name] });
}

export function leaveGroupChat(player: any) {
    const playerData = getGroupChatPlayerData(player.id);
    const ownerData = getGroupOwnerDataForPlayer(playerData);
    if (!ownerData) {
        player.sendMessage({ translate: "groupchat.error.not_in_group" });
        return;
    }

    if (ownerData.id === player.id) {
        disbandGroupChat(player);
        return;
    }

    ownerData.groupChat.ownedGroup.memberIds = ownerData.groupChat.ownedGroup.memberIds.filter((id: any) => id !== player.id);
    playerData.groupChat.currentOwnerId = undefined;
    savePlayerData(ownerData.id, ownerData);
    savePlayerData(player.id, playerData);
    if (player.getDynamicProperty("chatType") === "group") {
        player.setDynamicProperty("chatType", "general");
    }
    player.sendMessage({ translate: "groupchat.left" });
}

export function disbandGroupChat(player: any) {
    const ownerData = getGroupChatPlayerData(player.id);
    const ownedGroup = ownerData?.groupChat?.ownedGroup;
    if (!ownedGroup) {
        player.sendMessage({ translate: "groupchat.error.no_owned_group" });
        return;
    }

    for (const memberId of ownedGroup.memberIds) {
        const memberData = getGroupChatPlayerData(memberId);
        if (memberData?.groupChat?.currentOwnerId === player.id) {
            memberData.groupChat.currentOwnerId = undefined;
            savePlayerData(memberId, memberData);
        }
        const member = findOnlinePlayerById(memberId);
        if (member) {
            if (member.getDynamicProperty("chatType") === "group") {
                member.setDynamicProperty("chatType", "general");
            }
            member.sendMessage({ translate: "groupchat.disbanded_member", with: [player.name] });
        }
    }

    ownerData.groupChat.ownedGroup = undefined;
    ownerData.groupChat.currentOwnerId = undefined;
    savePlayerData(player.id, ownerData);
    if (player.getDynamicProperty("chatType") === "group") {
        player.setDynamicProperty("chatType", "general");
    }
    player.sendMessage({ translate: "groupchat.disbanded_owner" });
}

export function showGroupChatInfo(player: any) {
    const playerData = getGroupChatPlayerData(player.id);
    const ownerData = getGroupOwnerDataForPlayer(playerData);
    if (!ownerData) {
        player.sendMessage({ translate: "groupchat.error.not_in_group" });
        return;
    }

    const memberNames = ownerData.groupChat.ownedGroup.memberIds
        .map((memberId: any) => getGroupChatPlayerData(memberId)?.name)
        .filter((name: any) => !!name);
    player.sendMessage({
        rawtext: [
            { translate: "groupchat.info.group", with: [ownerData.groupChat.ownedGroup.name] },
            { text: "\n" },
            { translate: "groupchat.info.owner", with: [ownerData.name] },
            { text: "\n" },
            { translate: "groupchat.info.members" },
            memberNames.length > 0 ? { text: memberNames.join(", ") } : { translate: "none" },
        ],
    });
}

export function getGroupChatRecipients(sender: any) {
    const senderData = getGroupChatPlayerData(sender.id);
    const ownerData = getGroupOwnerDataForPlayer(senderData);
    if (!ownerData?.groupChat?.ownedGroup) {
        return { error: { translate: "groupchat.error.not_in_chat" } };
    }

    const recipients = [sender];
    const seen = new Set([sender.id]);
    const owner = ownerData.id === sender.id ? sender : findOnlinePlayerById(ownerData.id);
    if (owner && !seen.has(owner.id)) {
        recipients.push(owner);
        seen.add(owner.id);
    }

    for (const memberId of ownerData.groupChat.ownedGroup.memberIds) {
        if (seen.has(memberId)) continue;
        const member = findOnlinePlayerById(memberId);
        if (!member) continue;
        recipients.push(member);
        seen.add(memberId);
    }

    return {
        ownerData,
        recipients,
        groupName: ownerData.groupChat.ownedGroup.name ?? "Group",
    };
}

export function migrateGroupChatReferences(playerDataBase: any, oldId: any, newId: any) {
    for (const key of playerDataBase.idList) {
        const raw = playerDataBase.get(key);
        if (!raw) continue;
        const playerData = ensureGroupChatData(JSON.parse(raw));
        let changed = false;

        if (playerData.groupChat.currentOwnerId === oldId) {
            playerData.groupChat.currentOwnerId = newId;
            changed = true;
        }

        if (playerData.groupChat.ownedGroup?.memberIds?.includes(oldId)) {
            playerData.groupChat.ownedGroup.memberIds = playerData.groupChat.ownedGroup.memberIds.map((id: any) => id === oldId ? newId : id);
            changed = true;
        }

        if (changed) {
            playerDataBase.set(key, JSON.stringify(playerData));
        }
    }
}
