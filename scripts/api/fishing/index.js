import { ItemStack, world } from "@minecraft/server";
import { FishManager } from "./fishing";
import playerFishingAfterEvent from "./fishingEvent";
import { CountryManager } from "../country/country";
import { PlayerManager } from "../player/player";
import national_tier_level from "../../national_tier_level";

playerFishingAfterEvent.subscribe((ev) => {
    const fishManager = new FishManager();
    const { player, itemStack, itemEntity, dimension } = ev;
    if (!player || !itemStack || !itemEntity || !dimension) return;
    if (!player.getDynamicProperty('isSpecialFishing')) return;

    const playerManager = new PlayerManager(player.id);
    const countryData = playerManager.country;

    if (!countryData || (countryData.lv < national_tier_level.releaseSpeciallFishing && national_tier_level.enabled)) return

    const fish = fishManager.fishing(itemEntity.location, dimension, player);

    if (!fish) return;

    world.sendMessage(`${dimension.getBiome(itemEntity.location).id}`)

    const fishItemStack = new ItemStack(fish.typeId);
    fishItemStack.setLore([`§r§fSize: ${fish.size}cm`]);
    const item = dimension.spawnItem(fishItemStack, itemEntity.location);
    itemEntity.remove();
    item.clearVelocity();
    let { x, y, z } = player.location;
    let { x: ix, y: iy, z: iz } = item.location;
    item.applyImpulse({ x: Math.ceil(x - ix), y: Math.ceil(y - iy), z: Math.ceil(z - iz) });
});