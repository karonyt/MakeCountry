
type RecipeLike = {
    name?: string;
    result?: string | { id: string; count?: number } | Array<string | { id: string; count?: number }>;
    reactionType?: string;
};
export type ArtisanRecipeFilter = { source?: string; kind?: string; rank?: string };
export type FilterChoice = { id: string; label: string };
export const RECIPE_SOURCES: FilterChoice[] = [
    { id: "all", label: "すべて" },
    { id: "dungeon", label: "ダンジョン関連" },
    { id: "normal", label: "通常（ダンジョン以外）" },
];
export const EQUIPMENT_FAMILIES = ["長剣", "戦斧", "短剣", "魔杖", "長弓", "盾", "兜", "鎧", "脚甲", "戦靴"];
export const EQUIPMENT_RANKS = ["E", "D", "C", "B", "A", "S"];
export const SMITHING_KINDS: FilterChoice[] = [
    { id: "all", label: "すべて" },
    ...EQUIPMENT_FAMILIES.map((label, i) => ({ id: `family_${i}`, label })),
    { id: "other", label: "素材・道具・その他" },
];
export const CHEMISTRY_KINDS: FilterChoice[] = [
    { id: "all", label: "すべて" },
    { id: "decomposition", label: "分解・抽出" },
    { id: "neutralization", label: "中和" },
    { id: "reduction", label: "還元" },
    { id: "polymerization", label: "重合・合成" },
    { id: "precipitation", label: "沈殿" },
    { id: "other", label: "その他の反応" },
];
export const RANK_CHOICES: FilterChoice[] = [
    { id: "all", label: "すべて" },
    ...EQUIPMENT_RANKS.map(id => ({ id, label: `${id}級` })),
];

export function recipeOutputIds(recipe: RecipeLike): string[] {
    if (!recipe.result) return recipe.name ? [recipe.name] : [];
    return [recipe.result].flat().map(result => typeof result === "string" ? result : result.id);
}

export function isDungeonRecipe(recipeId: string, recipe: RecipeLike): boolean {
    // Classify the recipe and its output, never ordinary shared ingredients.
    return [recipeId, recipe.name ?? "", ...recipeOutputIds(recipe)]
        .some(id => /^(?:mc:)?sl_/.test(id));
}

// 配布版: ハンター装備(mc:sl_gear_*)は含まれないため、装備の系統・等級は常に無し
export function recipeEquipmentLayout(_recipe: RecipeLike): { familyIndex: number; rankIndex: number } | undefined {
    return undefined;
}

export function normalizeArtisanFilter(filter: ArtisanRecipeFilter = {}, smithing = true): Required<ArtisanRecipeFilter> {
    const kinds = smithing ? SMITHING_KINDS : CHEMISTRY_KINDS;
    return {
        source: RECIPE_SOURCES.some(c => c.id === filter.source) ? filter.source! : "all",
        kind: kinds.some(c => c.id === filter.kind) ? filter.kind! : "all",
        rank: smithing && RANK_CHOICES.some(c => c.id === filter.rank) ? filter.rank! : "all",
    };
}

export function filterArtisanRecipeIds(ids: string[], recipes: Record<string, RecipeLike>, filter: ArtisanRecipeFilter = {}, smithing = true) {
    const selected = normalizeArtisanFilter(filter, smithing);
    return ids.filter(id => {
        const recipe = recipes[id];
        if (!recipe) return false;
        const dungeon = isDungeonRecipe(id, recipe);
        if (selected.source === "dungeon" && !dungeon || selected.source === "normal" && dungeon) return false;
        if (!smithing) {
            if (selected.kind === "all") return true;
            const known = CHEMISTRY_KINDS.some(c => c.id === recipe.reactionType && c.id !== "all" && c.id !== "other");
            return selected.kind === "other" ? !known : recipe.reactionType === selected.kind;
        }
        const equipment = recipeEquipmentLayout(recipe);
        if (selected.rank !== "all" && (!equipment || EQUIPMENT_RANKS[equipment.rankIndex] !== selected.rank)) return false;
        if (selected.kind === "all") return true;
        return selected.kind === "other" ? !equipment : !!equipment && selected.kind === `family_${equipment.familyIndex}`;
    });
}

export function artisanFilterLabel(filter: ArtisanRecipeFilter = {}, smithing = true): string {
    const selected = normalizeArtisanFilter(filter, smithing);
    const kinds = smithing ? SMITHING_KINDS : CHEMISTRY_KINDS;
    return [RECIPE_SOURCES.find(c => c.id === selected.source)!.label,
        ...(selected.kind === "all" ? [] : [kinds.find(c => c.id === selected.kind)!.label]),
        ...(selected.rank === "all" ? [] : [`${selected.rank}級`])].join(" / ");
}
