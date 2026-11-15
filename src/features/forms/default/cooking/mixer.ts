import { addCraftableFilterButton, craftableOnly, toggleCraftableOnly, filterCraftableRecipeIds, CRAFTABLE_FILTER_SLOT } from "@/shared/ui/craftable-filter.js";
import { resolveCookingCategoryPreference } from "@/shared/ui/artisan-filter-preferences.js";
import { openCookingRecipeCategory } from "@/shared/ui/artisan-recipe-filter.js";
import { cancelArtisanCraft, runArtisanCraft } from "@/domain/jobs/pending-artisan-rewards.js";
import { recipeListName, recipeTitleParts } from "@/domain/recipes/recipe-display.js";
import { captureCookingEquipment, requireCookingEquipment } from '@/domain/cooking/cookware.js';
import { CraftingModalFormData as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { addLastCraftedRecipeButton, getLastCraftedRecipeId, rememberLastCraftedRecipe } from "@/shared/ui/last-crafted-recipe.js";
import { MixerRecipes } from "@/content/cooking/mixer-recipe.js";
import { itemIdToPath } from "@/config/textures.js";
import jobs_config from "@/config/jobs.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { getRandomInteger, langChangeItemName } from "@/shared/utils/minecraft.js";
import { getGameplayRandomValue } from "@/shared/utils/gameplay-random.js";
import { createResultStacks, resolveRecipeResult } from "@/domain/recipes/recipe-result.js";
import { buildCookingEffectRawtext } from "@/domain/recipes/recipe-effect-lore.js";
import { capCookingRankByRecipe } from "@/domain/cooking/quality-cap.js";
import {
    adjacentRecipeCategory,
    recipeCategoryLabel,
    filterRecipeIds,
    getAvailableRecipeCategories,
} from "@/domain/cooking/recipe-category.js";
import {
    cleanRecipeSearchQuery,
    filterUnlockedRecipesForSearch,
    isRecipeSearchActive,
    sortRecipeIdsByLevel,
} from "@/domain/recipes/recipe-list.js";

import {
    addComplexCookingMinigameUi,
    beginComplexCookingAction,
    canCompleteComplexCooking,
    endComplexCookingAction,
    ensureComplexCookingRoute,
    getComplexCookingAdjustment,
    getComplexCookingCompletionLore,
    getComplexCookingCompletionMessage,
    getComplexCookingResultInfo,
    initializeComplexCookingMinigame,
} from "@/features/forms/default/cooking/complex-station-minigame.js";
import { buildCookingMasteryLore } from "@/features/forms/default/cooking/cooking-mastery-ui.js";
import {
    hasAnyUnreservedCookingIngredient,
    hasUnreservedCookingIngredient,
} from "@/features/forms/default/cooking/complex-station-ingredients.js";

/* ===============================
   Init
================================ */
let buff: any;

world.afterEvents.worldLoad.subscribe(() => {
    buff = new RewardBuff();
});

/* ===============================
   Session
================================ */
const mixerSessions = new Map();

/* ===============================
   Inventory Utils
================================ */
function countInventory(player: any) {
    const inv = player.getComponent("inventory").container;
    const counts = {};
    for (let i = 0; i < inv.size; i++) {
        const it = inv.getItem(i);
        if (!it) continue;
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        counts[it.typeId] = (counts[it.typeId] ?? 0) + it.amount;
    }
    return counts;
}

function hasAll(player: any, req: any) {
    const inv = countInventory(player);
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return Object.entries(req).every(([id, n]) => (inv[id] ?? 0) >= n);
}

function consume(player: any, req: any) {
    const inv = player.getComponent("inventory").container;
    for (const [id, need] of Object.entries(req)) {
        let remain = need;
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        for (let i = 0; i < inv.size && remain > 0; i++) {
            const item = inv.getItem(i);
            if (!item || item.typeId !== id) continue;
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            if (item.amount > remain) {
                // @ts-ignore TS(2571): Object is of type 'unknown'.
                item.amount -= remain;
                inv.setItem(i, item);
                remain = 0;
            } else {
                // @ts-ignore TS(2571): Object is of type 'unknown'.
                remain -= item.amount;
                inv.setItem(i, undefined);
            }
        }
    }
}

function checkIngredients(player: any, required: any) {
    const inv = countInventory(player);
    const missing = [];

    for (const [id, amount] of Object.entries(required)) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const have = inv[id] ?? 0;
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        if (have < amount) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            missing.push({ id, need: amount - have });
        }
    }

    if (missing.length > 0) {
        const lines = missing.map(m => {
            return { rawtext: [{ text: '\n- ' }, { translate: langChangeItemName(m.id) }, { text: ` x ${m.need}` }] };
        });
        player.sendMessage({
            rawtext: [{ translate: "mixer.error.insufficient_materials" }, ...lines]
        });
        return false;
    }

    return true;
}

