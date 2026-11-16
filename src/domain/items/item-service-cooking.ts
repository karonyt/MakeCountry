// 料理パックのアイテム処理: 食べたときの効果・カカオからのコーヒー豆・品質付きのクワでの作物ボーナス・コップ。
import { BlockPermutation, GameMode, ItemStack, world } from "@minecraft/server";
import { applyConsumableEffects, applyCookingQualityEffects } from "@/config/consumable-effects.js";
import { applyFoodFinishingEffects } from '@/domain/cooking/food-finishing.js';
import { getToolQuality } from "@/domain/items/tool-quality.js";
import { registerContainerUse } from "@/domain/items/container-use.js";
world.afterEvents.itemCompleteUse.subscribe((ev) => {
    applyConsumableEffects(ev.source, ev.itemStack.typeId);
    applyCookingQualityEffects(ev.source, ev.itemStack);
    applyFoodFinishingEffects(ev.source, ev.itemStack);
});

const RANKED_HOE_IDS = new Set([
    'mc:vanadium_hoe',
    'mc:aluminum_hoe',
    'mc:titanium_hoe',
    'mc:tungsten_hoe',
    'mc:mithril_hoe',
    'mc:orichalcum_hoe',
]);

const MATURE_CROP_DROPS: Record<string, string> = {
    'minecraft:wheat': 'minecraft:wheat',
    'minecraft:carrots': 'minecraft:carrot',
    'minecraft:potatoes': 'minecraft:potato',
    'minecraft:beetroot': 'minecraft:beetroot',
    'mc:asparagus_crop': 'mc:asparagus',
    'mc:basil_crop': 'mc:basil',
    'mc:bell_pepper_crop': 'mc:bell_pepper',
    'mc:burdock_crop': 'mc:burdock',
    'mc:cabbage_crop': 'mc:cabbage',
    'mc:chili_pepper_crop': 'mc:chili_pepper',
    'mc:corn_crop': 'mc:sweet_corn',
    'mc:cucumber_crop': 'mc:cucumber',
    'mc:daikon_crop': 'mc:daikon',
    'mc:eggplant_crop': 'mc:eggplant',
    'mc:garlic_crop': 'mc:garlic',
    'mc:ginger_crop': 'mc:ginger',
    'mc:leek_crop': 'mc:leek',
    'mc:lettuce_crop': 'mc:lettuce',
    'mc:lotus_root_crop': 'mc:lotus_root',
    'mc:napa_cabbage_crop': 'mc:napa_cabbage',
    'mc:olive_crop': 'mc:ovlive',
    'mc:onion_crop': 'mc:onion',
    'mc:orange_crop': 'mc:mikan',
    'mc:peanut_crop': 'mc:peanut',
    'mc:pineapple_crop': 'mc:pineapple',
    'mc:rice_crop': 'mc:rice_plant',
    'mc:sesame_crop': 'mc:sesame',
    'mc:shiso_crop': 'mc:shiso',
    'mc:soybeans_crop': 'mc:soybeans',
    'mc:spinach_crop': 'mc:spinach',
    'mc:strawberry_crop': 'mc:straw_berry',
    'mc:tomato_crop': 'mc:tomato',
    'mc:zucchini_crop': 'mc:zucchini',
};

function isMatureCrop(permutation: BlockPermutation) {
    const blockId = permutation.type.id;
    if (blockId.startsWith('mc:')) {
        // @ts-ignore Custom block states are not included in the Script API type map.
        return permutation.getState('mc:growth_stage') === 3;
    }

    return permutation.getState('growth') === 7;
}

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const { brokenBlockPermutation, player, block } = ev;
    if (player.getGameMode() == GameMode.Creative) return;
    if (brokenBlockPermutation.type.id === `minecraft:cocoa` && brokenBlockPermutation.getState(`age`) === 2) {
        const randomNum = getWeight(1, 10000);
        if (randomNum < 50) {
            const coffee_beans = new ItemStack(`mc:coffee_beans`);
            player.dimension.spawnItem(coffee_beans, player.location);
        };
    };
    // Use the pre-break tool even if durability removed it or another handler
    // changed the selected slot before this after-event handler ran.
    const mainItem = ev.itemStackBeforeBreak;
    const cropDropId = MATURE_CROP_DROPS[brokenBlockPermutation.type.id];
    if (mainItem && RANKED_HOE_IDS.has(mainItem.typeId) && cropDropId && isMatureCrop(brokenBlockPermutation)) {
        const bonusAmount = getToolQuality(mainItem);
        if (bonusAmount > 0) {
            const bonusCrop = new ItemStack(cropDropId, bonusAmount);
            player.dimension.spawnItem(bonusCrop, block.location);
        }
    }
});

registerContainerUse(['mc:cup']);

function getWeight(min: any, max: any) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new TypeError("getWeight: min/max must be integers");
    }
    if (min > max) {
        throw new RangeError("getWeight: min must be <= max");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
