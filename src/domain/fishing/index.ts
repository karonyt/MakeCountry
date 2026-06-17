import { ItemStack, world } from "@minecraft/server";
import { getFishManager } from "@/domain/fishing/fishing.js";
import playerFishingAfterEvent from "@/domain/fishing/fishingEvent.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { PlayerManager } from "@/domain/player/player-manager.js";
import national_tier_level from "@/config/national-tier-level.js";
import config from "@/config/server.js";

playerFishingAfterEvent.subscribe((ev: any) => {
    const fishManager = getFishManager();
    const { player, itemStack, itemEntity, dimension } = ev;
    if (!player || !itemStack || !itemEntity || !dimension) return;
    const isSpecialFishing = player.getDynamicProperty('isSpecialFishing');
    if (isSpecialFishing !== true && isSpecialFishing !== 'true') return;

    const playerManager = new PlayerManager(player.id);
    const countryData = playerManager.country;

    if (!countryData || (countryData.lv < national_tier_level.releaseSpeciallFishing && national_tier_level.enabled)) return

    const fish = fishManager.fishing(itemEntity.location, dimension, player);

    if (!fish) return;

    sendFishCatchSyncEvent(player, fish);

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
