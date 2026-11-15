import { resolveCookingCategoryPreference } from "@/shared/ui/artisan-filter-preferences.js";
import { addCraftableFilterButton, craftableOnly, toggleCraftableOnly, filterCraftableRecipeIds, CRAFTABLE_FILTER_SLOT } from "@/shared/ui/craftable-filter.js";
import { openCookingRecipeCategory } from "@/shared/ui/artisan-recipe-filter.js";
import { cancelArtisanCraft, runArtisanCraft, type ArtisanCraftSession } from "@/domain/jobs/pending-artisan-rewards.js";
import jobs_config from "@/config/jobs.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { getRandomInteger } from "@/shared/utils/minecraft.js";
import { captureCookingEquipment, requireCookingEquipment, getCookwareScoreBonus, getCookingEquipmentLore } from '@/domain/cooking/cookware.js';
import { CraftingModalFormData as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { ItemStack, Player } from "@minecraft/server";

import { itemIdToPath } from "@/config/textures.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { capCookingRankByRecipe } from "@/domain/cooking/quality-cap.js";
import {
    evaluateCookingCompletion,
    type CookingCompletionGoal,
} from "@/domain/cooking/completion.js";
import {
    advanceCookingRoute,
    applyCookingTroubleChoice,
    getAvailableCookingRoutes,
    getChefLevelTechnique,
    getChefTechniqueProfile,
    getCookingTechniqueAdjustment,
    maybeStartCookingTrouble,
    type CookingRouteDefinition,
    type CookingTroubleDefinition,
} from "@/domain/cooking/station-minigame.js";
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
import { createResultStacks } from "@/domain/recipes/recipe-result.js";
import { buildCookingEffectRawtext } from "@/domain/recipes/recipe-effect-lore.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import {
    addLastCraftedRecipeButton,
    getLastCraftedRecipeId,
    rememberLastCraftedRecipe
} from "@/shared/ui/last-crafted-recipe.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";
import { buildCookingMasteryLore } from "@/features/forms/default/cooking/cooking-mastery-ui.js";

export type SimpleStationResult = string | { id: string; count?: number } | { id: string; count?: number }[];

export type SimpleStationRecipe = {
    name: string;
    result: SimpleStationResult;
    requiredLevel: number;
    ingredients: Record<string, number>;
};

export type SimpleStationRecipes = Record<string, SimpleStationRecipe>;

export type SimpleStationSession = ArtisanCraftSession & {
    recipeId: string;
    quantity: number;
    scaledIngredients: Record<string, number>;
    actions: number;
    maxActions: number;
    phase: string;
    routeId?: string;
    stageIndex: number;
    technique: number;
    routeCycles: number;
    mistakePenalty: number;
    recoveryBonus: number;
    troubleId?: string;
    troubleSeverity: number;
    troubleProgress: number;
    lastOutcome?: "stage" | "mistake" | "recovering" | "recovered" | "worsened" | "trouble";
    [key: string]: any;
};

export type SimpleStationAction = {
    key: string;
    slot: number;
    name: string;
    icon: string;
    unlockLv: number;
    cost: number;
    run: (session: SimpleStationSession, recipe: SimpleStationRecipe, player: Player) => void;
};

export type SimpleStationStatus = {
    name: string;
    color?: string;
    value: (session: SimpleStationSession, recipe: SimpleStationRecipe) => string | number;
};

export type SimpleStationCompletionGoal = {
    id: string;
    label: string;
    target: number;
    suffix?: string;
    value: (session: SimpleStationSession, recipe: SimpleStationRecipe) => number;
};

export type SimpleStationFormConfig = {
    rewardJob?: "chef";
    title: string;
    recipes: SimpleStationRecipes;
    sessions: Map<string, SimpleStationSession>;
    actions: SimpleStationAction[];
    statuses: SimpleStationStatus[];
    completionGoals: SimpleStationCompletionGoal[];
    routes: CookingRouteDefinition[];
    troubles: CookingTroubleDefinition[];
    openRecipeSelect: (player: Player, page?: number, categoryId?: string, searchQuery?: string) => void;
    openCooking: (player: Player) => void;
    createSession: (
        recipe: SimpleStationRecipe,
        quantity: number,
        scaledIngredients: Record<string, number>,
        player: Player
    ) => Omit<SimpleStationSession, "recipeId" | "quantity" | "scaledIngredients">;
    score: (session: SimpleStationSession, recipe: SimpleStationRecipe) => number;
};

const RECIPES_PER_PAGE = 21;
const RECIPE_SLOTS = [
    10, 11, 12, 13, 14, 15, 16,
    19, 20, 21, 22, 23, 24, 25,
    28, 29, 30, 31, 32, 33, 34
];

