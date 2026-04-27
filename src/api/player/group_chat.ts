import { Player, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../../lib/util.js";

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
        player.sendMessage("You are not in a group chat.");
        return;
    }
    playerData.groupChat.currentOwnerId = ownerData.id;
    savePlayerData(player.id, playerData);
    player.setDynamicProperty("chatType", "group");
    player.sendMessage(`Switched to group chat: ${ownerData.groupChat.ownedGroup.name}`);
}

export function createGroupChat(player: any, rawName: any) {
    const name = `${rawName ?? ""}`.trim();
    if (!name) {
        player.sendMessage("Usage: /groupcreate <group name>");
        return;
    }

    const playerData = getGroupChatPlayerData(player.id);
    const currentOwnerData = getGroupOwnerDataForPlayer(playerData);
    if (playerData?.groupChat?.ownedGroup) {
        player.sendMessage("You already own a group. Use /groupdisband first.");
        return;
    }
    if (currentOwnerData && currentOwnerData.id !== player.id) {
        player.sendMessage("Leave your current group first with /groupleave.");
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
    player.sendMessage(`Created group chat: ${name}`);
}

export function addPlayerToGroupChat(owner: any, target: any) {
    if (!(target instanceof Player)) {
        owner.sendMessage("Target player was not found.");
        return;
    }
    if (owner.id === target.id) {
        owner.sendMessage("You are already in your own group.");
        return;
    }

    const ownerData = getGroupChatPlayerData(owner.id);
    const targetData = getGroupChatPlayerData(target.id);
    if (!ownerData?.groupChat?.ownedGroup || getActiveGroupOwnerId(ownerData) !== owner.id) {
        owner.sendMessage("Only the group owner can add members.");
        return;
    }
    if (targetData?.groupChat?.ownedGroup) {
        owner.sendMessage(`${target.name} already owns another group.`);
        return;
    }

    const targetOwnerData = getGroupOwnerDataForPlayer(targetData);
    if (targetOwnerData) {
        owner.sendMessage(`${target.name} is already in another group.`);
        return;
    }
    if (ownerData.groupChat.ownedGroup.memberIds.includes(target.id)) {
        owner.sendMessage(`${target.name} is already in your group.`);
        return;
    }

    ownerData.groupChat.ownedGroup.memberIds.push(target.id);
    targetData.groupChat.currentOwnerId = owner.id;
    savePlayerData(owner.id, ownerData);
    savePlayerData(target.id, targetData);
    owner.sendMessage(`Added ${target.name} to the group.`);
    target.sendMessage(`You joined ${owner.name}'s group chat.`);
}

export function removePlayerFromGroupChat(owner: any, target: any) {
    if (!(target instanceof Player)) {
        owner.sendMessage("Target player was not found.");
        return;
    }

    const ownerData = getGroupChatPlayerData(owner.id);
    const targetData = getGroupChatPlayerData(target.id);
    if (!ownerData?.groupChat?.ownedGroup || getActiveGroupOwnerId(ownerData) !== owner.id) {
        owner.sendMessage("Only the group owner can remove members.");
        return;
    }

    const beforeCount = ownerData.groupChat.ownedGroup.memberIds.length;
    ownerData.groupChat.ownedGroup.memberIds = ownerData.groupChat.ownedGroup.memberIds.filter((id: any) => id !== target.id);
    if (beforeCount === ownerData.groupChat.ownedGroup.memberIds.length) {
        owner.sendMessage(`${target.name} is not in your group.`);
        return;
    }

    if (targetData?.groupChat?.currentOwnerId === owner.id) {
        targetData.groupChat.currentOwnerId = undefined;
        savePlayerData(target.id, targetData);
        if (target.getDynamicProperty("chatType") === "group") {
            target.setDynamicProperty("chatType", "general");
            target.sendMessage("You were removed from the group and moved to general chat.");
        } else {
            target.sendMessage("You were removed from the group.");
        }
    }

    savePlayerData(owner.id, ownerData);
    owner.sendMessage(`Removed ${target.name} from the group.`);
}

export function leaveGroupChat(player: any) {
    const playerData = getGroupChatPlayerData(player.id);
    const ownerData = getGroupOwnerDataForPlayer(playerData);
    if (!ownerData) {
        player.sendMessage("You are not in a group.");
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
    player.sendMessage("You left the group chat.");
}

export function disbandGroupChat(player: any) {
    const ownerData = getGroupChatPlayerData(player.id);
    const ownedGroup = ownerData?.groupChat?.ownedGroup;
    if (!ownedGroup) {
        player.sendMessage("You do not own a group.");
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
            member.sendMessage(`${player.name}'s group chat was disbanded.`);
        }
    }

    ownerData.groupChat.ownedGroup = undefined;
    ownerData.groupChat.currentOwnerId = undefined;
    savePlayerData(player.id, ownerData);
    if (player.getDynamicProperty("chatType") === "group") {
        player.setDynamicProperty("chatType", "general");
    }
    player.sendMessage("Your group chat was disbanded.");
}

export function showGroupChatInfo(player: any) {
    const playerData = getGroupChatPlayerData(player.id);
    const ownerData = getGroupOwnerDataForPlayer(playerData);
    if (!ownerData) {
        player.sendMessage("You are not in a group.");
        return;
    }

    const memberNames = ownerData.groupChat.ownedGroup.memberIds
        .map((memberId: any) => getGroupChatPlayerData(memberId)?.name)
        .filter((name: any) => !!name);
    player.sendMessage([
        `Group: ${ownerData.groupChat.ownedGroup.name}`,
        `Owner: ${ownerData.name}`,
        `Members: ${memberNames.length > 0 ? memberNames.join(", ") : "(none)"}`,
    ].join("\n"));
}

export function getGroupChatRecipients(sender: any) {
    const senderData = getGroupChatPlayerData(sender.id);
    const ownerData = getGroupOwnerDataForPlayer(senderData);
    if (!ownerData?.groupChat?.ownedGroup) {
        return { error: "You are not in a group chat." };
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
