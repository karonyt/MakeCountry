import { CraftingModalFormData } from "./purpose-forms.js";
import { CHEMISTRY_KINDS, SMITHING_KINDS, RECIPE_SOURCES, RANK_CHOICES, normalizeArtisanFilter, type ArtisanRecipeFilter } from "@/domain/recipes/artisan-filter.js";
import { recipeCategoryLabel, getAvailableRecipeCategories } from "@/domain/cooking/recipe-category.js";

export function openArtisanRecipeFilter(player: any, filter: ArtisanRecipeFilter, smithing: boolean, onSelect: (filter: ArtisanRecipeFilter) => void) {
    const selected = normalizeArtisanFilter(filter, smithing);
    const kinds = smithing ? SMITHING_KINDS : CHEMISTRY_KINDS;
    const form = new CraftingModalFormData().title("レシピの絞り込み")
        .dropdown("ジャンル", RECIPE_SOURCES.map(c => c.label), { defaultValueIndex: RECIPE_SOURCES.findIndex(c => c.id === selected.source) })
        .dropdown(smithing ? "装備・アイテムの種類" : "反応の種類", kinds.map(c => c.label), { defaultValueIndex: kinds.findIndex(c => c.id === selected.kind) });
    if (smithing) form.dropdown("装備の等級", RANK_CHOICES.map(c => c.label), { defaultValueIndex: RANK_CHOICES.findIndex(c => c.id === selected.rank) });
    form.submitButton("絞り込む").show(player).then(response => {
        if (response.canceled) return;
        const values = response.formValues ?? [];
        onSelect({ source: RECIPE_SOURCES[Number(values[0])]?.id, kind: kinds[Number(values[1])]?.id,
            rank: smithing ? RANK_CHOICES[Number(values[2])]?.id : "all" });
    });
}

export function openCookingRecipeCategory(player: any, recipes: Parameters<typeof getAvailableRecipeCategories>[0], categoryId: string, onSelect: (categoryId: string) => void) {
    const categories = getAvailableRecipeCategories(recipes, categoryId);
    new CraftingModalFormData().title("料理のジャンル")
        .dropdown("ジャンル", categories.map(recipeCategoryLabel), { defaultValueIndex: Math.max(0, categories.findIndex(c => c.id === categoryId)) })
        .submitButton("絞り込む").show(player).then(response => {
            if (response.canceled) return;
            const category = categories[Number(response.formValues?.[0])];
            if (category) onSelect(category.id);
        });
}
