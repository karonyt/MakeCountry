import { resolveArtisanFilterPreference } from "@/shared/ui/artisan-filter-preferences.js";
import { artisanFilterLabel, filterArtisanRecipeIds, type ArtisanRecipeFilter } from "@/domain/recipes/artisan-filter.js";
import { addCraftableFilterButton, craftableOnly, toggleCraftableOnly, filterCraftableRecipeIds, CRAFTABLE_FILTER_SLOT } from "@/shared/ui/craftable-filter.js";
import { openArtisanRecipeFilter } from "@/shared/ui/artisan-recipe-filter.js";
import { cancelArtisanCraft, runArtisanCraft } from "@/domain/jobs/pending-artisan-rewards.js";
import { recipeListName, recipeTitleParts } from "@/domain/recipes/recipe-display.js";
import { CraftingModalFormData as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { FurnaceRecipes } from "@/content/smelting/furnace-recipe.js";
import { itemIdToPath } from "@/config/textures.js";
import jobs_config from "@/config/jobs.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { getRandomInteger, langChangeItemName } from "@/shared/utils/minecraft.js";
import { getGameplayRandomValue } from "@/shared/utils/gameplay-random.js";
import { createResultStacks, resolveRecipeResult } from "@/domain/recipes/recipe-result.js";
import { buildSmithingEffectRawtext } from "@/domain/recipes/recipe-effect-lore.js";
import { addLastCraftedRecipeButton, getLastCraftedRecipeId, rememberLastCraftedRecipe } from "@/shared/ui/last-crafted-recipe.js";
import {
    cleanRecipeSearchQuery,
    filterUnlockedRecipesForSearch,
    isRecipeSearchActive,
    sortRecipeIdsByLevel,
} from "@/domain/recipes/recipe-list.js";

import { getForgedTraitTranslationKey } from "@/domain/smelting/forged-trait-data.js";
import { getArtisanQuality, isArtisanRankAtLeast } from "@/domain/professions/artisan-quality.js";
import { reportJobAchievement } from "@/shared/integration/standalone.js";
import {
    capRankByRecipeMastery,
    getRecipeMasteryProfile,
} from "@/domain/professions/recipe-mastery.js";
import {
    type ForgeStrike,
    applyForgeTechnique,
    canPerfectQuench,
    createStrikePattern,
    FORGE_REFINEMENT,
    getForgeActionBudget,
    getForgeRefinementCap,
    getForgeCoolingRange,
    getControlledCoolingAmount,
    getForgeHeatScale,
    getForgeTechnique,
    getPatternIndexAfterMiss,
    getSmithingOutcomeRank,
    getSmithingScoredRank,
    getSmithingRankMultiplier,
    getUnreservedConsumableCount,
    isCatastrophicQuench,
    judgeQuench,
    resolveStrike,
} from "@/domain/smelting/forge-guidance.js";
import { getSmithingQuantityLimit } from "@/domain/smelting/smithing-batch.js";

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
const furnaceSessions = new Map();

/* ===============================
   Inventory Utils
================================ */
function countInventory(player: any): Record<string, number> {
    const inv = player.getComponent("inventory").container;
    const counts: Record<string, number> = {};
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
            rawtext: [{ translate: "smelting.error.insufficient_materials" }, ...lines]
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

function calcMaxActions(player: any, recipe: any) {
    const lv = new JobLevel(player, "blacksmith").getLevel();
    // Reserve space for forming the item and the irreversible final quench.
    return getForgeActionBudget(recipe.baseActions, recipe.requiredLevel, lv);
}

function temperatureVariance(player: any, recipe: any) {
    const lv = new JobLevel(player, "blacksmith").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getGameplayRandomValue(
        -Math.max(1, 10 - Math.floor(diff / 3)),
        Math.max(1, 10 - Math.floor(diff / 3))
    );
}

function additiveSuccessRate(furnace: any, recipe: any) {
    let rate = 1;

    if (furnace.temperature < recipe.needTemperature[0]) rate -= 0.15;
    if (furnace.temperature > recipe.needTemperature[1]) rate -= 0.15;
    if (furnace.progress < 40) rate -= 0.2;

    rate -= furnace.usedAdditives.length * 0.1; // 使うほど成功率低下

    return Math.max(0.1, rate);
}

function getItemQuality(item: any) {
    return getArtisanQuality(item);
}

/* ===============================
   Actions (溶鉱炉用)
================================ */
const FurnaceActions = [
    /* ===== 基本操作 ===== */
    {
        key: "add_fuel",
        slot: 20,
        name: "smelting.action.add_fuel",
        icon: "minecraft:coal",
        unlockLv: 1,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            const heatScale = getForgeHeatScale(recipe);
            furnace.temperature += getGameplayRandomValue(80, 120) * heatScale + ctx.temperatureVariance();
            furnace.progress += furnace.temperature >= recipe.needTemperature[0] ? 15 : 5;
            player.stopSound('smelting.idle');
            player.stopSound('smelting.bellows');
            player.stopSound('smelting.pour');
            player.stopSound('smelting.cooling');
            player.stopSound('smelting.hammer');
            player.playSound('smelting.fire', player.location);
        }
    },
    {
        key: "stir",
        slot: 21,
        name: "smelting.action.stir",
        icon: "minecraft:iron_shovel",
        unlockLv: 1,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            furnace.progress += getGameplayRandomValue(8, 15);
            furnace.impurity -= 5;
            player.stopSound('smelting.hammer');
            player.playSound('smelting.stir', player.location);
        }
    },
    {
        key: "add_flux",
        slot: 22,
        name: "smelting.action.add_flux",
        icon: "minecraft:redstone",
        unlockLv: 2,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            if (furnace.usedAdditives.length >= recipe.maxAdditives) {
                furnace.score -= 1;
                return;
            }

            for (const a of Object.keys(recipe.additives ?? {})) {
                if (!hasUnreservedItem(player, a, furnace)) continue;

                const inv = player.getComponent("inventory").container;
                let usedItem;

                for (let i = 0; i < inv.size; i++) {
                    const it = inv.getItem(i);
                    if (it && it.typeId === a) {
                        usedItem = it;
                        break;
                    }
                }

                const q = usedItem ? getItemQuality(usedItem) : 0;
                furnace.additiveQuality += q;
                furnace.additiveCount += 1;

                consume(player, { [a]: 1 });

                const rate = additiveSuccessRate(furnace, recipe);
                if (Math.random() <= rate) {
                    furnace.score += recipe.additives[a];
                } else {
                    furnace.score -= recipe.additives[a] * 2;
                    furnace.temperature += 5 * getForgeHeatScale(recipe);
                    furnace.impurity += 15;
                }
                furnace.usedAdditives.push(a);
                player.stopSound('smelting.hammer');
                player.playSound('smelting.flux', player.location);
                return;
            }
        }
    },

    /* ===== 拡張アクション ===== */
    {
        key: "bellows",
        slot: 27,
        name: "smelting.action.bellows",
        icon: "minecraft:leather",
        unlockLv: 5,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            const heatScale = getForgeHeatScale(recipe);
            furnace.temperature += getGameplayRandomValue(40, 60) * heatScale + ctx.temperatureVariance();
            furnace.progress += 8;
            player.stopSound('smelting.idle');
            player.stopSound('smelting.fire');
            player.stopSound('smelting.pour');
            player.stopSound('smelting.hammer');
            player.stopSound('smelting.cooling');
            player.playSound('smelting.bellows', player.location);
        }
    },
    {
        key: "water_cool",
        slot: 28,
        name: "smelting.action.water_cool",
        icon: "minecraft:water_bucket",
        unlockLv: 1,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            furnace.temperature -= getGameplayRandomValue(60, 100);
            furnace.progress += 3;
            player.playSound('smelting.cooling', player.location);
            player.stopSound('smelting.idle');
            player.stopSound('smelting.fire');
            player.stopSound('smelting.hammer');
            player.stopSound('smelting.bellows');
        }
    },
    {
        key: "skim_slag",
        slot: 29,
        name: "smelting.action.skim_slag",
        icon: "minecraft:bowl",
        unlockLv: 15,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {

            const success = Math.random() < 0.80;

            if (success) {
                furnace.impurity -= getGameplayRandomValue(5, 15);
                furnace.progress -= 3;
                furnace.refinement = (furnace.refinement ?? 0) + FORGE_REFINEMENT.skimSuccess;
            } else {
                furnace.impurity += 10;
                furnace.refinement = (furnace.refinement ?? 0) + FORGE_REFINEMENT.skimFailure;
                furnace.temperature -= 20;
            }

            player.stopSound('smelting.hammer');
            player.playSound('smelting.skim', player.location);
        }
    },
    {
        key: "intense_heat",
        slot: 30,
        name: "smelting.action.intense_heat",
        icon: "minecraft:blaze_rod",
        unlockLv: 20,
        cost: 2,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            const heatScale = getForgeHeatScale(recipe);
            furnace.temperature += getGameplayRandomValue(150, 250) * heatScale + ctx.temperatureVariance();
            furnace.progress += 20;
            player.stopSound('smelting.idle');
            player.stopSound('smelting.bellows');
            player.stopSound('smelting.pour');
            player.stopSound('smelting.hammer');
            player.stopSound('smelting.cooling');
            player.playSound('smelting.fire', player.location);
        }
    },
    {
        key: "forge_hammer",
        slot: 31,
        name: "smelting.action.forge_hammer",
        icon: "minecraft:iron_pickaxe",
        unlockLv: 25,
        cost: 2,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            furnace.progress += 25;
            furnace.impurity -= 10;
            furnace.temperature += 20;
            player.stopSound('smelting.idle');
            player.stopSound('smelting.fire');
            player.stopSound('smelting.bellows');
            player.stopSound('smelting.pour');
            player.stopSound('smelting.cooling');
            player.playSound('smelting.hammer', player.location);
        }
    },
    {
        key: "controlled_cool",
        slot: 32,
        name: "smelting.action.controlled_cool",
        icon: "minecraft:packed_ice",
        unlockLv: 30,
        cost: 2,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            const [minimumCooling, maximumCooling] = getForgeCoolingRange(recipe);
            furnace.temperature -= getControlledCoolingAmount(furnace.temperature, recipe, getGameplayRandomValue(minimumCooling, maximumCooling));
            furnace.impurity -= 8;
            furnace.refinement = (furnace.refinement ?? 0) + FORGE_REFINEMENT.controlledCool;
            player.stopSound('smelting.fire');
            player.stopSound('smelting.bellows');
            player.stopSound('smelting.pour');
            player.stopSound('smelting.hammer');
            player.stopSound('smelting.cooling');
            player.playSound('smelting.idle', player.location);
        }
    },
    {
        key: "quality_check",
        slot: 33,
        name: "smelting.action.quality_check",
        icon: "minecraft:iron_nugget",
        unlockLv: 35,
        cost: 1,
        run(furnace: any, recipe: any, ctx: any, player: any) {
            const add = Math.random() * 0.3;
            if (
                furnace.temperature >= recipe.needTemperature[0] &&
                furnace.temperature <= recipe.needTemperature[1]
            ) {
                furnace.precision += add;
            }
            player.playSound('smelting.check', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player: any, page = 0, searchQuery = "", filter: ArtisanRecipeFilter | undefined = undefined) {
    // Closing the forge pauses it instead of trapping the player in a form loop.
    // Interacting with the furnace again resumes the same paid-additive session.
    if (furnaceSessions.has(player.id)) {
        openFurnace(player);
        return;
    }

    const form = new ChestFormData("large").enableLoreLineBreaks()
        .setTitle({ rawtext: [{ translate: "smelting.title.furnace" }] });

    const lv = new JobLevel(player, "blacksmith").getLevel();
    const cleanSearchQuery = cleanRecipeSearchQuery(searchQuery);
    const searchActive = isRecipeSearchActive(cleanSearchQuery);
    const recipes = FurnaceRecipes as Record<string, any>;
    const selectedFilter = resolveArtisanFilterPreference(player, true, filter);
    const recipeIds = filterCraftableRecipeIds(filterUnlockedRecipesForSearch(
        filterArtisanRecipeIds(sortRecipeIdsByLevel(Object.keys(recipes), recipes), recipes, selectedFilter, true),
        recipes,
        cleanSearchQuery,
        lv
    ), recipes, player, lv);

    // ==== 枠装飾 ====
    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:black_stained_glass_pane"
    );

    // ==== ページ計算 ====
    addCraftableFilterButton(form, player, recipeIds.length);
    const totalPages = Math.max(1, Math.ceil(recipeIds.length / RECIPES_PER_PAGE));
    const safePage = Math.min(Math.max(0, page), totalPages - 1);
    const start = safePage * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const r = recipes[id];
        const slot = RECIPE_SLOTS[i];
        const mastery = getRecipeMasteryProfile(lv, r.requiredLevel);

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
                : "smelting.locked",
            lore: lv >= r.requiredLevel
                ? [{
                    rawtext: [
                        { translate: "smelting.temperature_range" },
                        { text: `: ${r.needTemperature[0]}-${r.needTemperature[1]}℃\n§9` },
                        { translate: "smelting.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "smelting.additives" },
                        { text: ":" },
                        ...additives,
                        ...buildSmithingEffectRawtext(r.result),
                    ]
                }, {
                    rawtext: [
                        { text: "§6" },
                        { translate: "artisan.mastery.cap", with: [mastery.maxRank] },
                    ]
                }, ...(mastery.nextRank && mastery.levelsToNext !== undefined
                    ? [{
                        rawtext: [
                            { text: "§7" },
                            { translate: "artisan.mastery.next", with: [mastery.nextRank, String(mastery.levelsToNext)] },
                        ]
                    }]
                    : [{ rawtext: [{ text: "§e" }, { translate: "artisan.mastery.maxed" }] }])]
                : [{
                    rawtext: [
                        { translate: "smelting.unlock_level" },
                        { text: ` ${r.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    // ==== ページ操作 ====
    if (safePage > 0) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "smelting.page.prev",
            editedName: true
        });
    }

    if ((safePage + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "smelting.page.next",
            editedName: true
        });
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(47, {
        iconPath: itemIdToPath["minecraft:compass"],
        name: searchActive ? `§e検索: ${cleanSearchQuery}` : "§e検索",
        lore: [{ rawtext: [{ text: "§7ID/素材/完成品で検索" }] }],
        editedName: true
    });

    if (searchActive) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(51, {
            iconPath: itemIdToPath["minecraft:barrier"],
            name: "§c検索を解除",
            editedName: true
        });
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:paper"],
        name: `§ePage ${safePage + 1}/${totalPages}`,
        lore: [{ rawtext: [{ text: `§b${artisanFilterLabel(selectedFilter, true)}\n§7${recipeIds.length}件` }] }],
        editedName: true
    });

    form!.setButton(48, {
        iconPath: itemIdToPath["minecraft:hopper"],
        name: "§bジャンルで絞り込み",
        lore: [{ rawtext: [{ text: "§7" + artisanFilterLabel(selectedFilter, true) }] }],
        editedName: true
    });

    if (!craftableOnly(player) || recipeIds.includes(getLastCraftedRecipeId(player.id, "blacksmith") ?? "")) addLastCraftedRecipeButton(form, player.id, "blacksmith", recipes);

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.show(player).then(r => {
        if (r.canceled) return;

        if (r.selection === CRAFTABLE_FILTER_SLOT) {
            toggleCraftableOnly(player);
            openRecipeSelect(player, 0, cleanSearchQuery, selectedFilter);
            return;
        }

        if (r.selection === 46) {
            const lastRecipeId = getLastCraftedRecipeId(player.id, "blacksmith");
            if (lastRecipeId && (!craftableOnly(player) || recipeIds.includes(lastRecipeId)) && recipes[lastRecipeId] && lv >= recipes[lastRecipeId].requiredLevel) {
                openQuantitySelect(player, lastRecipeId);
            }
            return;
        }

        if (r.selection === 45) {
            openRecipeSelect(player, safePage - 1, cleanSearchQuery, selectedFilter);
            return;
        }
        if (r.selection === 53) {
            openRecipeSelect(player, safePage + 1, cleanSearchQuery, selectedFilter);
            return;
        }
        if (r.selection === 48) {
            openArtisanRecipeFilter(player, selectedFilter, true, next => openRecipeSelect(player, 0, cleanSearchQuery, next));
            return;
        }
        if (r.selection === 47) {
            openRecipeSearch(player, cleanSearchQuery, selectedFilter);
            return;
        }
        if (r.selection === 51 && searchActive) {
            openRecipeSelect(player, 0, "", selectedFilter);
            return;
        }

        const index = RECIPE_SLOTS.indexOf(r.selection);
        if (index === -1) return;

        const recipeId = pageRecipes[index];
        if (!recipeId) return;

        const recipe = recipes[recipeId];
        if (!recipe || lv < recipe.requiredLevel) {
            openRecipeSelect(player, safePage, cleanSearchQuery, selectedFilter);
            return;
        }

        openQuantitySelect(player, recipeId);
    });
}

function openRecipeSearch(player: any, searchQuery = "", filter: ArtisanRecipeFilter = {}) {
    const form = new ModalFormData()
        .title({ text: "レシピ検索" })
        .textField({ text: "検索語句" }, { text: "ID・素材・完成品" }, { defaultValue: searchQuery });

    form.show(player).then(r => {
        if (r.canceled) return;
        openRecipeSelect(player, 0, String(r.formValues?.[0] ?? ""), filter);
    });
}

function openQuantitySelect(player: any, recipeId: any) {
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = FurnaceRecipes[recipeId];
    const result = resolveRecipeResult(recipe.result).id;
    const quantityLimit = getSmithingQuantityLimit(new ItemStack(result).maxAmount);
    const form = new ModalFormData()
        .title({ translate: 'smelting.title.amount' })
        .slider({ translate: 'smelting.status.amount' }, 1, quantityLimit, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        startSmelting(player, recipeId, r.formValues[0]);
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

function startSmelting(player: any, recipeId: any, quantity: any) {
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = FurnaceRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);
    const craftLevel = new JobLevel(player, "blacksmith").getLevel();
    const technique = getForgeTechnique(craftLevel);

    cancelArtisanCraft(furnaceSessions.get(player.id));
    furnaceSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        temperature: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        refinement: 0,
        phase: "heating",
        impurity: 100,
        usedAdditives: [],
        precision: Math.random(),
        materialQuality,
        additiveQuality: 0,
        additiveCount: 0,
        lastFeedback: undefined,
        strikePattern: createStrikePattern(Math.random, technique.maxPatternLength),
        patternIndex: 0,
        completedPatterns: 0,
        forgeCombo: 0,
        stress: 0,
        shapeQuality: 0,
        craftLevel,
        techniqueBonus: technique.techniqueBonus,
        karonRoll: Math.random(),
        quenchResult: undefined,

        ctx: { temperatureVariance: () => temperatureVariance(player, recipe) }
    });

    openFurnace(player);
}

const StrikeActions = [
    {
        key: "light_strike" as ForgeStrike,
        slot: 23,
        name: "smelting.strike.light",
        icon: "minecraft:iron_nugget",
        progress: "+6%",
        temperature: "-4℃",
        stress: "+1",
    },
    {
        key: "heavy_strike" as ForgeStrike,
        slot: 24,
        name: "smelting.strike.heavy",
        icon: "minecraft:anvil",
        progress: "+12%",
        temperature: "-12℃",
        stress: "+6",
    },
    {
        key: "fold_metal" as ForgeStrike,
        slot: 25,
        name: "smelting.strike.fold",
        icon: "minecraft:paper",
        progress: "+5%",
        temperature: "-8℃",
        stress: "-4",
    },
];

function signed(value: number, suffix = "") {
    const rounded = Math.round(value * 100) / 100;
    return (rounded > 0 ? "+" : "") + rounded + suffix;
}

function texturePath(itemId: string) {
    return itemIdToPath[itemId as keyof typeof itemIdToPath];
}

function hasUnreservedItem(player: any, itemId: string, furnace: any) {
    const counts = countInventory(player);
    return getUnreservedConsumableCount(
        counts[itemId] ?? 0,
        furnace.scaledIngredients?.[itemId] ?? 0,
    ) >= 1;
}

function getUsableAdditiveId(player: any, recipe: any, furnace: any) {
    return Object.keys(recipe.additives ?? {}).find((id) => hasUnreservedItem(player, id, furnace));
}

function getActionUnavailableKey(action: any, furnace: any, recipe: any, player: any) {
    const remaining = furnace.maxActions - furnace.actions;
    if (action.key === "water_cool") {
        if (furnace.phase === "quenched") return "smelting.ui.unavailable.already_quenched";
        return undefined;
    }
    if (furnace.phase === "quenched") return "smelting.ui.unavailable.after_quench";
    if (action.cost >= remaining) return "smelting.ui.unavailable.reserve_quench";
    if (action.key === "add_flux") {
        if (furnace.usedAdditives.length >= recipe.maxAdditives) {
            return "smelting.ui.unavailable.additive_limit";
        }
        if (!getUsableAdditiveId(player, recipe, furnace)) {
            return "smelting.ui.unavailable.additive_missing";
        }
    }
    return undefined;
}

function buildActionLore(action: any, furnace: any, recipe: any, player: any) {
    const heatScale = getForgeHeatScale(recipe);
    const lines: any[] = [
        { rawtext: [{ text: "§7" }, { translate: "smelting.action.cost" }, { text: ": " + action.cost }] },
    ];
    const effectLine = (translationKey: string, value: string, color = "§7") => {
        lines.push({ rawtext: [{ text: color }, { translate: translationKey }, { text: ": " + value }] });
    };

    switch (action.key) {
        case "add_fuel":
            effectLine("smelting.status.temperature", `+${80 * heatScale}〜${120 * heatScale}℃`, "§c");
            effectLine("smelting.status.progress", "+5 / +15%", "§a");
            break;
        case "stir":
            effectLine("smelting.status.progress", "+8〜15%", "§a");
            effectLine("smelting.status.impurity", "-5%", "§6");
            break;
        case "add_flux": {
            const additive = getUsableAdditiveId(player, recipe, furnace);
            const value = additive ? recipe.additives[additive] : 0;
            effectLine("smelting.ui.score", "+" + value + " / -" + (value * 2), "§d");
            lines.push({ rawtext: [
                { text: "§b" },
                { translate: "smelting.ui.success_rate" },
                { text: ": " + Math.round(additiveSuccessRate(furnace, recipe) * 100) + "%" },
            ] });
            break;
        }
        case "bellows":
            effectLine("smelting.status.temperature", `+${40 * heatScale}〜${60 * heatScale}℃`, "§c");
            effectLine("smelting.status.progress", "+8%", "§a");
            break;
        case "water_cool":
            lines.push({ rawtext: [{ text: "§b" }, { translate: "smelting.ui.quench.irreversible" }] });
            break;
        case "skim_slag":
            effectLine("smelting.status.impurity", "80%: -5〜15% / 20%: +10%", "§6");
            effectLine("smelting.ui.score", "80%: +" + FORGE_REFINEMENT.skimSuccess + " / 20%: " + FORGE_REFINEMENT.skimFailure, "§d");
            break;
        case "intense_heat":
            effectLine("smelting.status.temperature", `+${150 * heatScale}〜${250 * heatScale}℃`, "§c");
            effectLine("smelting.status.progress", "+20%", "§a");
            break;
        case "forge_hammer":
            effectLine("smelting.status.temperature", "+20℃", "§c");
            effectLine("smelting.status.progress", "+25%", "§a");
            effectLine("smelting.status.impurity", "-10%", "§6");
            break;
        case "controlled_cool": {
            const [minimumCooling, maximumCooling] = getForgeCoolingRange(recipe);
            effectLine("smelting.status.temperature", `-${minimumCooling}〜${maximumCooling}℃`, "§b");
            effectLine("smelting.status.impurity", "-8%", "§6");
            effectLine("smelting.ui.score", "+" + FORGE_REFINEMENT.controlledCool, "§d");
            break;
        }
        case "quality_check":
            effectLine("smelting.ui.precision", "+0〜0.3", "§d");
            break;
    }
    return lines;
}

function renderTemperatureGauge(form: any, furnace: any, recipe: any) {
    const min = recipe.needTemperature[0];
    const max = recipe.needTemperature[1];
    const ceiling = Math.max(1, max + 100);
    const slotFor = (temperature: number) => Math.max(0, Math.min(8, Math.round((temperature / ceiling) * 8)));
    const currentSlot = slotFor(furnace.temperature);
    const targetStart = slotFor(min);
    const targetEnd = slotFor(max);

    for (let index = 0; index < 9; index++) {
        const target = index >= targetStart && index <= targetEnd;
        const current = index === currentSlot;
        const tooHot = index > targetEnd;
        const icon = current
            ? furnace.temperature > max
                ? "minecraft:magma_cream"
                : furnace.temperature < min
                    ? "minecraft:snowball"
                    : "minecraft:blaze_powder"
            : target
                ? "minecraft:lime_stained_glass_pane"
                : tooHot
                    ? "minecraft:orange_stained_glass_pane"
                    : "minecraft:light_blue_stained_glass_pane";
        form.setButton(9 + index, {
            iconPath: texturePath(icon),
            name: current
                ? [{ translate: "smelting.ui.gauge.current" }, { text: " " + furnace.temperature + "℃" }]
                : target
                    ? "smelting.ui.gauge.target"
                    : " ",
            lore: target ? [{ rawtext: [
                { translate: "smelting.temperature_range" },
                { text: ": " + min + "〜" + max + "℃" },
            ] }] : [],
            editedName: true,
        });
    }
}

function strikeNameKey(strike: ForgeStrike) {
    return StrikeActions.find((action) => action.key === strike)?.name ?? "smelting.strike.light";
}

function getQuenchState(furnace: any) {
    return {
        phase: furnace.phase,
        progress: furnace.progress,
        temperature: furnace.temperature,
        stress: furnace.stress,
        completedPatterns: furnace.completedPatterns,
    };
}

function openFurnace(player: any) {
    const furnace = furnaceSessions.get(player.id);
    if (!furnace) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = FurnaceRecipes[furnace.recipeId];
    const lv = new JobLevel(player, "blacksmith").getLevel();
    const technique = getForgeTechnique(furnace.craftLevel);
    const mastery = getRecipeMasteryProfile(lv, recipe.requiredLevel);
    const perfectQuenchReady = canPerfectQuench(getQuenchState(furnace), recipe);
    const predictedRank = calcRank(furnace, recipe, player).rank;

    const form = new ChestFormData("large").enableLoreLineBreaks();
    form.setTitle({ rawtext: recipeTitleParts(recipe) });
    fill(form, [...Array(9).keys()], "minecraft:black_stained_glass_pane");
    fill(form, [...Array(18).keys()].map(i => i + 36), "minecraft:black_stained_glass_pane");
    renderTemperatureGauge(form, furnace, recipe);

    const statusLine = (rawtext: any[]) => ({ rawtext: [...rawtext, { text: "\n" }] });
    const statusLore: any[] = [
        statusLine([{ text: "§9" }, { translate: "smelting.status.phase" }, { text: ": " }, { translate: "smelting.phase." + furnace.phase }]),
        statusLine([{ text: "§c" }, { translate: "smelting.status.temperature" }, { text: ": " + furnace.temperature + "℃ (" + recipe.needTemperature[0] + "〜" + recipe.needTemperature[1] + "℃)" }]),
        statusLine([{ text: "§a" }, { translate: "smelting.status.progress" }, { text: ": " + furnace.progress + "%" }]),
        statusLine([{ text: "§6" }, { translate: "smelting.status.impurity" }, { text: ": " + Math.max(0, furnace.impurity) + "%" }]),
        statusLine([{ text: "§b" }, { translate: "smelting.ui.stress" }, { text: ": " + furnace.stress + "/100" }]),
        statusLine([{ text: "§d" }, { translate: "smelting.ui.shape_quality" }, { text: ": " + furnace.shapeQuality }]),
        statusLine([{ text: "§d" }, { translate: "smelting.lore.quality", with: [predictedRank] }]),
        statusLine([{ text: "§e" }, { translate: "smelting.ui.technique.contribution", with: [String(furnace.techniqueBonus)] }]),
        statusLine([
            { text: "§7" },
            { translate: "smelting.ui.technique.heat_retention" },
            { text: ": " + Math.round(technique.heatRetention * 100) + "%" },
        ]),
        statusLine([
            { text: "§7" },
            { translate: "smelting.ui.technique.stress_control" },
            { text: ": " + Math.round(technique.stressControl * 100) + "%" },
        ]),
        statusLine([{ text: "§7" }, { translate: "smelting.ui.technique.recovery." + technique.missRecovery }]),
        statusLine([{ text: "§6" }, { translate: "artisan.mastery.cap", with: [mastery.maxRank] }]),
        ...(mastery.nextRank && mastery.levelsToNext !== undefined
            ? [statusLine([{ text: "§7" }, { translate: "artisan.mastery.next", with: [mastery.nextRank, String(mastery.levelsToNext)] }])]
            : [statusLine([{ text: "§e" }, { translate: "artisan.mastery.maxed" }])]),
        statusLine([{ text: "§f" }, { translate: "smelting.status.actions" }, { text: ": " + furnace.actions + "/" + furnace.maxActions }]),
    ];
    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:blast_furnace"],
        name: "smelting.status.title",
        lore: statusLore,
        editedName: true,
    });

    const patternLore: any[] = [];
    if (furnace.phase === "heating") {
        patternLore.push({ rawtext: [{ text: "§7" }, { translate: "smelting.ui.pattern.locked" }] });
    } else if (furnace.phase === "quenched") {
        patternLore.push({ rawtext: [{ text: "§b" }, { translate: "smelting.ui.pattern.finished" }] });
    } else {
        furnace.strikePattern.forEach((strike: ForgeStrike, index: number) => {
            const completed = index < furnace.patternIndex;
            const current = index === furnace.patternIndex;
            patternLore.push({ rawtext: [
                { text: completed ? "§a✔ " : current ? "§e▶ " : "§7○ " },
                { translate: strikeNameKey(strike) },
            ] });
        });
        patternLore.push({ rawtext: [
            { text: "§b" },
            { translate: "smelting.ui.combo" },
            { text: ": " + furnace.forgeCombo },
        ] });
    }
    form.setButton(19, {
        iconPath: itemIdToPath["minecraft:smithing_table"],
        name: "smelting.ui.pattern.title",
        lore: patternLore,
        editedName: true,
    });

    for (const action of FurnaceActions) {
        if (lv < action.unlockLv) {
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "smelting.locked",
                lore: [{ rawtext: [{ translate: "smelting.unlock_level" }, { text: String(action.unlockLv) }] }],
                editedName: true,
            });
            continue;
        }

        const unavailableKey = getActionUnavailableKey(action, furnace, recipe, player);
        form.setButton(action.slot, {
            iconPath: texturePath(unavailableKey ? "minecraft:barrier" : action.icon),
            name: unavailableKey
                ? [{ text: "§c" }, { translate: action.name }]
                : action.name,
            lore: unavailableKey
                ? [{ rawtext: [{ text: "§c" }, { translate: unavailableKey }] }]
                : buildActionLore(action, furnace, recipe, player),
            editedName: true,
        });
    }

    for (const strike of StrikeActions) {
        const preview = applyForgeTechnique(resolveStrike(strike.key, strike.key, 0), furnace.craftLevel);
        const unavailable = furnace.phase !== "forging" || furnace.maxActions - furnace.actions <= 1;
        form.setButton(strike.slot, {
            iconPath: texturePath(unavailable ? "minecraft:barrier" : strike.icon),
            name: unavailable
                ? [{ text: "§c" }, { translate: strike.name }]
                : strike.name,
            lore: unavailable
                ? [{ rawtext: [{ text: "§c" }, { translate: furnace.phase === "heating"
                    ? "smelting.ui.unavailable.strike_heating"
                    : furnace.phase === "quenched"
                        ? "smelting.ui.unavailable.after_quench"
                        : "smelting.ui.unavailable.reserve_quench" }] }]
                : [
                    { rawtext: [{ text: "§a" }, { translate: "smelting.status.progress" }, { text: ": " + signed(preview.progressDelta, "%") }] },
                    { rawtext: [{ text: "§c" }, { translate: "smelting.status.temperature" }, { text: ": " + signed(preview.temperatureDelta, "℃") }] },
                    { rawtext: [{ text: "§b" }, { translate: "smelting.ui.stress" }, { text: ": " + signed(preview.stressDelta) }] },
                ],
            editedName: true,
        });
    }

    const requirementLine = (met: boolean, key: string, suffix = "") => ({
        rawtext: [
            { text: met ? "§a✔ " : "§c✖ " },
            { translate: key },
            ...(suffix ? [{ text: suffix }] : []),
        ],
    });
    const quenchLore: any[] = furnace.phase === "quenched"
        ? [
            { rawtext: [
                { text: furnace.quenchResult === "perfect" ? "§a" : "§c" },
                { translate: "smelting.quench.result." + furnace.quenchResult },
            ] },
            { rawtext: [{ text: "§7" }, { translate: "smelting.ui.quench.final" }] },
        ]
        : [
            requirementLine(furnace.phase === "forging", "smelting.ui.quench.require.phase"),
            requirementLine(furnace.progress >= 80, "smelting.status.progress", " ≥80%"),
            requirementLine(furnace.completedPatterns >= 1, "smelting.ui.quench.require.pattern"),
            requirementLine(
                furnace.temperature >= recipe.needTemperature[0] && furnace.temperature <= recipe.needTemperature[1],
                "smelting.temperature_range",
                " " + recipe.needTemperature[0] + "〜" + recipe.needTemperature[1] + "℃",
            ),
            requirementLine(furnace.stress <= 60, "smelting.ui.stress", " ≤60"),
            { rawtext: [
                { text: perfectQuenchReady ? "§a" : "§e" },
                { translate: perfectQuenchReady ? "smelting.ui.quench.ready" : "smelting.ui.quench.not_ready" },
            ] },
        ];
    form.setButton(26, {
        iconPath: itemIdToPath[furnace.phase === "quenched"
            ? furnace.quenchResult === "perfect" ? "minecraft:lime_dye" : "minecraft:red_dye"
            : "minecraft:water_bucket"],
        name: "smelting.ui.quench.title",
        lore: quenchLore,
        editedName: true,
    });

    const feedback = furnace.lastFeedback;
    const feedbackLore: any[] = feedback
        ? [
            { rawtext: [
                { text: feedback.success === false ? "§c" : "§a" },
                { translate: feedback.messageKey },
            ] },
            { rawtext: [{ text: feedback.temperature < 0 ? "§b" : "§c" }, { translate: "smelting.status.temperature" }, { text: ": " + signed(feedback.temperature, "℃") }] },
            { rawtext: [{ text: "§a" }, { translate: "smelting.status.progress" }, { text: ": " + signed(feedback.progress, "%") }] },
            { rawtext: [{ text: "§6" }, { translate: "smelting.status.impurity" }, { text: ": " + signed(feedback.impurity, "%") }] },
            { rawtext: [{ text: "§b" }, { translate: "smelting.ui.stress" }, { text: ": " + signed(feedback.stress) }] },
        ]
        : [{ rawtext: [{ text: "§7" }, { translate: "smelting.ui.feedback.none" }] }];
    form.setButton(34, {
        iconPath: itemIdToPath["minecraft:paper"],
        name: "smelting.ui.feedback.title",
        lore: feedbackLore,
        editedName: true,
    });

    form.setButton(35, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "smelting.ui.guide.title",
        lore: [
            { rawtext: [{ text: furnace.phase === "heating" ? "§e▶ " : "§7① " }, { translate: "smelting.ui.guide.heat" }] },
            { rawtext: [{ text: furnace.phase === "forging" ? "§e▶ " : "§7② " }, { translate: "smelting.ui.guide.forge" }] },
            { rawtext: [{ text: furnace.phase === "quenched" ? "§e▶ " : "§7③ " }, { translate: "smelting.ui.guide.quench" }] },
        ],
        editedName: true,
    });

    const canFinish = furnace.phase === "quenched";
    form.setButton(49, {
        iconPath: itemIdToPath[canFinish ? "minecraft:lime_dye" : "minecraft:barrier"],
        name: canFinish
            ? [{ translate: "smelting.button.complete" }, { text: " §d[" + predictedRank + "]" }]
            : [{ text: "§c" }, { translate: "smelting.button.complete" }],
        lore: canFinish
            ? [
                { rawtext: [
                    { text: furnace.quenchResult === "perfect" ? "§a" : "§c" },
                    { translate: "smelting.quench.result." + furnace.quenchResult },
                ] },
                { rawtext: [{ text: "§d" }, { translate: "smelting.lore.quality", with: [predictedRank] }] },
            ]
            : [{ rawtext: [{ text: "§c" }, { translate: "smelting.ui.finish.requires_quench" }] }],
        editedName: true,
    });

    form.show(player).then(r => {
        if (r.canceled) return;
        handleAction(player, r.selection ?? -1);
    });
}

/* ===============================
   Logic
================================ */
function handleAction(player: any, slot: any) {
    const furnace = furnaceSessions.get(player.id);
    if (!furnace) return;
    if (furnace.artisanFinish) { finish(player); return; }
    if (!furnace) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = FurnaceRecipes[furnace.recipeId];

    if (slot === 49 && furnace.phase === "quenched") {
        finish(player);
        return;
    }

    const strike = StrikeActions.find((candidate) => candidate.slot === slot);
    if (strike) {
        handleStrike(player, furnace, recipe, strike.key);
        return;
    }

    const action = FurnaceActions.find(a => a.slot === slot);
    if (!action) {
        openFurnace(player);
        return;
    }

    const lv = new JobLevel(player, "blacksmith").getLevel();
    if (lv < action.unlockLv) {
        openFurnace(player);
        return;
    }
    if (getActionUnavailableKey(action, furnace, recipe, player)) {
        openFurnace(player);
        return;
    }

    if (action.key === "water_cool") {
        handleQuench(player, furnace, recipe);
        return;
    }

    const before = snapshotForge(furnace);
    action.run(furnace, recipe, furnace.ctx, player);
    furnace.actions += action.cost;
    normalizeForge(furnace);

    if (
        furnace.phase === "heating" &&
        furnace.temperature >= recipe.needTemperature[0] &&
        furnace.progress >= 30
    ) {
        furnace.phase = "forging";
    }
    furnace.lastFeedback = buildForgeFeedback(
        before,
        furnace,
        "smelting.ui.feedback.operation",
        true,
    );

    openFurnace(player);
}

function snapshotForge(furnace: any) {
    return {
        temperature: furnace.temperature,
        progress: furnace.progress,
        impurity: furnace.impurity,
        stress: furnace.stress,
    };
}

function normalizeForge(furnace: any) {
    furnace.temperature = Math.max(0, Math.floor(furnace.temperature * 100) / 100);
    furnace.progress = Math.max(0, Math.floor(furnace.progress * 100) / 100);
    furnace.impurity = Math.max(0, Math.min(100, Math.floor(furnace.impurity * 100) / 100));
    furnace.stress = Math.max(0, Math.min(100, Math.floor(furnace.stress * 100) / 100));
    furnace.shapeQuality = Math.max(-20, Math.min(40, furnace.shapeQuality));
}

function buildForgeFeedback(before: any, furnace: any, messageKey: string, success: boolean) {
    return {
        messageKey,
        success,
        temperature: furnace.temperature - before.temperature,
        progress: furnace.progress - before.progress,
        impurity: furnace.impurity - before.impurity,
        stress: furnace.stress - before.stress,
    };
}

function handleStrike(player: any, furnace: any, recipe: any, selected: ForgeStrike) {
    if (furnace.phase !== "forging" || furnace.maxActions - furnace.actions <= 1) {
        openFurnace(player);
        return;
    }

    const before = snapshotForge(furnace);
    const expected = furnace.strikePattern[furnace.patternIndex] as ForgeStrike;
    const resolution = applyForgeTechnique(
        resolveStrike(expected, selected, furnace.forgeCombo),
        furnace.craftLevel,
    );

    furnace.temperature += resolution.temperatureDelta;
    furnace.progress += resolution.progressDelta;
    furnace.impurity += resolution.impurityDelta;
    furnace.stress += resolution.stressDelta;
    furnace.shapeQuality += resolution.shapeDelta;
    furnace.forgeCombo = resolution.combo;
    furnace.actions += 1;

    let messageKey = resolution.correct
        ? "smelting.ui.feedback.strike_correct"
        : "smelting.ui.feedback.strike_miss";
    if (resolution.correct) {
        furnace.patternIndex += 1;
        if (furnace.patternIndex >= furnace.strikePattern.length) {
            const lengthBonus = 2 + Math.max(0, furnace.strikePattern.length - 3) * 2;
            furnace.completedPatterns += 1;
            furnace.shapeQuality += lengthBonus;
            furnace.impurity -= 2;
            furnace.patternIndex = 0;
            furnace.strikePattern = createStrikePattern(
                Math.random,
                getForgeTechnique(furnace.craftLevel).maxPatternLength,
            );
            messageKey = "smelting.ui.feedback.pattern_complete";
        }
    } else {
        furnace.patternIndex = getPatternIndexAfterMiss(furnace.patternIndex, furnace.craftLevel);
    }

    normalizeForge(furnace);
    furnace.lastFeedback = buildForgeFeedback(before, furnace, messageKey, resolution.correct);
    player.stopSound("smelting.fire");
    player.playSound("smelting.hammer", player.location);
    openFurnace(player);
}

function handleQuench(player: any, furnace: any, recipe: any) {
    if (furnace.phase === "quenched") {
        openFurnace(player);
        return;
    }

    const before = snapshotForge(furnace);
    const result = judgeQuench(getQuenchState(furnace), recipe);
    furnace.quenchTemperature = furnace.temperature;
    furnace.quenchResult = result;
    furnace.phase = "quenched";
    furnace.temperature -= getGameplayRandomValue(60, 100);
    furnace.actions = Math.min(furnace.maxActions, furnace.actions + 1);

    if (result === "perfect") {
        furnace.precision += 0.5;
        furnace.impurity -= 5;
        furnace.stress -= 5;
        furnace.shapeQuality += 3;
    } else {
        furnace.impurity += result === "overheated" ? 12 : 7;
        furnace.stress += result === "stressed" ? 15 : 8;
        furnace.shapeQuality -= 4;
    }

    normalizeForge(furnace);
    furnace.lastFeedback = buildForgeFeedback(
        before,
        furnace,
        "smelting.quench.result." + result,
        result === "perfect",
    );
    player.stopSound("smelting.fire");
    player.stopSound("smelting.bellows");
    player.stopSound("smelting.hammer");
    player.playSound("smelting.cooling", player.location);
    openFurnace(player);
}

function calcTemperatureScore(temperature: any, needTemperature: any, maxScore = 5) {
    const min = needTemperature[0];
    const max = needTemperature[1];

    if (temperature < min || temperature > max) return 0;

    const mid = Math.floor((min + max) / 2);
    const distance = Math.abs(temperature - mid);
    const score = maxScore - Math.floor(distance / 20);

    return Math.max(0, score);
}

function calcEfficiencyBonus(furnace: any, recipe: any) {
    const evaluationTemperature = furnace.quenchTemperature ?? furnace.temperature;
    const tempScore = calcTemperatureScore(evaluationTemperature, recipe.needTemperature, 12);

    if (tempScore < 10) return 0;

    const used = furnace.actions;
    const max = furnace.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function applySmithingMasteryCap(rawRank: string, player: any, recipe: any) {
    const level = new JobLevel(player, "blacksmith").getLevel();
    const rank = capRankByRecipeMastery(rawRank, level, recipe.requiredLevel);
    return {
        rank,
        // Money and output quality remain limited by recipe mastery.
        mul: getSmithingRankMultiplier(rank),
        // Profession XP rewards the quality of the actual forge attempt. If XP
        // used the capped rank too, newly unlocked recipes would make newer
        // smiths level more slowly precisely because their ceiling is lower.
        xpMul: getSmithingRankMultiplier(rawRank),
    };
}

function calcRank(furnace: any, recipe: any, player: any) {
    if (isCatastrophicQuench(furnace.quenchResult)) {
        return applySmithingMasteryCap("F", player, recipe);
    }

    let score = furnace.score;
    score += Math.min(furnace.refinement ?? 0, getForgeRefinementCap(furnace.craftLevel, recipe.requiredLevel));

    // progress
    score += Math.min(5, Math.floor(furnace.progress / 25));

    // temperature
    const evaluationTemperature = furnace.quenchTemperature ?? furnace.temperature;
    score += calcTemperatureScore(evaluationTemperature, recipe.needTemperature, 12);

    const impurity = furnace.impurity;
    // impurity (不純物が少ないほど高評価)
    score += Math.floor((100 - impurity) / 5);

    if (impurity > 60) score -= 10;
    if (impurity > 80) score -= 25;

    if (furnace.progress < 80) score -= 15;
    if (furnace.progress < 50) score -= 35;

    // efficiency bonus
    score += calcEfficiencyBonus(furnace, recipe);

    // precision
    score += Math.min(3, Math.floor(furnace.precision * 3));

    // material quality
    score += furnace.materialQuality * 1.5;

    // additive quality (平均)
    if (furnace.additiveCount > 0) {
        score += Math.floor(
            furnace.additiveQuality / furnace.additiveCount
        );
    }

    // Three-stage forge contribution: player execution matters, but the bounded
    // adjustment cannot eclipse material quality or the legacy score curve.
    score += Math.max(-8, Math.min(12, furnace.shapeQuality ?? 0));
    score -= Math.floor(Math.max(0, furnace.stress ?? 0) / 10);
    score += Math.max(0, Math.min(8, furnace.techniqueBonus ?? 0));

    const quenchScore: Record<string, number> = {
        perfect: 8,
        early: -10,
        cold: -7,
        overheated: -10,
        stressed: -7,
    };
    if (furnace.quenchResult) score += quenchScore[furnace.quenchResult] ?? 0;

    const finishState = {
        craftLevel: furnace.craftLevel,
        requiredLevel: recipe.requiredLevel,
        quenchResult: furnace.quenchResult,
        karonRoll: furnace.karonRoll,
    };
    const rawRank = getSmithingScoredRank(score);
    const rank = getSmithingOutcomeRank(score, finishState);
    return {
        rank,
        mul: getSmithingRankMultiplier(rank),
        // Preserve uncapped execution XP; only eligible winners earn KARON XP.
        xpMul: getSmithingRankMultiplier(rank === "KARON" ? rank : rawRank),
    };
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
    const furnace = furnaceSessions.get(player.id);
    if (!furnace || furnace.artisanCraftStarted) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = FurnaceRecipes[furnace.recipeId];

    if (!checkIngredients(player, furnace.scaledIngredients)) {
        cancelArtisanCraft(furnace);
        return;
    }

    const { rank, isFailure, rewardMultiplier, xpMultiplier, itemId, totalCount } = furnace.artisanFinish ??= (() => {
        const { rank, mul, xpMul } = calcRank(furnace, recipe, player);

        const resolved = resolveRecipeResult(recipe.result);
        const isFailure = isCatastrophicQuench(furnace.quenchResult);
        const rewardMultiplier = isFailure ? 0 : mul;
        const xpMultiplier = isFailure ? 0 : xpMul;
        const itemId = isFailure ? "minecraft:iron_nugget" : resolved.id;
        const totalCount = isFailure ? furnace.quantity : furnace.quantity * resolved.count;
        return { rank, isFailure, rewardMultiplier, xpMultiplier, itemId, totalCount };
    })();
    if (!runArtisanCraft(player, furnace, () => {
        if (!jobs_config.validity || !player.hasTag('mcjobs_blacksmith')) return undefined;
        const job = new JobLevel(player, "blacksmith");
        const level = job.getLevel();

        const baseMoney = recipe.baseMoney * rewardMultiplier;
        const random = getRandomInteger(
            jobs_config.blacksmithReward.min,
            jobs_config.blacksmithReward.max
        );

        const reward =
            Math.floor(
                baseMoney *
                100 *
                random *
                job.getReward(level) *
                buff.getMultiplier("blacksmith") *
                5
            ) / 100;
        const xpReward = recipe.baseXp * xpMultiplier * jobs_config.blacksmithXpMultiplier * Math.min(furnace.quantity, 25);
        return { job: "blacksmith", money: reward, xp: xpReward, rank, display: "smelting" };
    }, () => {
        consume(player, furnace.scaledIngredients);
        rememberLastCraftedRecipe(player.id, "blacksmith", furnace.recipeId);

        const inv = player.getComponent("inventory").container;

        for (const item of createResultStacks(itemId, totalCount)) {
            const lore: any[] = [
                { rawtext: [{ text: '§r§a==============' }] },
                { rawtext: [{ text: '§r§e' }, { translate: "smelting.lore.quality", with: [`${rank}`] }] },
                { rawtext: [{ text: '§r§b' }, { translate: `smelting.quench.result.${furnace.quenchResult}` }] },
                { rawtext: [{ text: '§r§d' }, { translate: "smelting.ui.technique.contribution", with: [String(furnace.techniqueBonus)] }] },
            ];
            const traitKey = getForgedTraitTranslationKey(itemId);
            if (traitKey && !isFailure) {
                lore.push({ rawtext: [{ text: '§r§6✦ ' }, { translate: traitKey }] });
            }
            lore.push({ rawtext: [{ text: '§r§a==============' }] });
            item.setLore(lore);
            const leftover = inv.addItem(item);
            if (leftover) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }

        furnaceSessions.delete(player.id);
    })) return;

    player.stopSound('smelting.idle');
    player.stopSound('smelting.fire');
    player.stopSound('smelting.bellows');
    player.stopSound('smelting.pour');
    player.stopSound('smelting.hammer');
    player.stopSound('smelting.cooling');
    player.playSound('smelting.complete', player.location);
    if (jobs_config.validity && player.hasTag('mcjobs_blacksmith') && isArtisanRankAtLeast(rank, "B")) {
        reportJobAchievement(player, "blacksmith_b");
    }
    player.sendMessage({
        rawtext: [
            { translate: "smelting.reward.prefix" },
            { text: ` ${rank} §b— ` },
            { translate: `smelting.quench.result.${furnace.quenchResult}` },
            { text: " §d" },
            { translate: "smelting.ui.technique.contribution", with: [String(furnace.techniqueBonus)] },
        ],
    });

}
