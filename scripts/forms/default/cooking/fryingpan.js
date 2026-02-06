import { ItemStack, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { FryingPanRecipes } from "../../../data/cooking/fryingpan_recipe";
import { itemIdToPath } from "../../../texture_config";
import jobs_config from "../../../jobs_config";
import { JobLevel } from "../../../lib/jobslevel";
import { RewardBuff } from "../../../api/rewardbuff";
import { getRandomInteger, langChangeItemName } from "../../../lib/util";
import { DynamicProperties } from "../../../api/dyp";
import { applyDailyLimit } from "../../../lib/jobs";

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

/* ===============================
   Utils
================================ */
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
    return recipe.baseActions + Math.min(Math.floor(lv / 5), 6);
}

function heatVariance(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 8 - Math.floor(diff / 3)),
        Math.max(1, 8 - Math.floor(diff / 3))
    );
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
        run(pan) {
            pan.progress += getRandomInteger(10, 18);
            pan.heat = Math.round(pan.heat);
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
            for (const s of Object.keys(recipe.seasonings ?? {})) {
                if (hasAll(player, { [s]: 1 })) {
                    consume(player, { [s]: 1 });
                    pan.usedSeasonings.push(s);
                    pan.score += recipe.seasonings[s];
                    player.playSound('cooking.tyoumiryou', player.location);
                    return;
                }
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
            pan.heat += getRandomInteger(4, 6) + ctx.heatVariance();
            pan.progress += 5;
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
            pan.heat -= getRandomInteger(8, 12);
            pan.progress += 2;
            player.playSound('cooking.stop', player.location);
        }
    },
    {
        key: "careful_flip",
        slot: 29,
        name: "cooking.action.careful_flip",
        icon: "minecraft:feather",
        unlockLv: 15,
        cost: 1,
        run(pan) {
            pan.progress += 8;
            pan.heat -= 3;
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
            pan.heat += getRandomInteger(20, 30) + ctx.heatVariance();
            pan.progress += 15;
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
        run(pan) {
            pan.progress += 30;
            pan.heat += 18;
        }
    },
    {
        key: "rest_pan",
        slot: 32,
        name: "cooking.action.rest_pan",
        icon: "minecraft:clock",
        unlockLv: 30,
        cost: 2,
        run(pan) {
            pan.heat -= 5;
            pan.score += 1;
        }
    },
    {
        key: "timing_check",
        slot: 33,
        name: "cooking.action.timing_check",
        icon: "minecraft:spyglass",
        unlockLv: 35,
        cost: 1,
        run(pan) {
            pan.luck += 0.05;
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player) {
    const form = new ChestFormData("small").setTitle({ rawtext: [{ translate: "cooking.title.fryingpan" }] });
    const lv = new JobLevel(player, "chef").getLevel();

    const ids = Object.keys(FryingPanRecipes);
    ids.forEach((id, i) => {
        const r = FryingPanRecipes[id];
        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push({ text: '\n§r§7- ' }, { translate: langChangeItemName(key) }, { text: ` x ${r.ingredients[key]}` })
        };
        form.setButton(i, {
            iconPath: itemIdToPath[r.name],
            name: lv >= r.requiredLevel ? langChangeItemName(r.name) : "cooking.locked",
            lore: lv >= r.requiredLevel
                ? [{ rawtext: [{ translate: "cooking.heat_range" }, { text: `: ${r.needHeat[0]}-${r.needHeat[1]}` }, ...materials] }]
                : [{ rawtext: [{ translate: "cooking.unlock_level" }, { text: `${r.requiredLevel}` }] }],
            editedName: true
        });
    });

    form.show(player).then(r => {
        if (!r.canceled) startCooking(player, ids[r.selection]);
    });
}

function startCooking(player, recipeId) {
    const recipe = FryingPanRecipes[recipeId];
    if (!hasAll(player, recipe.ingredients)) {
        player.sendMessage({ rawtext: [{ translate: "cooking.error.insufficient_ingredients" }] });
        return;
    }

    panSessions.set(player.id, {
        recipeId,
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
            { rawtext: [{ text: '§c' }, { translate: "cooking.status.heat" }, { text: `: ${pan.heat}\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "cooking.status.progress" }, { text: `: ${pan.progress}%\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "cooking.status.actions" }, { text: `: ${pan.actions}/${pan.maxActions}` }] }
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
        if (!r.canceled) handleAction(player, r.selection);
    });
}

/* ===============================
   Logic
================================ */
function handleAction(player, slot) {
    const pan = panSessions.get(player.id);
    const recipe = FryingPanRecipes[pan.recipeId];

    if (slot === 49) {
        finish(player);
        return;
    }

    const action = PanActions.find(a => a.slot === slot);
    if (!action) return;

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) return;
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

function calcRank(pan, recipe) {
    let score = pan.score;

    if (pan.progress >= 95) score += 3;
    else if (pan.progress >= 85) score += 2;
    else if (pan.progress >= 70) score += 1;

    if (pan.heat >= recipe.needHeat[0] && pan.heat <= recipe.needHeat[1]) {
        score += 2;
    }

    if (pan.phase === "burned") score = 0;
    if (pan.luck > 0.9) score += 1;

    if (score >= 8) return { rank: "★★★★★", mul: 2.0 };
    if (score >= 6) return { rank: "★★★★", mul: 1.6 };
    if (score >= 4) return { rank: "★★★", mul: 1.3 };
    if (score >= 2) return { rank: "★★", mul: 1.0 };
    return { rank: "★", mul: 0.4 };
}

/* ===============================
   Finish
================================ */
function finish(player) {
    const pan = panSessions.get(player.id);
    const recipe = FryingPanRecipes[pan.recipeId];

    if (!hasAll(player, recipe.ingredients)) {
        panSessions.delete(player.id);
        player.sendMessage({ rawtext: [{ translate: "cooking.error.failed_ingredients" }] });
        return;
    }

    consume(player, recipe.ingredients);

    const { rank, mul } = calcRank(pan, recipe);

    const item = new ItemStack(
        rank === "★" && pan.phase === "burned"
            ? "minecraft:charcoal"
            : recipe.result,
        1
    );

    item.setLore([
        { rawtext: [{ translate: "cooking.lore.completion" }, { text: `: ${rank}` }] },
        { rawtext: [{ translate: "cooking.lore.heat" }, { text: `: ${pan.heat}` }] },
        { rawtext: [{ translate: "cooking.lore.progress" }, { text: `: ${pan.progress}%` }] },
        { rawtext: [{ translate: "cooking.lore.seasonings" }, { text: `: ${pan.usedSeasonings.join(",") || "なし"}` }] }
    ]);

    player.getComponent("inventory").container.addItem(item);
    panSessions.delete(player.id);

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
                random *
                job.getReward(level) *
                buff.getMultiplier("chef") *
                100
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
                    { text: `+${finalReward}Money ` },
                    { translate: "cooking.reward.xp" },
                    { text: `${job.getXp()}/${job.getXpRequired(level)}` }
                ]
            }
        );
    };
}