/* ===============================
   Utils
================================ */

const RECIPES_PER_PAGE = 21;
const RECIPE_SLOTS = [
    10, 11, 12, 13, 14, 15, 16,
    19, 20, 21, 22, 23, 24, 25,
    28, 29, 30, 31, 32, 33, 34
];

function fill(form: any, slots: any, itemId: any, name = " ", lore = []) {
    slots.forEach((s: any) => {
        form.setButton(s, {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            iconPath: itemIdToPath[itemId],
            name,
            lore,
            editedName: true
        });
    });
}

function getIconPath(itemId: string) {
    return (itemIdToPath as Record<string, string>)[itemId] ?? itemId;
}

function isOverblendDanger(mixer: any, recipe: any) {
    return (
        mixer.speed > recipe.needSpeed[1] + 30 ||
        mixer.oxidation >= 80 ||
        mixer.actions >= mixer.maxActions - 1
    );
}

function calcMaxActions(player: any, recipe: any) {
    const lv = new JobLevel(player, "chef").getLevel();
    return Math.max(10, recipe.baseActions + Math.min(Math.floor(lv / 5), 30 + (recipe.requiredLevel * 3)));
}

function speedVariance(player: any, recipe: any) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getGameplayRandomValue(
        -Math.max(1, 5 - Math.floor(diff / 3)),
        Math.max(1, 5 - Math.floor(diff / 3))
    );
}

function additiveSuccessRate(mixer: any, recipe: any) {
    let rate = 1;

    if (mixer.speed < recipe.needSpeed[0]) rate -= 0.15;
    if (mixer.speed > recipe.needSpeed[1]) rate -= 0.15;
    if (mixer.progress < 40) rate -= 0.2;

    rate -= mixer.usedAdditives.length * 0.1;

    return Math.max(0.1, rate);
}

const RANK_QUALITY_TABLE = {
    "KARON": 10,
    "IMPOSSIBLE": 9,
    "EXTRA": 8,
    "LEGENDARY": 7,
    "SSS": 6,
    "SS": 5,
    "S": 4,
    "A": 3,
    "B": 2,
    "C": 1,
    "D": 1,
    "E": 0,
    "F": 0,
};

/**
 *
 * @param {ItemStack} item
 * @returns
 */
function getItemQuality(item: any) {
    if (item?.getRawLore().length == 0) return 0;

    const lore = item.getRawLore() ?? [];

    for (const line of lore) {
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            if (part.with && part.with.length > 0) {
                const rank = part.with[0]
                if (rank in RANK_QUALITY_TABLE) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    return RANK_QUALITY_TABLE[rank];
                }
            }
        }
    }
    return 0;
}

