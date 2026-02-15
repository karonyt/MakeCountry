import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { FryingPanRecipes } from "../../../data/cooking/fryingpan_recipe";
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
const panSessions = new Map();

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
            rawtext: [{ translate: "cooking.error.insufficient_ingredients" }, ...lines]
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

function isBurnDanger(pan, recipe) {
    return (
        pan.heat > recipe.needHeat[1] + 10 ||
        pan.actions >= pan.maxActions - 1
    );
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    return recipe.baseActions + Math.min(Math.floor(lv / 5), 30 + (recipe.requiredLevel * 3));
}

function heatVariance(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 8 - Math.floor(diff / 3)),
        Math.max(1, 8 - Math.floor(diff / 3))
    );
}

function seasoningSuccessRate(pan, recipe) {
    let rate = 1;

    if (pan.heat < recipe.needHeat[0]) rate -= 0.1;
    if (pan.heat > recipe.needHeat[1]) rate -= 0.1;
    if (pan.progress < 50) rate -= 0.1;

    rate -= pan.usedSeasonings.length * 0.15; // 使うほど成功率低下

    return Math.max(0.1, rate);
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
   Actions (完全統合)
================================ */
const PanActions = [
    /* ===== 基本操作 ===== */
    {
        key: "fire_up",
        slot: 20,
        name: "cooking.action.fire_up",
        icon: "minecraft:fire_charge",
        unlockLv: 1,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.heat += getRandomInteger(12, 22) + ctx.heatVariance();
            pan.progress += pan.heat >= recipe.needHeat[0] ? 20 : 8;
            pan.phase = "cooking";
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.karyoku');
            player.stopSound('cooking.timer');
            player.playSound('cooking.karyoku', player.location);
        }
    },
    {
        key: "flip",
        slot: 21,
        name: "cooking.action.flip",
        icon: "minecraft:stick",
        unlockLv: 1,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.progress += getRandomInteger(10, 18);
            pan.heat = Math.round(pan.heat);
            player.stopSound('cooking.timer');
            player.playSound('cooking.kaesi', player.location);
        }
    },
    {
        key: "seasoning",
        slot: 22,
        name: "cooking.action.seasoning",
        icon: "minecraft:sugar",
        unlockLv: 2,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            if (pan.usedSeasonings.length >= recipe.maxSeasonings) {
                pan.score -= 1;
                return;
            }

            for (const s of Object.keys(recipe.seasonings ?? {})) {
                if (!hasAll(player, { [s]: 1 })) continue;

                consume(player, { [s]: 1 });

                const rate = seasoningSuccessRate(pan, recipe);
                if (Math.random() <= rate) {
                    pan.score += recipe.seasonings[s];
                } else {
                    pan.score -= recipe.seasonings[s];
                    pan.heat += 5; // 焦がす
                }
                pan.usedSeasonings.push(s);
                player.stopSound('cooking.timer');
                player.playSound('cooking.tyoumiryou', player.location);
                return;
            }
        }

    },

    /* ===== 拡張アクション ===== */
    {
        key: "gentle_fire",
        slot: 27,
        name: "cooking.action.gentle_fire",
        icon: "minecraft:campfire",
        unlockLv: 5,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.heat += getRandomInteger(4, 6) + ctx.heatVariance();
            pan.progress += 5;
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.timer');
            player.stopSound('cooking.karyoku');
            player.playSound('cooking.yowabi', player.location);
        }
    },
    {
        key: "cool_down",
        slot: 28,
        name: "cooking.action.cool_down",
        icon: "minecraft:snowball",
        unlockLv: 10,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.heat -= getRandomInteger(8, 12);
            pan.progress += 2;
            player.playSound('cooking.stop', player.location);
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.timer');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.karyoku');
        }
    },
    {
        key: "careful_flip",
        slot: 29,
        name: "cooking.action.careful_flip",
        icon: "minecraft:feather",
        unlockLv: 15,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.progress += 8;
            pan.heat -= 3;
            player.playSound('cooking.teinei_kaesi', player.location);
            player.stopSound('cooking.timer');
        }
    },
    {
        key: "strong_fire",
        slot: 30,
        name: "cooking.action.strong_fire",
        icon: "minecraft:blaze_powder",
        unlockLv: 20,
        cost: 2,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.heat += getRandomInteger(25, 40) + ctx.heatVariance();
            pan.progress += 15;
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.timer');
            player.stopSound('cooking.karyoku');
            player.playSound('cooking.fire', player.location);
        }
    },
    {
        key: "hard_press",
        slot: 31,
        name: "cooking.action.hard_press",
        icon: "minecraft:cauldron",
        unlockLv: 25,
        cost: 2,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.progress += 30;
            pan.heat += 18;
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.timer');
            player.stopSound('cooking.karyoku');
            player.playSound('cooking.fry', player.location);
        }
    },
    {
        key: "rest_pan",
        slot: 32,
        name: "cooking.action.rest_pan",
        icon: "minecraft:clock",
        unlockLv: 30,
        cost: 2,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            pan.heat -= 5;
            pan.score += 1;
            player.stopSound('cooking.yowabi');
            player.stopSound('cooking.fire');
            player.stopSound('cooking.fry');
            player.stopSound('cooking.karyoku');
            player.stopSound('cooking.timer');
            player.playSound('cooking.timer', player.location);
        }
    },
    {
        key: "timing_check",
        slot: 33,
        name: "cooking.action.timing_check",
        icon: "minecraft:spyglass",
        unlockLv: 35,
        cost: 1,
        run(pan, recipe, ctx, player) {
            pan.phase = "cooking";
            const add = Math.random() * 0.3; // 0.0 ～ 0.3
            pan.luck = Math.min(1, pan.luck + add);
            player.playSound('cooking.glass', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "cooking.title.fryingpan" }] });

    const lv = new JobLevel(player, "chef").getLevel();
    const recipeIds = Object.keys(FryingPanRecipes);

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
        const r = FryingPanRecipes[id];
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
        for (const key of Object.keys(r.seasonings)) {
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
                        { text: `: ${r.needHeat[0]}-${r.needHeat[1]}\n§9` },
                        { translate: "cooking.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "cooking.seasonings" },
                        { text: ":" },
                        ...seasonings,
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
    const recipe = FryingPanRecipes[recipeId];

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
    const recipe = FryingPanRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    panSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        seasoningQuality: 0,
        seasoningCount: 0,
        materialQuality,
        heat: 0,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "raw",
        usedSeasonings: [],
        luck: Math.random(),
        ctx: { heatVariance: () => heatVariance(player, recipe) }
    });

    openPan(player);
}

