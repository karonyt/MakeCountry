// 生産パックのアイテム処理: 鍛造道具 (mc:ranktool)・鉱石のドロップ・ハンマーなど・ビーカー/フラスコ。
import { EnchantmentType, EnchantmentTypes, GameMode, ItemStack, system, world } from "@minecraft/server";
import { MINERAL_ORES } from '@/content/minerals/ore-data.js';
import { getMineralDrop } from '@/domain/items/mineral-drops.js';
import { getToolQuality } from "@/domain/items/tool-quality.js";
import { registerContainerUse } from "@/domain/items/container-use.js";
import '@/domain/items/forged-repair.js';
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

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const { brokenBlockPermutation, player, block } = ev;
    if (player.getGameMode() == GameMode.Creative) return;
    // Use the pre-break tool even if durability removed it or another handler
    // changed the selected slot before this after-event handler ran.
    const mainItem = ev.itemStackBeforeBreak;
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

registerContainerUse(['mc:beaker', 'mc:flask']);
