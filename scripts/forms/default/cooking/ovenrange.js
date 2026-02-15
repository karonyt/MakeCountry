import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { OvenRecipes } from "../../../data/cooking/oven_recipe";
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
const ovenSessions = new Map();

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

function isOvercookDanger(oven, recipe) {
    return (
        oven.temperature > recipe.needTemp[1] + 30 ||
        oven.overcooked >= 80 ||
        oven.actions >= oven.maxActions - 1
    );
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    return recipe.baseActions + Math.min(Math.floor(lv / 5), 30 + (recipe.requiredLevel * 3));
}

function tempVariance(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 5 - Math.floor(diff / 4)),
        Math.max(1, 5 - Math.floor(diff / 4))
    );
}

function toppingSuccessRate(oven, recipe) {
    let rate = 1;

    if (oven.temperature < recipe.needTemp[0]) rate -= 0.15;
    if (oven.temperature > recipe.needTemp[1]) rate -= 0.15;
    if (oven.progress < 30) rate -= 0.2;

    rate -= oven.usedToppings.length * 0.1;

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
   Actions (オーブン用)
================================ */
const OvenActions = [
    /* ===== 基本操作 ===== */
    {
        key: "increase_temp",
        slot: 20,
        name: "cooking.action.increase_temp",
        icon: "minecraft:fire_charge",
        unlockLv: 1,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.temperature += getRandomInteger(20, 35) + ctx.tempVariance();
            oven.progress += oven.temperature >= recipe.needTemp[0] ? 10 : 3;
            if (oven.temperature > recipe.needTemp[1]) {
                oven.overcooked += 6;
            }
            oven.phase = "baking";
            player.stopSound('cooking.oven_idle');
            player.stopSound('cooking.oven_cool');
            player.playSound('cooking.oven_heat', player.location);
        }
    },
    {
        key: "rotate_tray",
        slot: 21,
        name: "cooking.action.rotate_tray",
        icon: "minecraft:compass",
        unlockLv: 1,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.progress += getRandomInteger(8, 15);
            oven.evenness += 10;
            oven.overcooked -= 4;
            player.playSound('cooking.oven_rotate', player.location);
        }
    },
    {
        key: "add_topping",
        slot: 22,
        name: "cooking.action.add_topping",
        icon: "minecraft:honey_bottle",
        unlockLv: 2,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            if (oven.usedToppings.length >= recipe.maxToppings) {
                oven.score -= 1;
                return;
            }

            for (const t of Object.keys(recipe.toppings ?? {})) {
                if (!hasAll(player, { [t]: 1 })) continue;

                const inv = player.getComponent("inventory").container;
                let usedItem;

                for (let i = 0; i < inv.size; i++) {
                    const it = inv.getItem(i);
                    if (it && it.typeId === t) {
                        usedItem = it;
                        break;
                    }
                }

                const q = usedItem ? getItemQuality(usedItem) : 0;
                oven.toppingQuality += q;
                oven.toppingCount += 1;

                consume(player, { [t]: 1 });

                const rate = toppingSuccessRate(oven, recipe);
                if (Math.random() <= rate) {
                    oven.score += recipe.toppings[t];
                    oven.richness += 12;
                } else {
                    oven.score -= recipe.toppings[t];
                    oven.temperature += 10;
                    oven.richness -= 4;
                }
                oven.usedToppings.push(t);
                player.playSound('cooking.oven_topping', player.location);
                return;
            }
        }
    },

    /* ===== 拡張アクション ===== */
    {
        key: "reduce_temp",
        slot: 27,
        name: "cooking.action.reduce_temp",
        icon: "minecraft:snowball",
        unlockLv: 5,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.temperature -= getRandomInteger(20, 40);
            oven.progress += 4;
            oven.overcooked -= 8;
            player.stopSound('cooking.oven_heat');
            player.playSound('cooking.oven_cool', player.location);
        }
    },
    {
        key: "open_check",
        slot: 28,
        name: "cooking.action.open_check",
        icon: "minecraft:ender_eye",
        unlockLv: 10,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "checking";
            oven.temperature -= 15;
            oven.progress += 5;
            oven.evenness += 5;
            oven.precision += 0.15;
            player.playSound('cooking.oven_open', player.location);
        }
    },
    {
        key: "convection_mode",
        slot: 29,
        name: "cooking.action.convection_mode",
        icon: "minecraft:feather",
        unlockLv: 15,
        cost: 2,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.progress += 18;
            oven.evenness += 15;
            oven.crispiness += 10;
            oven.score += 2;
            if (oven.temperature > recipe.needTemp[1]) {
                oven.overcooked += 2;
            }
            player.playSound('cooking.oven_fan', player.location);
        }
    },
    {
        key: "high_heat_blast",
        slot: 30,
        name: "cooking.action.high_heat_blast",
        icon: "minecraft:blaze_rod",
        unlockLv: 20,
        cost: 2,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.temperature += getRandomInteger(50, 80) + ctx.tempVariance();
            oven.progress += 20;
            oven.crispiness += 15;
            oven.overcooked += 12;
            player.playSound('cooking.oven_blast', player.location);
        }
    },
    {
        key: "glaze_spray",
        slot: 31,
        name: "cooking.action.glaze_spray",
        icon: "minecraft:glass_bottle",
        unlockLv: 25,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.progress += 6;
            oven.appearance += 15;
            oven.richness += 8;
            oven.score += 3;
            player.playSound('cooking.oven_spray', player.location);
        }
    },
    {
        key: "steam_injection",
        slot: 32,
        name: "cooking.action.steam_injection",
        icon: "minecraft:water_bucket",
        unlockLv: 30,
        cost: 1,
        run(oven, recipe, ctx, player) {
            oven.phase = "baking";
            oven.moisture += 15;
            oven.richness += 10;
            oven.evenness += 8;
            oven.score += 2;
            player.playSound('cooking.oven_steam', player.location);
        }
    },
    {
        key: "rest_cooling",
        slot: 33,
        name: "cooking.action.rest_cooling",
        icon: "minecraft:clock",
        unlockLv: 35,
        cost: 2,
        run(oven, recipe, ctx, player) {
            oven.phase = "resting";
            oven.temperature -= 12;
            oven.evenness += 8;
            oven.appearance += 6;
            oven.richness += 5;
            oven.score += 1;
            player.stopSound('cooking.oven_heat');
            player.playSound('cooking.oven_idle', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "cooking.title.oven" }] });

    const lv = new JobLevel(player, "chef").getLevel();
    const recipeIds = Object.keys(OvenRecipes);

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
    const start = page * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        const r = OvenRecipes[id];
        const slot = RECIPE_SLOTS[i];

        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: ` x${r.ingredients[key]}` }
            );
        }

        const toppings = [];
        for (const key of Object.keys(r.toppings ?? {})) {
            toppings.push(
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
                        { translate: "cooking.temp_range" },
                        { text: `: ${r.needTemp[0]}-${r.needTemp[1]}°C\n§9` },
                        { translate: "cooking.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "cooking.toppings" },
                        { text: ":" },
                        ...toppings,
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
            openRecipeSelect(player, page - 1);
            return;
        }
        if (r.selection === 53) {
            openRecipeSelect(player, page + 1);
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
    const recipe = OvenRecipes[recipeId];
    const form = new ModalFormData()
        .title({ translate: 'cooking.title.amount' })
        .slider({ translate: 'cooking.status.amount' }, 1, new ItemStack(recipe.result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        startBaking(player, recipeId, r.formValues[0]);
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

function startBaking(player, recipeId, quantity) {
    const recipe = OvenRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    ovenSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        temperature: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "raw",
        overcooked: 0,
        evenness: 0,
        crispiness: 0,
        appearance: 0,
        moisture: 0,
        richness: 0,
        usedToppings: [],
        precision: Math.random(),
        materialQuality,
        toppingQuality: 0,
        toppingCount: 0,

        ctx: { tempVariance: () => tempVariance(player, recipe) }
    });

    openOven(player);
}

function openOven(player) {
    const oven = ovenSessions.get(player.id);
    const recipe = OvenRecipes[oven.recipeId];
    const lv = new JobLevel(player, "chef").getLevel();

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i),
        "minecraft:black_stained_glass_pane"
    );
    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i + 45),
        "minecraft:black_stained_glass_pane"
    );

    const overcookDanger = isOvercookDanger(oven, recipe);
    if (overcookDanger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:red_stained_glass_pane",
            "cooking.overcook.warning.title",
            [{ translate: 'cooking.overcook.warning.lore' }]
        );
    }

    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "cooking.status.title",
        lore: [
            { rawtext: [{ text: '§9' }, { translate: "cooking.status.phase" }, { text: `: ${oven.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "cooking.status.temperature" }, { text: `: ${oven.temperature}°C(${Math.floor((recipe.needTemp[0] + recipe.needTemp[1]) / 2)}°C)\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "cooking.status.progress" }, { text: `: ${oven.progress}%\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "cooking.status.overcooked" }, { text: `: ${Math.max(0, oven.overcooked)}%\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "cooking.status.evenness" }, { text: `: ${Math.max(0, oven.evenness)}%\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "cooking.status.crispiness" }, { text: `: ${Math.max(0, oven.crispiness)}\n` }] },
            { rawtext: [{ text: '§3' }, { translate: "cooking.status.moisture" }, { text: `: ${Math.max(0, oven.moisture)}\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "cooking.status.actions" }, { text: `: ${oven.actions}/${oven.maxActions}\n` }] },
            { rawtext: [{ text: '§f' }, { translate: "cooking.status.amount" }, { text: `: ${oven.quantity}\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "cooking.lore.quality", with: [`${calcRank(oven, recipe).rank}`] }] }
        ],
        editedName: true
    });

    for (const action of OvenActions) {
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
    const oven = ovenSessions.get(player.id);
    const recipe = OvenRecipes[oven.recipeId];

    if (slot === 49 && oven.phase != 'raw') {
        finish(player);
        return;
    }

    const action = OvenActions.find(a => a.slot === slot);
    if (!action) {
        openOven(player);
        return;
    }

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        openOven(player);
        return;
    }
    if (oven.actions + action.cost > oven.maxActions) {
        oven.phase = "burned";
        finish(player);
        return;
    }

    action.run(oven, recipe, oven.ctx, player);
    oven.actions += action.cost;
    oven.temperature = Math.floor(oven.temperature * 100) / 100;
    oven.progress = Math.floor(oven.progress * 100) / 100;
    oven.overcooked = Math.max(0, Math.floor(oven.overcooked * 100) / 100);
    oven.evenness = Math.max(0, Math.floor(oven.evenness * 100) / 100);
    oven.crispiness = Math.max(0, Math.floor(oven.crispiness * 100) / 100);
    oven.appearance = Math.max(0, Math.floor(oven.appearance * 100) / 100);
    oven.moisture = Math.max(0, Math.floor(oven.moisture * 100) / 100);
    oven.richness = Math.max(0, Math.floor(oven.richness * 100) / 100);

    openOven(player);
}

function calcTempScore(temp, needTemp, maxScore = 5) {
    const min = needTemp[0];
    const max = needTemp[1];

    if (temp < min || temp > max) return 0;

    const mid = Math.floor((min + max) / 2);
    const distance = Math.abs(temp - mid);
    const score = maxScore - Math.floor(distance / 10);

    return Math.max(0, score);
}

function calcEfficiencyBonus(oven, recipe) {
    const tempScore = calcTempScore(oven.temperature, recipe.needTemp, 12);

    if (tempScore < 10) return 0;

    const used = oven.actions;
    const max = oven.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(oven, recipe) {
    let score = oven.score;

    // progress
    score += Math.min(5, Math.floor(oven.progress / 25));

    // temperature
    score += calcTempScore(oven.temperature, recipe.needTemp, 12);

    // overcooked (焼きすぎが少ないほど高評価)
    score += Math.floor((100 - Math.max(0, oven.overcooked)) / 10);

    // evenness (均一性)
    score += Math.min(5, Math.floor(oven.evenness / 20));

    // crispiness (カリカリ感)
    score += Math.min(5, Math.floor(oven.crispiness / 15));

    // appearance (見た目)
    score += Math.min(3, Math.floor(oven.appearance / 20));

    // moisture (水分)
    score += Math.min(4, Math.floor(oven.moisture / 18));

    // richness (コク)
    score += Math.min(5, Math.floor(oven.richness / 15));

    // efficiency bonus
    score += calcEfficiencyBonus(oven, recipe);

    // precision
    score += Math.min(3, Math.floor(oven.precision * 3));

    // material quality
    score += oven.materialQuality * 1.5;

    // topping quality (平均)
    if (oven.toppingCount > 0) {
        score += Math.floor(
            oven.toppingQuality / oven.toppingCount
        );
    }

    // burned は即死
    if (oven.phase === "burned") {
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
function finish(player) {
    const oven = ovenSessions.get(player.id);
    const recipe = OvenRecipes[oven.recipeId];

    if (!checkIngredients(player, oven.scaledIngredients)) {
        ovenSessions.delete(player.id);
        return;
    }

    consume(player, oven.scaledIngredients);

    const { rank, mul } = calcRank(oven, recipe);

    const item = new ItemStack(
        rank === "F" && oven.phase === "burned"
            ? "minecraft:charcoal"
            : recipe.result,
        oven.quantity
    );

    item.setLore([
        { rawtext: [{ text: '§r§a==============' }] },
        { rawtext: [{ text: '§r§e' }, { translate: "cooking.lore.quality", with: [`${rank}`] }] },
        { rawtext: [{ text: '§r§a==============' }] },
    ]);

    player.getComponent("inventory").container.addItem(item);
    ovenSessions.delete(player.id);

    player.stopSound('cooking.oven_idle');
    player.stopSound('cooking.oven_heat');
    player.stopSound('cooking.oven_cool');
    player.stopSound('cooking.oven_fan');
    player.playSound('cooking.oven_complete', player.location);

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
                5
            ) / 100;

        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        const finalReward = applyDailyLimit(
            playerData,
            "chef",
            reward,
            jobs_config.dailyLimit.chef
        );

        if (finalReward > 0) {
            job.addXp(recipe.baseXp * mul);
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