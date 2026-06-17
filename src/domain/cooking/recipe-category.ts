export type RecipeCategoryId =
    | "all"
    | "low_level"
    | "materials"
    | "fish"
    | "home"
    | "bread"
    | "alcohol"
    | "rice_cooker"
    | "iron_board"
    | "steamer"
    | "ice"
    | "drink"
    | "generated"
    | "classic";

export type RecipeCategory = {
    id: RecipeCategoryId;
    label: string;
    icon: string;
};

type RecipeResult = string | { id: string; count?: number } | { id: string; count?: number }[];

type RecipeLike = {
    name?: string;
    result?: RecipeResult;
    requiredLevel?: number;
};

export const RECIPE_CATEGORIES: RecipeCategory[] = [
    { id: "all", label: "cooking.category.all", icon: "minecraft:book" },
    { id: "low_level", label: "cooking.category.low_level", icon: "minecraft:experience_bottle" },
    { id: "materials", label: "cooking.category.materials", icon: "minecraft:crafting_table" },
    { id: "fish", label: "cooking.category.fish", icon: "minecraft:cod" },
    { id: "home", label: "cooking.category.home", icon: "minecraft:bowl" },
    { id: "bread", label: "cooking.category.bread", icon: "minecraft:bread" },
    { id: "alcohol", label: "cooking.category.alcohol", icon: "minecraft:glass_bottle" },
    { id: "rice_cooker", label: "cooking.category.rice_cooker", icon: "mc:cooked_rice" },
    { id: "iron_board", label: "cooking.category.iron_board", icon: "mc:food_oil" },
    { id: "steamer", label: "cooking.category.steamer", icon: "mc:flour" },
    { id: "ice", label: "cooking.category.ice", icon: "minecraft:blue_ice" },
    { id: "drink", label: "cooking.category.drink", icon: "mc:water_cup" },
    { id: "generated", label: "cooking.category.generated", icon: "minecraft:filled_map" },
    { id: "classic", label: "cooking.category.classic", icon: "minecraft:paper" },
];

const LOW_LEVEL_MAX = 10;
const MATERIAL_PREFIXES = ["fish_fillet_", "fish_mince_", "fish_stock_", "homeprep_"];
const GENERATED_PREFIXES = [
    "cuisine_",
    "fish_",
    "homeprep_",
    "homefood_",
    "breadcraft_",
    "alcohol_",
    "ricecooker_",
    "griddle_",
    "steamer_",
    "icecraft_",
    "drinkcraft_",
];

function stripNamespace(id: string) {
    return id.replace(/^mc:/, "").replace(/^minecraft:/, "");
}

function resultIds(result: RecipeResult | undefined) {
    if (!result) return [];
    const results = Array.isArray(result) ? result : [result];
    return results.map((item) => stripNamespace(typeof item === "string" ? item : item.id));
}

function recipeIds(recipeId: string, recipe: RecipeLike) {
    return [
        stripNamespace(recipeId),
        ...(recipe.name ? [stripNamespace(recipe.name)] : []),
        ...resultIds(recipe.result),
    ];
}

function hasAnyPrefix(recipeId: string, recipe: RecipeLike, prefixes: string[]) {
    return recipeIds(recipeId, recipe).some((id) => prefixes.some((prefix) => id.startsWith(prefix)));
}

export function recipeMatchesCategory(recipeId: string, recipe: RecipeLike, categoryId: RecipeCategoryId) {
    switch (categoryId) {
        case "all":
            return true;
        case "low_level":
            return (recipe.requiredLevel ?? 999) <= LOW_LEVEL_MAX;
        case "materials":
            return hasAnyPrefix(recipeId, recipe, MATERIAL_PREFIXES);
        case "fish":
            return hasAnyPrefix(recipeId, recipe, ["fish_"]);
        case "home":
            return hasAnyPrefix(recipeId, recipe, ["homeprep_", "homefood_"]);
        case "bread":
            return hasAnyPrefix(recipeId, recipe, ["breadcraft_"]);
        case "alcohol":
            return hasAnyPrefix(recipeId, recipe, ["alcohol_"]);
        case "rice_cooker":
            return hasAnyPrefix(recipeId, recipe, ["ricecooker_"]);
        case "iron_board":
            return hasAnyPrefix(recipeId, recipe, ["griddle_"]);
        case "steamer":
            return hasAnyPrefix(recipeId, recipe, ["steamer_"]);
        case "ice":
            return hasAnyPrefix(recipeId, recipe, ["icecraft_"]);
        case "drink":
            return hasAnyPrefix(recipeId, recipe, ["drinkcraft_"]);
        case "generated":
            return hasAnyPrefix(recipeId, recipe, GENERATED_PREFIXES);
        case "classic":
            return !hasAnyPrefix(recipeId, recipe, GENERATED_PREFIXES);
    }
}

export function getAvailableRecipeCategories(recipes: Record<string, RecipeLike>, selectedCategoryId: string = "all") {
    const categories = RECIPE_CATEGORIES.filter((category) =>
        category.id === "all" ||
        Object.entries(recipes).some(([recipeId, recipe]) => recipeMatchesCategory(recipeId, recipe, category.id))
    );
    const selected = RECIPE_CATEGORIES.find((category) => category.id === selectedCategoryId);
    return selected && !categories.some((category) => category.id === selected.id) ? [...categories, selected] : categories;
}

export function resolveRecipeCategory(recipes: Record<string, RecipeLike>, categoryId: string = "all") {
    const categories = getAvailableRecipeCategories(recipes, categoryId);
    return categories.find((category) => category.id === categoryId) ?? categories[0] ?? RECIPE_CATEGORIES[0];
}

export function filterRecipeIds(recipeIds: string[], recipes: Record<string, RecipeLike>, categoryId: RecipeCategoryId) {
    return recipeIds.filter((recipeId) => {
        const recipe = recipes[recipeId];
        return recipe ? recipeMatchesCategory(recipeId, recipe, categoryId) : false;
    });
}

export function adjacentRecipeCategory(recipes: Record<string, RecipeLike>, categoryId: string, delta: number) {
    const categories = getAvailableRecipeCategories(recipes, categoryId);
    const index = Math.max(0, categories.findIndex((category) => category.id === categoryId));
    const nextIndex = (index + delta + categories.length) % categories.length;
    return categories[nextIndex] ?? RECIPE_CATEGORIES[0];
}
