import { ItemStack, type Container, type Player, type RawMessage } from '@minecraft/server';
import { CONSUMABLE_EFFECTS, getCookingConsumableCategory, type ConsumableEffect } from '@/config/consumable-effects.js';
import { ARTISAN_RANK_QUALITY, getArtisanQuality } from '@/domain/professions/artisan-quality.js';
import { ITEM_CHARACTERISTICS } from '@/generated/item-characteristics.js';

type Category = ReturnType<typeof getCookingConsumableCategory>;
type Ingredient = {
    id: string; item: string; effect: string; seconds: number;
    affinity: readonly Category[];
};
export const SECRET_FLAVORS: readonly Ingredient[] = [
    { id: 'salt', item: 'mc:salt', effect: 'resistance', seconds: 20, affinity: ['seafood', 'produce'] },
    { id: 'garlic', item: 'mc:garlic', effect: 'strength', seconds: 20, affinity: ['hearty', 'staple'] },
    { id: 'ginger', item: 'mc:ginger', effect: 'fire_resistance', seconds: 30, affinity: ['seafood', 'refreshment'] },
    { id: 'miso', item: 'mc:miso', effect: 'haste', seconds: 30, affinity: ['hearty', 'produce'] },
    { id: 'butter', item: 'mc:butter', effect: 'resistance', seconds: 20, affinity: ['staple', 'hearty'] },
    { id: 'sugar', item: 'minecraft:sugar', effect: 'regeneration', seconds: 4, affinity: ['refreshment', 'produce'] },
];
export const FOOD_TOPPINGS: readonly Ingredient[] = [
    { id: 'cheese', item: 'mc:cheese', effect: 'absorption', seconds: 40, affinity: ['hearty', 'staple'] },
    { id: 'sesame', item: 'mc:sesame', effect: 'haste', seconds: 30, affinity: ['hearty', 'produce', 'staple'] },
    { id: 'basil', item: 'mc:basil', effect: 'speed', seconds: 30, affinity: ['produce', 'seafood', 'staple'] },
    { id: 'shiso', item: 'mc:shiso', effect: 'water_breathing', seconds: 45, affinity: ['seafood', 'staple'] },
    { id: 'egg', item: 'mc:boiled_egg', effect: 'resistance', seconds: 25, affinity: ['staple', 'hearty'] },
    { id: 'cream', item: 'mc:custard_cream', effect: 'regeneration', seconds: 4, affinity: ['refreshment'] },
];
const PAIRS = [
    { secret: 'garlic', topping: 'cheese', categories: ['hearty', 'staple'], boost: 'strength' },
    { secret: 'ginger', topping: 'shiso', categories: ['seafood'], bonus: 'speed' },
    { secret: 'miso', topping: 'sesame', categories: ['hearty', 'produce'], boost: 'haste' },
    { secret: 'butter', topping: 'egg', categories: ['staple'], boost: 'resistance' },
    { secret: 'sugar', topping: 'cream', categories: ['refreshment'], boost: 'regeneration' },
    { secret: 'salt', topping: 'basil', categories: ['produce', 'seafood'], boost: 'speed' },
] as const;
export const FINISHING_TITLE = 'cooking.finish.lore.title';
const EFFECT_NAMES: Readonly<Record<string, string>> = {
    resistance: 'potion.resistance', strength: 'potion.damageBoost', fire_resistance: 'potion.fireResistance', haste: 'potion.digSpeed',
    regeneration: 'potion.regeneration', absorption: 'potion.absorption', speed: 'potion.moveSpeed', water_breathing: 'potion.waterBreathing',
};

