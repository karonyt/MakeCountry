import { ItemComponentTypes, ItemStack, type RawMessage } from "@minecraft/server";
import { CONSUMABLE_EFFECTS, getCookingQualityEffect } from "@/config/consumable-effects.js";
import { ITEM_CHARACTERISTICS } from "@/generated/item-characteristics.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";
import { getForgedTraitTranslationKey } from "@/domain/smelting/forged-trait-data.js";
import { gateGoodUsageRawtext } from "@/domain/recipes/recipe-display.js";

type RecipeResultItem = string | { id: string; count?: number };
export type RecipeResultLike = RecipeResultItem | RecipeResultItem[];

function resultIds(result: RecipeResultLike) {
    return (Array.isArray(result) ? result : [result]).map((entry) => typeof entry === "string" ? entry : entry.id);
}

function seconds(ticks: number) {
    return Math.max(0, Math.round(ticks / 20));
}

const EFFECT_TRANSLATION_KEYS: Readonly<Record<string, string>> = {
    fire_resistance: "potion.fireResistance",
    jump_boost: "potion.jump",
    nausea: "potion.confusion",
    regeneration: "potion.regeneration",
    resistance: "potion.resistance",
    speed: "potion.moveSpeed",
    haste: "potion.digSpeed",
    water_breathing: "potion.waterBreathing",
    slowness: "potion.moveSlowdown",
    weakness: "potion.weakness",
};

// Script API food components are guaranteed for data-driven custom items. Keep
// the vanilla results used by the cooking tables explicit as a compatibility
// fallback for runtimes that do not expose their food component.
const VANILLA_NUTRITION: Readonly<Record<string, number>> = {
    "minecraft:baked_potato": 5,
    "minecraft:cooked_beef": 8,
    "minecraft:cooked_cod": 5,
    "minecraft:cooked_porkchop": 8,
    "minecraft:mushroom_stew": 6,
};

export function buildCookingEffectRawtext(result: RecipeResultLike): RawMessage[] {
    return [...cookingEffectRawtext(result), ...gateGoodUsageRawtext(result)];
}
function cookingEffectRawtext(result: RecipeResultLike): RawMessage[] {
    const lines: RawMessage[] = [];
    let hasQualityMealBonus = false;

    for (const itemId of resultIds(result)) {
        // Data-driven custom items are not consistently exposed by
        // ItemStack#getComponent in every Bedrock runtime. The generated
        // catalog comes directly from their item JSON and therefore keeps the
        // recipe screen complete even when that runtime lookup fails.
        let nutrition = ITEM_CHARACTERISTICS[itemId]?.nutrition ?? VANILLA_NUTRITION[itemId];
        if (nutrition === undefined) {
            try {
                const food = new ItemStack(itemId).getComponent(ItemComponentTypes.Food);
                if (food) nutrition = food.nutrition;
            } catch {
                // Invalid or unavailable result IDs should not prevent the recipe list from opening.
            }
        }
        if (nutrition !== undefined) {
            lines.push(
                { text: "\n§6- " },
                { translate: "cooking.effect.nutrition" },
                { text: `: ${nutrition}` },
            );

            const qualityEffect = getCookingQualityEffect(itemId, 6);
            if (qualityEffect) {
                hasQualityMealBonus = true;
                lines.push(
                    { text: "\n§d- " },
                    { translate: EFFECT_TRANSLATION_KEYS[qualityEffect.effectId] ?? `potion.${qualityEffect.effectId}` },
                    { text: " §7(" },
                    { translate: "cooking.effect.quality_scaled" },
                    { text: ")" },
                );
            }
        }

        for (const effect of CONSUMABLE_EFFECTS[itemId] ?? []) {
            if (effect.duration <= 0) continue;
            lines.push(
                { text: "\n§d- " },
                { translate: EFFECT_TRANSLATION_KEYS[effect.effectId] ?? `potion.${effect.effectId}` },
                { text: ` ${effect.amplifier + 1} (${seconds(effect.duration)}` },
                { translate: "cooking.effect.seconds" },
                { text: ")" },
            );
        }
    }

    if (hasQualityMealBonus) {
        lines.push(
            { text: "\n§6- " },
            { translate: "cooking.effect.balanced_hint" },
        );
    }

    if (lines.length === 0) return [];
    return [
        { text: "\n§e" },
        { translate: "cooking.effect.title" },
        { text: ":" },
        ...lines,
    ];
}

export function buildSmithingEffectRawtext(result: RecipeResultLike): RawMessage[] {
    return [...smithingEffectRawtext(result), ...gateGoodUsageRawtext(result)];
}
function smithingEffectRawtext(result: RecipeResultLike): RawMessage[] {
    const lines: RawMessage[] = [];
    if (resultIds(result).includes("mc:katana")) lines.push({text:"\n§b- "},{translate:"katana.iaido.recipe_hint"});

    for (const itemId of resultIds(result)) {
        const characteristic = ITEM_CHARACTERISTICS[itemId];
        if (!characteristic) continue;

        if (characteristic.attackDamage !== undefined) {
            lines.push(
                { text: "\n§c- " },
                { translate: "smelting.effect.attack_damage" },
                { text: `: ${characteristic.attackDamage}` },
            );
        }
        if (characteristic.protection !== undefined) {
            lines.push(
                { text: "\n§b- " },
                { translate: "smelting.effect.protection" },
                { text: `: ${characteristic.protection}` },
            );
        }
        if (characteristic.durability !== undefined) {
            lines.push(
                { text: "\n§a- " },
                { translate: "smelting.effect.durability" },
                { text: `: ${characteristic.durability}` },
            );
        }
        if (characteristic.miningSpeed !== undefined) {
            lines.push(
                { text: "\n§e- " },
                { translate: "smelting.effect.mining_speed" },
                { text: `: ${characteristic.miningSpeed}` },
            );
        }
        for (const special of characteristic.specialMining ?? []) {
            lines.push(
                { text: "\n§6- " },
                special.translationKey
                    ? { translate: special.translationKey }
                    : { translate: langChangeItemName(special.blockId ?? "") },
                { text: ` (${special.speed})` },
            );
        }
        if (characteristic.rankedTool) {
            lines.push(
                { text: "\n§d- " },
                { translate: "smelting.effect.rank_tool" },
                { text: '\n§c- ' },
                { translate: 'mineral.tool.repair_policy_hint' },
            );
        }
        const traitKey = getForgedTraitTranslationKey(itemId);
        if (traitKey) {
            lines.push(
                { text: "\n§6- " },
                { translate: traitKey },
            );
        }
    }

    if (lines.length === 0) return [];
    return [
        { text: "\n§e" },
        { translate: "smelting.effect.title" },
        { text: ":" },
        ...lines,
    ];
}
