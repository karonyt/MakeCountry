import { ItemStack, type Block, type Container } from '@minecraft/server';
import { PACKAGES } from '@/content/packaging/catalog.js';
import { FOOD_PACKAGE_ITEMS } from '@/content/packaging/food-items.js';
import { ARTISAN_RANK_QUALITY, getArtisanQuality } from '@/domain/professions/artisan-quality.js';
import { restorePortableItem, serializePortableItem, validatePortableItem } from '@/shared/minecraft/portable-item-codec.js';
import { splitUtf8 } from '@/shared/storage/utf8-chunks.js';

export const PACKAGE_ID = 'mc:package_id';
export const PACKAGE_SEALED = 'mc:package_sealed';
const SHELL_PROPERTY = 'mc:package_shell';
const PAYLOAD_PREFIX = 'mc:package_payload_';
const OPAQUE_ITEMS = new Set(['minecraft:banner', 'minecraft:decorated_pot', 'minecraft:suspicious_stew', 'minecraft:writable_book', 'minecraft:written_book', 'minecraft:goat_horn', 'minecraft:map', 'minecraft:empty_map', 'minecraft:filled_map', 'minecraft:bee_nest']);
const foodItems = new Set(FOOD_PACKAGE_ITEMS);

// The server supports this component from 26.50; the shared type package still
// targets 26.20. Keep the narrow compatibility type here until that is upgraded.
interface BlockProperties { get(key: string): unknown; set(key: string, value: string): void }
function blockProperties(block: Block): BlockProperties {
    const properties = block.getComponent('minecraft:dynamic_properties') as unknown as BlockProperties | undefined;
    if (!properties) throw Error('packaging.storage_unavailable');
    return properties;
}

export function packageDefinition(id: string) {
    return PACKAGES.find(entry => entry.item === id || entry.block === id || new RegExp(`^${entry.block}_rank_(?:[1-9]|1[0-2])$`).test(id));
}

export function packageCapacity(item: ItemStack): number {
    const definition = packageDefinition(item.typeId);
    if (!definition) throw Error('packaging.changed');
    return definition.slots + definition.perRank * getArtisanQuality(item);
}

export function packageBlockId(item: ItemStack): string {
    const definition = packageDefinition(item.typeId);
    if (!definition) throw Error('packaging.changed');
    const rank = getArtisanQuality(item);
    return definition.block + (rank ? `_rank_${rank}` : '');
}

/** Read only occupied slots, preserving their order. */
export function storedItems(container: Pick<Container, 'size' | 'getItem'>, limit = container.size): ItemStack[] {
    const items: ItemStack[] = [];
    for (let slot = 0; slot < Math.min(limit, container.size); slot++) {
        const item = container.getItem(slot);
        if (item) items.push(item);
    }
    return items;
}

function readContents(item: ItemStack): any[] {
    const count = item.getDynamicProperty(PAYLOAD_PREFIX + 'count');
    if (count === undefined || count === 0) return [];
    if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0 || count > 16) throw Error('packaging.changed');
    let json = '';
    for (let i = 0; i < count; i++) {
        const part = item.getDynamicProperty(PAYLOAD_PREFIX + i);
        if (typeof part !== 'string') throw Error('packaging.changed');
        json += part;
    }
    const data: unknown = JSON.parse(json);
    if (!Array.isArray(data) || data.length > packageCapacity(item)) throw Error('packaging.changed');
    return data;
}
function saveContents(item: ItemStack, contents: readonly any[]) {
    const chunks = splitUtf8(JSON.stringify(contents), 30000);
    if (chunks.length > 16) throw Error('packaging.full');
    for (const key of item.getDynamicPropertyIds()) if (key.startsWith(PAYLOAD_PREFIX)) item.setDynamicProperty(key, undefined);
    chunks.forEach((part, index) => item.setDynamicProperty(PAYLOAD_PREFIX + index, part));
    item.setDynamicProperty(PAYLOAD_PREFIX + 'count', chunks.length);
}
/** Safe in before-events: inspect DTOs without constructing/mutating ItemStacks. */
export function validatePackagePayload(item: ItemStack): number {
    const contents = readContents(item), budget = { nodes: 0 };
    for (const child of contents) validatePortableItem(child, 0, budget);
    return contents.length;
}
export function packageInventory(item: ItemStack) {
    return {
        size: packageCapacity(item),
        getItem(slot: number): ItemStack | undefined { const data = readContents(item)[slot]; return data ? restorePortableItem(data) : undefined; },
        clearAll() { saveContents(item, []); },
    };
}

/** Prepare a portable copy before editing any player or world inventory. */
export function withPackageContents(shell: ItemStack, contents: readonly ItemStack[]): ItemStack {
    const result = shell.clone();
    const definition = packageDefinition(result.typeId);
    if (!definition || contents.length > packageCapacity(result)) throw Error('packaging.full');
    if (contents.some(item => !acceptsPackageItem(result.typeId, item))) throw Error('packaging.unsupported');
    saveContents(result, contents.map(item => serializePortableItem(item)));
    return result;
}

