import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { DeepStewRecipes } from "../../../data/cooking/deepstew_recipe";
import { itemIdToPath } from "../../../texture_config";
import jobs_config from "../../../jobs_config";
import { JobLevel } from "../../../lib/jobslevel";
import { RewardBuff } from "../../../api/rewardbuff";
import { getRandomInteger, langChangeItemName } from "../../../lib/util";
import { DynamicProperties } from "../../../api/dyp";
import { applyDailyLimit } from "../../../lib/jobs";
import { ModalFormData } from "@minecraft/server-ui";
import config from "../../../config";

/* ===============================
   Init
================================ */
let buff;
let playerDB;

world.afterEvents.worldLoad.subscribe(() => {
    buff = new RewardBuff();
    playerDB = new DynamicProperties("player");
});

/* ===============================
   Session
================================ */
const deepPotSessions = new Map();

/* ===============================
   Inventory Utils
================================ */
function countInventory(player) {
    const inv = player.getComponent("inventory").container;
    const counts = {};
    for (let i = 0; i < inv.size; i++) {
        const it = inv.getItem(i);
        if (!it) continue;
        counts[it.typeId] = (counts[it.typeId] ?? 0) + it.amount;
    }
    return counts;
}

function hasAll(player, req) {
    const inv = countInventory(player);
    return Object.entries(req).every(([id, n]) => (inv[id] ?? 0) >= n);
}