// Quality descriptions are written on ordinary crafted ingredients. Accept only
// this stock schema; custom names, foreign lore and properties stay protected.
const STOCK_QUALITY_KEYS = new Set(['cooking.lore.quality', 'mixer.lore.quality', 'chemistry.lore.purity']);
const STOCK_RANKS = new Set([...Object.keys(ARTISAN_RANK_QUALITY), 'IMPOSSIBLE', 'EXTRA', 'LEGEND']);
const stripFormatting = (value: string) => value.replace(/§[0-9a-fk-or]/gi, '');
function stockLoreParts(value: unknown, depth = 0): RawMessage[] | undefined {
    if (depth > 8) return undefined;
    if (typeof value === 'string') return [{ text: value }];
    if (!value || typeof value !== 'object') return undefined;
    const line = value as RawMessage;
    if (Array.isArray(line.rawtext) && Object.keys(line).every(key => key === 'rawtext')) {
        const parts = line.rawtext.map(part => stockLoreParts(part, depth + 1));
        return parts.every(part => part !== undefined) ? parts.flat() as RawMessage[] : undefined;
    }
    if (typeof line.text === 'string' && Object.keys(line).every(key => key === 'text')) return [line];
    if (typeof line.translate === 'string' && Object.keys(line).every(key => key === 'translate' || key === 'with')) return [line];
    return undefined;
}
function stockLoreArguments(line: RawMessage): string[] | undefined {
    const args = line.with === undefined ? [] : Array.isArray(line.with) ? line.with : line.with.rawtext;
    if (!Array.isArray(args)) return undefined;
    const values = args.map(arg => {
        const parts = stockLoreParts(arg);
        return parts?.every(part => typeof part.text === 'string') ? parts.map(part => part.text).join('') : undefined;
    });
    return values.every(value => value !== undefined) ? values as string[] : undefined;
}
export function isFinishingIngredient(item: ItemStack): boolean {
    if (item.nameTag || item.getDynamicPropertyIds().length) return false;
    const lore = item.getRawLore();
    if (!lore.length) return true;
    let qualityKey = '', separators = 0, level = 0, route = 0, breakthrough = 0;
    for (const line of lore) {
        const parts = stockLoreParts(line);
        if (!parts) return false;
        const display = parts.map(part => stripFormatting(part.text ?? '')).join('');
        const translated = parts.filter(part => part.translate !== undefined);
        if (!translated.length && display === '==============') { separators++; continue; }
        if (display !== '' || translated.length !== 1) return false;
        const message = translated[0], args = stockLoreArguments(message);
        if (!args) return false;
        const key = message.translate!;
        if (STOCK_QUALITY_KEYS.has(key)) {
            if (qualityKey || args.length !== 1 || !STOCK_RANKS.has(stripFormatting(args[0]).trim().toUpperCase())) return false;
            qualityKey = key;
        } else if (key === 'chemistry.lore.breakthrough' && !args.length) {
            if (++breakthrough > 1) return false;
        } else if (args.length === 1 && /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(args[0])) {
            if (key === 'cooking.minigame.result.level_technique') { if (++level > 1) return false; }
            else if (key === 'cooking.minigame.result.route_bonus') { if (++route > 1) return false; }
            else return false;
        } else return false;
    }
    if (!qualityKey || separators !== 0 && separators !== 2) return false;
    return qualityKey === 'chemistry.lore.purity' ? !level && !route : !breakthrough;
}

// Read only literal lore written by this feature. Display text never supplies effect levels/durations.
function translationKeys(line: unknown): string[] {
    if (!line || typeof line !== 'object') return [];
    const message = line as RawMessage;
    return [...(message.translate ? [message.translate] : []), ...(message.rawtext?.flatMap(translationKeys) ?? [])];
}
export function hasFoodFinishing(item: Pick<ItemStack, 'getRawLore'>): boolean {
    return item.getRawLore().flatMap(translationKeys).includes(FINISHING_TITLE);
}
export function readFoodFinishing(item: Pick<ItemStack, 'getRawLore'>) {
    const lines = item.getRawLore().flatMap(translationKeys);
    if (lines.filter(line => line === FINISHING_TITLE).length !== 1) return undefined;
    const secrets = lines.filter(line => line.startsWith('cooking.finish.secret.'));
    const toppings = lines.filter(line => line.startsWith('cooking.finish.topping.'));
    if (secrets.length !== 1 || toppings.length !== 1) return undefined;
    const secret = SECRET_FLAVORS.find(entry => secrets[0] === 'cooking.finish.secret.' + entry.id);
    const topping = FOOD_TOPPINGS.find(entry => toppings[0] === 'cooking.finish.topping.' + entry.id);
    if (!secret && secrets[0] !== 'cooking.finish.secret.none') return undefined;
    if (!topping && toppings[0] !== 'cooking.finish.topping.none') return undefined;
    return secret || topping ? { secret, topping } : undefined;
}
const VANILLA_FOOD = new Set([
    'apple', 'golden_apple', 'enchanted_golden_apple', 'bread', 'baked_potato', 'potato', 'carrot', 'golden_carrot',
    'beetroot', 'melon_slice', 'sweet_berries', 'glow_berries', 'dried_kelp', 'cookie', 'pumpkin_pie',
    'cooked_beef', 'cooked_porkchop', 'cooked_chicken', 'cooked_mutton', 'cooked_rabbit', 'cooked_cod', 'cooked_salmon',
    'beef', 'porkchop', 'chicken', 'mutton', 'rabbit', 'cod', 'salmon', 'tropical_fish', 'pufferfish',
    'mushroom_stew', 'rabbit_stew', 'beetroot_soup', 'suspicious_stew', 'rotten_flesh', 'spider_eye', 'poisonous_potato',
].map(id => 'minecraft:' + id));
export function canFinishFood(item: ItemStack): boolean {
    if (Object.hasOwn(CONSUMABLE_EFFECTS, item.typeId) || hasFoodFinishing(item)) return false;
    if (ITEM_CHARACTERISTICS[item.typeId]?.nutrition !== undefined || VANILLA_FOOD.has(item.typeId)) return true;
    return !!item.getComponent('minecraft:food');
}

