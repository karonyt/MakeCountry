import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, type Container, type ItemStack, type Player } from '@minecraft/server';
import { utf8Bytes } from './outbox.js';

/** Read-only forensic view, NOT a full LevelDB backup or an automatic restore format. */
export function snapshotInventory(player: Player): Record<string, unknown> {
    if (!player.isValid || player.hasTag('status:loading') || player.hasTag('status:transferring')) throw Error('inventory_transitional');
    let count = 0;
    const unavailable: string[] = [];
    function containerData(container: Container, depth: number): unknown[] {
        if (depth > 4 || container.size > 256) throw Error('inventory_recursion_limit');
        const result: unknown[] = [];
        for (let slot = 0; slot < container.size; slot++) result.push(itemData(container.getItem(slot), depth));
        return result;
    }
    function itemData(item: ItemStack | undefined, depth: number): unknown {
        if (!item) return null;
        if (++count > 512) throw Error('inventory_item_limit');
        const components = {
            durability: item.getComponent(ItemComponentTypes.Durability), enchantable: item.getComponent(ItemComponentTypes.Enchantable),
            potion: item.getComponent(ItemComponentTypes.Potion), inventory: item.getComponent(ItemComponentTypes.Inventory),
            book: item.getComponent(ItemComponentTypes.Book), dye: item.getComponent(ItemComponentTypes.Dyeable),
        };
        const properties = item.getDynamicPropertyIds().sort().map(id => ({ id, data: item.getDynamicProperty(id) }));
        if (/shulker_box/.test(item.typeId) && !components.inventory) unavailable.push('native_shulker_contents_not_exposed');
        const result = {
            typeId: item.typeId, amount: item.amount, nameTag: item.nameTag, lore: item.getLore(),
            damage: components.durability?.damage, keepOnDeath: item.keepOnDeath, lockMode: item.lockMode,
            canDestroy: item.getCanDestroy(), canPlaceOn: item.getCanPlaceOn(), dynamicProperties: properties,
            enchantments: components.enchantable?.getEnchantments().map(e => ({ typeId: e.type.id, level: e.level })),
            potion: components.potion ? { effect: components.potion.potionEffectType.id, delivery: components.potion.potionDeliveryType.id } : undefined,
            book: components.book ? { title: components.book.title, author: components.book.author, signed: components.book.isSigned,
                contents: components.book.contents, rawContents: components.book.rawContents, pageCount: components.book.pageCount } : undefined,
            color: components.dye?.color,
            storage: components.inventory ? containerData(components.inventory.container, depth + 1) : undefined,
        };
        if (utf8Bytes(JSON.stringify(result)) > 128 * 1024) throw Error('inventory_item_too_large');
        return result;
    }
    const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    // Exact component ID from the installed 2.8 beta declarations. Use its
    // structural container shape so older build-time enums do not become a
    // reason to silently omit the ender chest on a newer BDS runtime.
    const enderComponent = player.getComponent('minecraft:ender_inventory') as { readonly container?: Container } | undefined;
    const enderContainer = enderComponent?.container;
    if (!container || !equippable) throw Error('inventory_components_unavailable');
    if (!enderContainer || enderContainer.size !== 27) throw Error('ender_inventory_unavailable');
    const inventory = containerData(container, 0);
    const equipment = Object.fromEntries([EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand]
        .map(slot => [slot.toLowerCase(), itemData(equippable.getEquipment(slot), 0)]));
    const result = {
        schema: 2, inventory, equipment, enderChest: containerData(enderContainer, 0), selectedSlot: player.selectedSlotIndex,
        experience: { level: player.level, totalXp: player.getTotalXp(), xpEarnedAtCurrentLevel: player.xpEarnedAtCurrentLevel },
        coverage: { fullNbt: false, enderChest: true, itemDynamicProperties: true, unavailable: [...new Set(unavailable)] },
    };
    if (utf8Bytes(JSON.stringify(result)) > 128 * 1024) throw Error('inventory_snapshot_too_large');
    return result;
}
