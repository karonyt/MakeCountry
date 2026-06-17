type RecipeResultItem = string | { id: string; count?: number };
type RecipeResult = RecipeResultItem | RecipeResultItem[];

export type RecipeListEntry = {
    name?: string;
    result?: RecipeResult;
    requiredLevel?: number;
    ingredients?: Record<string, unknown>;
    additives?: Record<string, unknown>;
    catalysts?: Record<string, unknown>;
    seasonings?: Record<string, unknown>;
};

const SEARCHABLE_MAP_KEYS = ["ingredients", "additives", "catalysts", "seasonings"] as const;

function stripNamespace(value: string) {
    return value.replace(/^minecraft:/, "").replace(/^mc:/, "");
}

function normalizeSearchValue(value: string) {
    return value
        .toLowerCase()
        .replace(/§[0-9a-fklmnor]/g, "")
        .replace(/[_:./\\-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function resultIds(result: RecipeResult | undefined) {
    if (!result) return [];
    const results = Array.isArray(result) ? result : [result];
    return results
        .map((item) => typeof item === "string" ? item : item.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function searchableIds(recipeId: string, recipe: RecipeListEntry) {
    const ids = [recipeId];

    if (recipe.name) ids.push(recipe.name);
    ids.push(...resultIds(recipe.result));

    for (const key of SEARCHABLE_MAP_KEYS) {
        const values = recipe[key];
        if (!values) continue;
        ids.push(...Object.keys(values));
    }

    return ids;
}

function recipeSearchText(recipeId: string, recipe: RecipeListEntry) {
    const values = searchableIds(recipeId, recipe).flatMap((id) => [
        id,
        stripNamespace(id),
        `item.${id}`,
        `tile.${id}`,
    ]);

    return values.map(normalizeSearchValue).join(" ");
}

export function cleanRecipeSearchQuery(query = "") {
    return query.trim().slice(0, 64);
}

export function isRecipeSearchActive(query = "") {
    return cleanRecipeSearchQuery(query).length > 0;
}

export function sortRecipeIdsByLevel<T extends RecipeListEntry>(recipeIds: string[], recipes: Record<string, T>) {
    return [...recipeIds].sort((leftId, rightId) => {
        const left = recipes[leftId];
        const right = recipes[rightId];
        const levelDiff = (left?.requiredLevel ?? Number.MAX_SAFE_INTEGER) - (right?.requiredLevel ?? Number.MAX_SAFE_INTEGER);
        if (levelDiff !== 0) return levelDiff;

        const leftName = stripNamespace(left?.name ?? resultIds(left?.result)[0] ?? leftId);
        const rightName = stripNamespace(right?.name ?? resultIds(right?.result)[0] ?? rightId);
        return leftName.localeCompare(rightName);
    });
}

export function recipeMatchesSearch(recipeId: string, recipe: RecipeListEntry, query: string) {
    const tokens = normalizeSearchValue(query).split(" ").filter(Boolean);
    if (tokens.length === 0) return true;

    const text = recipeSearchText(recipeId, recipe);
    return tokens.every((token) => text.includes(token));
}

export function filterUnlockedRecipesForSearch<T extends RecipeListEntry>(
    recipeIds: string[],
    recipes: Record<string, T>,
    query: string,
    level: number
) {
    const cleanQuery = cleanRecipeSearchQuery(query);
    if (!cleanQuery) return recipeIds;

    return recipeIds.filter((recipeId) => {
        const recipe = recipes[recipeId];
        if (!recipe) return false;
        return level >= (recipe.requiredLevel ?? Number.MAX_SAFE_INTEGER) && recipeMatchesSearch(recipeId, recipe, cleanQuery);
    });
}