export function getFoodFinishingCategory(itemId: string): Category {
    const id = itemId.slice(itemId.indexOf(':') + 1);
    // Existing quality effects stay unchanged. Classify legacy food names that
    // do not contain the usual rice/noodle/dessert tokens for finishing only.
    if (['gyudon', 'cheese_gyudon', 'gyudon_egg', 'katsudon', 'karaagedon', 'curry', 'katsu_curry', 'karaage_curry', 'karaage_chahan'].includes(id)) return 'staple';
    if (['panna_cotta', 'daifuku', 'straw_berry_daifuku', 'cookie', 'pumpkin_pie'].includes(id)) return 'refreshment';
    return getCookingConsumableCategory(itemId);
}

export function getFoodFinishing(itemId: string, quality: number, secretId?: string, toppingId?: string) {
    const secret = SECRET_FLAVORS.find(entry => entry.id === secretId);
    const topping = FOOD_TOPPINGS.find(entry => entry.id === toppingId);
    const category = getFoodFinishingCategory(itemId);
    const pair = PAIRS.find(entry => entry.secret === secret?.id && entry.topping === topping?.id
        && (entry.categories as readonly string[]).includes(category));
    const scale = 1 + (Number.isFinite(quality) ? Math.max(0, Math.min(12, quality)) : 0) * 0.025;
    const effects = new Map<string, ConsumableEffect>();
    for (const ingredient of [secret, topping]) {
        if (!ingredient) continue;
        const affinity = ingredient.affinity.includes(category);
        const duration = Math.round(ingredient.seconds * 20 * scale * (affinity ? 1.5 : 1) * (pair ? 1.25 : 1));
        const amplifier = pair && 'boost' in pair && pair.boost === ingredient.effect ? 1 : 0;
        const previous = effects.get(ingredient.effect);
        effects.set(ingredient.effect, { effectId: ingredient.effect,
            duration: Math.max(previous?.duration ?? 0, Math.min(ingredient.effect === 'regeneration' ? 160 : 2400, duration)),
            amplifier: Math.max(previous?.amplifier ?? 0, amplifier) });
    }
    if (pair && 'bonus' in pair) effects.set(pair.bonus, { effectId: pair.bonus, duration: Math.round(600 * scale), amplifier: 0 });
    return { secret, topping, category, pairName: pair ? 'cooking.finish.pair.' + pair.secret : undefined, effects: [...effects.values()] };
}
export function describeFinishingEffect(effect: ConsumableEffect) {
    return { translate: 'cooking.finish.lore.effect', with: { rawtext: [
        { translate: EFFECT_NAMES[effect.effectId] }, { text: String(effect.amplifier + 1) }, { text: String(Math.round(effect.duration / 20)) },
    ] } } satisfies RawMessage;
}
export function buildFinishingLore(item: ItemStack, secretId?: string, toppingId?: string): RawMessage[] {
    const result = getFoodFinishing(item.typeId, getArtisanQuality(item), secretId, toppingId);
    return [
        { translate: FINISHING_TITLE },
        { translate: 'cooking.finish.secret.' + (result.secret?.id ?? 'none') },
        { translate: 'cooking.finish.topping.' + (result.topping?.id ?? 'none') },
        { translate: result.pairName ? result.pairName : result.secret && result.topping ? 'cooking.finish.lore.deluxe' : 'cooking.finish.lore.simple' },
        ...[result.secret, result.topping].filter(Boolean).map(entry => ({ translate: 'cooking.finish.appearance.' + entry!.id })),
        ...result.effects.map(describeFinishingEffect),
    ];
}
export function foodSnapshot(item: ItemStack) {
    return JSON.stringify([item.typeId, item.amount, item.nameTag, item.getRawLore(), item.keepOnDeath, item.lockMode,
        item.getDynamicPropertyIds().sort().map(key => [key, item.getDynamicProperty(key)])]);
}
export function finishedFoodId(itemId: string, toppingId?: string) {
    // Reuse the existing, distinct cheese/egg artwork and nutrition for gyudon.
    if (itemId === 'mc:gyudon' && toppingId === 'cheese') return 'mc:cheese_gyudon';
    if (itemId === 'mc:gyudon' && toppingId === 'egg') return 'mc:gyudon_egg';
    return itemId;
}

