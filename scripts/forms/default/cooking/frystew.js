import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { FryStewRecipes } from "../../../data/cooking/frystew_recipe";
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
const fryingSessions = new Map();

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

function isFryingDanger(fryer, recipe) {
    return (
        fryer.oilTemp > recipe.needTemp[1] + 50 ||
        fryer.burned >= 70 ||
        fryer.actions >= fryer.maxActions - 2 ||
        fryer.oilDegradation >= 80
    );
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    return recipe.baseActions + Math.min(Math.floor(lv / 4), 40 + (recipe.requiredLevel * 4));
}

function tempVariance(player, recipe) {
    const lv = new JobLevel(player, "chef").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 8 - Math.floor(diff / 5)),
        Math.max(1, 8 - Math.floor(diff / 5))
    );
}

function coatingSuccessRate(fryer, recipe) {
    let rate = 1;

    if (fryer.oilTemp < recipe.needTemp[0]) rate -= 0.25;
    if (fryer.oilTemp > recipe.needTemp[1]) rate -= 0.25;
    if (fryer.moisture > 60) rate -= 0.2;
    if (fryer.oilDegradation > 50) rate -= 0.15;

    rate -= fryer.usedCoatings.length * 0.1;

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
   Actions (揚げ物用)
================================ */
const FryingActions = [
    /* ===== 基本操作 ===== */
    {
        key: "increase_heat",
        slot: 20,
        name: "cooking.action.increase_heat",
        icon: "minecraft:blaze_powder",
        unlockLv: 1,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.oilTemp += getRandomInteger(30, 50) + ctx.tempVariance();
            fryer.progress += fryer.oilTemp >= recipe.needTemp[0] ? 12 : 4;
            if (fryer.oilTemp > recipe.needTemp[1]) {
                fryer.burned += 12;
                fryer.oilDegradation += 8;
            }
            fryer.phase = "frying";
            player.stopSound('cooking.frying_idle');
            player.stopSound('cooking.oil_bubble');
            player.playSound('cooking.fire', player.location);
        }
    },
    {
        key: "drain_oil",
        slot: 21,
        name: "cooking.action.drain_oil",
        icon: "minecraft:bucket",
        unlockLv: 1,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "draining";
            fryer.progress += 8;
            fryer.crispiness += 10;
            fryer.oilContent -= 15;
            fryer.moisture -= 8;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.oil_bubble');
            player.playSound('cooking.drain', player.location);
        }
    },
    {
        key: "add_coating",
        slot: 22,
        name: "cooking.action.add_coating",
        icon: "minecraft:wheat",
        unlockLv: 2,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "coating";
            if (fryer.usedCoatings.length >= recipe.maxCoatings) {
                fryer.score -= 2;
                return;
            }

            for (const c of Object.keys(recipe.coatings ?? {})) {
                if (!hasAll(player, { [c]: 1 })) continue;

                const inv = player.getComponent("inventory").container;
                let usedItem;

                for (let i = 0; i < inv.size; i++) {
                    const it = inv.getItem(i);
                    if (it && it.typeId === c) {
                        usedItem = it;
                        break;
                    }
                }

                const q = usedItem ? getItemQuality(usedItem) : 0;
                fryer.coatingQuality += q;
                fryer.coatingCount += 1;

                consume(player, { [c]: 1 });

                const rate = coatingSuccessRate(fryer, recipe);
                if (Math.random() <= rate) {
                    fryer.score += recipe.coatings[c] * 1.5;
                    fryer.crispiness += 15;
                    fryer.texture += 10;
                } else {
                    fryer.score -= recipe.coatings[c];
                    fryer.oilTemp += 15;
                    fryer.moisture += 10;
                }
                fryer.usedCoatings.push(c);
                player.playSound('cooking.coating', player.location);
                return;
            }
        }
    },

    /* ===== 揚げ物専用アクション ===== */
    {
        key: "flip",
        slot: 23,
        name: "cooking.action.flip",
        icon: "minecraft:wooden_shovel",
        unlockLv: 3,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.progress += 10;
            fryer.evenness += 12;
            fryer.crispiness += 8;
            fryer.score += 2;
            player.playSound('cooking.flip', player.location);
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
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.oilTemp -= getRandomInteger(20, 40);
            fryer.progress += 5;
            fryer.burned -= 10;
            fryer.oilDegradation -= 5;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.oil_bubble');
            player.playSound('cooking.cool', player.location);
        }
    },
    {
        key: "shake_basket",
        slot: 28,
        name: "cooking.action.shake_basket",
        icon: "minecraft:hopper",
        unlockLv: 8,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.progress += 8;
            fryer.evenness += 15;
            fryer.oilContent -= 8;
            fryer.crispiness += 6;
            player.playSound('cooking.shake', player.location);
        }
    },
    {
        key: "remove_excess_moisture",
        slot: 29,
        name: "cooking.action.remove_moisture",
        icon: "minecraft:sponge",
        unlockLv: 10,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "preparing";
            fryer.moisture -= 20;
            fryer.crispiness += 12;
            fryer.score += 3;
            player.playSound('cooking.pat', player.location);
        }
    },
    {
        key: "double_fry",
        slot: 30,
        name: "cooking.action.double_fry",
        icon: "minecraft:golden_carrot",
        unlockLv: 12,
        cost: 2,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.progress += 20;
            fryer.crispiness += 20;
            fryer.texture += 15;
            fryer.goldenColor += 15;
            fryer.score += 5;
            fryer.oilDegradation += 10;
            player.stopSound('cooking.frying_idle');
            player.playSound('cooking.oil_bubble', player.location);
        }
    },
    {
        key: "temperature_control",
        slot: 31,
        name: "cooking.action.temp_control",
        icon: "minecraft:comparator",
        unlockLv: 15,
        cost: 2,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            const targetTemp = Math.floor((recipe.needTemp[0] + recipe.needTemp[1]) / 2);
            const diff = fryer.oilTemp - targetTemp;
            fryer.oilTemp -= Math.floor(diff * 0.6);
            fryer.progress += 15;
            fryer.precision = Math.min(1, fryer.precision + 0.3);
            fryer.score += 4;
            player.playSound('cooking.adjust', player.location);
        }
    },
    {
        key: "add_aromatics",
        slot: 32,
        name: "cooking.action.add_aromatics",
        icon: "minecraft:sweet_berries",
        unlockLv: 18,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.aroma += 18;
            fryer.flavor += 12;
            fryer.score += 4;
            player.playSound('cooking.infuse', player.location);
        }
    },
    {
        key: "skim_debris",
        slot: 33,
        name: "cooking.action.skim_debris",
        icon: "minecraft:bowl",
        unlockLv: 20,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "maintaining";
            fryer.oilDegradation -= 15;
            fryer.clarity += 12;
            fryer.score += 3;
            player.playSound('cooking.skim', player.location);
        }
    },
    {
        key: "rest_on_rack",
        slot: 34,
        name: "cooking.action.rest_rack",
        icon: "minecraft:iron_bars",
        unlockLv: 22,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "resting";
            fryer.progress += 6;
            fryer.oilContent -= 12;
            fryer.crispiness += 10;
            fryer.texture += 8;
            fryer.score += 3;
            player.stopSound('cooking.fire');
            player.stopSound('cooking.oil_bubble');
            player.playSound('cooking.frying_idle', player.location);
        }
    },
    {
        key: "flash_fry",
        slot: 35,
        name: "cooking.action.flash_fry",
        icon: "minecraft:fire_charge",
        unlockLv: 25,
        cost: 2,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.oilTemp += getRandomInteger(60, 90) + ctx.tempVariance();
            fryer.progress += 25;
            fryer.goldenColor += 20;
            fryer.crispiness += 15;
            fryer.burned += 15;
            fryer.oilDegradation += 12;
            player.stopSound('cooking.frying_idle');
            player.playSound('cooking.oil_bubble', player.location);
        }
    },
    {
        key: "batter_test",
        slot: 36,
        name: "cooking.action.batter_test",
        icon: "minecraft:glass_bottle",
        unlockLv: 28,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "testing";
            const add = Math.random() * 0.35;
            fryer.precision = Math.min(1, fryer.precision + add);
            fryer.texture += 5;
            player.playSound('cooking.test', player.location);
        }
    },
    {
        key: "gentle_fry",
        slot: 37,
        name: "cooking.action.gentle_fry",
        icon: "minecraft:torch",
        unlockLv: 30,
        cost: 2,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "frying";
            fryer.progress += 18;
            fryer.texture += 12;
            fryer.moisture -= 10;
            fryer.evenness += 10;
            fryer.score += 4;
            fryer.oilDegradation += 3;
            player.stopSound('cooking.fire');
            player.playSound('cooking.oil_bubble', player.location);
        }
    },
    {
        key: "season_hot",
        slot: 38,
        name: "cooking.action.season_hot",
        icon: "minecraft:glowstone_dust",
        unlockLv: 35,
        cost: 1,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "seasoning";
            fryer.flavor += 15;
            fryer.aroma += 10;
            fryer.score += 5;
            player.playSound('cooking.seasoning', player.location);
        }
    },
    {
        key: "perfect_drain",
        slot: 39,
        name: "cooking.action.perfect_drain",
        icon: "minecraft:chain",
        unlockLv: 40,
        cost: 2,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "draining";
            fryer.oilContent -= 25;
            fryer.crispiness += 18;
            fryer.texture += 12;
            fryer.score += 6;
            player.playSound('cooking.drain', player.location);
        }
    },
    {
        key: "oil_refresh",
        slot: 40,
        name: "cooking.action.oil_refresh",
        icon: "minecraft:honey_bottle",
        unlockLv: 45,
        cost: 3,
        run(fryer, recipe, ctx, player) {
            fryer.phase = "maintaining";
            fryer.oilDegradation = Math.max(0, fryer.oilDegradation - 30);
            fryer.clarity += 20;
            fryer.score += 7;
            player.playSound('cooking.refresh', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openFryStewRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "cooking.title.deep_fryer" }] });

    const lv = new JobLevel(player, "chef").getLevel();
    const recipeIds = Object.keys(FryStewRecipes);

    // ==== 枠装飾 ====
    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:orange_stained_glass_pane"
    );

    // ==== ページ計算 ====
    const start = page * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        const r = FryStewRecipes[id];
        const slot = RECIPE_SLOTS[i];

        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: ` x${r.ingredients[key]}` }
            );
        }

        const coatings = [];
        for (const key of Object.keys(r.coatings ?? {})) {
            coatings.push(
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
                        { text: `: ${r.needTemp[0]}-${r.needTemp[1]}°\n§9` },
                        { translate: "cooking.material" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "cooking.coatings" },
                        { text: ":" },
                        ...coatings,
                        { text: "\n§6" },
                        { translate: "cooking.fried.specialty" }
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
            openFryStewRecipeSelect(player, page - 1);
            return;
        }
        if (r.selection === 53) {
            openFryStewRecipeSelect(player, page + 1);
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
    const recipe = FryStewRecipes[recipeId];
    const form = new ModalFormData()
        .title({ translate: 'cooking.title.amount' })
        .slider({ translate: 'cooking.status.amount' }, 1, new ItemStack(recipe.result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        startFrying(player, recipeId, r.formValues[0]);
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

function startFrying(player, recipeId, quantity) {
    const recipe = FryStewRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    fryingSessions.set(player.id, {
        recipeId,
        quantity,
        scaledIngredients,
        oilTemp: 20,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "preparing",
        burned: 0,
        crispiness: 0,
        texture: 0,
        goldenColor: 0,
        oilContent: 50,
        moisture: 80,
        evenness: 0,
        aroma: 0,
        flavor: 0,
        clarity: 100,
        oilDegradation: 0,
        usedCoatings: [],
        precision: Math.random(),
        materialQuality,
        coatingQuality: 0,
        coatingCount: 0,

        ctx: { tempVariance: () => tempVariance(player, recipe) }
    });

    openFryer(player);
}

function openFryer(player) {
    const fryer = fryingSessions.get(player.id);
    const recipe = FryStewRecipes[fryer.recipeId];
    const lv = new JobLevel(player, "chef").getLevel();

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys()],
        "minecraft:orange_stained_glass_pane"
    );
    fill(form, [...Array(9).keys()].map(i => i + 45),
        "minecraft:orange_stained_glass_pane"
    );

    const fryingDanger = isFryingDanger(fryer, recipe);
    if (fryingDanger) {
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
            { rawtext: [{ text: '§9' }, { translate: "cooking.status.phase" }, { text: `: ${fryer.phase}\n` }] },
            { rawtext: [{ text: '§c' }, { translate: "cooking.status.oil_temp" }, { text: `: ${fryer.oilTemp}°(${Math.floor((recipe.needTemp[0] + recipe.needTemp[1]) / 2)}°)\n` }] },
            { rawtext: [{ text: '§a' }, { translate: "cooking.status.progress" }, { text: `: ${fryer.progress}%\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "cooking.status.burned" }, { text: `: ${Math.max(0, fryer.burned)}%\n` }] },
            { rawtext: [{ text: '§e' }, { translate: "cooking.status.crispiness" }, { text: `: ${Math.max(0, fryer.crispiness)}%\n` }] },
            { rawtext: [{ text: '§d' }, { translate: "cooking.status.texture" }, { text: `: ${Math.max(0, fryer.texture)}\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "cooking.status.golden" }, { text: `: ${Math.max(0, fryer.goldenColor)}\n` }] },
            { rawtext: [{ text: '§7' }, { translate: "cooking.status.oil_content" }, { text: `: ${Math.max(0, fryer.oilContent)}%\n` }] },
            { rawtext: [{ text: '§3' }, { translate: "cooking.status.moisture" }, { text: `: ${Math.max(0, fryer.moisture)}%\n` }] },
            { rawtext: [{ text: '§2' }, { translate: "cooking.status.evenness" }, { text: `: ${Math.max(0, fryer.evenness)}%\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "cooking.status.aroma" }, { text: `: ${Math.max(0, fryer.aroma)}\n` }] },
            { rawtext: [{ text: '§b' }, { translate: "cooking.status.actions" }, { text: `: ${fryer.actions}/${fryer.maxActions}\n` }] },
            { rawtext: [{ text: '§f' }, { translate: "cooking.status.amount" }, { text: `: ${fryer.quantity}\n` }] },
            { rawtext: [{ text: '§5' }, { translate: "cooking.lore.quality", with: [`${calcRank(fryer, recipe).rank}`] }] }
        ],
        editedName: true
    });

    for (const action of FryingActions) {
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
    const fryer = fryingSessions.get(player.id);
    const recipe = FryStewRecipes[fryer.recipeId];

    if (slot === 49 && fryer.phase != 'preparing') {
        finish(player);
        return;
    }

    const action = FryingActions.find(a => a.slot === slot);
    if (!action) {
        openFryer(player);
        return;
    }

    const lv = new JobLevel(player, "chef").getLevel();
    if (lv < action.unlockLv) {
        openFryer(player);
        return;
    }
    if (fryer.actions + action.cost > fryer.maxActions) {
        fryer.phase = "burned";
        finish(player);
        return;
    }

    action.run(fryer, recipe, fryer.ctx, player);
    fryer.actions += action.cost;
    fryer.oilTemp = Math.floor(fryer.oilTemp * 100) / 100;
    fryer.progress = Math.floor(fryer.progress * 100) / 100;
    fryer.burned = Math.max(0, Math.floor(fryer.burned * 100) / 100);
    fryer.crispiness = Math.max(0, Math.floor(fryer.crispiness * 100) / 100);
    fryer.texture = Math.max(0, Math.floor(fryer.texture * 100) / 100);
    fryer.goldenColor = Math.max(0, Math.floor(fryer.goldenColor * 100) / 100);
    fryer.oilContent = Math.max(0, Math.floor(fryer.oilContent * 100) / 100);
    fryer.moisture = Math.max(0, Math.floor(fryer.moisture * 100) / 100);
    fryer.evenness = Math.max(0, Math.floor(fryer.evenness * 100) / 100);
    fryer.aroma = Math.max(0, Math.floor(fryer.aroma * 100) / 100);
    fryer.flavor = Math.max(0, Math.floor(fryer.flavor * 100) / 100);
    fryer.clarity = Math.max(0, Math.floor(fryer.clarity * 100) / 100);
    fryer.oilDegradation = Math.max(0, Math.floor(fryer.oilDegradation * 100) / 100);

    openFryer(player);
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

function calcEfficiencyBonus(fryer, recipe) {
    const tempScore = calcTempScore(fryer.oilTemp, recipe.needTemp, 15);

    if (tempScore < 12) return 0;

    const used = fryer.actions;
    const max = fryer.maxActions;

    if (used <= max * 0.35) return 10;
    if (used <= max * 0.55) return 8;
    if (used <= max * 0.75) return 5;
    return 0;
}

function calcRank(fryer, recipe) {
    let score = fryer.score;

    // progress
    score += Math.min(6, Math.floor(fryer.progress / 20));

    // temperature
    score += calcTempScore(fryer.oilTemp, recipe.needTemp, 15);

    // burned (焦げが少ないほど高評価)
    score += Math.floor((100 - Math.max(0, fryer.burned)) / 8);

    // crispiness (カリカリ度)
    score += Math.min(8, Math.floor(fryer.crispiness / 15));

    // texture (食感)
    score += Math.min(6, Math.floor(fryer.texture / 12));

    // golden color (きつね色)
    score += Math.min(6, Math.floor(fryer.goldenColor / 15));

    // oil content (油の含有量が少ないほど高評価)
    score += Math.floor((100 - Math.max(0, fryer.oilContent)) / 15);

    // moisture (水分が少ないほど高評価)
    score += Math.floor((100 - Math.max(0, fryer.moisture)) / 12);

    // evenness (均一性)
    score += Math.min(6, Math.floor(fryer.evenness / 15));

    // aroma (香り)
    score += Math.min(5, Math.floor(fryer.aroma / 12));

    // flavor (風味)
    score += Math.min(5, Math.floor(fryer.flavor / 12));

    // oil quality (油の劣化が少ないほど高評価)
    score += Math.floor((100 - Math.max(0, fryer.oilDegradation)) / 15);

    // efficiency bonus
    score += calcEfficiencyBonus(fryer, recipe);

    // precision
    score += Math.min(4, Math.floor(fryer.precision * 4));

    // material quality
    score += fryer.materialQuality * 2;

    // coating quality (平均)
    if (fryer.coatingCount > 0) {
        score += Math.floor(
            fryer.coatingQuality / fryer.coatingCount * 1.5
        );
    }

    // burned は即死
    if (fryer.phase === "burned") {
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
    const fryer = fryingSessions.get(player.id);
    const recipe = FryStewRecipes[fryer.recipeId];

    if (!checkIngredients(player, fryer.scaledIngredients)) {
        fryingSessions.delete(player.id);
        return;
    }

    consume(player, fryer.scaledIngredients);

    const { rank, mul } = calcRank(fryer, recipe);

    const item = new ItemStack(
        rank === "F" && fryer.phase === "burned"
            ? "minecraft:charcoal"
            : recipe.result,
        fryer.quantity
    );

    item.setLore([
        { rawtext: [{ text: '§r§3==============' }] },
        { rawtext: [{ text: '§r§e' }, { translate: "cooking.lore.quality", with: [`${rank}`] }] },
        { rawtext: [{ text: '§r§6' }, { translate: "cooking.fried.specialty" }] },
        { rawtext: [{ text: '§r§3==============' }] },
    ]);

    player.getComponent("inventory").container.addItem(item);
    fryingSessions.delete(player.id);

    player.stopSound('cooking.frying_idle');
    player.stopSound('cooking.fire');
    player.stopSound('cooking.oil_bubble');
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