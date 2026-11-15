import { artisanText } from "../../../localization/artisan-text.js";
import { literal } from "../../../localization/ui-makecountry.js";
import { itemIdToPath } from "@/config/textures.js";
import { craftableFilterLabel, CRAFTABLE_FILTER_SLOT } from "@/domain/recipes/craftable-filter.js";
export { craftableOnly, toggleCraftableOnly, filterCraftableRecipeIds, CRAFTABLE_FILTER_SLOT } from "@/domain/recipes/craftable-filter.js";

export function addCraftableFilterButton(form: any, player: any, count: number): void {
    form.setButton(CRAFTABLE_FILTER_SLOT, {
        iconPath: (itemIdToPath as Record<string, string>)["minecraft:crafting_table"],
        // ChestFormData expects message parts as an array.
        name: [literal(craftableFilterLabel(player))],
        lore: [{ rawtext: [literal(artisanText(player, "game.ui.artisan.craftable_filter_hint", [count]))] }],
        editedName: true,
    });
}