/** Build every changed slot first, then commit synchronously without dropping or replacing other items. */
export function finishFood(container: Container, slot: number, expected: string, quantity: number, secretId?: string, toppingId?: string) {
    const source = container.getItem(slot);
    if (!source || foodSnapshot(source) !== expected || !canFinishFood(source)) throw Error('cooking.finish.error.changed');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > source.amount) throw Error('cooking.finish.error.quantity');
    const secret = SECRET_FLAVORS.find(entry => entry.id === secretId);
    const topping = FOOD_TOPPINGS.find(entry => entry.id === toppingId);
    if ((!secret && secretId) || (!topping && toppingId) || (!secret && !topping)) throw Error('cooking.finish.error.choice');
    const visualId = finishedFoodId(source.typeId, toppingId);
    const output = visualId === source.typeId ? source.clone() : new ItemStack(visualId, quantity);
    if (visualId !== source.typeId) {
        // These three foods have no item-specific components or enchantments.
        // Refuse unexpected properties rather than silently discard them.
        if (source.getDynamicPropertyIds().length) throw Error('cooking.finish.error.changed');
        output.nameTag = source.nameTag;
        output.keepOnDeath = source.keepOnDeath;
        output.lockMode = source.lockMode;
        output.setCanDestroy(source.getCanDestroy());
        output.setCanPlaceOn(source.getCanPlaceOn());
    }
    output.amount = quantity;
    output.setLore([...source.getRawLore(), ...buildFinishingLore(source, secretId, toppingId)]);
    const before = new Map<number, ItemStack | undefined>();
    const after = new Map<number, ItemStack | undefined>();
    const stage = (index: number, value: ItemStack | undefined) => {
        if (!before.has(index)) before.set(index, container.getItem(index));
        after.set(index, value);
    };
    for (const ingredient of [secret, topping]) {
        if (!ingredient) continue;
        let remaining = quantity;
        for (let index = 0; index < container.size && remaining > 0; index++) {
            if (index === slot) continue;
            const item = after.has(index) ? after.get(index) : container.getItem(index);
            // Stock quality lore is allowed; custom/finished ingredients remain protected.
            if (item?.typeId !== ingredient.item || !isFinishingIngredient(item)) continue;
            const used = Math.min(item.amount, remaining);
            const rest = item.clone(); rest.amount = Math.max(1, item.amount - used);
            stage(index, used === item.amount ? undefined : rest);
            remaining -= used;
        }
        if (remaining) throw Error('cooking.finish.error.ingredients');
    }
    if (quantity === source.amount) stage(slot, output);
    else {
        const rest = source.clone(); rest.amount -= quantity; stage(slot, rest);
        let destination = -1;
        for (let index = 0; index < container.size; index++) {
            if (index !== slot && !(after.has(index) ? after.get(index) : container.getItem(index))) { destination = index; break; }
        }
        if (destination === -1) throw Error('cooking.finish.error.space');
        stage(destination, output);
    }
    const written: number[] = [];
    try {
        for (const [index, item] of after) { container.setItem(index, item); written.push(index); }
    } catch (error) {
        for (const index of written.reverse()) container.setItem(index, before.get(index));
        throw error;
    }
}

export function applyFoodFinishingEffects(player: Player, item: ItemStack) {
    const recipe = readFoodFinishing(item);
    if (!recipe || Object.hasOwn(CONSUMABLE_EFFECTS, item.typeId)) return;
    // Validate food again; copying lore onto a non-food item never grants buffs.
    if (ITEM_CHARACTERISTICS[item.typeId]?.nutrition === undefined && !VANILLA_FOOD.has(item.typeId) && !item.getComponent('minecraft:food')) return;
    const result = getFoodFinishing(item.typeId, getArtisanQuality(item), recipe.secret?.id, recipe.topping?.id);
    for (const effect of result.effects) {
        const active = player.getEffect(effect.effectId);
        if (active && (active.amplifier > effect.amplifier || active.amplifier === effect.amplifier && active.duration >= effect.duration)) continue;
        player.addEffect(effect.effectId, effect.duration, { amplifier: effect.amplifier });
    }
}
