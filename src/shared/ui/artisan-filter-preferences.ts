import type { Player } from "@minecraft/server";
import { normalizeArtisanFilter, type ArtisanRecipeFilter } from "@/domain/recipes/artisan-filter.js";
import { resolveRecipeCategory } from "@/domain/cooking/recipe-category.js";

type PreferencePlayer = Pick<Player, "getDynamicProperty" | "setDynamicProperty">;
const PREFIX = "artisan:recipe_filter:";

function readPreference(player: PreferencePlayer, station: string): unknown {
    try {
        const raw = player.getDynamicProperty(PREFIX + station);
        return typeof raw === "string" ? JSON.parse(raw) : undefined;
    } catch {
        return undefined;
    }
}

function savePreference(player: PreferencePlayer, station: string, value: unknown) {
    try {
        const key = PREFIX + station;
        const raw = JSON.stringify(value);
        // Pagination and reopening the same selection need no extra writes.
        if (player.getDynamicProperty(key) !== raw) player.setDynamicProperty(key, raw);
    } catch {
        console.warn("[artisan-recipe-filter] 絞り込み設定を保存できませんでした");
    }
}

/** Omitted filters restore the last selection; an explicit empty filter resets it. */
export function resolveArtisanFilterPreference(player: PreferencePlayer, smithing: boolean, filter?: ArtisanRecipeFilter) {
    const station = smithing ? "smithing" : "chemistry";
    const value = filter ?? readPreference(player, station);
    const selected = normalizeArtisanFilter(value && typeof value === "object" && !Array.isArray(value) ? value : {}, smithing);
    if (filter !== undefined) savePreference(player, station, selected);
    return selected;
}

/** Each cooking appliance keeps its own category, including an explicit 'all'. */
export function resolveCookingCategoryPreference(
    player: PreferencePlayer,
    station: string,
    recipes: Parameters<typeof resolveRecipeCategory>[0],
    categoryId?: string,
) {
    const value = categoryId ?? readPreference(player, station);
    const selected = resolveRecipeCategory(recipes, typeof value === "string" ? value : "all");
    if (categoryId !== undefined) savePreference(player, station, selected.id);
    return selected;
}
