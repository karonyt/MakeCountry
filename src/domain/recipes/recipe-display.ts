import type { RawMessage } from "@minecraft/server";
import { langChangeItemName } from "@/shared/utils/minecraft.js";

type DisplayResultItem = string | { id: string; count?: number };
type DisplayRecipe = { name?: string; result?: DisplayResultItem | DisplayResultItem[] };

function firstResultId(recipe: DisplayRecipe): string | undefined {
    const result = recipe.result;
    if (!result) return undefined;
    const first = Array.isArray(result) ? result[0] : result;
    return typeof first === "string" ? first : first?.id;
}

function resultIds(recipe: DisplayRecipe): string[] {
    const result = recipe.result;
    if (!result) return [];
    return (Array.isArray(result) ? result : [result]).map((item) => typeof item === "string" ? item : item.id);
}

/**
 * Some recipes are listed under their input (one recipe per monster part, so the part icon and
 * level gate stay searchable). Showing only that name read as "the earring needs the earring";
 * those recipes are shown as "input → result" instead.
 */
export function recipeShowsInput(recipe: DisplayRecipe): boolean {
    const results = resultIds(recipe);
    return typeof recipe.name === "string" && results.length > 0 && !results.includes(recipe.name);
}

/** Button name for recipe lists: the usual item key, or rawtext parts when the recipe is listed under its input. */
export function recipeListName(recipe: DisplayRecipe): string | RawMessage[] {
    if (!recipeShowsInput(recipe)) return langChangeItemName(recipe.name);
    return [{ translate: langChangeItemName(recipe.name) }, { text: " §7→§r " }, { translate: langChangeItemName(firstResultId(recipe)) }];
}

/** Rawtext parts for a recipe screen title. */
export function recipeTitleParts(recipe: DisplayRecipe): RawMessage[] {
    const name = recipeListName(recipe);
    return typeof name === "string" ? [{ translate: name }] : name;
}

/** 配布版: ダンジョン(ゲート)由来アイテムの用途説明は無し。 */
export const GATE_GOOD_USAGE: Readonly<Record<string, string>> = {};
export function gateGoodUsageRawtext(_result: DisplayResultItem | DisplayResultItem[] | undefined): RawMessage[] {
    return [];
}