/** Only the wrapper's own public metadata is encoded. Payload stacks stay native. */
export function encodeShell(item: ItemStack): string {
    return JSON.stringify({
        typeId: item.typeId, name: item.nameTag, lore: item.getRawLore(),
        properties: item.getDynamicPropertyIds().filter(id => !id.startsWith(PAYLOAD_PREFIX)).map(id => [id, item.getDynamicProperty(id)]),
        canDestroy: item.getCanDestroy(), canPlaceOn: item.getCanPlaceOn(),
        keepOnDeath: item.keepOnDeath, lockMode: item.lockMode,
    });
}

export function readBlockPackage(block: Block): ItemStack {
    const definition = packageDefinition(block.typeId);
    const raw = blockProperties(block).get(SHELL_PROPERTY);
    if (!definition) throw Error('packaging.changed');
    // Command-created or older empty blocks have no wrapper metadata yet.
    if (raw === undefined) {
        const shell = new ItemStack(definition.item);
        const quality = Number(block.typeId.match(/_rank_(\d+)$/)?.[1] ?? 0);
        const rank = Object.keys(ARTISAN_RANK_QUALITY)[quality];
        if (quality) shell.setLore([{ rawtext: [{ translate: 'chemistry.lore.purity', with: [rank] }] }]);
        return withPackageContents(shell, storedItems(block.getComponent('inventory')!.container!));
    }
    if (typeof raw !== 'string') throw Error('packaging.changed');
    const data = JSON.parse(raw);
    if (data.typeId !== definition.item) throw Error('packaging.changed');
    const shell = new ItemStack(definition.item);
    shell.nameTag = data.name;
    shell.setLore(data.lore);
    for (const [key, value] of data.properties) shell.setDynamicProperty(key, value);
    shell.setCanDestroy(data.canDestroy); shell.setCanPlaceOn(data.canPlaceOn);
    shell.keepOnDeath = data.keepOnDeath; shell.lockMode = data.lockMode;
    const container = block.getComponent('inventory')?.container;
    if (!container) throw Error('packaging.storage_unavailable');
    return withPackageContents(shell, storedItems(container));
}

export function writeBlockPackage(block: Block, item: ItemStack) {
    const definition = packageDefinition(block.typeId);
    if (!definition || item.typeId !== definition.item) throw Error('packaging.changed');
    const container = block.getComponent('inventory')?.container;
    if (!container) throw Error('packaging.storage_unavailable');
    const contents = storedItems(packageInventory(item));
    if (contents.length > container.size || contents.length > packageCapacity(item)) throw Error('packaging.full');
    const properties = blockProperties(block);
    const beforeShell = properties.get(SHELL_PROPERTY);
    // Prepare metadata before changing contents. If its byte limit is exceeded,
    // the old block and the player's held item remain untouched.
    properties.set(SHELL_PROPERTY, encodeShell(item));
    try {
        replaceInventorySlots(container, Array.from({ length: container.size }, (_, slot) => [slot, contents[slot]] as const));
    } catch (error) {
        if (typeof beforeShell === 'string') properties.set(SHELL_PROPERTY, beforeShell);
        throw error;
    }
}

export function acceptsPackageItem(packageId: string, item: ItemStack): boolean {
    const definition = packageDefinition(packageId);
    if (!definition) return false;
    // Native getters cross the Script API boundary. Reuse immutable values only
    // within this synchronous check; mutable metadata is re-read on every call.
    const typeId = item.typeId;
    if (packageDefinition(typeId) || OPAQUE_ITEMS.has(typeId)) return false;
    if (item.lockMode !== 'none' || item.keepOnDeath) return false;
    // Avoid recursive containers and scripted backpack/virtual-storage contents.
    if (item.getComponent('minecraft:inventory') || /(?:shulker_box|bundle|backpack)/.test(typeId)) return false;
    if (item.getDynamicProperty('karo:virtual_storage_item') !== undefined) return false;
    if (definition.kind === 'food') return isFoodType(item, typeId);
    if (definition.kind === 'bottle') return isDrinkType(typeId);
    return true;
}

function isFoodType(item: ItemStack, typeId: string): boolean {
    return foodItems.has(typeId) || !!item.getComponent('minecraft:food');
}
export function isFood(item: ItemStack): boolean {
    return isFoodType(item, item.typeId);
}
function isDrinkType(typeId: string): boolean {
    return typeId === 'mc:red_wine' || typeId === 'mc:white_wine' || typeId.startsWith('mc:alcohol_')
        || ['minecraft:potion', 'minecraft:honey_bottle', 'minecraft:ominous_bottle', 'minecraft:milk_bucket'].includes(typeId);
}
export function isDrink(item: ItemStack): boolean {
    return isDrinkType(item.typeId);
}

/** Roll back both source slots if a native inventory write fails. No awaits inside. */
export function replaceInventorySlots(container: Container, changes: ReadonlyArray<readonly [number, ItemStack | undefined]>) {
    const before = changes.map(([slot]) => [slot, container.getItem(slot)] as const);
    try {
        for (const [slot, item] of changes) container.setItem(slot, item);
    } catch (error) {
        for (const [slot, item] of before) container.setItem(slot, item);
        throw error;
    }
}
