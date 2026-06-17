import { ItemComponentTypes } from "@minecraft/server";
import { itemIdToPath } from "@/config/textures.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";

const potionEffectPresentation: Record<string, { texture: string; translation: string }> = {
    absorption: { texture: "absorption", translation: "absorption" },
    blindness: { texture: "blindness", translation: "blindness" },
    confusion: { texture: "confusion", translation: "confusion" },
    damageboost: { texture: "damageBoost", translation: "damageBoost" },
    digslowdown: { texture: "digSlowdown", translation: "digSlowDown" },
    digspeed: { texture: "digSpeed", translation: "digSpeed" },
    empty: { texture: "empty", translation: "emptyPotion" },
    fireresistance: { texture: "fireResistance", translation: "fireResistance" },
    harm: { texture: "harm", translation: "harm" },
    heal: { texture: "heal", translation: "heal" },
    healthboost: { texture: "healthBoost", translation: "healthBoost" },
    hunger: { texture: "hunger", translation: "hunger" },
    infested: { texture: "infested", translation: "infested" },
    invisibility: { texture: "invisibility", translation: "invisibility" },
    jump: { texture: "jump", translation: "jump" },
    levitation: { texture: "levitation", translation: "levitation" },
    luck: { texture: "luck", translation: "luck" },
    moveslowdown: { texture: "moveSlowdown", translation: "moveSlowdown" },
    movespeed: { texture: "moveSpeed", translation: "moveSpeed" },
    nightvision: { texture: "nightVision", translation: "nightVision" },
    oozing: { texture: "oozing", translation: "oozing" },
    poison: { texture: "poison", translation: "poison" },
    regeneration: { texture: "regeneration", translation: "regeneration" },
    resistance: { texture: "resistance", translation: "resistance" },
    saturation: { texture: "saturation", translation: "saturation" },
    slowfall: { texture: "slowFall", translation: "slowFalling" },
    slowfalling: { texture: "slowFall", translation: "slowFalling" },
    turtlemaster: { texture: "turtleMaster", translation: "turtleMaster" },
    water: { texture: "empty", translation: "emptyPotion" },
    waterbreathing: { texture: "waterBreathing", translation: "waterBreathing" },
    weakness: { texture: "weakness", translation: "weakness" },
    weaving: { texture: "weaving", translation: "weaving" },
    windcharged: { texture: "windCharged", translation: "windCharged" },
    wither: { texture: "wither", translation: "wither" }
};

const brewingOnlyPotionNames: Record<string, string> = {
    awkward: "awkward",
    mundane: "mundane",
    mundaneextended: "mundane.extended",
    thick: "thick"
};

const potionDurationSeconds: Record<string, { normal?: number; long?: number; strong?: number }> = {
    damageboost: { normal: 180, long: 480, strong: 90 },
    fireresistance: { normal: 180, long: 480 },
    infested: { normal: 180 },
    invisibility: { normal: 180, long: 480 },
    jump: { normal: 180, long: 480, strong: 90 },
    moveslowdown: { normal: 90, long: 240, strong: 20 },
    movespeed: { normal: 180, long: 480, strong: 90 },
    nightvision: { normal: 180, long: 480 },
    oozing: { normal: 180 },
    poison: { normal: 45, long: 90, strong: 21 },
    regeneration: { normal: 45, long: 90, strong: 22 },
    slowfall: { normal: 90, long: 240 },
    turtlemaster: { normal: 20, long: 40, strong: 20 },
    waterbreathing: { normal: 180, long: 480 },
    weakness: { normal: 90, long: 240 },
    weaving: { normal: 180 },
    windcharged: { normal: 180 },
    wither: { normal: 40 }
};

export function resolveChestIconPath(iconPath: any, name?: any) {
    if (typeof iconPath === "number") return iconPath;
    if (typeof iconPath === "string" && iconPath.length > 0) return getChestIconPath(iconPath);
    if (typeof name === "string" && isTypeId(name)) return getChestIconPath(name);
    return getChestIconPath("minecraft:barrier");
}

export function getChestIconPath(typeId: string, itemData?: any) {
    const normalizedTypeId = String(typeId || "");
    const potion = firstPotionData(itemData);
    if (potion) return potionIconPath(normalizedTypeId, potion);

    if (normalizedTypeId === "minecraft:potion") return "textures/items/potion_bottle_drinkable";
    if (normalizedTypeId === "minecraft:splash_potion") return "textures/items/potion_bottle_splash";
    if (normalizedTypeId === "minecraft:lingering_potion") return "textures/items/potion_bottle_lingering";

    return (itemIdToPath as Record<string, string>)[normalizedTypeId] ?? normalizedTypeId;
}

export function getChestItemDataPresentation(itemData: any) {
    const typeId = String(itemData?.typeId || "");
    const potion = firstPotionData(itemData);
    return {
        iconPath: getChestIconPath(typeId, itemData),
        name: potionDisplayName(typeId, potion) || langChangeItemName(typeId),
        lore: potionLore(potion)
    };
}

