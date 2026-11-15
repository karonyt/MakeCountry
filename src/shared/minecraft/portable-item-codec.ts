import { ItemStack, ItemComponentTypes, EnchantmentTypes, Potions, type ItemLockMode } from '@minecraft/server';
import { canonicalBlockPermissionIds } from './block-permissions.js';

export function validatePortableItem(item: any, depth = 0, budget = { nodes: 0 }): void {
    if (item === undefined || item === null) return;
    if (depth > 8 || ++budget.nodes > 4096) throw Error('transfer_item_storage_limit');
    if (typeof item !== 'object' || Array.isArray(item) || typeof item.typeId !== 'string' || !item.typeId
        || !Number.isSafeInteger(item.amount) || item.amount < 1) throw Error('invalid_transfer_item');
    const storage = item.storage;
    if (storage === undefined) return; // Older saves without storage remain readable.
    if (!storage || storage.version !== 1 || item.amount !== 1 || !Number.isSafeInteger(storage.size)
        || storage.size < 1 || storage.size > 64 || !Array.isArray(storage.contents) || storage.contents.length !== storage.size) throw Error('invalid_transfer_item_storage');
    for (const child of storage.contents) validatePortableItem(child, depth + 1, budget);
}

export function serializePortableItem(item: any, originalLockMode?: ItemLockMode, depth = 0, budget = { nodes: 0 }) {
    if (!item) return undefined;
    if (depth > 8 || ++budget.nodes > 4096) throw Error('transfer_item_storage_limit');
    const dyp = (item.getDynamicPropertyIds() || []).map((id: any) => ({
        id,
        data: item.getDynamicProperty(id)
    }));
    const enchantments = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map((ench: any) => ({
        typeId: ench.type.id,
        level: ench.level
    }));
    const potionComponent = item.getComponent(ItemComponentTypes.Potion);
    let potion = [];
    if (potionComponent?.isValid) {
        potion.push({ id: potionComponent.potionEffectType.id, durationTicks: potionComponent.potionEffectType?.durationTicks, deliveryType: potionComponent.potionDeliveryType.id })
    };
    const damage = item.getComponent(ItemComponentTypes.Durability)?.damage;
    const nativeInventory = item.getComponent(ItemComponentTypes.Inventory)?.container;
    // 26.60 exposes shulker inventories. Never treat an inaccessible container
    // as empty on an older server or after an API error.
    if (!nativeInventory && /(?:shulker_box|bundle)$/.test(item.typeId)) throw Error('transfer_item_storage_unavailable');
    const storage = nativeInventory ? {
        version: 1,
        size: nativeInventory.size,
        contents: Array.from({ length: nativeInventory.size }, (_, slot) => serializePortableItem(nativeInventory.getItem(slot), undefined, depth + 1, budget)),
    } : undefined;
    if (storage && (storage.size < 1 || storage.size > 64 || item.amount !== 1)) throw Error('invalid_transfer_item_storage');
    const result: any = {
        typeId: item.typeId,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getRawLore?.() ?? item.getLore(),
        enchantments: enchantments,
        nbt: damage,
        dyp: dyp,
        potion: potion,
        lockMode: originalLockMode ?? item.lockMode,
        keepOnDeath: item.keepOnDeath,
        canDestroy: canonicalBlockPermissionIds(item.getCanDestroy()),
        canPlaceOn: canonicalBlockPermissionIds(item.getCanPlaceOn()),
        durabilityUnbreakable: item.getComponent(ItemComponentTypes.Durability)?.unbreakable,
        dyeColor: item.getComponent(ItemComponentTypes.Dyeable)?.color,
        ...(storage ? { storage } : {}),
    };
    if (depth === 0 && JSON.stringify(result).length > 120000) throw Error('transfer_item_storage_limit');
    return result;
}

export function restorePortableItem(itemData: any) {
    let itemStack = new ItemStack(itemData.typeId);
    const potionComponent = itemStack.getComponent(ItemComponentTypes.Potion);
    if (potionComponent && itemData.potion) {
        if (itemData.potion.length > 0) {
            const potion = itemData.potion[0]
            //itemStack = Potions.resolve({ id: potion.id, durationTicks: potion?.durationTicks }, { id: potion.deliveryType });
            itemStack = Potions.resolve(potion.id, potion.deliveryType);
        };
    };
    itemStack.amount = itemData.amount;
    if (itemData.nameTag) itemStack.nameTag = itemData.nameTag;
    if (itemData.lore) itemStack.setLore(itemData.lore);
    const durability = itemStack.getComponent("durability");
    if ((itemData.nbt !== undefined || itemData.durabilityUnbreakable !== undefined) && !durability) throw Error('missing_transfer_durability');
    if (durability && itemData.nbt !== undefined) durability.damage = itemData.nbt;
    if (durability && itemData.durabilityUnbreakable !== undefined) durability.unbreakable = itemData.durabilityUnbreakable;
    if (itemData.dyeColor) {
        const dyeable = itemStack.getComponent(ItemComponentTypes.Dyeable);
        if (!dyeable) throw Error('missing_transfer_dyeable');
        dyeable.color = itemData.dyeColor;
    }
    if (itemData.lockMode !== undefined) itemStack.lockMode = itemData.lockMode;
    if (itemData.keepOnDeath !== undefined) itemStack.keepOnDeath = itemData.keepOnDeath;
    if (itemData.canDestroy) itemStack.setCanDestroy(canonicalBlockPermissionIds(itemData.canDestroy));
    if (itemData.canPlaceOn) itemStack.setCanPlaceOn(canonicalBlockPermissionIds(itemData.canPlaceOn));
    const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
    if (itemData.enchantments?.length && !enchantable) throw Error("missing_transfer_enchantable");
    if (enchantable && itemData.enchantments) {
        for (const enchData of itemData.enchantments) {
            const type = EnchantmentTypes.get(enchData.typeId);
            // @ts-ignore TS(2339): Property 'addEnchantment' does not exist on type '... Remove this comment to see the full error message
            if (!type) throw Error("unknown_transfer_enchantment");
            enchantable.addEnchantment({ type, level: enchData.level });
        }
    }

    if (itemData.dyp) {
        for (const dypData of itemData.dyp) {
            itemStack.setDynamicProperty(dypData.id, dypData.data);
        }
    }
    if (itemData.storage !== undefined) {
        validatePortableItem(itemData);
        const container = itemStack.getComponent(ItemComponentTypes.Inventory)?.container;
        if (!container || container.size < itemData.storage.size) throw Error('missing_transfer_item_storage');
        // Build all children before placing any. A single unknown item holds
        // the entire unopened package instead of delivering a partial box.
        const children = itemData.storage.contents.map((child: any) => child ? restorePortableItem(child) : undefined);
        container.clearAll();
        children.forEach((child: ItemStack | undefined, slot: number) => { if (child) container.setItem(slot, child); });
    }
    return itemStack;
}
