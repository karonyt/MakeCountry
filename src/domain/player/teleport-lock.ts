import type { Player } from "@minecraft/server";
import config from "@/config/server.js";

/**
 * 2026-11-03 operator request: /tpa, /home, /spawn and other teleports are disabled on the hunter dungeon servers.
 * Players leave a dungeon only through its return gate. Elsewhere the existing mc_notp tag still blocks teleports.
 */
const HUNTER_DUNGEON_WORLDS = new Set(["hunterdungeon", "hunterdungeon2", "hunterdungeon3", "redgate1", "redgate2"]);

export function isHunterDungeonWorld(worldId: unknown = config.world): boolean {
    return HUNTER_DUNGEON_WORLDS.has(String(worldId));
}

export function teleportLocked(player: Player): boolean {
    if (isHunterDungeonWorld()) {
        player.sendMessage("§7ダンジョン内では /tpa・/home などの移動は使えません。帰還ゲートを使ってください。");
        return true;
    }
    return player.hasTag("mc_notp");
}