export function getChestItemStackPresentation(item: any) {
    const typeId = String(item?.typeId || "");
    const potion = readItemStackPotionData(item);
    return getChestItemDataPresentation({
        typeId,
        potion: potion ? [potion] : []
    });
}

export function readItemStackPotionData(item: any) {
    const potionComponent = item?.getComponent?.(ItemComponentTypes.Potion);
    if (!potionComponent?.isValid) return undefined;
    const effectType = potionComponent.potionEffectType as any;
    const deliveryType = potionComponent.potionDeliveryType as any;
    const durationTicks = firstNumber(
        effectType?.durationTicks,
        effectType?.duration,
        potionComponent.durationTicks,
        potionComponent.duration
    );
    const amplifier = firstNumber(
        effectType?.amplifier,
        effectType?.amplifierLevel,
        potionComponent.amplifier,
        potionComponent.amplifierLevel
    );
    return {
        id: effectType?.id,
        deliveryType: deliveryType?.id,
        durationTicks,
        amplifier
    };
}

export function appendChestPresentationLore(lore: any[] = [], presentationLore: any[] = []) {
    if (presentationLore.length === 0) return lore;
    const normalizedLore = normalizeChestLore(lore);
    if (normalizedLore.length === 0) return presentationLore;
    return [...normalizedLore, { text: "\n" }, ...presentationLore];
}

function firstPotionData(itemData: any) {
    const potion = Array.isArray(itemData?.potion) ? itemData.potion[0] : itemData?.potion;
    if (!potion) return undefined;
    const id = potion.id ?? potion.effect ?? potion.typeId;
    if (!id) return undefined;
    return {
        ...potion,
        id,
        deliveryType: potion.deliveryType ?? potion.delivery,
        durationTicks: firstNumber(potion.durationTicks, potion.duration),
        amplifier: firstNumber(potion.amplifier, potion.amplifierLevel)
    };
}

function potionIconPath(typeId: string, potion: any) {
    const delivery = potionDeliveryPresentation(typeId, potion?.deliveryType);
    const effect = potionEffectPresentationKey(potion?.id);
    const presentation = effect ? potionEffectPresentation[effect] : undefined;
    if (!presentation) return delivery.fallbackIcon;

    if (presentation.texture === "empty" && delivery.kind === "splash") return delivery.fallbackIcon;
    return `textures/items/${delivery.texturePrefix}_${presentation.texture}`;
}

function potionDisplayName(typeId: string, potion: any) {
    if (!potion?.id) return undefined;

    const delivery = potionDeliveryPresentation(typeId, potion.deliveryType);
    const effect = potionEffectPresentationKey(potion.id);
    const presentation = effect ? potionEffectPresentation[effect] : undefined;
    const brewingOnly = effect ? brewingOnlyPotionNames[effect] : undefined;

    if (presentation) return [{ translate: `potion.${presentation.translation}${delivery.translationSuffix}.name` }];
    if (brewingOnly) return [{ translate: `potion.${brewingOnly}${delivery.translationSuffix}.name` }];
    return undefined;
}

function potionLore(potion: any) {
    const effect = potionEffectPresentationKey(potion?.id);
    if (!effect || brewingOnlyPotionNames[effect]) return [];

    const lore = [];
    const duration = formatPotionDuration(potionDurationTicks(potion));
    const power = potionPowerLevel(potion, effect);

    if (duration) lore.push({ text: `§7効果時間: §f${duration}` });
    if (power) lore.push({ text: `${lore.length > 0 ? "\n" : ""}§7強さ: §f${romanNumeral(power)}` });

    return lore;
}

function potionDurationTicks(potion: any) {
    const explicit = firstNumber(potion?.durationTicks, potion?.durationTick);
    if (explicit !== undefined) return explicit;

    const effect = normalizePotionId(potion?.id);
    if (!effect || effect.includes("healing") || effect.includes("harming") || effect.includes("heal") || effect.includes("harm")) {
        return undefined;
    }
    const effectKey = potionEffectPresentationKey(effect);
    const durations = effectKey ? potionDurationSeconds[effectKey] : undefined;
    if (!durations) return undefined;

    const seconds = isStrongPotionId(effect)
        ? durations.strong ?? durations.normal
        : isLongPotionId(effect)
            ? durations.long ?? durations.normal
            : durations.normal;
    if (!seconds) return undefined;

    const delivery = normalizePotionId(potion?.deliveryType);
    return (delivery.includes("lingering") || delivery.includes("linger"))
        ? Math.max(1, Math.floor(seconds * 20 / 4))
        : seconds * 20;
}

function potionPowerLevel(potion: any, effect: string) {
    const amplifier = firstNumber(potion?.amplifier, potion?.amplifierLevel);
    if (amplifier !== undefined) return Math.max(1, Math.floor(amplifier) + 1);

    const level = firstNumber(potion?.level, potion?.power, potion?.strength);
    if (level !== undefined) return Math.max(1, Math.floor(level));

    if (isBrewingOnlyEffect(effect)) return undefined;
    return isStrongPotionId(potion?.id) ? 2 : 1;
}

