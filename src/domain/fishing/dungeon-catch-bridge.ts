import { system } from "@minecraft/server";
import type { PlayerFishingAfterEvent } from "./player-fishing-after-event.js";
import { DUNGEON_FISHING_CATCH_EVENT, DUNGEON_FISHING_CATCH_TAG, DUNGEON_FISHING_HANDLED_TAG } from "./dungeon-catch-protocol.js";

/** Keep the normal fish replacement from racing the dungeon pack for the same item. */
export function forwardDungeonCatch(event: PlayerFishingAfterEvent, worldId: string): boolean {
    if (!/^hunterdungeon(?:2|3)?$/.test(worldId)) return false;
    const { player, itemEntity, dimension, hookLocation } = event;
    if (!event.result || !player?.isValid || !itemEntity?.isValid || !dimension || !hookLocation) return true;
    if (itemEntity.hasTag(DUNGEON_FISHING_CATCH_TAG) || itemEntity.hasTag(DUNGEON_FISHING_HANDLED_TAG)) return true;
    try {
        itemEntity.addTag(DUNGEON_FISHING_CATCH_TAG);
        system.sendScriptEvent(DUNGEON_FISHING_CATCH_EVENT, JSON.stringify({
            playerId: player.id, itemId: itemEntity.id, dimensionId: dimension.id, hookLocation,
        }));
    } catch (error) {
        console.warn(`[DungeonFishing] catch forwarding failed: ${String(error)}`);
    }
    return true;
}