const textureByItemId = itemIdToPath as Record<string, string>;

function resolveSimpleStationGoals(
    config: SimpleStationFormConfig,
    session: SimpleStationSession,
    recipe: SimpleStationRecipe,
): CookingCompletionGoal[] {
    return config.completionGoals.map((goal) => ({
        id: goal.id,
        label: goal.label,
        current: goal.value(session, recipe),
        target: goal.target,
        suffix: goal.suffix,
    }));
}

export function getSimpleStationCompletionState(
    config: SimpleStationFormConfig,
    session: SimpleStationSession,
    recipe: SimpleStationRecipe,
) {
    return evaluateCookingCompletion(
        session.routeCycles,
        resolveSimpleStationGoals(config, session, recipe),
    );
}

// 必要Lvを超えた分だけ、手数と仕上げ点が伸びる（ほかの器具・鍛冶・化学と同じ考え方）
function getRecipeSurplus(level: unknown, requiredLevel: unknown) {
    return Math.max(0, Math.floor(Number(level) || 0) - Math.floor(Number(requiredLevel) || 0));
}
export function getSimpleStationSurplusActions(level: unknown, requiredLevel: unknown) {
    return Math.min(8, Math.floor(getRecipeSurplus(level, requiredLevel) / 30));
}
export function getSimpleStationMasteryBonus(level: unknown, requiredLevel: unknown) {
    return Math.min(6, Math.floor(getRecipeSurplus(level, requiredLevel) / 40));
}

export function clamp(value: number, min = 0, max = 100) {
    return Math.floor(Math.min(max, Math.max(min, value)) * 100) / 100;
}

export function targetScore(value: number, target: number, maxDistance: number, maxScore = 10) {
    const missRate = Math.min(1, Math.abs(value - target) / Math.max(1, maxDistance));
    return Math.floor(maxScore * Math.pow(1 - missRate, 2.2));
}

export function rangeScore(value: number, min: number, max: number, maxScore = 10) {
    if (value < min || value > max) return 0;
    const mid = (min + max) / 2;
    const distance = Math.max(1, (max - min) / 2);
    return targetScore(value, mid, distance, maxScore);
}

function rankFromScore(score: number, failed: boolean) {
    if (failed) return "F";
    if (score >= 98) return "KARON";
    if (score >= 95) return "IMPOSSIBLE";
    if (score >= 92) return "EXTRA";
    if (score >= 88) return "LEGENDARY";
    if (score >= 84) return "SSS";
    if (score >= 78) return "SS";
    if (score >= 72) return "S";
    if (score >= 64) return "A";
    if (score >= 56) return "B";
    if (score >= 48) return "C";
    if (score >= 36) return "D";
    if (score >= 24) return "E";
    return "F";
}

function getIconPath(itemId: string) {
    return textureByItemId[itemId] ?? itemId;
}

function getItemName(itemId: string) {
    try {
        return langChangeItemName(itemId);
    } catch {
        return itemId;
    }
}

function getMaxStackAmount(itemId: string) {
    try {
        return new ItemStack(itemId).maxAmount;
    } catch {
        return 64;
    }
}

function getInventory(player: Player): any {
    return (player.getComponent("inventory") as any)?.container;
}

function normalizeResult(result: SimpleStationResult) {
    const results = Array.isArray(result) ? result : [result];
    return results.map((item) => {
        if (typeof item === "string") return { id: item, count: 1 };
        return { id: item.id, count: item.count ?? 1 };
    });
}

function countInventory(player: Player): Record<string, number> {
    const inv = getInventory(player);
    const counts: Record<string, number> = {};
    if (!inv) return counts;

    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (!item) continue;
        counts[item.typeId] = (counts[item.typeId] ?? 0) + item.amount;
    }

    return counts;
}

function checkIngredients(player: Player, required: Record<string, number>) {
    const inv = countInventory(player);
    const missing: { id: string; need: number }[] = [];

    for (const [id, amount] of Object.entries(required)) {
        const have = inv[id] ?? 0;
        if (have < amount) {
            missing.push({ id, need: amount - have });
        }
    }

    if (missing.length === 0) return true;

    const lines = missing.map((item) => ({
        rawtext: [{ text: "\n- " }, { translate: getItemName(item.id) }, { text: ` x ${item.need}` }]
    }));
    player.sendMessage({
        rawtext: [{ translate: "cooking.error.insufficient_ingredients" }, ...lines]
    });

    return false;
}

function consume(player: Player, required: Record<string, number>) {
    const inv = getInventory(player);
    if (!inv) return;

    for (const [id, need] of Object.entries(required)) {
        let remain = need;
        for (let i = 0; i < inv.size && remain > 0; i++) {
            const item = inv.getItem(i);
            if (!item || item.typeId !== id) continue;

            if (item.amount > remain) {
                item.amount -= remain;
                inv.setItem(i, item);
                remain = 0;
            } else {
                remain -= item.amount;
                inv.setItem(i, undefined);
            }
        }
    }
}

