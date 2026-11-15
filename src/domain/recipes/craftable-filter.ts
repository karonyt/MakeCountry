import { artisanText } from "../../../localization/artisan-text.js";
/** Shared per-player preference. Optional quality additives are not crafting requirements. */
export const CRAFTABLE_ONLY_PROPERTY = "artisan:craftable_only";
export const CRAFTABLE_FILTER_SLOT = 40;
type Recipe = { requiredLevel?: number; ingredients: Record<string, number> };
type InventoryPlayer = { getComponent(id: string): any; getDynamicProperty(id: string): unknown; setDynamicProperty(id: string, value: boolean): void };

export function craftableOnly(player: Pick<InventoryPlayer, "getDynamicProperty">): boolean {
    return player.getDynamicProperty(CRAFTABLE_ONLY_PROPERTY) === true;
}
export function toggleCraftableOnly(player: InventoryPlayer): void {
    player.setDynamicProperty(CRAFTABLE_ONLY_PROPERTY, !craftableOnly(player));
}
export function recipeInventoryCounts(player: Pick<InventoryPlayer, "getComponent">): Record<string, number> {
    const inventory = player.getComponent("inventory")?.container;
    const counts: Record<string, number> = {};
    if (inventory) for (let slot = 0; slot < inventory.size; slot++) {
        const item = inventory.getItem(slot);
        if (item) counts[item.typeId] = (counts[item.typeId] ?? 0) + item.amount;
    }
    return counts;
}
export function canCraftRecipe(recipe: Recipe, level: number, counts: Record<string, number>): boolean {
    return level >= (recipe.requiredLevel ?? 1) && Object.entries(recipe.ingredients)
        .every(([id, amount]) => (counts[id] ?? 0) >= amount);
}
export function filterCraftableRecipeIds<T extends Recipe>(ids: string[], recipes: Record<string, T>, player: InventoryPlayer, level: number): string[] {
    if (!craftableOnly(player)) return ids;
    const counts = recipeInventoryCounts(player);
    return ids.filter(id => recipes[id] && canCraftRecipe(recipes[id], level, counts));
}
export function craftableFilterLabel(player: Pick<InventoryPlayer, "getDynamicProperty">): string {
    return `§${craftableOnly(player) ? "a" : "7"}${artisanText(player, "game.ui.artisan.craftable_filter", [craftableOnly(player) ? "ON" : "OFF"])}`;
}
