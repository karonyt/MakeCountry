import { ItemStack } from "@minecraft/server";
import { FishManager } from "./fishing";
import playerFishingAfterEvent from "./fishingEvent";

playerFishingAfterEvent.subscribe((ev) => {
    const fishManager = new FishManager();
    const { player, itemStack, itemEntity, dimension } = ev;
    if (!player || !itemStack || !itemEntity || !dimension) return;
    if (!player.getDynamicProperty('isSpecialFishing')) return;
    const fish = fishManager.fishing(player.location, dimension, player);
    if (!fish) return;

    const item = dimension.spawnItem(new ItemStack(fish.typeId).setLore([`§r§fSize: ${fish.size}cm`]), itemEntity.location);
    itemEntity.remove();
    item.clearVelocity();
    let { x, y, z } = player.location;
    let { x: ix, y: iy, z: iz } = item.location;
    item.applyImpulse({ x: Math.ceil(x - ix), y: Math.ceil(y - iy), z: Math.ceil(z - iz) });
});