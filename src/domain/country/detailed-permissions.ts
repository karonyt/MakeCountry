const ANVIL_BLOCKS = new Set([
    'minecraft:anvil',
    'minecraft:chipped_anvil',
    'minecraft:damaged_anvil',
]);

/** Returns a narrower permission for interactions that can be configured separately. */
export function getDetailedBlockUsePermission(blockTypeId: string): string | undefined {
    if (ANVIL_BLOCKS.has(blockTypeId)) return 'anvilUse';
    if (blockTypeId.endsWith('_door') || blockTypeId.endsWith('_trapdoor')) return 'doorUse';
    if (blockTypeId === 'minecraft:lever' || blockTypeId.endsWith('_button')) return 'switchUse';
    if (blockTypeId.endsWith('_sign')) return 'signEdit';
    return undefined;
}

export function getDetailedItemUsePermission(itemTypeId: string): string | undefined {
    return itemTypeId === 'minecraft:firework_rocket' ? 'flightItemUse' : undefined;
}

/** Dungeon exits remain governed by their existing interaction rules. */
export function getDetailedEntityUsePermission(entityTypeId: string): string | undefined {
    return /^mc:gate_[edcbas]$/.test(entityTypeId) ? 'gateUse' : undefined;
}
