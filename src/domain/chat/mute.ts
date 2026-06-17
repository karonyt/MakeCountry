import { Player } from "@minecraft/server";

const CHAT_MUTE_DP_KEY = "mutedPlayers";

function normalizePlayerName(name: string) {
    return name.trim().toLowerCase();
}

export function getMutedPlayerNames(player: Player) {
    const raw = player.getDynamicProperty(CHAT_MUTE_DP_KEY);
    if (typeof raw !== "string" || raw === "") return [] as string[];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [] as string[];
        return parsed.filter((name): name is string => typeof name === "string" && name.trim() !== "");
    } catch {
        return [] as string[];
    }
}

export function setMutedPlayerNames(player: Player, names: string[]) {
    const uniqueNames: string[] = [];
    const seen = new Set<string>();

    for (const name of names) {
        if (typeof name !== "string") continue;
        const trimmed = name.trim();
        if (!trimmed) continue;

        const normalized = normalizePlayerName(trimmed);
        if (seen.has(normalized)) continue;

        seen.add(normalized);
        uniqueNames.push(trimmed);
    }

    player.setDynamicProperty(CHAT_MUTE_DP_KEY, JSON.stringify(uniqueNames));
    return uniqueNames;
}

export function isPlayerMuted(receiver: Player, senderName: string) {
    const mutedPlayers = getMutedPlayerNames(receiver);
    const normalizedSender = normalizePlayerName(senderName);
    return mutedPlayers.some(name => normalizePlayerName(name) === normalizedSender);
}

export function mutePlayer(receiver: Player, targetName: string) {
    const mutedPlayers = getMutedPlayerNames(receiver);
    const normalizedTarget = normalizePlayerName(targetName);
    const exists = mutedPlayers.some(name => normalizePlayerName(name) === normalizedTarget);
    if (exists) return { changed: false, names: mutedPlayers };

    return {
        changed: true,
        names: setMutedPlayerNames(receiver, [...mutedPlayers, targetName.trim()])
    };
}

export function unmutePlayer(receiver: Player, targetName: string) {
    const normalizedTarget = normalizePlayerName(targetName);
    const mutedPlayers = getMutedPlayerNames(receiver);
    const nextNames = mutedPlayers.filter(name => normalizePlayerName(name) !== normalizedTarget);

    return {
        changed: nextNames.length !== mutedPlayers.length,
        names: setMutedPlayerNames(receiver, nextNames)
    };
}

export function resolvePlayerName(rawName: string, fallbackPlayers: Player[] = []) {
    const trimmed = rawName.trim();
    if (!trimmed) return "";

    const normalized = normalizePlayerName(trimmed);
    const found = fallbackPlayers.find(player => normalizePlayerName(player.name) === normalized);
    return found?.name ?? trimmed;
}
