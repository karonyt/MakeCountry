import type { Entity, Player } from "@minecraft/server";
import { getArtisanQuality, getArtisanRank } from "../domain/professions/artisan-quality.js";

export type ConsumableEffect = {
    effectId: string;
    duration: number;
    amplifier: number;
};

export const CONSUMABLE_EFFECTS: Readonly<Record<string, readonly ConsumableEffect[]>> = {
    "mc:beer": [
        { effectId: "nausea", duration: 200, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 0 },
    ],
    "mc:white_wine": [
        { effectId: "nausea", duration: 400, amplifier: 20 },
        { effectId: "jump_boost", duration: 100, amplifier: 3 },
        { effectId: "weakness", duration: 200, amplifier: 3 },
    ],
    "mc:red_wine": [
        { effectId: "nausea", duration: 400, amplifier: 20 },
        { effectId: "slowness", duration: 100, amplifier: 1 },
        { effectId: "weakness", duration: 200, amplifier: 3 },
    ],
    "mc:whiskey": [
        { effectId: "nausea", duration: 200, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 0 },
    ],
    "mc:vodka": [
        { effectId: "nausea", duration: 250, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 1 },
    ],
    "mc:sake": [
        { effectId: "nausea", duration: 300, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 2 },
    ],
    "mc:absinthe": [
        { effectId: "nausea", duration: 300, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 2 },
    ],
    // Keep the former misspelling compatible with any already-distributed item.
    "mc:abisinthe": [
        { effectId: "nausea", duration: 300, amplifier: 20 },
        { effectId: "regeneration", duration: 100, amplifier: 2 },
    ],
    "mc:aoziru": [
        { effectId: "resistance", duration: 200, amplifier: 0 },
        { effectId: "regeneration", duration: 100, amplifier: 0 },
    ],
    "mc:jingo_jewel_stones": [
        { effectId: "resistance", duration: 400, amplifier: 0 },
        { effectId: "fire_resistance", duration: 400, amplifier: 2 },
        { effectId: "regeneration", duration: 150, amplifier: 1 },
        { effectId: "poison", duration: 0, amplifier: 0 },
    ],
};

export function applyConsumableEffects(source: Entity, itemId: string) {
    for (const effect of CONSUMABLE_EFFECTS[itemId] ?? []) {
        source.addEffect(effect.effectId, effect.duration, { amplifier: effect.amplifier });
    }
}

type CookingConsumableCategory = "hearty" | "staple" | "seafood" | "produce" | "refreshment";

type CookingItem = {
    typeId: string;
    getRawLore(): readonly unknown[];
};

type MealEntry = {
    category: CookingConsumableCategory;
    timestamp: number;
};

type MealState = {
    entries: MealEntry[];
    cooldownUntil: number;
};

const COOKING_EFFECTS: Readonly<Record<CookingConsumableCategory, ConsumableEffect>> = {
    hearty: { effectId: "resistance", duration: 500, amplifier: 0 },
    staple: { effectId: "speed", duration: 700, amplifier: 0 },
    seafood: { effectId: "water_breathing", duration: 1_000, amplifier: 0 },
    produce: { effectId: "regeneration", duration: 80, amplifier: 0 },
    refreshment: { effectId: "haste", duration: 700, amplifier: 0 },
};

const BALANCED_MEAL_PROPERTY = "mc:balanced_meal_v1";
const BALANCED_MEAL_WINDOW_MS = 60_000 * 4;
const BALANCED_MEAL_COOLDOWN_MS = 60_000 * 2;

const CATEGORY_HINTS: Readonly<Record<Exclude<CookingConsumableCategory, "hearty">, readonly string[]>> = {
    staple: [
        "bread", "rice", "onigiri", "sushi", "ramen",
        "soba", "udon", "noodle", "macaroni", "pasta", "spaghetti", "pizza", "sandwich", "yakisoba",
        "pilaf", "risotto", "porridge", "donburi", "bento", "doria", "tortilla", "toast", "burger",
    ],
    seafood: [
        "cod", "salmon", "squid", "shrimp", "tuna", "octopus", "ikura", "seafood",
    ],
    produce: [
        "salad", "vegetable", "veggie", "mushroom", "tomato", "cabbage", "carrot",
        "potato", "apple", "melon", "berry", "spinach", "eggplant", "bell_pepper", "leek",
        "ginger", "garlic", "chili", "daikon", "burdock", "lotus_root", "asparagus",
        "zucchini", "pineapple", "strawberry", "mikan", "pumpkin", "beetroot", "corn",
    ],
    refreshment: [
        "juice", "tea", "coffee", "soda", "smoothie",
        "shake", "squash", "nectar", "latte", "shavedice", "shaved_ice", "ice_cream", "softcream",
        "chocolate", "doughnut", "toffee", "custard", "parfait", "sorbet", "gelato", "popsicle",
        "granita", "sherbet", "pudding", "cake", "candy", "anko", "matcha", "honey",
    ],
};

function containsCookingQualityLore(value: unknown, visited = new Set<object>()): boolean {
    if (!value || typeof value !== "object") return false;
    if (visited.has(value)) return false;
    visited.add(value);

    if (Array.isArray(value)) {
        return value.some((entry) => containsCookingQualityLore(entry, visited));
    }

    const message = value as Record<string, unknown>;
    if (message.translate === "cooking.lore.quality" || message.translate === "mixer.lore.quality") {
        return true;
    }

    return containsCookingQualityLore(message.rawtext, visited);
}