function formatPotionDuration(ticks: number | undefined) {
    if (ticks === undefined || !Number.isFinite(ticks) || ticks <= 0) return undefined;
    const totalSeconds = Math.ceil(ticks / 20);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function romanNumeral(value: number) {
    const numerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return numerals[value] ?? `${value}`;
}

function firstNumber(...values: any[]) {
    for (const value of values) {
        if (typeof value !== "number" || !Number.isFinite(value)) continue;
        return value;
    }
    return undefined;
}

function isStrongPotionId(effectId: unknown) {
    return normalizePotionId(effectId).includes("strong");
}

function isLongPotionId(effectId: unknown) {
    return normalizePotionId(effectId).includes("long");
}

function isBrewingOnlyEffect(effect: string) {
    return effect === "empty" || brewingOnlyPotionNames[effect] !== undefined;
}

function normalizeChestLore(lore: any[] = []) {
    if (lore.length === 0 || typeof lore[0] !== "string") return lore;
    return lore.flatMap((line, index) => [
        ...(index > 0 ? [{ text: "\n§r" }] : []),
        { translate: `${line}` }
    ]);
}

function potionDeliveryPresentation(typeId: string, deliveryType: unknown) {
    const delivery = normalizePotionId(deliveryType);
    if (typeId === "minecraft:splash_potion" || delivery.includes("splash")) {
        return {
            kind: "splash",
            texturePrefix: "potion_bottle_splash",
            fallbackIcon: "textures/items/potion_bottle_splash",
            translationSuffix: ".splash"
        };
    }

    if (typeId === "minecraft:lingering_potion" || delivery.includes("lingering") || delivery.includes("linger")) {
        return {
            kind: "lingering",
            texturePrefix: "potion_bottle_lingering",
            fallbackIcon: "textures/items/potion_bottle_lingering",
            translationSuffix: ".linger"
        };
    }

    return {
        kind: "drinkable",
        texturePrefix: "potion_bottle",
        fallbackIcon: "textures/items/potion_bottle_drinkable",
        translationSuffix: ""
    };
}

function potionEffectPresentationKey(effectId: unknown) {
    const effect = normalizePotionId(effectId);
    if (!effect) return undefined;
    const aliases: Record<string, string> = {
        fire_resistance: "fireresistance",
        fire_resistant: "fireresistance",
        instant_damage: "harm",
        harming: "harm",
        instant_health: "heal",
        healing: "heal",
        leaping: "jump",
        jump_boost: "jump",
        mining_fatigue: "digslowdown",
        haste: "digspeed",
        night_vision: "nightvision",
        slowness: "moveslowdown",
        slow_falling: "slowfall",
        speed: "movespeed",
        strength: "damageboost",
        turtle_master: "turtlemaster",
        water_breathing: "waterbreathing",
        wind_charged: "windcharged"
    };
    const aliased = aliases[effect] ?? aliases[effect.replace(/_/g, "")];
    if (aliased) return aliased;

    if (effect.includes("fireresistance")) return "fireresistance";
    if (effect.includes("harm") || effect.includes("harming")) return "harm";
    if (effect.includes("heal") || effect.includes("healing")) return "heal";
    if (effect.includes("waterbreathing")) return "waterbreathing";
    if (effect.includes("nightvision")) return "nightvision";
    if (effect.includes("moveslowdown") || effect.includes("slowness")) return "moveslowdown";
    if (effect.includes("movespeed") || effect.includes("swiftness") || effect.includes("speed")) return "movespeed";
    if (effect.includes("slowfall") || effect.includes("slow_fall")) return "slowfall";
    if (effect.includes("damageboost") || effect.includes("strength")) return "damageboost";
    if (effect.includes("jump") || effect.includes("leaping")) return "jump";
    if (effect.includes("poison")) return "poison";
    if (effect.includes("regeneration")) return "regeneration";
    if (effect.includes("turtlemaster")) return "turtlemaster";
    if (effect.includes("windcharged")) return "windcharged";
    if (effect.includes("digslowdown") || effect.includes("miningfatigue")) return "digslowdown";
    if (effect.includes("digspeed") || effect.includes("haste")) return "digspeed";
    if (effect.includes("weakness")) return "weakness";
    if (effect.includes("wither")) return "wither";
    if (effect.includes("invisibility")) return "invisibility";
    if (effect.includes("mundaneextended") || effect.includes("longmundane")) return "mundaneextended";

    return effect;
}

function normalizePotionId(value: unknown) {
    return String(value || "")
        .trim()
        .replace(/^minecraft:/, "")
        .replace(/[^A-Za-z0-9_]/g, "")
        .toLowerCase();
}

function isTypeId(value: string) {
    return /^[a-z0-9_.-]+:[a-z0-9_./-]+$/i.test(value);
}
