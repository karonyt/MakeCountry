import type { Dimension, Player, Vector3 } from '@minecraft/server';

const RIG_ID = 'mc:deep_fishing_rig';

export function hasDeepWater(readBlock: (y: number) => string | undefined, surfaceY: number): boolean {
    // Fished item entities may hover one or two blocks above the surface.
    let top: number | undefined;
    for (let y = Math.floor(surfaceY) + 1; y >= Math.floor(surfaceY) - 2; y--) {
        const block = readBlock(y);
        if (block === 'minecraft:water' || block === 'minecraft:flowing_water') { top = y; break; }
    }
    if (top === undefined) return false;
    for (let depth = 0; depth < 8; depth++) {
        const block = readBlock(top - depth);
        if (block !== 'minecraft:water' && block !== 'minecraft:flowing_water') return false;
    }
    return true;
}

export function findDeepwaterRig(player: Player, dimension: Dimension, location: Vector3): number | undefined {
    try {
        const biome = dimension.getBiome(location)?.id;
        if (!biome?.includes('ocean')) return undefined;
        const container = player.getComponent('inventory')?.container;
        if (!container) return undefined;
        let slot: number | undefined;
        for (let i = 0; i < container.size; i++) {
            if (container.getItem(i)?.typeId === RIG_ID) { slot = i; break; }
        }
        if (slot === undefined) return undefined;
        return hasDeepWater(y => dimension.getBlock({ x: Math.floor(location.x), y, z: Math.floor(location.z) })?.typeId, location.y) ? slot : undefined;
    } catch {
        return undefined;
    }
}

export function consumeDeepwaterRig(player: Player, slot: number) {
    const container = player.getComponent('inventory')?.container;
    const item = container?.getItem(slot);
    if (!item || item.typeId !== RIG_ID) return;
    if (item.amount === 1) container?.setItem(slot);
    else { item.amount--; container?.setItem(slot, item); }
    player.onScreenDisplay.setActionBar({ translate: 'mineral.fishing.rig_used' });
}
