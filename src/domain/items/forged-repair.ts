import { EntityDamageCause, GameMode, Player, system, world, type ItemStack } from '@minecraft/server';
import { FORGED_TOOL_IDS } from '@/content/minerals/tool-ids.js';
import { getArtisanRankFromLore } from '@/domain/professions/artisan-quality.js';
const lastNotice = new Map<string, number>();

function hasQuality(item: ItemStack) {
    return getArtisanRankFromLore(item.getRawLore()) !== undefined;
}

function blocked(player: Player, item: ItemStack | undefined) {
    if (!item || !FORGED_TOOL_IDS.has(item.typeId) || player.getGameMode() === GameMode.Creative) return false;
    // Anvil operations retain quality; crafting/grindstone combinations create
    // an ungraded item. Do not erase or refill legitimate existing durability.
    return !hasQuality(item);
}

function notice(player: Player) {
    if (system.currentTick - (lastNotice.get(player.id) ?? -100) < 40) return;
    lastNotice.set(player.id, system.currentTick);
    system.run(() => {
        if (player.isValid) player.sendMessage({ translate: 'mineral.tool.no_crafting_repair' });
    });
}

world.beforeEvents.playerBreakBlock.subscribe(event => {
    if (!blocked(event.player, event.itemStack)) return;
    event.cancel = true;
    notice(event.player);
});
world.beforeEvents.itemUse.subscribe(event => {
    if (!blocked(event.source, event.itemStack)) return;
    event.cancel = true;
    notice(event.source);
});
world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    if (!blocked(event.player, event.itemStack)) return;
    event.cancel = true;
    notice(event.player);
});
world.beforeEvents.playerItemAttackEntity.subscribe(event => {
    if (!blocked(event.player, event.itemStack)) return;
    event.cancel = true;
    notice(event.player);
});
world.beforeEvents.entityHurt.subscribe(event => {
    if (event.damageSource.cause !== EntityDamageCause.entityAttack) return;
    const player = event.damageSource.damagingEntity;
    if (!(player instanceof Player)) return;
    const item = player.getComponent('inventory')?.container?.getItem(player.selectedSlotIndex);
    if (!blocked(player, item)) return;
    event.cancel = true;
    notice(player);
});
world.afterEvents.playerLeave.subscribe(event => lastNotice.delete(event.playerId));