function getScaledIngredients(recipe: SimpleStationRecipe, quantity: number) {
    const scaled: Record<string, number> = {};
    for (const [id, amount] of Object.entries(recipe.ingredients)) {
        scaled[id] = amount * quantity;
    }
    return scaled;
}

function fill(form: ChestFormData, slots: number[], itemId: string, name: any = " ", lore: any[] = []) {
    slots.forEach((slot) => {
        form.setButton(slot, {
            iconPath: getIconPath(itemId),
            name,
            lore,
            editedName: true
        });
    });
}

function addResults(
    player: Player,
    recipe: SimpleStationRecipe,
    quantity: number,
    rank: string,
    levelTechnique = 0,
    routeBonus = 0,
) {
    const inv = getInventory(player);
    if (!inv) return;

    for (const [index, result] of normalizeResult(recipe.result).entries()) {
        for (const item of createResultStacks(result.id, result.count * quantity)) {
            if (index === 0) {
                item.setLore([
                    { rawtext: [{ text: "§r§a==============" }] },
                    { rawtext: [{ text: "§r§e" }, { translate: "cooking.lore.quality", with: [rank] }] },
                    { rawtext: [{ text: "§r§6" }, { translate: "cooking.minigame.result.level_technique", with: [`${levelTechnique}`] }] },
                    { rawtext: [{ text: "§r§d" }, { translate: "cooking.minigame.result.route_bonus", with: [`${routeBonus}`] }] },
                    { rawtext: [{ text: "§r§a==============" }] },
                ]);
            }

            const leftover = inv.addItem(item);
            if (leftover) {
                player.dimension.spawnItem(leftover, player.location);
            }
        }
    }
}

function buildRecipeLore(recipe: SimpleStationRecipe, chefLevel: number) {
    const materials = [];
    for (const [id, amount] of Object.entries(recipe.ingredients)) {
        materials.push(
            { text: "\n§7- " },
            { translate: getItemName(id) },
            { text: ` x${amount}` }
        );
    }

    const results = [];
    for (const result of normalizeResult(recipe.result)) {
        results.push(
            { text: "\n§a- " },
            { translate: getItemName(result.id) },
            { text: ` x${result.count}` }
        );
    }

    return [{
        rawtext: [
            { text: "§9" },
            { translate: "cooking.material" },
            { text: ":" },
            ...materials,
            { text: "\n§a" },
            { translate: "cooking.result" },
            { text: ":" },
            ...results,
            ...buildCookingEffectRawtext(recipe.result),
        ]
    }, ...buildCookingMasteryLore(chefLevel, recipe.requiredLevel)];
}

