import { itemIdToPath } from "@/config/textures.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";

const lastCraftedRecipes = new Map<string, string>();

function getKey(playerId: string, station: string) {
    return `${playerId}:${station}`;
}

export function rememberLastCraftedRecipe(playerId: string, station: string, recipeId: string) {
    lastCraftedRecipes.set(getKey(playerId, station), recipeId);
}

export function getLastCraftedRecipeId(playerId: string, station: string) {
    return lastCraftedRecipes.get(getKey(playerId, station));
}

export function addLastCraftedRecipeButton(
    form: ChestFormData | undefined,
    playerId: string,
    station: string,
    recipes: Record<string, { name: string }>
) {
    if (!form) return;

    const recipeId = getLastCraftedRecipeId(playerId, station);
    const recipe = recipeId ? recipes[recipeId] : undefined;
    if (!recipe) return;

    const iconPath = (itemIdToPath as Record<string, string>)[recipe.name] ?? recipe.name;
    form.setButton(46, {
        iconPath,
        name: [{ text: "§e直前に作成した物\n§f" }, { translate: langChangeItemName(recipe.name) }],
        editedName: true
    });
}
