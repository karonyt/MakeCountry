import { system, world, type Block, type ItemStack } from '@minecraft/server';
import { acceptsPackageItem, isDrink, isFood, packageDefinition } from './storage.js';

export function acceptsStorageItem(blockId: string, item: ItemStack): boolean {
    if (packageDefinition(blockId)) return acceptsPackageItem(blockId, item);
    if (/^mc:furniture_\w+_refrigerator$/.test(blockId)) return isFood(item) || isDrink(item);
    if (/^mc:furniture_\w+_wine_rack$/.test(blockId)) return isDrink(item);
    return true;
}

/** Never rebuild a whole inventory: remove only a still-present rejected stack. */
export function enforceStorageContents(block: Block): void {
    const container = block.getComponent('inventory')?.container;
    if (!container) return;
    const size = container.size;
    // Empty containers need no ItemStack clones. Do not retain this result:
    // hoppers and same-type metadata changes must be checked on the next pass.
    if (container.emptySlotsCount === size) return;
    const blockId = block.typeId;
    for (let slot = 0; slot < size; slot++) {
        const item = container.getItem(slot);
        if (!item || acceptsStorageItem(blockId, item)) continue;
        // Writable callbacks are synchronous. Remove before spawning, and restore
        // the exact stack if spawning fails, preserving all native item metadata.
        container.setItem(slot, undefined);
        // Return beside the container, below any hopper placed on top, so the
        // rejected stack cannot immediately cycle back through that hopper.
        try { block.dimension.spawnItem(item, { x: block.x + .5, y: block.y + .5, z: block.z - .5 }); }
        catch (error) { container.setItem(slot, item); throw error; }
    }
}

export function registerStorageRestrictions(): void {
    // Spread closed containers over half a second at 20 TPS. Open containers and
    // inventory events retain immediate checks; never cache item eligibility.
    const period = 10;
    type Entry = { key: string; block: Block; bucket: number; checkedTick: number };
    const open = new Map<string, Entry>();
    const tracked = new Map<string, Entry>();
    const buckets = Array.from({ length: period }, () => new Set<Entry>());
    let sequence = 0;
    const restricted = (id: string) => !!packageDefinition(id) || /^mc:furniture_\w+_(?:refrigerator|wine_rack)$/.test(id);
    const watch = (block: Block): Entry => {
        const key = `${block.dimension.id}:${block.x}:${block.y}:${block.z}`;
        const existing = tracked.get(key);
        if (existing) { existing.block = block; return existing; }
        const entry = { key, block, bucket: sequence++ % period, checkedTick: -1 };
        tracked.set(key, entry);
        buckets[entry.bucket].add(entry);
        return entry;
    };
    const forget = (entry: Entry) => {
        tracked.delete(entry.key);
        buckets[entry.bucket].delete(entry);
        for (const [player, current] of open) if (current === entry) open.delete(player);
    };
    const check = (entry: Entry, immediate = false) => {
        if (!immediate && entry.checkedTick === system.currentTick) return;
        const block = entry.block;
        try {
            if (!block.isValid || !restricted(block.typeId)) { forget(entry); return; }
        } catch { forget(entry); return; } // Reloaded chunks are rediscovered by onTick.
        entry.checkedTick = system.currentTick;
        try { enforceStorageContents(block); }
        catch (error) { console.warn('[Storage restriction]', error); }
    };
    system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
        blockComponentRegistry.registerCustomComponent('mc:storage_restrictions', {
            onPlace({ block }) { watch(block); },
            onPlayerInteract({ block }) { watch(block); },
            onTick({ block }) { watch(block); },
        });
    });
    world.afterEvents.blockContainerOpened.subscribe(event => {
        const player = event.openSource.entity;
        if (player?.typeId !== 'minecraft:player') return;
        if (!restricted(event.block.typeId)) return;
        const entry = watch(event.block);
        open.set(player.id, entry); check(entry, true);
    });
    world.afterEvents.blockContainerClosed.subscribe(event => {
        if (restricted(event.block.typeId)) check(watch(event.block), true);
        const player = event.closeSource.entity;
        if (player) open.delete(player.id);
    });
    // Separate mutations within one tick must each be checked, even when a
    // periodic pass or another viewer already inspected this container.
    const changed = (id: string) => { const entry = open.get(id); if (entry) check(entry, true); };
    world.afterEvents.playerCursorItemRelease.subscribe(event => changed(event.player.id));
    world.afterEvents.playerInventoryItemChange.subscribe(event => changed(event.player.id));
    world.afterEvents.playerLeave.subscribe(event => open.delete(event.playerId));
    // Hoppers and metadata-only changes in closed storage are detected within
    // ten ticks. Opening/closing and package pickup validate synchronously too.
    system.runInterval(() => {
        for (const entry of new Set(open.values())) check(entry);
        for (const entry of buckets[system.currentTick % period]) check(entry);
    }, 1);
    console.warn('[Storage restriction] polling: closed=10 ticks (distributed), open=1 tick; inventory events=immediate');
}
