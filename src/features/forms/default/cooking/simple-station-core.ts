import { ItemStack, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { itemIdToPath } from "@/config/textures.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { capCookingRankByChefLevel } from "@/domain/cooking/quality-cap.js";
import {
    adjacentRecipeCategory,
    filterRecipeIds,
    getAvailableRecipeCategories,
    resolveRecipeCategory,
} from "@/domain/cooking/recipe-category.js";
import {
    cleanRecipeSearchQuery,
    filterUnlockedRecipesForSearch,
    isRecipeSearchActive,
    sortRecipeIdsByLevel,
} from "@/domain/recipes/recipe-list.js";
import { createResultStacks } from "@/domain/recipes/recipe-result.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";

export type SimpleStationResult = string | { id: string; count?: number } | { id: string; count?: number }[];

export type SimpleStationRecipe = {
    name: string;
    result: SimpleStationResult;
    requiredLevel: number;
    ingredients: Record<string, number>;
};

export type SimpleStationRecipes = Record<string, SimpleStationRecipe>;

export type SimpleStationSession = {
    recipeId: string;
    quantity: number;
    scaledIngredients: Record<string, number>;
    actions: number;
    maxActions: number;
    phase: string;
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

export type SimpleStationFormConfig = {
    title: string;
    recipes: SimpleStationRecipes;
    sessions: Map<string, SimpleStationSession>;
    actions: SimpleStationAction[];
    statuses: SimpleStationStatus[];
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

function addResults(player: Player, recipe: SimpleStationRecipe, quantity: number, rank: string) {
    const inv = getInventory(player);
    if (!inv) return;

    for (const [index, result] of normalizeResult(recipe.result).entries()) {
        for (const item of createResultStacks(result.id, result.count * quantity)) {
            if (index === 0) {
                item.setLore([
                    { rawtext: [{ text: "§r§a==============" }] },
                    { rawtext: [{ text: "§r§e" }, { translate: "cooking.lore.quality", with: [rank] }] },
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

function buildRecipeLore(recipe: SimpleStationRecipe) {
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
        ]
    }];
}

export function openSimpleStationRecipeSelect(player: Player, config: SimpleStationFormConfig, page = 0, categoryId = "all", searchQuery = "") {
    const form = new ChestFormData("large");
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
    const selectedCategory = resolveRecipeCategory(config.recipes, categoryId);
    const availableCategories = getAvailableRecipeCategories(config.recipes, selectedCategory.id);
    const recipeIds = filterUnlockedRecipesForSearch(
        filterRecipeIds(sortRecipeIdsByLevel(Object.keys(config.recipes), config.recipes), config.recipes, selectedCategory.id),
        config.recipes,
        cleanSearchQuery,
        lv
    );
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
                ? buildRecipeLore(recipe)
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
            name: [{ translate: "cooking.category.prev" }, { text: "\n§7" }, { translate: previousCategory.label }],
            editedName: true
        });

        form.setButton(51, {
            iconPath: getIconPath(nextCategory.icon),
            name: [{ translate: "cooking.category.next" }, { text: "\n§7" }, { translate: nextCategory.label }],
            editedName: true
        });
    }

    form.setButton(48, {
        iconPath: getIconPath("minecraft:compass"),
        name: searchActive ? `§e検索: ${cleanSearchQuery}` : "§e検索",
        lore: [{ rawtext: [{ text: "§7ID/素材/完成品で検索" }] }],
        editedName: true
    });

    if (searchActive) {
        form.setButton(50, {
            iconPath: getIconPath("minecraft:barrier"),
            name: "§c検索を解除",
            editedName: true
        });
    }

    const pageLore: any[] = [{ rawtext: [{ text: "§b" }, { translate: selectedCategory.label }] }];
    if (searchActive) {
        pageLore.push({ rawtext: [{ text: `§e検索: ${cleanSearchQuery}` }] });
    }

    form.setButton(49, {
        iconPath: getIconPath("minecraft:paper"),
        name: [{ translate: "cooking.page.current", with: [`${safePage + 1}`, `${totalPages}`] }],
        lore: pageLore,
        editedName: true
    });

    form.show(player).then((response) => {
        if (!response || response.canceled) return;

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
        .title({ text: "レシピ検索" })
        .textField({ text: "検索語句" }, { text: "ID・素材・完成品" }, { defaultValue: searchQuery });

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
        config.sessions.delete(player.id);
        return;
    }

    const form = new ChestFormData("large");
    form.setTitle({ rawtext: [{ translate: getItemName(recipe.name) }] });

    fill(form, [...Array(9).keys()], "minecraft:black_stained_glass_pane");
    fill(form, [...Array(9).keys()].map((i) => i + 45), "minecraft:black_stained_glass_pane");

    const statusLore = [
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
    ];

    form.setButton(18, {
        iconPath: getIconPath("minecraft:book"),
        name: "cooking.status.title",
        lore: statusLore,
        editedName: true
    });

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
                editedName: true
            });
        }
    }

    form.setButton(49, {
        iconPath: getIconPath("minecraft:lime_dye"),
        name: "cooking.button.complete",
        editedName: true
    });

    form.show(player).then((response) => {
        if (!response || response.canceled) return;
        handleStationAction(player, config, response.selection ?? -1);
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

    config.sessions.set(player.id, {
        phase: "raw",
        maxActions: 8,
        ...config.createSession(recipe, safeQuantity, scaledIngredients, player),
        recipeId,
        quantity: safeQuantity,
        scaledIngredients,
        actions: 0,
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
        config.sessions.delete(player.id);
        return;
    }

    if (slot === 49 && session.phase !== "raw") {
        finishCooking(player, config, session, recipe);
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

    action.run(session, recipe, player);
    if (session.phase === "raw") session.phase = "cooking";
    session.actions += action.cost;
    config.openCooking(player);
}

function finishCooking(player: Player, config: SimpleStationFormConfig, session: SimpleStationSession, recipe: SimpleStationRecipe) {
    if (!checkIngredients(player, session.scaledIngredients)) {
        config.sessions.delete(player.id);
        return;
    }

    consume(player, session.scaledIngredients);

    const { rank } = capCookingRankByChefLevel(player, {
        rank: rankFromScore(config.score(session, recipe), session.phase === "failed"),
        mul: 1,
    });
    addResults(player, recipe, session.quantity, rank);
    config.sessions.delete(player.id);

    player.onScreenDisplay.setActionBar({
        rawtext: [
            { translate: getItemName(recipe.name) },
            { text: ` x${session.quantity} ` },
            { translate: "cooking.button.complete" }
        ]
    });
}
