import { MINERAL_ORES } from '@/content/minerals/ore-data.js';

const PICKAXE_TIERS: Readonly<Record<string, number>> = {
    'minecraft:wooden_pickaxe': 0,
    'minecraft:golden_pickaxe': 0,
    'minecraft:stone_pickaxe': 1,
    'minecraft:copper_pickaxe': 1,
    'minecraft:iron_pickaxe': 2,
    'minecraft:diamond_pickaxe': 3,
    'minecraft:netherite_pickaxe': 4,
    'mc:bronze_pickaxe': 2,
    'mc:vanadium_pickaxe': 3,
    'mc:aluminum_pickaxe': 3,
    'mc:nickel_pickaxe': 3,
    'mc:molybdenum_pickaxe': 4,
    'mc:titanium_pickaxe': 4,
    'mc:tungsten_pickaxe': 4,
    'mc:mithril_pickaxe': 5,
    'mc:orichalcum_pickaxe': 5,
};

export function getMineralDrop(blockId: string, toolId: string | undefined, quality: number, silkTouch: boolean) {
    // Bedrock already drops the block with Silk Touch, bypassing minecraft:loot.
    // Supplying a scripted drop as well would duplicate the ore.
    if (silkTouch) return undefined;
    const ore = MINERAL_ORES[blockId as keyof typeof MINERAL_ORES];
    if (!ore || !toolId || (PICKAXE_TIERS[toolId] ?? -1) < ore.minTier) return undefined;
    return {
        id: ore.drop,
        // Match legacy ores such as titanium: one base item plus tool quality.
        count: 1 + Math.max(0, Math.min(12, Math.floor(Number.isFinite(quality) ? quality : 0))),
    };
}
