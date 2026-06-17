import { BlockPermutation, EnchantmentType, EnchantmentTypes, GameMode, ItemStack, system, world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe((ev) => {
    const { source } = ev;
    switch (ev.itemStack.typeId) {
        case `mc:beer`: {
            source.addEffect(`nausea`, 200, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 0 });
            break;
        };
        case `mc:white_wine`: {
            source.addEffect(`nausea`, 400, { amplifier: 20 });
            source.addEffect(`jump_boost`, 100, { amplifier: 3 });
            source.addEffect(`weakness`, 200, { amplifier: 3 });
            break;
        };
        case `mc:red_wine`: {
            source.addEffect(`nausea`, 400, { amplifier: 20 });
            source.addEffect(`slowness`, 100, { amplifier: 1 });
            source.addEffect(`weakness`, 200, { amplifier: 3 });
            break;
        };
        case `mc:whiskey`: {
            source.addEffect(`nausea`, 200, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 0 });
            break;
        };
        case `mc:vodka`: {
            source.addEffect(`nausea`, 250, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 1 });
            break;
        };
        case `mc:sake`: {
            source.addEffect(`nausea`, 300, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 2 });
            break;
        };
        case `mc:abisinthe`: {
            source.addEffect(`nausea`, 300, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 2 });
            break;
        };
        case `mc:aoziru`: {
            source.addEffect(`resistance`, 800, { amplifier: 0 });
            source.addEffect(`regeneration`, 100, { amplifier: 1 });
            break;
        };
        default: {
            break;
        };
    };
});

system.beforeEvents.startup.subscribe((ev) => {
    ev.itemComponentRegistry.registerCustomComponent('mc:ranktool', {
        onMineBlock: (ev) => {
            const player = ev.source;
            const item = ev.itemStack;
            const qualityNum = getToolQuality(item);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const durability = item.getComponent('durability');
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const damage = durability.damage + (13 - qualityNum);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const container = player.getComponent('inventory').container;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (damage > durability.maxDurability) {
                // @ts-ignore TS(2339): Property 'selectedSlotIndex' does not exist on typ... Remove this comment to see the full error message
                container.setItem(player.selectedSlotIndex);
                return;
            };
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            durability.damage = damage;
            // @ts-ignore TS(2339): Property 'selectedSlotIndex' does not exist on typ... Remove this comment to see the full error message
            container.setItem(player.selectedSlotIndex, item);
        }
    });
});

const RANK_QUALITY_TABLE = {
    "KARON": 12,
    "MYTHICAL": 11,
    "MASTERWORK": 10,
    "LEGENDARY": 9,
    "SSS": 8,
    "SS": 7,
    "S": 6,
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1,
    "F": 0,
};

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
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent('inventory').container;
    const mainItem = container.getItem(player.selectedSlotIndex);
    let silktouch = false;
    if (mainItem) {
        const enchantable = mainItem.getComponent('enchantable');
        if (enchantable) {
            // @ts-ignore TS(2345): Argument of type 'EnchantmentType | undefined' is ... Remove this comment to see the full error message
            silktouch = enchantable.getEnchantment(EnchantmentTypes.get('minecraft:silk_touch')) ? true : false;
        };
    };
    if (silktouch) return;
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
    if (item?.getRawLore().length == 0) return 0;

    const lore = item.getRawLore() ?? [];

    for (const line of lore) {
        // rawtext 配列を想定
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            // translate + with 対応
            if (part.with && part.with.length > 0) {
                const rank = part.with[0]
                if (rank in RANK_QUALITY_TABLE) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    return RANK_QUALITY_TABLE[rank];
                }
            }
        }
    }
    return 0;
}