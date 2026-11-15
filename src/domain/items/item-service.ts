import { BlockPermutation, EnchantmentType, EnchantmentTypes, GameMode, ItemStack, system, world } from "@minecraft/server";
import { applyConsumableEffects, applyCookingQualityEffects } from "@/config/consumable-effects.js";
import { applyFoodFinishingEffects } from '@/domain/cooking/food-finishing.js';
import { getArtisanQuality } from "@/domain/professions/artisan-quality.js";
import { MINERAL_ORES } from '@/content/minerals/ore-data.js';
import { getMineralDrop } from '@/domain/items/mineral-drops.js';
import '@/domain/items/forged-repair.js';

world.afterEvents.itemCompleteUse.subscribe((ev) => {
    applyConsumableEffects(ev.source, ev.itemStack.typeId);
    applyCookingQualityEffects(ev.source, ev.itemStack);
    applyFoodFinishingEffects(ev.source, ev.itemStack);
});

system.beforeEvents.startup.subscribe((ev) => {
    ev.itemComponentRegistry.registerCustomComponent('mc:ranktool', {
        onMineBlock: (ev) => {
            const player = ev.source;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const container = player.getComponent('inventory').container;
            const eventItem = ev.itemStack;
            if (!eventItem) return;
            // The selected hotbar slot can change between the mine event and this
            // callback.  Never write the event's tool into a slot now holding a
            // different item, or that item would be replaced (for example, a
            // netherite pickaxe could become a tungsten pickaxe).
            // @ts-ignore TS(2339): Property 'selectedSlotIndex' does not exist on typ... Remove this comment to see the full error message
            const selectedSlot = player.selectedSlotIndex;
            const item = container.getItem(selectedSlot);
            if (!item || item.typeId !== eventItem.typeId) return;

            const qualityNum = getToolQuality(item);
            const durability = item.getComponent('durability');
            if (!durability) return;
            const damage = durability.damage + (13 - qualityNum);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (damage >= durability.maxDurability) {
                container.setItem(selectedSlot);
                return;
            };
            durability.damage = damage;
            container.setItem(selectedSlot, item);
        }
    });
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
    let silktouch = false;
    if (mainItem) {
        const enchantable = mainItem.getComponent('enchantable');
        if (enchantable) {
            // @ts-ignore TS(2345): Argument of type 'EnchantmentType | undefined' is ... Remove this comment to see the full error message
            silktouch = enchantable.getEnchantment(EnchantmentTypes.get('minecraft:silk_touch')) ? true : false;
        };
    };
    const mineralId = brokenBlockPermutation.type.id;
    if (mineralId in MINERAL_ORES) {
        // Use the actual tool at break time, including its quality. A broken
        // last-use pickaxe is no longer guaranteed to occupy the selected slot.
        const tool = ev.itemStackBeforeBreak;
        const silk = !!tool?.getComponent('enchantable')?.getEnchantment('silk_touch');
        const drop = getMineralDrop(mineralId, tool?.typeId, tool ? getToolQuality(tool) : 0, silk);
        if (drop) player.dimension.spawnItem(new ItemStack(drop.id, drop.count), block.location);
        return;
    }
    if (!mainItem || silktouch) return;
    switch (brokenBlockPermutation.type.id) {
        case 'mc:rock_salt_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            const item = new ItemStack('mc:salt');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };
        case 'mc:vanadium_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            const item = new ItemStack('mc:vanadium_powder');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };
        case 'mc:bauxite_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            const item = new ItemStack('mc:bauxite');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };
        case 'mc:lime_stone': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            const item = new ItemStack('mc:lime_powder');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };

        case 'mc:cryolite_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            const item = new ItemStack('mc:cryolite');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };

        case 'mc:titanium_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:iron_pickaxe') return;
            const item = new ItemStack('mc:titanium');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };
        case 'mc:tungsten_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:iron_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:diamond_pickaxe') return;
            const item = new ItemStack('mc:tungsten');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };

        case 'mc:mithril_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:iron_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:diamond_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:netherite_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:vanadium_pickaxe') return;
            const item = new ItemStack('mc:mithril');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };

        case 'mc:orichalcum_ore': {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (!mainItem.typeId.includes('_pickaxe')) return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:wooden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:copper_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:golden_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:stone_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:iron_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:diamond_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:netherite_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:vanadium_pickaxe') return;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (mainItem.typeId == 'minecraft:titanium_pickaxe') return;
            const item = new ItemStack('mc:orichalcum');
            const toolQuality = getToolQuality(mainItem);
            item.amount = toolQuality + 1;
            player.dimension.spawnItem(item, block.location);
            break;
        };

        default: {
            if (ev.brokenBlockPermutation.type.id.includes('glass')) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                if (mainItem.typeId == 'mc:titanium_hammer') {
                    return;
                };
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                if (mainItem.typeId == 'mc:tungsten_hammer') {
                    const item = new ItemStack(ev.brokenBlockPermutation.type.id);
                    player.dimension.spawnItem(item, block.location);
                    return;
                }

            }
        }
    };
});

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent('inventory').container;
    const block = player.getBlockFromViewDirection({ maxDistance: 5, includeLiquidBlocks: true })?.block;
    const entities = player.getEntitiesFromViewDirection({ maxDistance: 5, includeLiquidBlocks: true });
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const entity = entities.length == 0 ? undefined : entities[0].entity;
    if (itemStack) {
        switch (itemStack.typeId) {
            case 'mc:beaker': {
                if (block) {
                    if (block.typeId == 'minecraft:water') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:water_beaker'), player.location);
                        break;
                    };
                };
            };
            case 'mc:cup': {
                if (block) {
                    if (block.typeId == 'minecraft:water') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:water_cup'), player.location);
                        break;
                    };
                };
            };
            case 'mc:flask': {
                if (block) {
                    if (block.typeId == 'mc:oil_block') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:crude_oil'), player.location);
                        block.setPermutation(BlockPermutation.resolve('minecraft:air'));
                        break;
                    };
                };
                if (entity) {
                    if (entity.typeId == 'minecraft:cow') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:raw_milk'), player.location);
                        break;
                    };
                };
            };
        };
    };
});

function getWeight(min: any, max: any) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new TypeError("getWeight: min/max must be integers");
    }
    if (min > max) {
        throw new RangeError("getWeight: min must be <= max");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {ItemStack} item 
 * @returns 
 */
export function getToolQuality(item: any) {
    return getArtisanQuality(item);
}