function openPan(player) {
    const pan = panSessions.get(player.id);
    const recipe = FryingPanRecipes[pan.recipeId];
    const lv = new JobLevel(player, "chef").getLevel();

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i),
        "minecraft:black_stained_glass_pane"
    );
    fill(form, [...Array(9).keys(), ...Array(9).keys()].map(i => i + 45),
        "minecraft:black_stained_glass_pane"
    );

    const burnDanger = isBurnDanger(pan, recipe); if (burnDanger) { fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17], "minecraft:red_stained_glass_pane", "cooking.burnt.warning.title", [{ translate: 'cooking.burnt.warning.lore' }]); };
    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "cooking.status.title",
        lore: [
            { rawtext: [{ text: '§9' }, { translate: "cooking.status.title" }, { translate: `: ${pan.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "cooking.status.heat" }, { text: `: ${pan.heat}(${Math.floor((recipe.needHeat[0] + recipe.needHeat[1]) / 2)})\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "cooking.status.progress" }, { text: `: ${pan.progress}%\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "cooking.status.actions" }, { text: `: ${pan.actions}/${pan.maxActions}\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "cooking.status.amount" }, { text: `: ${pan.quantity}\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "cooking.lore.quality", with: [`${calcRank(pan, recipe).rank}`] }] }
        ],
        editedName: true
    });

    for (const action of PanActions) {
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
    const pan = panSessions.get(player.id);
    const recipe = FryingPanRecipes[pan.recipeId];

    if (slot === 49 && pan.phase != 'raw') {
        finish(player);
        return;
    }

    const action = PanActions.find(a => a.slot === slot);
    if (!action) {
        openPan(player);
        return;
    };

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        openPan(player);
        return;
    }
    if (pan.actions + action.cost > pan.maxActions) {
        pan.phase = "burned";
        finish(player);
        return;
    }

    action.run(pan, recipe, pan.ctx, player);
    pan.actions += action.cost;
    pan.heat = Math.floor(pan.heat * 100) / 100;
    pan.progress = Math.floor(pan.progress * 100) / 100;

    openPan(player);
}

function calcHeatScore(heat, needHeat, maxScore = 5) {
    const min = needHeat[0];
    const max = needHeat[1];

    if (heat < min || heat > max) return 0;

    const mid = Math.floor((min + max) / 2);

    // 中央からの距離
    const distance = Math.abs(heat - mid);

    // 距離0のみ満点
    const score = maxScore - distance;

    return Math.max(0, score);
}

function calcTurnBonus(pan, recipe) {
    const heatScore = calcHeatScore(pan.heat, recipe.needHeat, 5);

    // 焼き最大じゃないなら評価しない
    if (heatScore < 12) return 0;

    const used = pan.actions;
    const max = pan.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(pan, recipe) {
    let score = pan.score;

    // progress
    score += Math.min(5, Math.floor(pan.progress / 25));

    // heat
    score += calcHeatScore(pan.heat, recipe.needHeat, 12);

    // turn bonus
    score += calcTurnBonus(pan, recipe);

    // luck
    score += Math.min(3, Math.floor(pan.luck));

    // material quality
    score += pan.materialQuality * 2;

    // seasoning quality (平均)
    if (pan.seasoningCount > 0) {
        score += Math.floor(
            pan.seasoningQuality / pan.seasoningCount * 1.5
        );
    }

    // burned は即死
    if (pan.phase === "burned") {
        return { rank: "F", mul: 0.4 };
    }

    if (score >= 55) return { rank: "KARON", mul: 10 };
    if (score >= 45) return { rank: "IMPOSSIBLE", mul: 5 };
    if (score >= 30) return { rank: "EXTRA", mul: 3 };
    if (score >= 27) return { rank: "LEGEND", mul: 2.0 };
    if (score >= 24) return { rank: "SSS", mul: 1.8 };
    if (score >= 21) return { rank: "SS", mul: 1.7 };
    if (score >= 18) return { rank: "S", mul: 1.6 };
    if (score >= 15) return { rank: "A", mul: 1.5 };
    if (score >= 13) return { rank: "B", mul: 1.4 };
    if (score >= 10) return { rank: "C", mul: 1.3 };
    if (score >= 7) return { rank: "D", mul: 1.2 };
    if (score >= 4) return { rank: "E", mul: 1.0 };
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
    const pan = panSessions.get(player.id);
    const recipe = FryingPanRecipes[pan.recipeId];

    if (!checkIngredients(player, pan.scaledIngredients)) {
        panSessions.delete(player.id);
        return;
    }

    consume(player, pan.scaledIngredients);

    const { rank, mul } = calcRank(pan, recipe);

    const item = new ItemStack(
        rank === "F" && pan.phase === "burned"
            ? "minecraft:charcoal"
            : recipe.result,
        pan.quantity
    );

    item.setLore([
        { rawtext: [{ text: '§r§a==============' }] },
        { rawtext: [{ text: '§r§e' }, { translate: "cooking.lore.quality", with: [`${rank}`] }] },
        { rawtext: [{ text: '§r§a==============' }] },
    ]);

    player.getComponent("inventory").container.addItem(item);
    panSessions.delete(player.id);

    player.stopSound('cooking.yowabi');
    player.stopSound('cooking.fire');
    player.stopSound('cooking.karyoku');
    player.stopSound('cooking.kaesi');
    player.stopSound('cooking.timer');
    player.playSound('cooking.ovenrange', player.location);

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
                50
            ) / 100;

        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        const finalReward = applyDailyLimit(
            playerData,
            "chef",
            reward,
            jobs_config.dailyLimit.chef
        );

        if (finalReward > 0) {
            job.addXp(recipe.baseXp * mul * 100);
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
    };
}