export function openSimpleStationRecipeSelect(player: Player, config: SimpleStationFormConfig, page = 0, categoryId: string | undefined = undefined, searchQuery = "") {
    if (config.sessions.has(player.id)) {
        config.openCooking(player);
        return;
    }

    const form = new ChestFormData("large").enableLoreLineBreaks();
    form.setTitle({ rawtext: [{ translate: config.title }] });

    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:black_stained_glass_pane"
    );

    const lv = new JobLevel(player, "chef").getLevel();
    const cleanSearchQuery = cleanRecipeSearchQuery(searchQuery);
    const searchActive = isRecipeSearchActive(cleanSearchQuery);
    const selectedCategory = resolveCookingCategoryPreference(player, config.title, config.recipes, categoryId);
    const availableCategories = getAvailableRecipeCategories(config.recipes, selectedCategory.id);
    const recipeIds = filterCraftableRecipeIds(filterUnlockedRecipesForSearch(
        filterRecipeIds(sortRecipeIdsByLevel(Object.keys(config.recipes), config.recipes), config.recipes, selectedCategory.id),
        config.recipes,
        cleanSearchQuery,
        lv
    ), config.recipes, player, lv);
    addCraftableFilterButton(form, player, recipeIds.length);
    const totalPages = Math.max(1, Math.ceil(recipeIds.length / RECIPES_PER_PAGE));
    const safePage = Math.min(Math.max(0, page), totalPages - 1);
    const start = safePage * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, index) => {
        const recipe = config.recipes[id];
        if (!recipe) return;

        const unlocked = lv >= recipe.requiredLevel;
        const slot = RECIPE_SLOTS[index];

        form.setButton(slot, {
            iconPath: unlocked ? getIconPath(recipe.name) : getIconPath("minecraft:barrier"),
            name: unlocked ? getItemName(recipe.name) : "cooking.locked",
            lore: unlocked
                ? buildRecipeLore(recipe, lv)
                : [{
                    rawtext: [
                        { translate: "cooking.unlock_level" },
                        { text: ` ${recipe.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    if (safePage > 0) {
        form.setButton(45, {
            iconPath: getIconPath("minecraft:arrow"),
            name: "cooking.page.prev",
            editedName: true
        });
    }

    if ((safePage + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        form.setButton(53, {
            iconPath: getIconPath("minecraft:arrow"),
            name: "cooking.page.next",
            editedName: true
        });
    }

    if (availableCategories.length > 1) {
        const previousCategory = adjacentRecipeCategory(config.recipes, selectedCategory.id, -1);
        const nextCategory = adjacentRecipeCategory(config.recipes, selectedCategory.id, 1);

        form.setButton(47, {
            iconPath: getIconPath(previousCategory.icon),
            name: [{ translate: "cooking.category.prev" }, { text: "\n§7" }, recipeCategoryLabel(previousCategory)],
            editedName: true
        });

        form.setButton(51, {
            iconPath: getIconPath(nextCategory.icon),
            name: [{ translate: "cooking.category.next" }, { text: "\n§7" }, recipeCategoryLabel(nextCategory)],
            editedName: true
        });
    }

    form.setButton(48, {
        iconPath: getIconPath("minecraft:compass"),
        name: searchActive ? [{ translate: 'game.ui.0f7cd56b195ccb7a', with: [cleanSearchQuery] }] : [{ translate: 'game.ui.591482c36f3bba3e' }],
        lore: [{ translate: 'game.ui.da1dd2129138a80e' }],
        editedName: true
    });

    if (searchActive) {
        form.setButton(50, {
            iconPath: getIconPath("minecraft:barrier"),
            name: [{ translate: 'game.ui.49f6994c765ec835' }],
            editedName: true
        });
    }

    const pageLore: any[] = [{ rawtext: [{ text: "§b" }, recipeCategoryLabel(selectedCategory)] }];
    if (searchActive) {
        pageLore.push({ translate: 'game.ui.0f7cd56b195ccb7a', with: [cleanSearchQuery] });
    }

    form!.setButton(52, {
        iconPath: getIconPath("minecraft:hopper"),
        name: [{ translate: 'game.ui.4fd4b2e889d619c9' }],
        lore: pageLore,
        editedName: true
    });

    if (config.title === 'cooking.title.cutting_board') {
        form.setButton(39, {
            iconPath: getIconPath('minecraft:bowl'),
            name: [{ translate: 'cooking.finish.ui.choose' }],
            lore: [{ translate: 'cooking.finish.ui.hint' }],
            editedName: true,
        });
    }

    // @ts-ignore TS(2532): Object is possibly undefined.
    form.setButton(49, {
        iconPath: getIconPath("minecraft:paper"),
        name: [{ translate: "cooking.page.current", with: [`${safePage + 1}`, `${totalPages}`] }],
        lore: pageLore,
        editedName: true
    });

    const lastCraftedRecipeId = getLastCraftedRecipeId(player.id, config.title);
    if ((!craftableOnly(player) || !!lastCraftedRecipeId && recipeIds.includes(lastCraftedRecipeId))
        && (!lastCraftedRecipeId || !pageRecipes.includes(lastCraftedRecipeId))) {
        addLastCraftedRecipeButton(form, player.id, config.title, config.recipes);
    }

    form.show(player).then((response) => {
        if (!response || response.canceled) return;

        if (response.selection === CRAFTABLE_FILTER_SLOT) {
            toggleCraftableOnly(player);
            config.openRecipeSelect(player, 0, selectedCategory.id, cleanSearchQuery);
            return;
        }

        if (response.selection === 39 && config.title === 'cooking.title.cutting_board') {
            player.sendMessage({ translate: 'cooking.finish.ui.hint' });
            return;
        }

        if (response.selection === 46) {
            const lastRecipeId = getLastCraftedRecipeId(player.id, config.title);
            if (lastRecipeId && (!craftableOnly(player) || recipeIds.includes(lastRecipeId)) && config.recipes[lastRecipeId]) {
                openQuantitySelect(player, config, lastRecipeId);
            }
            return;
        }

        if (response.selection === 45) {
            config.openRecipeSelect(player, safePage - 1, selectedCategory.id, cleanSearchQuery);
            return;
        }

        if (response.selection === 53) {
            config.openRecipeSelect(player, safePage + 1, selectedCategory.id, cleanSearchQuery);
            return;
        }

        if (response.selection === 47) {
            config.openRecipeSelect(player, 0, adjacentRecipeCategory(config.recipes, selectedCategory.id, -1).id, cleanSearchQuery);
            return;
        }

        if (response.selection === 51) {
            config.openRecipeSelect(player, 0, adjacentRecipeCategory(config.recipes, selectedCategory.id, 1).id, cleanSearchQuery);
            return;
        }

        if (response.selection === 52) {
            openCookingRecipeCategory(player, config.recipes, selectedCategory.id, next => config.openRecipeSelect(player, 0, next, cleanSearchQuery));
            return;
        }

        if (response.selection === 48) {
            openSimpleStationRecipeSearch(player, config, selectedCategory.id, cleanSearchQuery);
            return;
        }

        if (response.selection === 50 && searchActive) {
            config.openRecipeSelect(player, 0, selectedCategory.id);
            return;
        }

        const index = RECIPE_SLOTS.indexOf(response.selection ?? -1);
        if (index === -1) return;

        const recipeId = pageRecipes[index];
        const recipe = recipeId ? config.recipes[recipeId] : undefined;
        if (!recipe || lv < recipe.requiredLevel) {
            config.openRecipeSelect(player, safePage, selectedCategory.id);
            return;
        }

        openQuantitySelect(player, config, recipeId);
    });
}

function openSimpleStationRecipeSearch(player: Player, config: SimpleStationFormConfig, categoryId: string, searchQuery = "") {
    const form = new ModalFormData()
        .title({ translate: 'game.ui.6cc56f8617876423' })
        .textField({ translate: 'game.ui.35449980007222c2' }, { translate: 'game.ui.7c8e7f9486408422' }, { defaultValue: searchQuery });

    form.show(player).then((response) => {
        if (!response || response.canceled) return;
        config.openRecipeSelect(player, 0, categoryId, String(response.formValues?.[0] ?? ""));
    });
}

export function openSimpleStationCooking(player: Player, config: SimpleStationFormConfig) {
    const session = config.sessions.get(player.id);
    if (!session) {
        config.openRecipeSelect(player);
        return;
    }

    const recipe = config.recipes[session.recipeId];
    if (!recipe) {
        cancelArtisanCraft(session);
        config.sessions.delete(player.id);
        return;
    }

    if (!session.routeId) {
        openSimpleStationRouteSelect(player, config);
        return;
    }

    const route = config.routes.find((item) => item.id === session.routeId);
    if (!route) {
        session.routeId = undefined;
        openSimpleStationRouteSelect(player, config);
        return;
    }

    const currentStage = route.stages[session.stageIndex] ?? route.stages[0];
    const trouble = config.troubles.find((item) => item.id === session.troubleId);
    const chefLevel = new JobLevel(player, "chef").getLevel();
    const levelProfile = getChefTechniqueProfile(chefLevel);
    const predictedRank = capCookingRankByRecipe(player, {
        rank: rankFromScore(
            config.score(session, recipe) + getCookwareScoreBonus(session.cookware) + getCookingTechniqueAdjustment(session, chefLevel, route) + getSimpleStationMasteryBonus(chefLevel, recipe.requiredLevel),
            session.phase === "failed",
        ),
        mul: 1,
    }, recipe.requiredLevel).rank;
    const completion = getSimpleStationCompletionState(config, session, recipe);

    const form = new ChestFormData("large").enableLoreLineBreaks();
    form.setTitle({ rawtext: [{ translate: getItemName(recipe.name) }] });

    fill(form, [...Array(9).keys()], "minecraft:black_stained_glass_pane");
    fill(form, [...Array(9).keys()].map((i) => i + 45), "minecraft:black_stained_glass_pane");

    form.setButton(4, {
        iconPath: getIconPath(route.icon),
        name: [{ translate: route.name }],
        lore: [
            { rawtext: [{ text: "§7" }, { translate: route.description }] },
            ...route.stages.map((stage, index) => ({
                rawtext: [
                    { text: index === session.stageIndex ? "§e▶ " : "§8  " },
                    { translate: stage.label },
                ],
            })),
            { rawtext: [{ text: "§d" }, { translate: "cooking.minigame.route_rule" }] },
        ],
        editedName: true,
        isGlint: true,
    });

    const statusLore = [
        ...getCookingEquipmentLore(session.cookware),
        { rawtext: [{ text: "§9" }, { translate: "cooking.status.phase" }, { text: `: ${session.phase}\n` }] },
        ...config.statuses.map((status) => ({
            rawtext: [
                { text: status.color ?? "§f" },
                { translate: status.name },
                { text: `: ${status.value(session, recipe)}\n` }
            ]
        })),
        { rawtext: [{ text: "§b" }, { translate: "cooking.status.actions" }, { text: `: ${session.actions}/${session.maxActions}\n` }] },
        { rawtext: [{ text: "§e" }, { translate: "cooking.status.amount" }, { text: `: ${session.quantity}\n` }] },
        { rawtext: [{ text: "§6" }, { translate: "cooking.minigame.stage" }, { text: ": " }, { translate: currentStage?.label ?? "cooking.stage.prep" }] },
        { rawtext: [{ text: "§d" }, { translate: "cooking.minigame.technique" }, { text: `: ${session.technique}/3` }] },
        { rawtext: [
            { text: "§6" },
            { translate: "cooking.minigame.level_technique" },
            { text: ": " },
            { translate: `cooking.minigame.level_tier.${levelProfile.tier}` },
            { text: ` (+${levelProfile.bonus})` },
        ] },
        { rawtext: [{ text: "§a" }, { translate: "cooking.minigame.route_cycles" }, { text: `: ${session.routeCycles}` }] },
        ...buildCookingMasteryLore(chefLevel, recipe.requiredLevel),
    ];

    if (session.lastOutcome) {
        statusLore.push({
            rawtext: [
                { text: "\n§f" },
                { translate: `cooking.minigame.outcome.${session.lastOutcome}` },
            ],
        });
    }

    form.setButton(18, {
        iconPath: getIconPath("minecraft:book"),
        name: "cooking.status.title",
        lore: statusLore,
        editedName: true
    });

    if (trouble) {
        form.setButton(26, {
            iconPath: getIconPath(trouble.icon),
            name: [{ text: "§c! " }, { translate: trouble.name }],
            lore: [
                { rawtext: [{ text: "§7" }, { translate: trouble.description }] },
                { rawtext: [{ text: "§c" }, { translate: "cooking.minigame.trouble.severity" }, { text: `: ${session.troubleSeverity + 1}/3` }] },
                ...(trouble.recoveryStages?.length
                    ? [{ rawtext: [{ text: "§b" }, { translate: "cooking.minigame.trouble.steps" }, { text: `: ${session.troubleProgress}/${trouble.recoveryStages.length}` }] }]
                    : []),
                { rawtext: [{ text: "§e" }, { translate: "cooking.minigame.trouble.hint" }] },
            ],
            editedName: true,
            isGlint: true,
        });
    } else {
        form.setButton(26, {
            iconPath: getIconPath("minecraft:clock"),
            name: "cooking.minigame.calm",
            lore: [{ rawtext: [{ text: "§7" }, { translate: "cooking.minigame.calm_lore" }] }],
            editedName: true,
        });
    }

    const lv = new JobLevel(player, "chef").getLevel();
    for (const action of config.actions) {
        if (lv < action.unlockLv) {
            form.setButton(action.slot, {
                iconPath: getIconPath("minecraft:barrier"),
                name: "cooking.locked",
                lore: [{ rawtext: [{ translate: "cooking.unlock_level" }, { text: ` ${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            form.setButton(action.slot, {
                iconPath: getIconPath(action.icon),
                name: action.name,
                lore: [{ rawtext: [{ text: "§7" }, { translate: "cooking.action.cost" }, { text: `: ${action.cost}` }] }],
                editedName: true,
            });
        }
    }

    form.setButton(49, {
        iconPath: getIconPath(completion.complete ? "minecraft:lime_dye" : "minecraft:barrier"),
        name: completion.complete ? "cooking.button.complete" : "cooking.minigame.finish.locked",
        lore: [
            { rawtext: [{ text: "§e" }, { translate: "cooking.lore.quality", with: [predictedRank] }] },
            { rawtext: [{ text: "§d" }, { translate: "cooking.minigame.technique" }, { text: `: ${session.technique}/3` }] },
            ...completion.goals.map((goal) => ({
                rawtext: [
                    { text: goal.current >= goal.target ? "§a✔ " : "§c✘ " },
                    { translate: goal.label },
                    { text: `: ${goal.current}/${goal.target}${goal.suffix ?? ""}` },
                ],
            })),
            ...(!completion.routeComplete
                ? [{ rawtext: [{ text: "§c" }, { translate: "cooking.minigame.finish.need_cycle" }] }]
                : []),
            { rawtext: [{ text: trouble ? "§c" : "§a" }, { translate: trouble ? "cooking.minigame.finish.trouble" : "cooking.minigame.finish.clear" }] },
        ],
        editedName: true,
    });

    form.show(player).then((response) => {
        if (!response || response.canceled) return;
        handleStationAction(player, config, response.selection ?? -1);
    });
}

function openSimpleStationRouteSelect(player: Player, config: SimpleStationFormConfig) {
    const session = config.sessions.get(player.id);
    if (!session) {
        config.openRecipeSelect(player);
        return;
    }

    const level = new JobLevel(player, "chef").getLevel();
    const routes = getAvailableCookingRoutes(config.routes, config.actions, level);
    if (routes.length === 0) {
        cancelArtisanCraft(session);
        config.sessions.delete(player.id);
        config.openRecipeSelect(player);
        return;
    }

    const form = new ChestFormData("small").enableLoreLineBreaks();
    form.setTitle({ rawtext: [{ translate: "cooking.minigame.route_select" }] });
    fill(form, [...Array(27).keys()], "minecraft:black_stained_glass_pane");
    const slots = routes.length === 1 ? [13] : routes.length === 2 ? [11, 15] : [10, 13, 16];
    routes.slice(0, 3).forEach((route, index) => {
        form.setButton(slots[index], {
            iconPath: getIconPath(route.icon),
            name: route.name,
            lore: [
                { rawtext: [{ text: "§7" }, { translate: route.description }] },
                { rawtext: [{ text: "§6" }, { translate: "cooking.minigame.route_reward" }, { text: `: +${route.rewardBonus}` }] },
                ...route.stages.map((stage, stageIndex) => {
                    const allowed = stage.actionKeys
                        .map((key) => config.actions.find((action) => action.key === key))
                        .filter((action) => action && action.unlockLv <= level);
                    return {
                        rawtext: [
                            { text: `§b${stageIndex + 1}. ` },
                            { translate: stage.label },
                            { text: " §8— §f" },
                            ...allowed.flatMap((action, actionIndex) => [
                                ...(actionIndex > 0 ? [{ text: " / " }] : []),
                                { translate: action!.name },
                            ]),
                        ],
                    };
                }),
            ],
            editedName: true,
        });
    });

    form.show(player).then((response) => {
        if (!response || response.canceled) return;
        const routeIndex = slots.indexOf(response.selection ?? -1);
        const route = routes[routeIndex];
        if (!route) {
            openSimpleStationRouteSelect(player, config);
            return;
        }
        session.routeId = route.id;
        session.stageIndex = 0;
        config.openCooking(player);
    });
}

function openQuantitySelect(player: Player, config: SimpleStationFormConfig, recipeId: string) {
    const recipe = config.recipes[recipeId];
    if (!recipe) return;

    const primaryResult = normalizeResult(recipe.result)[0];
    if (!primaryResult) return;

    const form = new ModalFormData()
        .title({ translate: "cooking.title.amount" })
        .slider({ translate: "cooking.status.amount" }, 1, getMaxStackAmount(primaryResult.id), { valueStep: 1, defaultValue: 1 })
        .submitButton({ translate: "mc.button.create" });

    form.show(player).then((response) => {
        if (response.canceled) return;
        const quantity = Number(response.formValues?.[0] ?? 1);
        startCooking(player, config, recipeId, quantity);
    });
}

function startCooking(player: Player, config: SimpleStationFormConfig, recipeId: string, quantity: number) {
    const recipe = config.recipes[recipeId];
    if (!recipe) return;

    const safeQuantity = Math.max(1, Math.floor(quantity));
    const scaledIngredients = getScaledIngredients(recipe, safeQuantity);

    if (!checkIngredients(player, scaledIngredients)) {
        config.openRecipeSelect(player);
        return;
    }

    const level = new JobLevel(player, "chef").getLevel();
    const levelActionBonus = getChefTechniqueProfile(level).actionBonus;
    const stationSession = config.createSession(recipe, safeQuantity, scaledIngredients, player);
    cancelArtisanCraft(config.sessions.get(player.id));
    config.sessions.set(player.id, {
        cookware: captureCookingEquipment(player, config.title),
        phase: "raw",
        ...stationSession,
        maxActions: (stationSession.maxActions ?? 8) + levelActionBonus + getSimpleStationSurplusActions(level, recipe.requiredLevel),
        recipeId,
        quantity: safeQuantity,
        scaledIngredients,
        actions: 0,
        routeId: undefined,
        stageIndex: 0,
        technique: 0,
        routeCycles: 0,
        mistakePenalty: 0,
        recoveryBonus: 0,
        troubleSeverity: 0,
        troubleProgress: 0,
    });
    config.openCooking(player);
}

function handleStationAction(player: Player, config: SimpleStationFormConfig, slot: number) {
    const session = config.sessions.get(player.id);
    if (!session) {
        config.openRecipeSelect(player);
        return;
    }

    const recipe = config.recipes[session.recipeId];
    if (!recipe) {
        cancelArtisanCraft(session);
        config.sessions.delete(player.id);
        return;
    }

    const completion = getSimpleStationCompletionState(config, session, recipe);
    if (slot === 49 && session.phase !== "raw" && completion.complete) {
        finishCooking(player, config, session, recipe);
        return;
    }

    if (slot === 49) {
        const unmetGoal = completion.unmetGoals[0];
        player.onScreenDisplay.setActionBar({
            rawtext: !completion.routeComplete
                ? [{ translate: "cooking.minigame.finish.need_cycle" }]
                : unmetGoal
                    ? [
                        { translate: "cooking.minigame.finish.locked" },
                        { text: " — " },
                        { translate: unmetGoal.label },
                        { text: `: ${unmetGoal.current}/${unmetGoal.target}${unmetGoal.suffix ?? ""}` },
                    ]
                    : [{ translate: "cooking.minigame.finish.locked" }],
        });
        config.openCooking(player);
        return;
    }

    const action = config.actions.find((item) => item.slot === slot);
    if (!action) {
        config.openCooking(player);
        return;
    }

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        config.openCooking(player);
        return;
    }

    if (session.actions + action.cost > session.maxActions) {
        session.phase = "failed";
        finishCooking(player, config, session, recipe);
        return;
    }

    const route = config.routes.find((item) => item.id === session.routeId);
    if (!route) {
        session.routeId = undefined;
        config.openCooking(player);
        return;
    }

    const activeTrouble = config.troubles.find((item) => item.id === session.troubleId);
    const troubleOutcome = applyCookingTroubleChoice(session, activeTrouble, action.key);
    if (troubleOutcome === "recovered" || troubleOutcome === "recovering" || troubleOutcome === "worsened") {
        session.lastOutcome = troubleOutcome;
    } else {
        const routeSuccess = advanceCookingRoute(session, route, action.key);
        session.lastOutcome = routeSuccess ? "stage" : "mistake";
    }

    action.run(session, recipe, player);
    if (session.phase === "raw") session.phase = "cooking";
    session.actions += action.cost;

    if (!activeTrouble && !session.troubleId) {
        const beforeTroubleOutcome = session.lastOutcome;
        const started = maybeStartCookingTrouble(
            session,
            config.troubles,
            config.actions,
            lv,
            session.maxActions - session.actions,
        );
        if (!started) session.lastOutcome = beforeTroubleOutcome;
    }
    config.openCooking(player);
}

function finishCooking(player: Player, config: SimpleStationFormConfig, session: SimpleStationSession, recipe: SimpleStationRecipe) {
    if (session.artisanCraftStarted) return;
    if (!requireCookingEquipment(player, session.cookware)) return;
    if (!checkIngredients(player, session.scaledIngredients)) {
        cancelArtisanCraft(session);
        config.sessions.delete(player.id);
        return;
    }

    const level = new JobLevel(player, "chef").getLevel();
    const route = config.routes.find((item) => item.id === session.routeId);
    const levelTechnique = getChefLevelTechnique(level);
    const routeReward = session.routeCycles > 0 ? route?.rewardBonus ?? 0 : 0;
    const { rank, mul } = capCookingRankByRecipe(player, {
        rank: rankFromScore(
            config.score(session, recipe) + getCookwareScoreBonus(session.cookware) + getCookingTechniqueAdjustment(session, level, route) + getSimpleStationMasteryBonus(level, recipe.requiredLevel),
            session.phase === "failed",
        ),
        mul: 1,
    }, recipe.requiredLevel);
    const produce = () => {
        consume(player, session.scaledIngredients);
        addResults(player, recipe, session.quantity, rank, levelTechnique, routeReward);
        rememberLastCraftedRecipe(player.id, config.title, session.recipeId);
        config.sessions.delete(player.id);
    };
    const earnedReward = config.rewardJob === "chef" && session.phase !== "failed"
        && jobs_config.validity && player.hasTag("mcjobs_chef");
    if (config.rewardJob) {
        if (!runArtisanCraft(player, session, () => {
            if (!earnedReward) return undefined;
            const job = new JobLevel(player, "chef");
            const quantity = session.quantity;
            const money = Math.floor(getRandomInteger(jobs_config.chefReward.min, jobs_config.chefReward.max)
                * job.getReward(level) * new RewardBuff().getMultiplier("chef") * quantity * mul * 100) / 100;
            const xp = jobs_config.chefReward.xp * Math.min(quantity, 25) * mul;
            return { job: "chef", money, xp, rank, display: "cooking" };
        }, produce)) return;
    } else {
        produce();
    }

    // The receipt handler displays the actual paid reward, including the daily cap.
    if (!earnedReward) player.onScreenDisplay.setActionBar({
        rawtext: [
            { translate: getItemName(recipe.name) },
            { text: ` x${session.quantity} ` },
            { translate: "cooking.button.complete" },
            { text: " §6" },
            { translate: "cooking.minigame.result.level_technique", with: [`${levelTechnique}`] },
            ...(routeReward > 0
                ? [{ text: " §d" }, { translate: "cooking.minigame.result.route_bonus", with: [`${routeReward}`] }]
                : []),
        ]
    });
}
