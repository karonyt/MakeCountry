import type { Container, ItemStack } from '@minecraft/server';

export interface ContainerItem {
    typeId: string;
    nameTag?: string;
    lore: string[];
    damage?: number;
    enchantments?: Array<{ typeId: string; level: number }>;
    properties: Array<{ id: string; value: unknown }>;
    metadata: Record<string, unknown>;
}
export interface CountedItem { item: ContainerItem; amount: number }
export type ContainerContents = Map<string, CountedItem>;
export interface ContainerChange extends CountedItem { key: string; delta: number }

// Stable identity excludes quantity so moving stacks between slots does not
// become a withdrawal plus a deposit. Retain custom names/enchantments/properties.
export function containerItem(item: ItemStack): { key: string; item: ContainerItem } {
    const enchantable = item.getComponent('minecraft:enchantable');
    const potion = item.getComponent('minecraft:potion');
    const book = item.getComponent('minecraft:book');
    const data: ContainerItem = {
        typeId: item.typeId, nameTag: item.nameTag, lore: item.getLore(),
        damage: item.getComponent('minecraft:durability')?.damage,
        enchantments: enchantable?.getEnchantments().map(e => ({ typeId: e.type.id, level: e.level }))
            .sort((a, b) => a.typeId.localeCompare(b.typeId)),
        properties: item.getDynamicPropertyIds().sort().map(id => ({ id, value: item.getDynamicProperty(id) })),
        metadata: {
            keepOnDeath: item.keepOnDeath, lockMode: item.lockMode,
            canDestroy: item.getCanDestroy().sort(), canPlaceOn: item.getCanPlaceOn().sort(),
            color: item.getComponent('minecraft:dyeable')?.color,
            potion: potion ? { effect: potion.potionEffectType.id, delivery: potion.potionDeliveryType.id } : undefined,
            book: book ? { title: book.title, author: book.author, signed: book.isSigned, contents: book.contents, rawContents: book.rawContents } : undefined,
        },
    };
    const key = JSON.stringify(data);
    if (key.length > 32_000) throw Error('container_item_too_large');
    return { key, item: data };
}

export function readContainer(container: Container): ContainerContents {
    if (!container.isValid || container.size > 256) throw Error('container_unavailable');
    const contents: ContainerContents = new Map();
    for (let slot = 0; slot < container.size; slot++) {
        const stack = container.getItem(slot);
        if (!stack) continue;
        const { key, item } = containerItem(stack);
        const previous = contents.get(key);
        contents.set(key, { item, amount: (previous?.amount ?? 0) + stack.amount });
    }
    return contents;
}

export function diffContainer(before: ContainerContents, after: ContainerContents): ContainerChange[] {
    const changes: ContainerChange[] = [];
    for (const key of new Set([...before.keys(), ...after.keys()])) {
        const old = before.get(key), next = after.get(key);
        const delta = (next?.amount ?? 0) - (old?.amount ?? 0);
        if (delta) changes.push({ key, item: (next ?? old)!.item, amount: Math.abs(delta), delta });
    }
    return changes;
}
