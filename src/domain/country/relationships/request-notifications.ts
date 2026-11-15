import { world } from "@minecraft/server";

export type RelationshipRequestKind = "alliance" | "friendly" | "application" | "federation" | "merge";

type CountryNotificationTarget = {
    name?: string;
    owner?: string;
};

function onlinePlayer(playerId: unknown) {
    if (playerId === undefined || playerId === null) return undefined;
    const id = String(playerId);
    return world.getPlayers().find(player => String(player.id) === id);
}

function message(translate: string, value: string, prefix = "") {
    return {
        rawtext: [
            { text: `§a[MakeCountry]§r\n${prefix}` },
            { translate, with: [value] }
        ]
    };
}

function sendOnce(recipients: Set<string>, player: any, value: any) {
    if (!player || recipients.has(String(player.id))) return;
    recipients.add(String(player.id));
    player.sendMessage(value);
}

/**
 * Notify the player who performed the action and both countries' online owners.
 * The recipient-side message is built from existing localized relationship strings,
 * so every language shipped by the resource pack remains supported.
 */
export function notifyRelationshipRequest(
    action: "sent" | "accepted",
    kind: RelationshipRequestKind,
    sourceCountry: CountryNotificationTarget,
    targetCountry: CountryNotificationTarget,
    actor?: any,
) {
    const recipients = new Set<string>();
    const sourceName = `${sourceCountry?.name ?? ""}`;
    const targetName = `${targetCountry?.name ?? ""}`;

    if (action === "sent") {
        const senderMessage = message(`sent.${kind}.request`, targetName);
        const receiverMessage = message(`received.${kind}.request`, "", `${sourceName} §r: `);
        sendOnce(recipients, actor, senderMessage);
        sendOnce(recipients, onlinePlayer(sourceCountry?.owner), senderMessage);
        sendOnce(recipients, onlinePlayer(targetCountry?.owner), receiverMessage);
        return;
    }

    const accepterMessage = message(`accept.${kind}.request`, sourceName);
    const requesterMessage = message(`accept.${kind}.request`, sourceName, `${targetName} §r: `);
    sendOnce(recipients, actor, accepterMessage);
    sendOnce(recipients, onlinePlayer(targetCountry?.owner), accepterMessage);
    sendOnce(recipients, onlinePlayer(sourceCountry?.owner), requesterMessage);
}
