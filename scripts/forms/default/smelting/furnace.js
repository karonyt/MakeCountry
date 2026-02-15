import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { FurnaceRecipes } from "../../../data/smelting/furnace_recipe";
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
const furnaceSessions = new Map();

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

function isOverheatDanger(furnace, recipe) {
    return (
        furnace.temperature > recipe.needTemperature[1] + 100 ||
        furnace.actions >= furnace.maxActions - 1
    );
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "blacksmith").getLevel();
    return recipe.baseActions + Math.min(Math.floor(lv / 5), 30 + (recipe.requiredLevel * 3));
}

function temperatureVariance(player, recipe) {
    const lv = new JobLevel(player, "blacksmith").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 10 - Math.floor(diff / 3)),
        Math.max(1, 10 - Math.floor(diff / 3))
    );
}

function additiveSuccessRate(furnace, recipe) {
    let rate = 1;

    if (furnace.temperature < recipe.needTemperature[0]) rate -= 0.15;
    if (furnace.temperature > recipe.needTemperature[1]) rate -= 0.15;
    if (furnace.progress < 40) rate -= 0.2;

    rate -= furnace.usedAdditives.length * 0.1; // 使うほど成功率低下

    return Math.max(0.1, rate);
}

const RANK_QUALITY_TABLE = {
    "KARON": 12,
    "IMPOSSIBLE": 11,
    "EXTRA": 10,
    "LEGENDARY": 9,
    "SSS": 8,
    "SS": 7,
    "S": 6,
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1,
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
        // rawtext 配列を想定
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            // translate + with 対応
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
        run(furnace, recipe, ctx, player) {
            furnace.temperature += getRandomInteger(80, 120) + ctx.temperatureVariance();
            furnace.progress += furnace.temperature >= recipe.needTemperature[0] ? 15 : 5;
            furnace.phase = "smelting";
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            furnace.progress += getRandomInteger(8, 15);
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            if (furnace.usedAdditives.length >= recipe.maxAdditives) {
                furnace.score -= 1;
                return;
            }

            for (const a of Object.keys(recipe.additives ?? {})) {
                if (!hasAll(player, { [a]: 1 })) continue;

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
                    furnace.heat += 5;
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            furnace.temperature += getRandomInteger(40, 60) + ctx.temperatureVariance();
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
        unlockLv: 10,
        cost: 1,
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            furnace.temperature -= getRandomInteger(60, 100);
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";

            const success = Math.random() < 0.80;

            if (success) {
                furnace.impurity -= getRandomInteger(5, 15);
                furnace.progress -= 3;
                furnace.score += 1;
            } else {
                furnace.impurity += 10;
                furnace.score -= 3;
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            furnace.temperature += getRandomInteger(150, 250) + ctx.temperatureVariance();
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
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
        key: "let_settle",
        slot: 32,
        name: "smelting.action.let_settle",
        icon: "minecraft:hopper",
        unlockLv: 30,
        cost: 2,
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
            furnace.temperature -= 10;
            furnace.impurity -= 8;
            furnace.score += 1;
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
        run(furnace, recipe, ctx, player) {
            furnace.phase = "smelting";
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
export function openRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "smelting.title.furnace" }] });

    const lv = new JobLevel(player, "blacksmith").getLevel();
    const recipeIds = Object.keys(FurnaceRecipes);

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
        const r = FurnaceRecipes[id];
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

        form.setButton(slot, {
            iconPath: lv >= r.requiredLevel
                ? itemIdToPath[r.name]
                : itemIdToPath["minecraft:barrier"],
            name: lv >= r.requiredLevel
                ? langChangeItemName(r.name)
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
                    ]
                }]
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
    if (page > 0) {
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "smelting.page.prev",
            editedName: true
        });
    }

    if ((page + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "smelting.page.next",
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
    const recipe = FurnaceRecipes[recipeId];
    const form = new ModalFormData()
        .title({ translate: 'smelting.title.amount' })
        .slider({ translate: 'smelting.status.amount' }, 1, new ItemStack(recipe.result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        startSmelting(player, recipeId, r.formValues[0]);
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

function startSmelting(player, recipeId, quantity) {
    const recipe = FurnaceRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    furnaceSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        temperature: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "raw",
        impurity: 100,
        usedAdditives: [],
        precision: Math.random(),
        materialQuality,
        additiveQuality: 0,
        additiveCount: 0,

        ctx: { temperatureVariance: () => temperatureVariance(player, recipe) }
    });

    openFurnace(player);
}

function openFurnace(player) {
    const furnace = furnaceSessions.get(player.id);
    const recipe = FurnaceRecipes[furnace.recipeId];
    const lv = new JobLevel(player, "blacksmith").getLevel();

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i),
        "minecraft:black_stained_glass_pane"
    );
    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i + 45),
        "minecraft:black_stained_glass_pane"
    );

    const overheatDanger = isOverheatDanger(furnace, recipe);
    if (overheatDanger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:red_stained_glass_pane",
            "smelting.overheat.warning.title",
            [{ translate: 'smelting.overheat.warning.lore' }]
        );
    }

    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "smelting.status.title",
        lore: [
            { rawtext: [{ text: '§9' }, { translate: "smelting.status.phase" }, { text: `: ${furnace.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "smelting.status.temperature" }, { text: `: ${furnace.temperature}℃(${Math.floor((recipe.needTemperature[0] + recipe.needTemperature[1]) / 2)}℃)\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "smelting.status.progress" }, { text: `: ${furnace.progress}%\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "smelting.status.impurity" }, { text: `: ${Math.max(0, furnace.impurity)}%\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "smelting.status.actions" }, { text: `: ${furnace.actions}/${furnace.maxActions}\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "smelting.status.amount" }, { text: `: ${furnace.quantity}\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "smelting.lore.quality", with: [`${calcRank(furnace, recipe, player).rank}`] }] }
        ],
        editedName: true
    });

    for (const action of FurnaceActions) {
        if (lv < action.unlockLv) {
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "smelting.locked",
                lore: [{ rawtext: [{ translate: "smelting.unlock_level" }, { text: `${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            form.setButton(action.slot, {
                iconPath: itemIdToPath[action.icon],
                name: action.name,
                lore: [{ rawtext: [{ text: '§7' }, { translate: "smelting.action.cost" }, { text: `: ${action.cost}` }] }],
                editedName: true
            });
        }
    }

    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:lime_dye"],
        name: "smelting.button.complete",
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
    const furnace = furnaceSessions.get(player.id);
    const recipe = FurnaceRecipes[furnace.recipeId];

    if (slot === 49 && furnace.phase != 'raw') {
        finish(player);
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
    if (furnace.actions + action.cost > furnace.maxActions) {
        furnace.phase = "overheated";
        finish(player);
        return;
    }

    action.run(furnace, recipe, furnace.ctx, player);
    furnace.actions += action.cost;
    furnace.temperature = Math.floor(furnace.temperature * 100) / 100;
    furnace.progress = Math.floor(furnace.progress * 100) / 100;
    furnace.impurity = Math.max(0, Math.floor(furnace.impurity * 100) / 100);

    openFurnace(player);
}

function calcTemperatureScore(temperature, needTemperature, maxScore = 5) {
    const min = needTemperature[0];
    const max = needTemperature[1];

    if (temperature < min || temperature > max) return 0;

    const mid = Math.floor((min + max) / 2);
    const distance = Math.abs(temperature - mid);
    const score = maxScore - Math.floor(distance / 20);

    return Math.max(0, score);
}

function calcEfficiencyBonus(furnace, recipe) {
    const tempScore = calcTemperatureScore(furnace.temperature, recipe.needTemperature, 12);

    if (tempScore < 10) return 0;

    const used = furnace.actions;
    const max = furnace.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(furnace, recipe, player) {
    let score = furnace.score;

    // progress
    score += Math.min(5, Math.floor(furnace.progress / 25));

    // temperature
    score += calcTemperatureScore(furnace.temperature, recipe.needTemperature, 12);

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

    // overheated は即死
    if (furnace.phase === "overheated") {
        return { rank: "F", mul: 0.4 };
    }

    const lv = new JobLevel(player, "blacksmith").getLevel();
    const diff = lv - recipe.requiredLevel;

    if (score >= 210 && diff >= 80) return { rank: "KARON", mul: 10 };
    if (score >= 185 && diff >= 70) return { rank: "IMPOSSIBLE", mul: 5 };
    if (score >= 165 && diff >= 60) return { rank: "EXTRA", mul: 3 };
    if (score >= 145 && diff >= 50) return { rank: "LEGENDARY", mul: 2.0 };
    if (score >= 130 && diff >= 40) return { rank: "SSS", mul: 1.8 };
    if (score >= 115 && diff >= 30) return { rank: "SS", mul: 1.7 };
    if (score >= 90 && diff >= 20) return { rank: "S", mul: 1.6 };
    if (score >= 70 && diff >= 10) return { rank: "A", mul: 1.5 };
    if (score >= 55) return { rank: "B", mul: 1.4 };
    if (score >= 40) return { rank: "C", mul: 1.3 };
    if (score >= 25) return { rank: "D", mul: 1.2 };
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
    const furnace = furnaceSessions.get(player.id);
    const recipe = FurnaceRecipes[furnace.recipeId];

    if (!checkIngredients(player, furnace.scaledIngredients)) {
        furnaceSessions.delete(player.id);
        return;
    }

    consume(player, furnace.scaledIngredients);

    const { rank, mul } = calcRank(furnace, recipe, player);

    const item = new ItemStack(
        rank === "F" && furnace.phase === "overheated"
            ? "minecraft:iron_nugget"
            : recipe.result,
        furnace.quantity
    );

    item.setLore([
        { rawtext: [{ text: '§r§a==============' }] },
        { rawtext: [{ text: '§r§e' }, { translate: "smelting.lore.quality", with: [`${rank}`] }] },
        { rawtext: [{ text: '§r§a==============' }] },
    ]);

    player.getComponent("inventory").container.addItem(item);
    furnaceSessions.delete(player.id);

    player.stopSound('smelting.idle');
    player.stopSound('smelting.fire');
    player.stopSound('smelting.bellows');
    player.stopSound('smelting.pour');
    player.stopSound('smelting.hammer');
    player.stopSound('smelting.cooling');
    player.playSound('smelting.complete', player.location);

    if (jobs_config.validity && player.hasTag('mcjobs_blacksmith')) {
        /* ===== Blacksmith Job ===== */
        const job = new JobLevel(player, "blacksmith");
        const level = job.getLevel();

        const baseMoney = recipe.baseMoney * mul;
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

        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        const finalReward = applyDailyLimit(
            playerData,
            "blacksmith",
            reward,
            jobs_config.dailyLimit.blacksmith
        );

        if (finalReward > 0) {
            job.addXp(recipe.baseXp * mul);
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        }

        player.onScreenDisplay.setActionBar(
            {
                rawtext: [
                    { translate: "smelting.reward.prefix" },
                    { text: ` ${rank} ` },
                    { translate: "smelting.reward.money" },
                    { text: `+${finalReward}${config.MoneyName}` },
                    { translate: "smelting.reward.xp" },
                    { text: `${job.getXp()}/${job.getXpRequired(level)}` }
                ]
            }
        );
    }
}