/** Keeps chemistry purity and smithing-quality lore out of cooking bonuses. */
export function isRankedCookingItem(item: CookingItem): boolean {
    try {
        return containsCookingQualityLore(item.getRawLore()) && getArtisanRank(item) !== undefined;
    } catch {
        return false;
    }
}

export function getCookingConsumableCategory(itemId: string): CookingConsumableCategory {
    const path = itemId.includes(":") ? itemId.slice(itemId.indexOf(":") + 1) : itemId;

    if (path.startsWith("fish_")) return "seafood";
    if (["breadcraft_", "ricecooker_", "steamer_"].some((prefix) => path.startsWith(prefix))) return "staple";
    if (["drinkcraft_", "icecraft_", "alcohol_"].some((prefix) => path.startsWith(prefix))) return "refreshment";
    if (path.startsWith("homeprep_")) return "produce";

    const hasToken = (token: string) => path === token
        || path.startsWith(`${token}_`)
        || path.endsWith(`_${token}`)
        || path.includes(`_${token}_`);

    for (const category of ["seafood", "staple", "produce", "refreshment"] as const) {
        if (CATEGORY_HINTS[category].some(hasToken)) return category;
    }

    return "hearty";
}

/** Resolves the generic cooking bonus without touching the Minecraft runtime. */
export function getCookingQualityEffect(itemId: string, quality: number): ConsumableEffect | undefined {
    if (Object.hasOwn(CONSUMABLE_EFFECTS, itemId)) return undefined;

    const normalizedQuality = Number.isFinite(quality)
        ? Math.max(0, Math.min(12, Math.trunc(quality)))
        : 0;
    const hunterFood: Readonly<Record<string, { effectId: string; duration: number }>> = {
        "mc:sl_beast_steak": { effectId: "speed", duration: 600 },
        "mc:sl_expedition_stew": { effectId: "haste", duration: 1200 },
        "mc:sl_beast_jerky": { effectId: "water_breathing", duration: 1200 },
    };
    if (hunterFood[itemId]) return { effectId: hunterFood[itemId].effectId,
        duration: hunterFood[itemId].duration + normalizedQuality * 200, amplifier: 0 };
    const base = COOKING_EFFECTS[getCookingConsumableCategory(itemId)];
    const durationMultiplier = 0.7 + normalizedQuality * 0.05;

    return {
        effectId: base.effectId,
        duration: Math.round(base.duration * durationMultiplier),
        amplifier: base.amplifier + (normalizedQuality >= 11 ? 1 : 0),
    };
}

function parseMealState(raw: unknown, currentTime: number): MealState {
    if (typeof raw !== "string") return { entries: [], cooldownUntil: 0 };

    try {
        const candidate = JSON.parse(raw) as Partial<MealState>;
        const cooldownUntil = Number.isFinite(candidate.cooldownUntil)
            && candidate.cooldownUntil! >= currentTime
            && candidate.cooldownUntil! - currentTime <= BALANCED_MEAL_COOLDOWN_MS
            ? candidate.cooldownUntil!
            : 0;
        const entries = Array.isArray(candidate.entries)
            ? candidate.entries.filter((entry): entry is MealEntry => {
                if (!entry || typeof entry !== "object") return false;
                if (!Object.hasOwn(COOKING_EFFECTS, entry.category)) return false;
                if (!Number.isFinite(entry.timestamp) || entry.timestamp > currentTime) return false;
                return currentTime - entry.timestamp <= BALANCED_MEAL_WINDOW_MS;
            })
            : [];

        return { entries, cooldownUntil };
    } catch {
        return { entries: [], cooldownUntil: 0 };
    }
}

function updateBalancedMeal(source: Player, category: CookingConsumableCategory, currentTime: number) {
    const state = parseMealState(source.getDynamicProperty(BALANCED_MEAL_PROPERTY), currentTime);
    if (state.cooldownUntil > currentTime) {
        source.setDynamicProperty(BALANCED_MEAL_PROPERTY, JSON.stringify({ entries: [], cooldownUntil: state.cooldownUntil }));
        return;
    }

    const entries = state.entries.filter((entry) => entry.category !== category);
    entries.push({ category, timestamp: currentTime });

    if (new Set(entries.map((entry) => entry.category)).size >= 3) {
        source.addEffect("absorption", 600, { amplifier: 0 });
        source.addEffect("regeneration", 100, { amplifier: 0 });
        source.onScreenDisplay.setActionBar({ translate: "cooking.balanced_meal.complete" });
        source.setDynamicProperty(BALANCED_MEAL_PROPERTY, JSON.stringify({
            entries: [],
            cooldownUntil: currentTime + BALANCED_MEAL_COOLDOWN_MS,
        } satisfies MealState));
        return;
    }

    source.setDynamicProperty(BALANCED_MEAL_PROPERTY, JSON.stringify({ entries, cooldownUntil: 0 } satisfies MealState));
}

/** Applies modest category and meal bonuses only to ranked cooking outputs. */
export function applyCookingQualityEffects(source: Player, item: CookingItem) {
    if (!isRankedCookingItem(item)) return;

    // Named consumables keep their established hand-authored effects exactly as-is.
    const effect = getCookingQualityEffect(item.typeId, getArtisanQuality(item));
    if (!effect) return;

    source.addEffect(effect.effectId, effect.duration, { amplifier: effect.amplifier });
    // Wall-clock timestamps survive server restarts; system.currentTick does not.
    updateBalancedMeal(source, getCookingConsumableCategory(item.typeId), Date.now());
}
