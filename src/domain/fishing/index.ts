import { readLiteFlag } from "@/shared/shared-player-props.js";
import { ItemStack, world } from "@minecraft/server";
import { getFishManager } from "@/domain/fishing/fishing.js";
import playerFishingAfterEvent from "@/domain/fishing/fishingEvent.js";
import { getPlayerCountryLevel } from "@/domain/country/player-country-level.js";
import national_tier_level from "@/config/national-tier-level.js";
import config from "@/config/server.js";
import { reportJobAchievement } from "@/shared/integration/standalone.js";
import { forwardDungeonCatch } from "./dungeon-catch-bridge.js";
import { findDeepwaterRig, consumeDeepwaterRig } from '@/domain/fishing/deepwater-rig.js';

playerFishingAfterEvent.subscribe((ev: any) => {
    // Dungeon catches are handled by the pack owning the gate and its loot.
    if (forwardDungeonCatch(ev, config.world)) return;
    const fishManager = getFishManager();
    const { player, itemStack, itemEntity, dimension } = ev;
    if (!player || !itemStack || !itemEntity || !dimension) return;
    if (!readLiteFlag(player, 'isSpecialFishing')) return;

    const countryLv = getPlayerCountryLevel(player);

    if (countryLv === undefined || (countryLv < national_tier_level.releaseSpeciallFishing && national_tier_level.enabled)) return

    const rigSlot = findDeepwaterRig(player, dimension, itemEntity.location);
    const fish = fishManager.fishing(itemEntity.location, dimension, player, rigSlot !== undefined);

    if (!fish) return;
    if (rigSlot !== undefined) consumeDeepwaterRig(player, rigSlot);

    sendFishCatchSyncEvent(player, fish);
    // 出現重み 1〜2 の魚は、各釣り場でも最も希少な層。
    if (Number(fish.weight) > 0 && Number(fish.weight) <= 2) {
        reportJobAchievement(player, "rare_fish");
    }

    //world.sendMessage(`${dimension.getBiome(itemEntity.location).id}`)

    const fishItemStack = new ItemStack(fish.typeId);
    fishItemStack.setLore([{ rawtext: [{ text: '§r§f' }, { translate: 'fish.lore.size', with: [`${fish.size}`] }] }]);
    const item = dimension.spawnItem(fishItemStack, itemEntity.location);
    itemEntity.remove();
    item.clearVelocity();
    let { x, y, z } = player.location;
    let { x: ix, y: iy, z: iz } = item.location;
    item.applyImpulse({ x: Math.ceil(x - ix), y: Math.ceil(y - iy), z: Math.ceil(z - iz) });
});

function sendFishCatchSyncEvent(player: any, fish: any) {
    const sender = (globalThis as any).karoSendServerEvent;
    if (typeof sender !== "function") return;

    sender({
        type: "fish_catch",
        data: {
            sourceServer: config.world,
            playerId: player.id,
            playerName: player.name,
            typeId: fish.typeId,
            size: fish.size,
            count: fish.playerRecord?.count ?? 0,
            maxSize: fish.playerRecord?.maxSize ?? fish.size,
        },
    })?.catch?.((error: any) => {
        console.warn(`[FishSync] Failed to send fish catch sync: ${error instanceof Error ? error.message : error}`);
    });
}