function consume(player, req) {
    const inv = player.getComponent("inventory").container;
    for (const [id, need] of Object.entries(req)) {
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

function checkIngredients(player, required) {
    const inv = countInventory(player);
    const missing = [];

    for (const [id, amount] of Object.entries(required)) {
        const have = inv[id] ?? 0;
        if (have < amount) {
            missing.push({ id, need: amount - have });
        }
    }

    if (missing.length > 0) {
        const lines = missing.map(m => {
            return { rawtext: [{ text: '\n- ' }, { translate: langChangeItemName(m.id) }, { text: ` x ${m.need}` }] };
        });
        player.sendMessage({
            rawtext: [{ translate: "cooking.error.insufficient_materials" }, ...lines]
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

function fill(form, slots, itemId, name = " ", lore = []) {
    slots.forEach(s => {
        form.setButton(s, {
            iconPath: itemIdToPath[itemId],
            name,
            lore,
            editedName: true
        });
    });
}

function isBurnDanger(pot, recipe) {
    return (
        pot.heat > recipe.needHeat[1] + 60 ||
        pot.burned >= 70 ||
        pot.actions >= pot.maxActions - 2
    );
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    return recipe.baseActions + Math.min(Math.floor(lv / 4), 40 + (recipe.requiredLevel * 4));
}

function heatVariance(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 10 - Math.floor(diff / 4)),
        Math.max(1, 10 - Math.floor(diff / 4))
    );
}

function seasoningSuccessRate(pot, recipe) {
    let rate = 1;

    if (pot.heat < recipe.needHeat[0]) rate -= 0.2;
    if (pot.heat > recipe.needHeat[1]) rate -= 0.2;
    if (pot.progress < 30) rate -= 0.25;
    if (pot.depth < 50) rate -= 0.15;

    rate -= pot.usedSeasonings.length * 0.08;

    return Math.max(0.05, rate);
}

const RANK_QUALITY_TABLE = {
    "KARON": 15,
    "IMPOSSIBLE": 12,
    "EXTRA": 10,
    "LEGENDARY": 8,
    "SSS": 7,
    "SS": 6,
    "S": 5,
    "A": 4,
    "B": 3,
    "C": 2,
    "D": 1,
    "E": 0,
    "F": 0,
};

/**
 * 
 * @param {ItemStack} item 
 * @returns 
 */
function getItemQuality(item) {
    if (item?.getRawLore().length == 0) return 0;

    const lore = item.getRawLore() ?? [];

    for (const line of lore) {
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            if (part.with && part.with.length > 0) {
                const rank = part.with[0]
                if (rank in RANK_QUALITY_TABLE) {
                    return RANK_QUALITY_TABLE[rank];
                }
            }
        }
    }
    return 0;
}

/* ===============================
   Actions (深い鍋用)
================================ */
const DeepPotActions = [
    /* ===== 基本操作 ===== */
    {
        key: "increase_heat",
        slot: 20,
        name: "cooking.action.increase_heat",
        icon: "minecraft:blaze_powder",
        unlockLv: 1,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.heat += getRandomInteger(35, 60) + ctx.heatVariance();
            pot.progress += pot.heat >= recipe.needHeat[0] ? 10 : 3;
            pot.depth += 5;
            if (pot.heat > recipe.needHeat[1]) {
                pot.burned += 10;
            }
            pot.phase = "cooking";
            player.stopSound('cooking.deep_idle');
            player.stopSound('cooking.deep_stir');
            player.stopSound('cooking.cool');
            player.stopSound('cooking.deep_boil');
            player.playSound('cooking.fire', player.location);
        }
    },
    {
        key: "stir",
        slot: 21,
        name: "cooking.action.stir",
        icon: "minecraft:stick",
        unlockLv: 1,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += getRandomInteger(8, 15);
            pot.consistency += 6;
            pot.burned -= 4;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_boil');
            player.playSound('cooking.deep_stir', player.location);
        }
    },
    {
        key: "add_seasoning",
        slot: 22,
        name: "cooking.action.add_seasoning",
        icon: "minecraft:sugar",
        unlockLv: 2,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            if (pot.usedSeasonings.length >= recipe.maxSeasonings) {
                pot.score -= 2;
                return;
            }

            for (const s of Object.keys(recipe.seasonings ?? {})) {
                if (!hasAll(player, { [s]: 1 })) continue;

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
                pot.seasoningQuality += q;
                pot.seasoningCount += 1;

                consume(player, { [s]: 1 });

                const rate = seasoningSuccessRate(pot, recipe);
                if (Math.random() <= rate) {
                    pot.score += recipe.seasonings[s] * 1.5;
                    pot.flavor += 12;
                    pot.umami += 8;
                } else {
                    pot.score -= recipe.seasonings[s];
                    pot.heat += 20;
                    pot.flavor -= 6;
                }
                pot.usedSeasonings.push(s);
                player.stopSound('cooking.fire');
                player.playSound('cooking.seasoning', player.location);
                return;
            }
        }
    },

    /* ===== 深い鍋専用アクション ===== */
    {
        key: "layer_ingredients",
        slot: 23,
        name: "cooking.action.layer_ingredients",
        icon: "minecraft:cake",
        unlockLv: 3,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "layering";
            pot.layers += 1;
            pot.depth += 15;
            pot.consistency += 10;
            pot.score += 3;
            pot.umami += 5;
            player.playSound('cooking.layer', player.location);
        }
    },

    /* ===== 拡張アクション ===== */
    {
        key: "reduce_heat",
        slot: 27,
        name: "cooking.action.reduce_heat",
        icon: "minecraft:ice",
        unlockLv: 5,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.heat -= getRandomInteger(25, 45);
            pot.progress += 4;
            pot.burned -= 12;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_boil');
            player.stopSound('cooking.deep_stir');
            player.playSound('cooking.cool', player.location);
        }
    },
    {
        key: "vigorous_stir",
        slot: 28,
        name: "cooking.action.vigorous_stir",
        icon: "minecraft:wooden_shovel",
        unlockLv: 10,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += getRandomInteger(12, 22);
            pot.consistency += 12;
            pot.burned -= 10;
            pot.heat -= 8;
            pot.depth += 8;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_boil');
            player.playSound('cooking.deep_stir', player.location);
        }
    },
    {
        key: "slow_cook",
        slot: 29,
        name: "cooking.action.slow_cook",
        icon: "minecraft:campfire",
        unlockLv: 12,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "slow_cooking";
            pot.progress += 18;
            pot.consistency += 8;
            pot.flavor += 10;
            pot.depth += 20;
            pot.umami += 12;
            pot.score += 4;
            if (pot.heat > recipe.needHeat[1]) {
                pot.burned += 2;
            }
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_stir');
            player.stopSound('cooking.cool');
            player.playSound('cooking.deep_cook', player.location);
        }
    },
    {
        key: "simmer",
        slot: 30,
        name: "cooking.action.simmer",
        icon: "minecraft:cauldron",
        unlockLv: 15,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += 22;
            pot.consistency += 12;
            pot.flavor += 10;
            pot.score += 3;
            pot.umami += 8;
            if (pot.heat > recipe.needHeat[1]) {
                pot.burned += 4;
            }
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_stir');
            player.stopSound('cooking.cool');
            player.playSound('cooking.deep_boil', player.location);
        }
    },
    {
        key: "press_down",
        slot: 31,
        name: "cooking.action.press_down",
        icon: "minecraft:heavy_weighted_pressure_plate",
        unlockLv: 18,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "pressing";
            pot.progress += 10;
            pot.consistency += 18;
            pot.depth += 10;
            pot.layers += 1;
            pot.score += 2;
            player.playSound('cooking.press', player.location);
        }
    },
    {
        key: "rapid_boil",
        slot: 32,
        name: "cooking.action.rapid_boil",
        icon: "minecraft:magma_cream",
        unlockLv: 20,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.heat += getRandomInteger(70, 110) + ctx.heatVariance();
            pot.progress += 28;
            pot.consistency += 15;
            pot.burned += 18;
            pot.depth += 12;
            player.stopSound('cooking.deep_idle');
            player.stopSound('cooking.deep_stir');
            player.stopSound('cooking.cool');
            player.playSound('cooking.deep_boil', player.location);
        }
    },
    {
        key: "add_broth",
        slot: 33,
        name: "cooking.action.add_broth",
        icon: "minecraft:potion",
        unlockLv: 22,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += 12;
            pot.depth += 25;
            pot.umami += 15;
            pot.flavor += 12;
            pot.score += 5;
            player.playSound('cooking.broth', player.location);
        }
    },
    {
        key: "skim_foam",
        slot: 34,
        name: "cooking.action.skim_foam",
        icon: "minecraft:bowl",
        unlockLv: 25,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += 6;
            pot.clarity += 18;
            pot.score += 4;
            pot.umami += 5;
            player.playSound('cooking.skim', player.location);
        }
    },
    {
        key: "deep_stir",
        slot: 35,
        name: "cooking.action.deep_stir",
        icon: "minecraft:iron_shovel",
        unlockLv: 28,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            pot.progress += getRandomInteger(20, 30);
            pot.consistency += 20;
            pot.depth += 15;
            pot.layers = Math.max(1, pot.layers - 1);
            pot.burned -= 12;
            pot.heat -= 10;
            pot.umami += 10;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_boil');
            player.playSound('cooking.deep_stir', player.location);
        }
    },
    {
        key: "taste_test",
        slot: 36,
        name: "cooking.action.taste_test",
        icon: "minecraft:honey_bottle",
        unlockLv: 30,
        cost: 1,
        run(pot, recipe, ctx, player) {
            pot.phase = "cooking";
            const add = Math.random() * 0.4;
            pot.precision = Math.min(1, pot.precision + add);
            pot.flavor += 6;
            pot.umami += 4;
            player.playSound('cooking.taste', player.location);
        }
    },
    {
        key: "rest",
        slot: 37,
        name: "cooking.action.rest",
        icon: "minecraft:clock",
        unlockLv: 35,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "resting";
            pot.heat -= 10;
            pot.consistency += 8;
            pot.clarity += 10;
            pot.flavor += 5;
            pot.depth += 5;
            pot.umami += 8;
            pot.score += 2;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.deep_boil');
            player.stopSound('cooking.deep_stir');
            player.playSound('cooking.deep_idle', player.location);
        }
    },
    {
        key: "extract_essence",
        slot: 38,
        name: "cooking.action.extract_essence",
        icon: "minecraft:dragon_breath",
        unlockLv: 40,
        cost: 3,
        run(pot, recipe, ctx, player) {
            pot.phase = "extracting";
            pot.progress += 15;
            pot.clarity += 25;
            pot.umami += 20;
            pot.flavor += 15;
            pot.score += 8;
            player.playSound('cooking.extract', player.location);
        }
    },
    {
        key: "infuse_herbs",
        slot: 39,
        name: "cooking.action.infuse_herbs",
        icon: "minecraft:sweet_berries",
        unlockLv: 45,
        cost: 2,
        run(pot, recipe, ctx, player) {
            pot.phase = "infusing";
            pot.flavor += 20;
            pot.umami += 15;
            pot.clarity += 10;
            pot.score += 6;
            pot.depth += 10;
            player.playSound('cooking.infuse', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openDeepStewRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "cooking.title.deep_pot" }] });

    const lv = new JobLevel(player, "chef").getLevel();
    const recipeIds = Object.keys(DeepStewRecipes);

    // ==== 枠装飾 ====
    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:cyan_stained_glass_pane"
    );

    // ==== ページ計算 ====
    const start = page * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        const r = DeepStewRecipes[id];
        const slot = RECIPE_SLOTS[i];

        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: ` x${r.ingredients[key]}` }
            );
        }

        const seasonings = [];
        for (const key of Object.keys(r.seasonings ?? {})) {
            seasonings.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: `` }
            );
        }

        form.setButton(slot, {
            iconPath: lv >= r.requiredLevel
                ? itemIdToPath[r.name]
                : itemIdToPath["minecraft:barrier"],
            name: lv >= r.requiredLevel
                ? langChangeItemName(r.name)
                : "cooking.locked",
            lore: lv >= r.requiredLevel
                ? [{
                    rawtext: [
                        { translate: "cooking.heat_range" },
                        { text: `: ${r.needHeat[0]}-${r.needHeat[1]}°\n§9` },
                        { translate: "cooking.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "cooking.seasonings" },
                        { text: ":" },
                        ...seasonings,
                        { text: "\n§d" },
                        { translate: "cooking.deep_pot.specialty" }
                    ]
                }]
                : [{
                    rawtext: [
                        { translate: "cooking.unlock_level" },
                        { text: ` ${r.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    // ==== ページ操作 ====
    if (page > 0) {
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "cooking.page.prev",
            editedName: true
        });
    }

    if ((page + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "cooking.page.next",
            editedName: true
        });
    }

    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:paper"],
        name: `§ePage ${page + 1}/${Math.ceil(recipeIds.length / RECIPES_PER_PAGE)}`,
        editedName: true
    });

    form.show(player).then(r => {
        if (r.canceled) return;

        if (r.selection === 45) {
            openDeepStewRecipeSelect(player, page - 1);
            return;
        }
        if (r.selection === 53) {
            openDeepStewRecipeSelect(player, page + 1);
            return;
        }

        const index = RECIPE_SLOTS.indexOf(r.selection);
        if (index === -1) return;

        const recipeId = pageRecipes[index];
        if (!recipeId) return;

        openQuantitySelect(player, recipeId);
    });
}

function openQuantitySelect(player, recipeId) {
    const recipe = DeepStewRecipes[recipeId];
    const form = new ModalFormData()
        .title({ translate: 'cooking.title.amount' })
        .slider({ translate: 'cooking.status.amount' }, 1, new ItemStack(recipe.result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        startCooking(player, recipeId, r.formValues[0]);
    });
}

function calcAverageMaterialQuality(player, req) {
    const inv = player.getComponent("inventory").container;

    let totalQ = 0;
    let totalCount = 0;

    for (const [id, need] of Object.entries(req)) {
        let remain = need;

        for (let i = 0; i < inv.size && remain > 0; i++) {
            const it = inv.getItem(i);
            if (!it || it.typeId !== id) continue;

            const take = Math.min(it.amount, remain);
            const q = getItemQuality(it);

            totalQ += q * take;
            totalCount += take;
            remain -= take;
        }
    }

    return totalCount === 0 ? 0 : Math.floor(totalQ / totalCount);
}

function startCooking(player, recipeId, quantity) {
    const recipe = DeepStewRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    deepPotSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        heat: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "raw",
        burned: 0,
        consistency: 0,
        flavor: 0,
        clarity: 0,
        depth: 0,
        layers: 0,
        umami: 0,
        usedSeasonings: [],
        precision: Math.random(),
        materialQuality,
        seasoningQuality: 0,
        seasoningCount: 0,

        ctx: { heatVariance: () => heatVariance(player, recipe) }
    });

    openDeepPot(player);
}

function openDeepPot(player) {
    const pot = deepPotSessions.get(player.id);
    const recipe = DeepStewRecipes[pot.recipeId];
    const lv = new JobLevel(player, "chef").getLevel();

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys()],
        "minecraft:cyan_stained_glass_pane"
    );
    fill(form, [...Array(9).keys()].map(i => i + 45),
        "minecraft:cyan_stained_glass_pane"
    );

    const burnDanger = isBurnDanger(pot, recipe);
    if (burnDanger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:red_stained_glass_pane",
            "cooking.burn.warning.title",
            [{ translate: 'cooking.burn.warning.lore' }]
        );
    }

    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "cooking.status.title",
        lore: [
            { rawtext: [{ text: '§9' }, { translate: "cooking.status.phase" }, { text: `: ${pot.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "cooking.status.heat" }, { text: `: ${pot.heat}°(${Math.floor((recipe.needHeat[0] + recipe.needHeat[1]) / 2)}°)\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "cooking.status.progress" }, { text: `: ${pot.progress}%\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "cooking.status.burned" }, { text: `: ${Math.max(0, pot.burned)}%\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "cooking.status.consistency" }, { text: `: ${Math.max(0, pot.consistency)}%\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "cooking.status.flavor" }, { text: `: ${Math.max(0, pot.flavor)}\n` }] },
            { rawtext: [{ text: '§3' }, { translate: "cooking.status.depth" }, { text: `: ${Math.max(0, pot.depth)}\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "cooking.status.layers" }, { text: `: ${pot.layers}\n` }] },
            { rawtext: [{ text: '§2' }, { translate: "cooking.status.umami" }, { text: `: ${Math.max(0, pot.umami)}\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "cooking.status.actions" }, { text: `: ${pot.actions}/${pot.maxActions}\n` }] },
            { rawtext: [{ text: '§f' }, { translate: "cooking.status.amount" }, { text: `: ${pot.quantity}\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "cooking.lore.quality", with: [`${calcRank(pot, recipe).rank}`] }] }
        ],
        editedName: true
    });

    for (const action of DeepPotActions) {
        if (lv < action.unlockLv) {
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "cooking.locked",
                lore: [{ rawtext: [{ translate: "cooking.unlock_level" }, { text: `${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            form.setButton(action.slot, {
                iconPath: itemIdToPath[action.icon],
                name: action.name,
                lore: [{ rawtext: [{ text: '§7' }, { translate: "cooking.action.cost" }, { text: `: ${action.cost}` }] }],
                editedName: true
            });
        }
    }

    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:lime_dye"],
        name: "cooking.button.complete",
        editedName: true
    });

    form.show(player).then(r => {
        handleAction(player, r.selection || 0);
    });
}

/* ===============================
   Logic
================================ */
function handleAction(player, slot) {
    const pot = deepPotSessions.get(player.id);
    const recipe = DeepStewRecipes[pot.recipeId];

    if (slot === 49 && pot.phase != 'raw') {
        finish(player);
        return;
    }

    const action = DeepPotActions.find(a => a.slot === slot);
    if (!action) {
        openDeepPot(player);
        return;
    }

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        openDeepPot(player);
        return;
    }
    if (pot.actions + action.cost > pot.maxActions) {
        pot.phase = "burned";
        finish(player);
        return;
    }

    action.run(pot, recipe, pot.ctx, player);
    pot.actions += action.cost;
    pot.heat = Math.floor(pot.heat * 100) / 100;
    pot.progress = Math.floor(pot.progress * 100) / 100;
    pot.burned = Math.max(0, Math.floor(pot.burned * 100) / 100);
    pot.consistency = Math.max(0, Math.floor(pot.consistency * 100) / 100);
    pot.flavor = Math.max(0, Math.floor(pot.flavor * 100) / 100);
    pot.clarity = Math.max(0, Math.floor(pot.clarity * 100) / 100);
    pot.depth = Math.max(0, Math.floor(pot.depth * 100) / 100);
    pot.umami = Math.max(0, Math.floor(pot.umami * 100) / 100);

    openDeepPot(player);
}

function calcHeatScore(heat, needHeat, maxScore = 5) {
    const min = needHeat[0];
    const max = needHeat[1];

    if (heat < min || heat > max) return 0;

    const mid = Math.floor((min + max) / 2);
    const distance = Math.abs(heat - mid);
    const score = maxScore - Math.floor(distance / 12);

    return Math.max(0, score);
}

function calcEfficiencyBonus(pot, recipe) {
    const heatScore = calcHeatScore(pot.heat, recipe.needHeat, 15);

    if (heatScore < 12) return 0;

    const used = pot.actions;
    const max = pot.maxActions;

    if (used <= max * 0.35) return 10;
    if (used <= max * 0.55) return 8;
    if (used <= max * 0.75) return 5;
    return 0;
}

function calcRank(pot, recipe) {
    let score = pot.score;

    // progress
    score += Math.min(6, Math.floor(pot.progress / 20));

    // heat
    score += calcHeatScore(pot.heat, recipe.needHeat, 15);

    // burned (焦げが少ないほど高評価)
    score += Math.floor((100 - Math.max(0, pot.burned)) / 8);

    // consistency (濃度)
    score += Math.min(6, Math.floor(pot.consistency / 18));

    // flavor (風味)
    score += Math.min(6, Math.floor(pot.flavor / 12));

    // clarity (透明度/純度)
    score += Math.min(4, Math.floor(pot.clarity / 18));

    // depth (深さ)
    score += Math.min(8, Math.floor(pot.depth / 15));

    // layers (層)
    score += Math.min(5, pot.layers);

    // umami (旨味)
    score += Math.min(7, Math.floor(pot.umami / 10));

    // efficiency bonus
    score += calcEfficiencyBonus(pot, recipe);

    // precision
    score += Math.min(4, Math.floor(pot.precision * 4));

    // material quality
    score += pot.materialQuality * 2;

    // seasoning quality (平均)
    if (pot.seasoningCount > 0) {
        score += Math.floor(
            pot.seasoningQuality / pot.seasoningCount * 1.5
        );
    }

    // burned は即死
    if (pot.phase === "burned") {
        return { rank: "F", mul: 0.3 };
    }

    if (score >= 85) return { rank: "KARON", mul: 15 };
    if (score >= 70) return { rank: "IMPOSSIBLE", mul: 8 };
    if (score >= 63) return { rank: "EXTRA", mul: 5 };
    if (score >= 52) return { rank: "LEGENDARY", mul: 3.0 };
    if (score >= 48) return { rank: "SSS", mul: 2.5 };
    if (score >= 44) return { rank: "SS", mul: 2.2 };
    if (score >= 40) return { rank: "S", mul: 2.0 };
    if (score >= 36) return { rank: "A", mul: 1.8 };
    if (score >= 32) return { rank: "B", mul: 1.6 };
    if (score >= 28) return { rank: "C", mul: 1.4 };
    if (score >= 15) return { rank: "D", mul: 1.2 };
    if (score >= 10) return { rank: "E", mul: 1.0 };
    return { rank: "F", mul: 0.3 };
}

/* ===============================
   Finish
================================ */
/**
 * 
 * @param {Player} player 
 * @returns 
 */
function finish(player) {
    const pot = deepPotSessions.get(player.id);
    const recipe = DeepStewRecipes[pot.recipeId];

    if (!checkIngredients(player, pot.scaledIngredients)) {
        deepPotSessions.delete(player.id);
        return;
    }

    consume(player, pot.scaledIngredients);

    const { rank, mul } = calcRank(pot, recipe);

    const item = new ItemStack(
        rank === "F" && pot.phase === "burned"
            ? "minecraft:charcoal"
            : recipe.result,
        pot.quantity
    );

    item.setLore([
        { rawtext: [{ text: '§r§3==============' }] },
        { rawtext: [{ text: '§r§e' }, { translate: "cooking.lore.quality", with: [`${rank}`] }] },
        { rawtext: [{ text: '§r§d' }, { translate: "cooking.deep_pot.specialty" }] },
        { rawtext: [{ text: '§r§3==============' }] },
    ]);

    player.getComponent("inventory").container.addItem(item);
    deepPotSessions.delete(player.id);

    player.stopSound('cooking.deep_idle');
    player.stopSound('cooking.fire');
    player.stopSound('cooking.deep_stir');
    player.stopSound('cooking.deep_boil');
    player.stopSound('cooking.cool');
    player.playSound('cooking.complete', player.location);

    if (jobs_config.validity && player.hasTag('mcjobs_chef')) {
        /* ===== Chef Job ===== */
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
                6
            ) / 100;

        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        const finalReward = applyDailyLimit(
            playerData,
            "chef",
            reward,
            jobs_config.dailyLimit.chef
        );

        if (finalReward > 0) {
            job.addXp(recipe.baseXp * mul * 1.5);
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        }

        player.onScreenDisplay.setActionBar(
            {
                rawtext: [
                    { translate: "cooking.reward.prefix" },
                    { text: ` ${rank} ` },
                    { translate: "cooking.reward.money" },
                    { text: `+${finalReward}${config.MoneyName}` },
                    { translate: "cooking.reward.xp" },
                    { text: `${job.getXp()}/${job.getXpRequired(level)}` }
                ]
            }
        );
    }
}