/* ===============================
   Actions (ミキサー用)
================================ */
const MixerActions = [
    /* ===== 基本操作 ===== */
    {
        key: "increase_speed",
        slot: 20,
        name: "mixer.action.increase_speed",
        icon: "minecraft:feather",
        unlockLv: 1,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.speed += getGameplayRandomValue(30, 50) + ctx.speedVariance();
            mixer.progress += mixer.speed >= recipe.needSpeed[0] ? 12 : 4;
            if (mixer.speed > recipe.needSpeed[1]) {
                mixer.oxidation += 8;
            }
            mixer.phase = "mixing";
            player.stopSound('mixer.idle');
            player.stopSound('mixer.slow');
            player.stopSound('mixer.pulse');
            player.playSound('mixer.fast', player.location);
        }
    },
    {
        key: "blend",
        slot: 21,
        name: "mixer.action.blend",
        icon: "minecraft:glass_bottle",
        unlockLv: 1,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.progress += getGameplayRandomValue(10, 18);
            mixer.smoothness += 8;
            mixer.oxidation -= 5;
            player.stopSound('mixer.fast');
            player.stopSound('mixer.pulse');
            player.playSound('mixer.slow', player.location);
        }
    },
    {
        key: "add_additive",
        slot: 22,
        name: "mixer.action.add_additive",
        icon: "minecraft:honey_bottle",
        unlockLv: 2,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            if (mixer.usedAdditives.length >= recipe.maxAdditives) {
                mixer.score -= 1;
                return;
            }

            for (const s of Object.keys(recipe.additives ?? {})) {
                if (!hasUnreservedCookingIngredient(player, s, mixer.scaledIngredients)) continue;

                const inv = player.getComponent("inventory").container;
                let usedItem;

                for (let i = 0; i < inv.size; i++) {
                    const it = inv.getItem(i);
                    if (it && it.typeId === s) {
                        usedItem = it;
                        break;
                    }
                }

                const q = usedItem ? getItemQuality(usedItem) : 0;
                mixer.additiveQuality += q;
                mixer.additiveCount += 1;

                consume(player, { [s]: 1 });

                const rate = additiveSuccessRate(mixer, recipe);
                if (Math.random() <= rate) {
                    mixer.score += recipe.additives[s];
                    mixer.richness += 10;
                } else {
                    mixer.score -= recipe.additives[s];
                    mixer.speed += 15;
                    mixer.richness -= 5;
                }
                mixer.usedAdditives.push(s);
                player.playSound('mixer.additive', player.location);
                return;
            }
        }
    },

    /* ===== 拡張アクション ===== */
    {
        key: "reduce_speed",
        slot: 27,
        name: "mixer.action.reduce_speed",
        icon: "minecraft:rabbit_foot",
        unlockLv: 5,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.speed -= getGameplayRandomValue(25, 40);
            mixer.progress += 5;
            mixer.oxidation -= 10;
            player.stopSound('mixer.fast');
            player.stopSound('mixer.pulse');
            player.playSound('mixer.slow', player.location);
        }
    },
    {
        key: "vigorous_blend",
        slot: 28,
        name: "mixer.action.vigorous_blend",
        icon: "minecraft:iron_shovel",
        unlockLv: 10,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.progress += getGameplayRandomValue(15, 25);
            mixer.smoothness += 15;
            mixer.oxidation -= 8;
            mixer.speed -= 5;
            player.stopSound('mixer.fast');
            player.stopSound('mixer.pulse');
            player.playSound('mixer.slow', player.location);
        }
    },
    {
        key: "pulse",
        slot: 29,
        name: "mixer.action.pulse",
        icon: "minecraft:redstone",
        unlockLv: 15,
        cost: 2,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.progress += 20;
            mixer.smoothness += 10;
            mixer.richness += 8;
            mixer.score += 2;
            if (mixer.speed > recipe.needSpeed[1]) {
                mixer.oxidation += 3;
            }
            player.stopSound('mixer.fast');
            player.stopSound('mixer.slow');
            player.playSound('mixer.pulse', player.location);
        }
    },
    {
        key: "turbo_mix",
        slot: 30,
        name: "mixer.action.turbo_mix",
        icon: "minecraft:blaze_powder",
        unlockLv: 20,
        cost: 2,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.speed += getGameplayRandomValue(60, 100) + ctx.speedVariance();
            mixer.progress += 25;
            mixer.smoothness += 12;
            mixer.oxidation += 15;
            player.stopSound('mixer.idle');
            player.stopSound('mixer.slow');
            player.stopSound('mixer.pulse');
            player.playSound('mixer.fast', player.location);
        }
    },
    {
        key: "chill",
        slot: 31,
        name: "mixer.action.chill",
        icon: "minecraft:ice",
        unlockLv: 25,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            mixer.progress += 8;
            mixer.temperature -= 15;
            mixer.score += 3;
            player.playSound('mixer.chill', player.location);
        }
    },
    {
        key: "taste_test",
        slot: 32,
        name: "mixer.action.taste_test",
        icon: "minecraft:potion",
        unlockLv: 30,
        cost: 1,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "mixing";
            const add = Math.random() * 0.35;
            mixer.precision = Math.min(1, mixer.precision + add);
            mixer.richness += 5;
            player.playSound('mixer.taste', player.location);
        }
    },
    {
        key: "rest",
        slot: 33,
        name: "mixer.action.rest",
        icon: "minecraft:clock",
        unlockLv: 35,
        cost: 2,
        run(mixer: any, recipe: any, ctx: any, player: any) {
            mixer.phase = "resting";
            mixer.speed -= 8;
            mixer.smoothness += 5;
            mixer.temperature -= 8;
            mixer.richness += 3;
            mixer.score += 1;
            player.stopSound('mixer.fast');
            player.stopSound('mixer.pulse');
            player.stopSound('mixer.slow');
            player.playSound('mixer.idle', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player: any, page = 0, categoryId: string | undefined = undefined, searchQuery = "") {
    if (mixerSessions.has(player.id)) {
        openMixer(player);
        return;
    }

    const form = new ChestFormData("large").enableLoreLineBreaks()
        .setTitle({ rawtext: [{ translate: "mixer.title.mixer" }] });

    const lv = new JobLevel(player, "chef").getLevel();
    const recipes = MixerRecipes as Record<string, any>;
    const cleanSearchQuery = cleanRecipeSearchQuery(searchQuery);
    const searchActive = isRecipeSearchActive(cleanSearchQuery);
    const selectedCategory = resolveCookingCategoryPreference(player, "cooking:mixer", recipes, categoryId);
    const availableCategories = getAvailableRecipeCategories(recipes, selectedCategory.id);
    const recipeIds = filterCraftableRecipeIds(filterUnlockedRecipesForSearch(
        filterRecipeIds(sortRecipeIdsByLevel(Object.keys(recipes), recipes), recipes, selectedCategory.id),
        recipes,
        cleanSearchQuery,
        lv
    ), recipes, player, lv);

    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:black_stained_glass_pane"
    );

    addCraftableFilterButton(form, player, recipeIds.length);
    const totalPages = Math.max(1, Math.ceil(recipeIds.length / RECIPES_PER_PAGE));
    const safePage = Math.min(Math.max(0, page), totalPages - 1);
    const start = safePage * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const r = recipes[id];
        const slot = RECIPE_SLOTS[i];

        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: ` x${r.ingredients[key]}` }
            );
        }

        const additives = [];
        for (const key of Object.keys(r.additives ?? {})) {
            additives.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: `` }
            );
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(slot, {
            iconPath: lv >= r.requiredLevel
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                ? itemIdToPath[r.name]
                : itemIdToPath["minecraft:barrier"],
            name: lv >= r.requiredLevel
                ? recipeListName(r)
                : "mixer.locked",
            lore: lv >= r.requiredLevel
                ? [{
                    rawtext: [
                        { translate: "mixer.speed_range" },
                        { text: `: ${r.needSpeed[0]}-${r.needSpeed[1]}RPM\n§9` },
                        { translate: "mixer.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "mixer.additives" },
                        { text: ":" },
                        ...additives,
                        ...buildCookingEffectRawtext(r.result),
                    ]
                }, ...buildCookingMasteryLore(lv, r.requiredLevel)]
                : [{
                    rawtext: [
                        { translate: "mixer.unlock_level" },
                        { text: ` ${r.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    if (safePage > 0) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "mixer.page.prev",
            editedName: true
        });
    }

    if ((safePage + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "mixer.page.next",
            editedName: true
        });
    }

    if (availableCategories.length > 1) {
        const previousCategory = adjacentRecipeCategory(recipes, selectedCategory.id, -1);
        const nextCategory = adjacentRecipeCategory(recipes, selectedCategory.id, 1);

        // @ts-ignore TS(18048): Form creation follows the existing ChestFormData chain pattern.
        form.setButton(47, {
            iconPath: getIconPath(previousCategory.icon),
            name: [{ translate: "cooking.category.prev" }, { text: "\n§7" }, recipeCategoryLabel(previousCategory)],
            editedName: true
        });

        // @ts-ignore TS(18048): Form creation follows the existing ChestFormData chain pattern.
        form.setButton(51, {
            iconPath: getIconPath(nextCategory.icon),
            name: [{ translate: "cooking.category.next" }, { text: "\n§7" }, recipeCategoryLabel(nextCategory)],
            editedName: true
        });
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(48, {
        iconPath: itemIdToPath["minecraft:compass"],
        name: searchActive ? `§e検索: ${cleanSearchQuery}` : "§e検索",
        lore: [{ rawtext: [{ text: "§7ID/素材/完成品で検索" }] }],
        editedName: true
    });

    if (searchActive) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(50, {
            iconPath: itemIdToPath["minecraft:barrier"],
            name: "§c検索を解除",
            editedName: true
        });
    }

    const pageLore: any[] = [{ rawtext: [{ text: "§b" }, recipeCategoryLabel(selectedCategory)] }];
    if (searchActive) pageLore.push({ rawtext: [{ text: `§e検索: ${cleanSearchQuery}` }] });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form!.setButton(52, {
        iconPath: itemIdToPath["minecraft:hopper"],
        name: "§bジャンルで絞り込み",
        lore: pageLore,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly undefined.
    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:paper"],
        name: [{ translate: "cooking.page.current", with: [`${safePage + 1}`, `${totalPages}`] }],
        lore: pageLore,
        editedName: true
    });

    if (!craftableOnly(player) || recipeIds.includes(getLastCraftedRecipeId(player.id, "cooking:mixer") ?? "")) addLastCraftedRecipeButton(form, player.id, "cooking:mixer", recipes);

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.show(player).then(r => {
        if (r.canceled) return;

        if (r.selection === CRAFTABLE_FILTER_SLOT) {
            toggleCraftableOnly(player);
            openRecipeSelect(player, 0, selectedCategory.id, cleanSearchQuery);
            return;
        }

        if (r.selection === 46) {
            const lastRecipeId = getLastCraftedRecipeId(player.id, "cooking:mixer");
            if (lastRecipeId && (!craftableOnly(player) || recipeIds.includes(lastRecipeId)) && recipes[lastRecipeId] && lv >= recipes[lastRecipeId].requiredLevel) {
                openQuantitySelect(player, lastRecipeId);
            }
            return;
        }

        if (r.selection === 45) {
            openRecipeSelect(player, safePage - 1, selectedCategory.id, cleanSearchQuery);
            return;
        }
        if (r.selection === 53) {
            openRecipeSelect(player, safePage + 1, selectedCategory.id, cleanSearchQuery);
            return;
        }
        if (r.selection === 47) {
            openRecipeSelect(player, 0, adjacentRecipeCategory(recipes, selectedCategory.id, -1).id, cleanSearchQuery);
            return;
        }
        if (r.selection === 51) {
            openRecipeSelect(player, 0, adjacentRecipeCategory(recipes, selectedCategory.id, 1).id, cleanSearchQuery);
            return;
        }
        if (r.selection === 52) {
            openCookingRecipeCategory(player, recipes, selectedCategory.id, next => openRecipeSelect(player, 0, next, cleanSearchQuery));
            return;
        }

        if (r.selection === 48) {
            openRecipeSearch(player, selectedCategory.id, cleanSearchQuery);
            return;
        }
        if (r.selection === 50 && searchActive) {
            openRecipeSelect(player, 0, selectedCategory.id);
            return;
        }

        const index = RECIPE_SLOTS.indexOf(r.selection);
        if (index === -1) return;

        const recipeId = pageRecipes[index];
        if (!recipeId) return;

        const recipe = recipes[recipeId];
        if (!recipe || lv < recipe.requiredLevel) {
            openRecipeSelect(player, safePage, selectedCategory.id, cleanSearchQuery);
            return;
        }

        openQuantitySelect(player, recipeId);
    });
}

function openRecipeSearch(player: any, categoryId: string, searchQuery = "") {
    const form = new ModalFormData()
        .title({ text: "レシピ検索" })
        .textField({ text: "検索語句" }, { text: "ID・素材・完成品" }, { defaultValue: searchQuery });

    form.show(player).then(r => {
        if (r.canceled) return;
        openRecipeSelect(player, 0, categoryId, String(r.formValues?.[0] ?? ""));
    });
}

function openQuantitySelect(player: any, recipeId: any) {
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = MixerRecipes[recipeId];
    const result = resolveRecipeResult(recipe.result).id;
    const form = new ModalFormData()
        .title({ translate: 'mixer.title.amount' })
        .slider({ translate: 'mixer.status.amount' }, 1, new ItemStack(result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        startMixing(player, recipeId, r.formValues[0]);
    });
}

function calcAverageMaterialQuality(player: any, req: any) {
    const inv = player.getComponent("inventory").container;

    let totalQ = 0;
    let totalCount = 0;

    for (const [id, need] of Object.entries(req)) {
        let remain = need;

        // @ts-ignore TS(2571): Object is of type 'unknown'.
        for (let i = 0; i < inv.size && remain > 0; i++) {
            const it = inv.getItem(i);
            if (!it || it.typeId !== id) continue;

            // @ts-ignore TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
            const take = Math.min(it.amount, remain);
            const q = getItemQuality(it);

            totalQ += q * take;
            totalCount += take;
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            remain -= take;
        }
    }

    return totalCount === 0 ? 0 : Math.floor(totalQ / totalCount);
}

function startMixing(player: any, recipeId: any, quantity: any) {
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = MixerRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    cancelArtisanCraft(mixerSessions.get(player.id));
    mixerSessions.set(player.id, initializeComplexCookingMinigame({
        recipeId,
        cookware: captureCookingEquipment(player, "mixer"),
        quantity,
        scaledIngredients,
        speed: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "raw",
        oxidation: 0,
        smoothness: 0,
        richness: 0,
        temperature: 20,
        usedAdditives: [],
        precision: Math.random(),
        materialQuality,
        additiveQuality: 0,
        additiveCount: 0,

        ctx: { speedVariance: () => speedVariance(player, recipe) }
    }));

    openMixer(player);
}

function openMixer(player: any) {
    const mixer = mixerSessions.get(player.id);
    if (!ensureComplexCookingRoute(player, "mixer", mixer, MixerActions, openMixer)) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = MixerRecipes[mixer.recipeId];
    const lv = new JobLevel(player, "chef").getLevel();
    const predictedRank = capCookingRankByRecipe(
        player,
        calcRank({ ...mixer, score: mixer.score + getComplexCookingAdjustment(player, "mixer", mixer) }, recipe),
        recipe.requiredLevel,
    ).rank;

    const form = new ChestFormData("large").enableLoreLineBreaks().setTitle({ rawtext: recipeTitleParts(recipe) });

    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i),
        "minecraft:black_stained_glass_pane"
    );
    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i + 45),
        "minecraft:black_stained_glass_pane"
    );
    addComplexCookingMinigameUi(form, player, "mixer", mixer);

    const overblendDanger = isOverblendDanger(mixer, recipe);
    if (overblendDanger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:orange_stained_glass_pane",
            "mixer.overblend.warning.title",
            // @ts-ignore TS(2322): Type 'string' is not assignable to type 'never'.
            [{ translate: 'mixer.overblend.warning.lore' }]
        );
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "mixer.status.title",
        lore: [
            { rawtext: [{ text: '§9' }, { translate: "mixer.status.phase" }, { text: `: ${mixer.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "mixer.status.speed" }, { text: `: ${mixer.speed}RPM(${Math.floor((recipe.needSpeed[0] + recipe.needSpeed[1]) / 2)}RPM)\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "mixer.status.progress" }, { text: `: ${mixer.progress}%\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "mixer.status.oxidation" }, { text: `: ${Math.max(0, mixer.oxidation)}%\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "mixer.status.smoothness" }, { text: `: ${Math.max(0, mixer.smoothness)}%\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "mixer.status.richness" }, { text: `: ${Math.max(0, mixer.richness)}\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "mixer.status.actions" }, { text: `: ${mixer.actions}/${mixer.maxActions}\n` }] },
            { rawtext: [{ text: '§f' }, { translate: "mixer.status.amount" }, { text: `: ${mixer.quantity}\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "mixer.lore.quality", with: [predictedRank] }] },
            ...buildCookingMasteryLore(lv, recipe.requiredLevel),
        ],
        editedName: true
    });

    for (const action of MixerActions) {
        if (lv < action.unlockLv) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "mixer.locked",
                lore: [{ rawtext: [{ translate: "mixer.unlock_level" }, { text: `${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            form.setButton(action.slot, {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                iconPath: itemIdToPath[action.icon],
                name: action.name,
                lore: [{ rawtext: [{ text: '§7' }, { translate: "mixer.action.cost" }, { text: `: ${action.cost}` }] }],
                editedName: true
            });
        }
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(49, {
        iconPath: itemIdToPath[canCompleteComplexCooking(mixer) ? "minecraft:lime_dye" : "minecraft:barrier"],
        name: canCompleteComplexCooking(mixer) ? "mixer.button.complete" : "cooking.minigame.finish.locked",
        lore: [
            ...buildCookingMasteryLore(lv, recipe.requiredLevel),
            ...getComplexCookingCompletionLore(mixer),
        ],
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.show(player).then(r => {
        if (r.canceled || r.selection === undefined) return;
        handleAction(player, r.selection);
    });
}

/* ===============================
   Logic
================================ */
function handleAction(player: any, slot: any) {
    const mixer = mixerSessions.get(player.id);
    if (!mixer) return;
    if (mixer.artisanFinish) { finish(player); return; }
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = MixerRecipes[mixer.recipeId];

    if (slot === 49 && mixer.phase != 'raw' && canCompleteComplexCooking(mixer)) {
        finish(player);
        return;
    }
    if (slot === 49) {
        player.onScreenDisplay.setActionBar(getComplexCookingCompletionMessage(mixer));
        openMixer(player);
        return;
    }

    const action = MixerActions.find(a => a.slot === slot);
    if (!action) {
        openMixer(player);
        return;
    }

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        openMixer(player);
        return;
    }
    if (mixer.actions + action.cost > mixer.maxActions) {
        mixer.phase = "overblended";
        finish(player);
        return;
    }
    if (
        action.key === "add_additive"
        && mixer.usedAdditives.length < recipe.maxAdditives
        && !hasAnyUnreservedCookingIngredient(player, Object.keys(recipe.additives ?? {}), mixer.scaledIngredients)
    ) {
        player.onScreenDisplay.setActionBar({ rawtext: [{ translate: "cooking.error.optional_requires_surplus" }] });
        openMixer(player);
        return;
    }

    const hadTrouble = beginComplexCookingAction("mixer", mixer, action.key);
    action.run(mixer, recipe, mixer.ctx, player);
    mixer.actions += action.cost;
    mixer.speed = Math.floor(mixer.speed * 100) / 100;
    mixer.progress = Math.floor(mixer.progress * 100) / 100;
    mixer.oxidation = Math.max(0, Math.floor(mixer.oxidation * 100) / 100);
    mixer.smoothness = Math.max(0, Math.floor(mixer.smoothness * 100) / 100);
    mixer.richness = Math.max(0, Math.floor(mixer.richness * 100) / 100);
    mixer.temperature = Math.max(0, Math.floor(mixer.temperature * 100) / 100);
    endComplexCookingAction(player, "mixer", mixer, MixerActions, hadTrouble);

    openMixer(player);
}

function calcSpeedScore(speed: any, needSpeed: any, maxScore = 5) {
    const min = needSpeed[0];
    const max = needSpeed[1];

    if (speed < min || speed > max) return 0;

    const mid = Math.floor((min + max) / 2);
    const distance = Math.abs(speed - mid);
    const score = maxScore - Math.floor(distance / 15);

    return Math.max(0, score);
}

function calcEfficiencyBonus(mixer: any, recipe: any) {
    const speedScore = calcSpeedScore(mixer.speed, recipe.needSpeed, 12);

    if (speedScore < 10) return 0;

    const used = mixer.actions;
    const max = mixer.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(mixer: any, recipe: any) {
    let score = mixer.score;

    score += Math.min(5, Math.floor(mixer.progress / 25));
    score += calcSpeedScore(mixer.speed, recipe.needSpeed, 12);
    score += Math.floor((100 - Math.max(0, mixer.oxidation)) / 10);
    score += Math.min(5, Math.floor(mixer.smoothness / 20));
    score += Math.min(5, Math.floor(mixer.richness / 15));
    score += Math.min(3, Math.floor((30 - Math.abs(mixer.temperature - 10)) / 10));
    score += calcEfficiencyBonus(mixer, recipe);
    score += Math.min(3, Math.floor(mixer.precision * 3));
    score += mixer.materialQuality * 1.5;

    if (mixer.additiveCount > 0) {
        score += Math.floor(
            mixer.additiveQuality / mixer.additiveCount
        );
    }

    if (mixer.phase === "overblended") {
        return { rank: "F", mul: 0.4 };
    }

    if (score >= 75) return { rank: "KARON", mul: 10 };
    if (score >= 60) return { rank: "IMPOSSIBLE", mul: 5 };
    if (score >= 55) return { rank: "EXTRA", mul: 3 };
    if (score >= 44) return { rank: "LEGENDARY", mul: 2.0 };
    if (score >= 41) return { rank: "SSS", mul: 1.8 };
    if (score >= 38) return { rank: "SS", mul: 1.7 };
    if (score >= 35) return { rank: "S", mul: 1.6 };
    if (score >= 32) return { rank: "A", mul: 1.5 };
    if (score >= 29) return { rank: "B", mul: 1.4 };
    if (score >= 26) return { rank: "C", mul: 1.3 };
    if (score >= 13) return { rank: "D", mul: 1.2 };
    if (score >= 10) return { rank: "E", mul: 1.0 };
    return { rank: "F", mul: 0.4 };
}

/* ===============================
   Finish
================================ */
/**
 *
 * @param {Player} player
 * @returns
 */
function finish(player: any) {
    const mixer = mixerSessions.get(player.id);
    if (!mixer || mixer.artisanCraftStarted) return;
    if (!requireCookingEquipment(player, mixer?.cookware)) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = MixerRecipes[mixer.recipeId];

    if (!checkIngredients(player, mixer.scaledIngredients)) {
        cancelArtisanCraft(mixer);
        mixerSessions.delete(player.id);
        return;
    }

    const { minigameResult, rank, mul, itemId, totalCount } = mixer.artisanFinish ??= (() => {
        const minigameResult = getComplexCookingResultInfo(player, "mixer", mixer);
        const finalResult = calcRank({
            ...mixer,
            score: mixer.score + getComplexCookingAdjustment(player, "mixer", mixer),
        }, recipe);
        const { rank, mul } = capCookingRankByRecipe(player, finalResult, recipe.requiredLevel);

        const resolved = resolveRecipeResult(recipe.result);
        const isFailure = rank === "F" && mixer.phase === "overblended";
        const itemId = isFailure ? "minecraft:brown_dye" : resolved.id;
        const totalCount = isFailure ? mixer.quantity : mixer.quantity * resolved.count;
        return { minigameResult, rank, mul, itemId, totalCount };
    })();
    if (!runArtisanCraft(player, mixer, () => {
        if (!jobs_config.validity || !player.hasTag('mcjobs_chef')) return undefined;
        const job = new JobLevel(player, "chef");
        const level = job.getLevel();

        const baseMoney = recipe.baseMoney * mul;
        const random = getRandomInteger(
            jobs_config.chefReward.min,
            jobs_config.chefReward.max
        );

        const reward =
            Math.floor(
                baseMoney *
                100 *
                random *
                job.getReward(level) *
                buff.getMultiplier("chef") *
                5
            ) / 100;
        const xpReward = recipe.baseXp * mul * Math.min(mixer.quantity, 25);
        return { job: "chef", money: reward, xp: xpReward, rank, display: "mixer" };
    }, () => {
        consume(player, mixer.scaledIngredients);
        rememberLastCraftedRecipe(player.id, "cooking:mixer", mixer.recipeId);

        const inv = player.getComponent("inventory").container;

        for (const item of createResultStacks(itemId, totalCount)) {
            item.setLore([
                { rawtext: [{ text: '§r§a==============' }] },
                { rawtext: [{ text: '§r§e' }, { translate: "mixer.lore.quality", with: [`${rank}`] }] },
                { rawtext: [{ text: '§r§6' }, { translate: "cooking.minigame.result.level_technique", with: [`${minigameResult.levelTechnique}`] }] },
                { rawtext: [{ text: '§r§d' }, { translate: "cooking.minigame.result.route_bonus", with: [`${minigameResult.routeBonus}`] }] },
                { rawtext: [{ text: '§r§a==============' }] },
            ]);

            const leftover = inv.addItem(item);
            if (leftover) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }

        mixerSessions.delete(player.id);
    })) return;

    player.stopSound('mixer.idle');
    player.stopSound('mixer.fast');
    player.stopSound('mixer.slow');
    player.stopSound('mixer.pulse');
    player.playSound('mixer.complete', player.location);

}
