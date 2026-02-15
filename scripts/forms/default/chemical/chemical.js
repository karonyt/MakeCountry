import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "../../../lib/chest-ui";
import { ChemistryRecipes } from "../../../data/chemical/chemical_recipe";
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
const chemistrySessions = new Map();

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

function resolveResult(result) {

    if (typeof result === "string") {
        return { id: result, count: 1 };
    }

    return {
        id: result.id,
        count: result.count ?? 1
    };
}

function createStacks(id, count) {
    const stacks = [];

    while (count > 0) {
        const stack = new ItemStack(id);
        const stackSize = Math.min(stack.maxAmount, count);
        stack.amount = stackSize;
        stacks.push(stack);
        count -= stackSize;
    }

    return stacks;
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
            rawtext: [{ translate: "chemistry.error.insufficient_materials" }, ...lines]
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

function isDangerousCondition(lab, recipe) {
    const type = recipe.reactionType;

    if (type === "electrolysis") {
        return lab.voltage > recipe.optimalVoltage[1] + 5 || lab.actions >= lab.maxActions - 1;
    } else if (type === "neutralization") {
        return Math.abs(lab.pH - 7) > 5 || lab.actions >= lab.maxActions - 1;
    } else if (type === "oxidation" || type === "reduction" || type === "polymerization") {
        return lab.temperature > recipe.optimalTemperature[1] + 80 || lab.actions >= lab.maxActions - 1;
    } else if (type === "precipitation") {
        return Math.abs(lab.pH - (recipe.targetPH ?? 7)) > 4
            || lab.actions >= lab.maxActions - 1;
    } else if (type === "decomposition") {
        return lab.temperature > recipe.optimalTemperature[1] + 150
            || lab.actions >= lab.maxActions - 1;
    } else if (type === "fermentation") {
        return lab.temperature > recipe.optimalTemperature[1] + 20
            || lab.actions >= lab.maxActions - 1;
    }

    return lab.actions >= lab.maxActions - 1;
}

function calcMaxActions(player, recipe) {
    const lv = new JobLevel(player, "chemist").getLevel();
    return recipe.baseActions + Math.min(
        Math.floor((lv - recipe.requiredLevel) / 3),
        recipe.requiredLevel * 1.5
    )
}

function reactionVariance(player, recipe) {
    const lv = new JobLevel(player, "chemist").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getRandomInteger(
        -Math.max(1, 10 - Math.floor(diff / 3)),
        Math.max(1, 10 - Math.floor(diff / 3))
    );
}

function catalystSuccessRate(lab, recipe) {
    let rate = 1;
    const type = recipe.reactionType;

    if (type === "electrolysis") {
        const optV = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
        if (Math.abs(lab.voltage - optV) > 3) rate -= 0.15;
    } else if (type === "neutralization") {
        if (Math.abs(lab.pH - 7) > 2) rate -= 0.2;
    } else if (type === "oxidation" || type === "reduction" || type === "polymerization") {
        const optT = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
        if (Math.abs(lab.temperature - optT) > 40) rate -= 0.15;
    }

    if (lab.progress < 40) rate -= 0.2;
    rate -= lab.usedCatalysts.length * 0.1;

    return Math.max(0.1, rate);
}

const RANK_QUALITY_TABLE = {
    "KARON": 10,
    "IMPOSSIBLE": 10,
    "EXTRA": 9,
    "LEGEND": 8,
    "SSS": 7,
    "SS": 6,
    "S": 5,
    "A": 4,
    "B A": 3,
    "C B": 2,
    "D C": 1,
    "E": 0,
    "F": 0,
};

function getItemQuality(item) {
    if (item?.getRawLore().length == 0) return 0;

    const lore = item.getRawLore() ?? [];

    for (const line of lore) {
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            if (part.with && part.with.length > 0) {
                const rank = part.with[0];
                if (rank in RANK_QUALITY_TABLE) {
                    return RANK_QUALITY_TABLE[rank];
                }
            }
        }
    }
    return 0;
}

/* ===============================
   Actions (化学実験用)
================================ */
const ChemistryActions = [
    /* ===== 基本操作 ===== */
    {
        key: "add_reagent",
        slot: 20,
        name: "chemistry.action.add_reagent",
        icon: "minecraft:glass_bottle",
        unlockLv: 1,
        cost: 1,
        run(lab, recipe, ctx, player) {
            lab.progress += 12;
            lab.phase = "reacting";

            if (recipe.reactionType === "electrolysis") {
                lab.voltage += getRandomInteger(1, 3);
            } else if (recipe.reactionType === "neutralization") {
                lab.pH += getRandomInteger(-2, 2) * 0.5;
            }

            player.stopSound('chemistry.bubbling');
            player.stopSound('chemistry.electric');
            player.playSound('chemistry.pour', player.location);
        }
    },
    {
        key: "stir",
        slot: 21,
        name: "chemistry.action.stir",
        icon: "minecraft:stick",
        unlockLv: 1,
        cost: 1,
        run(lab, recipe, ctx, player) {
            lab.phase = "reacting";
            lab.progress += getRandomInteger(8, 12);
            lab.stirringSpeed += 10;
            lab.contamination -= 5;
            player.playSound('chemistry.stir', player.location);
        }
    },
    {
        key: "add_catalyst",
        slot: 22,
        name: "chemistry.action.add_catalyst",
        icon: "minecraft:glowstone_dust",
        unlockLv: 2,
        cost: 1,
        run(lab, recipe, ctx, player) {
            lab.phase = "reacting";
            if (lab.usedCatalysts.length >= recipe.maxCatalysts) {
                lab.score -= 1;
                return;
            }

            for (const c of Object.keys(recipe.catalysts ?? {})) {
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
                lab.catalystQuality += q;
                lab.catalystCount += 1;

                consume(player, { [c]: 1 });

                const rate = catalystSuccessRate(lab, recipe);
                if (Math.random() <= rate) {
                    lab.score += recipe.catalysts[c];
                    lab.contamination -= 10;
                    lab.progress += 15;
                } else {
                    lab.score -= recipe.catalysts[c];
                    lab.contamination += 8;

                    if (recipe.reactionType === "electrolysis") {
                        lab.voltage += 2;
                    } else if (recipe.reactionType === "oxidation" || recipe.reactionType === "reduction") {
                        lab.temperature += 30;
                    }
                }
                lab.usedCatalysts.push(c);
                player.playSound('chemistry.catalyst', player.location);
                return;
            }
        }
    },

    /* ===== 電気分解関連 ===== */
    {
        key: "increase_voltage",
        slot: 27,
        name: "chemistry.action.increase_voltage",
        icon: "minecraft:redstone",
        unlockLv: 3,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "electrolysis") return;

            lab.phase = "reacting";
            lab.voltage += getRandomInteger(2, 4) + ctx.reactionVariance();
            lab.progress += 10;
            player.stopSound('chemistry.pour');
            player.stopSound('chemistry.bubbling');
            player.playSound('chemistry.electric', player.location);
        }
    },
    {
        key: "decrease_voltage",
        slot: 28,
        name: "chemistry.action.decrease_voltage",
        icon: "minecraft:redstone_torch",
        unlockLv: 3,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "electrolysis") return;

            lab.phase = "reacting";
            lab.voltage -= getRandomInteger(2, 3);
            lab.voltage = Math.max(0, lab.voltage);
            lab.progress += 5;
            player.playSound('chemistry.adjust', player.location);
        }
    },

    /* ===== pH調整関連 ===== */
    {
        key: "add_acid",
        slot: 29,
        name: "chemistry.action.add_acid",
        icon: "minecraft:fermented_spider_eye",
        unlockLv: 5,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "neutralization") return;

            lab.phase = "reacting";
            lab.pH -= getRandomInteger(1, 3) * 0.5;
            lab.pH = Math.max(0, lab.pH);
            lab.progress += 8;
            player.playSound('chemistry.acid', player.location);
        }
    },
    {
        key: "add_base",
        slot: 30,
        name: "chemistry.action.add_base",
        icon: "minecraft:sugar",
        unlockLv: 5,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "neutralization") return;

            lab.phase = "reacting";
            lab.pH += getRandomInteger(1, 3) * 0.5;
            lab.pH = Math.min(14, lab.pH);
            lab.progress += 8;
            player.playSound('chemistry.base', player.location);
        }
    },

    /* ===== 温度管理関連 ===== */
    {
        key: "heat",
        slot: 31,
        name: "chemistry.action.heat",
        icon: "minecraft:blaze_powder",
        unlockLv: 8,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "oxidation" && recipe.reactionType !== "reduction" && recipe.reactionType !== "decomposition" && recipe.reactionType !== 'fermentation') return;

            lab.phase = "reacting";
            lab.temperature += getRandomInteger(40, 80) + ctx.reactionVariance();
            lab.progress += 12;
            player.stopSound('chemistry.bubbling');
            player.stopSound('chemistry.electric');
            player.playSound('chemistry.heat', player.location);
        }
    },
    {
        key: "cool",
        slot: 32,
        name: "chemistry.action.cool",
        icon: "minecraft:ice",
        unlockLv: 8,
        cost: 1,
        run(lab, recipe, ctx, player) {
            if (recipe.reactionType !== "oxidation" && recipe.reactionType !== "reduction" && recipe.reactionType !== "decomposition" && recipe.reactionType !== 'fermentation') return;

            lab.phase = "reacting";
            lab.temperature -= getRandomInteger(30, 60);
            lab.progress += 5;
            player.playSound('chemistry.cool', player.location);
        }
    },

    /* ===== 高度な操作 ===== */
    {
        key: "filter",
        slot: 33,
        name: "chemistry.action.filter",
        icon: "minecraft:paper",
        unlockLv: 10,
        cost: 2,
        run(lab, recipe, ctx, player) {
            lab.phase = "purifying";
            lab.contamination -= getRandomInteger(20, 30);
            lab.contamination = Math.max(0, lab.contamination);
            lab.progress += 8;
            lab.score += 1;
            player.playSound('chemistry.filter', player.location);
        }
    },
    {
        key: "centrifuge",
        slot: 34,
        name: "chemistry.action.centrifuge",
        icon: "minecraft:ender_eye",
        unlockLv: 15,
        cost: 2,
        run(lab, recipe, ctx, player) {
            lab.phase = "separating";
            lab.contamination -= getRandomInteger(15, 25);
            lab.contamination = Math.max(0, lab.contamination);
            lab.stirringSpeed += 50;
            lab.progress += 15;
            lab.score += 1;
            player.playSound('chemistry.centrifuge', player.location);
        }
    },
    {
        key: "distill",
        slot: 35,
        name: "chemistry.action.distill",
        icon: "minecraft:brewing_stand",
        unlockLv: 20,
        cost: 3,
        run(lab, recipe, ctx, player) {
            lab.phase = "purifying";
            lab.contamination -= getRandomInteger(25, 40);
            lab.contamination = Math.max(0, lab.contamination);
            lab.progress += 10;
            lab.score += 2;

            if (recipe.reactionType === "oxidation" || recipe.reactionType === "reduction") {
                lab.temperature += 20;
            }

            player.playSound('chemistry.distill', player.location);
        }
    },
    {
        key: "measure_purity",
        slot: 36,
        name: "chemistry.action.measure_purity",
        icon: "minecraft:spyglass",
        unlockLv: 25,
        cost: 1,
        run(lab, recipe, ctx, player) {
            lab.phase = "analyzing";
            const add = Math.random() * 0.3;
            lab.precision = Math.min(1, lab.precision + add);
            lab.score += 0.5;
            player.playSound('chemistry.measure', player.location);
        }
    },
    {
        key: "crystallize",
        slot: 37,
        name: "chemistry.action.crystallize",
        icon: "minecraft:amethyst_shard",
        unlockLv: 30,
        cost: 3,
        run(lab, recipe, ctx, player) {
            lab.phase = "crystallizing";

            if (recipe.reactionType === "oxidation" || recipe.reactionType === "reduction") {
                lab.temperature -= 30;
            }
            lab.temperature -= 20;
            lab.precision -= 0.1;
            lab.contamination -= 10;
            lab.progress += 20;
            lab.score += 1.5;
            player.playSound('chemistry.crystallize', player.location);
        }
    }
];

/* ===============================
   UI
================================ */
export function openRecipeSelect(player, page = 0) {
    const form = new ChestFormData("large")
        .setTitle({ rawtext: [{ translate: "chemistry.title.laboratory" }] });

    const lv = new JobLevel(player, "chemist").getLevel();
    const recipeIds = Object.keys(ChemistryRecipes);

    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:black_stained_glass_pane"
    );

    const start = page * RECIPES_PER_PAGE;
    const pageRecipes = recipeIds.slice(start, start + RECIPES_PER_PAGE);

    pageRecipes.forEach((id, i) => {
        const r = ChemistryRecipes[id];
        const slot = RECIPE_SLOTS[i];

        const materials = [];
        for (const key of Object.keys(r.ingredients)) {
            materials.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: ` x${r.ingredients[key]}` }
            );
        }

        const catalysts = [];
        for (const key of Object.keys(r.catalysts ?? {})) {
            catalysts.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: `` }
            );
        }

        let conditionText = [];

        switch (r.reactionType) {
            case "electrolysis":
                conditionText = [
                    { text: '\n§e' },
                    { translate: "chemistry.voltage_range" },
                    { text: `: ${r.optimalVoltage[0]} ～ ${r.optimalVoltage[1]}V` }
                ];
                break;

            case "neutralization":
                conditionText = [
                    { text: '\n§e' },
                    { translate: "chemistry.target_ph" },
                    { text: `: ${r.targetPH ?? 7}` }
                ];
                break;

            case "oxidation":
            case "reduction":
            case "polymerization":
            case "decomposition":
                conditionText = [
                    { text: '\n§c' },
                    { translate: "chemistry.temperature_range" },
                    { text: `: ${r.optimalTemperature[0]} ～ ${r.optimalTemperature[1]}℃` }
                ];
                break;

            case "precipitation":
                conditionText = [
                    { text: '\n§c' },
                    { translate: "chemistry.temperature_range" },
                    { text: `: ${r.optimalTemperature[0]} ～ ${r.optimalTemperature[1]}℃` },
                    { text: '\n§e' },
                    { translate: "chemistry.target_ph" },
                    { text: `: ${r.targetPH ?? 7}` }
                ];
                break;

            case "fermentation":
                conditionText = [
                    { text: '\n§c' },
                    { translate: "chemistry.temperature_range" },
                    { text: `: ${r.optimalTemperature[0]} ～ ${r.optimalTemperature[1]}℃` }
                ];
                break;
        }

        form.setButton(slot, {
            iconPath: lv >= r.requiredLevel
                ? itemIdToPath[r.name]
                : itemIdToPath["minecraft:barrier"],
            name: lv >= r.requiredLevel
                ? langChangeItemName(r.name)
                : "chemistry.locked",
            lore: lv >= r.requiredLevel
                ? [{
                    rawtext: [
                        { translate: "chemistry.reaction_type" },
                        { text: `: ${r.reactionType}` },
                        ...conditionText,
                        { text: "\n§9" },
                        { translate: "chemistry.reagents" },
                        { text: ":" },
                        ...materials,
                        { text: "\n§9" },
                        { translate: "chemistry.catalysts" },
                        { text: ":" },
                        ...catalysts,
                    ]
                }]
                : [{
                    rawtext: [
                        { translate: "chemistry.unlock_level" },
                        { text: ` ${r.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    if (page > 0) {
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "chemistry.page.prev",
            editedName: true
        });
    }

    if ((page + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "chemistry.page.next",
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
    const recipe = ChemistryRecipes[recipeId];
    const result = resolveResult(recipe.result).id;

    const form = new ModalFormData()
        .title({ translate: 'chemistry.title.amount' })
        .slider({ translate: 'chemistry.status.amount' }, 1, new ItemStack(result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        startReaction(player, recipeId, r.formValues[0]);
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

function startReaction(player, recipeId, quantity) {
    const recipe = ChemistryRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);

    const initialState = {
        recipeId,
        quantity,
        scaledIngredients,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(player, recipe),
        score: 0,
        phase: "preparation",
        contamination: 100,
        usedCatalysts: [],
        precision: Math.random(),
        materialQuality,
        catalystQuality: 0,
        catalystCount: 0,
        stirringSpeed: 0,

        voltage: 0,
        pH: 7,
        temperature: 20,

        ctx: { reactionVariance: () => reactionVariance(player, recipe) }
    };

    chemistrySessions.set(player.id, initialState);

    openLaboratory(player);
}

function openLaboratory(player) {
    const lab = chemistrySessions.get(player.id);
    const recipe = ChemistryRecipes[lab.recipeId];
    const lv = new JobLevel(player, "chemist").getLevel();
    lab.temperature = Math.max(-273.15, lab.temperature);

    const form = new ChestFormData("large").setTitle({ rawtext: [{ translate: langChangeItemName(recipe.name) }] });

    fill(form, [...Array(9).keys()], "minecraft:black_stained_glass_pane");
    fill(form, [...Array(9).keys()].map(i => i + 45), "minecraft:black_stained_glass_pane");

    const danger = isDangerousCondition(lab, recipe);
    if (danger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:red_stained_glass_pane",
            "chemistry.danger.warning.title",
            [{ translate: 'chemistry.danger.warning.lore' }]
        );
    }

    const statusLore = [
        { rawtext: [{ text: '§9' }, { translate: "chemistry.status.phase" }, { text: `: ${lab.phase}\n` }] },
        { rawtext: [{ text: '§a' }, { translate: "chemistry.status.progress" }, { text: `: ${lab.progress}%\n` }] },
        { rawtext: [{ text: '§6' }, { translate: "chemistry.status.contamination" }, { text: `: ${Math.max(0, lab.contamination)}%\n` }] },
        { rawtext: [{ text: '§b' }, { translate: "chemistry.status.actions" }, { text: `: ${lab.actions}/${lab.maxActions}\n` }] },
        { rawtext: [{ text: '§e' }, { translate: "chemistry.status.amount" }, { text: `: ${lab.quantity}\n` }] },
    ];

    if (recipe.reactionType === "electrolysis") {
        statusLore.push(
            { rawtext: [{ text: '§c' }, { translate: "chemistry.status.voltage" }, { text: `: ${lab.voltage}V (${Math.floor((recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2)}V)\n` }] }
        );
    } else if (recipe.reactionType === "neutralization") {
        statusLore.push(
            { rawtext: [{ text: '§c' }, { translate: "chemistry.status.ph" }, { text: `: ${lab.pH.toFixed(1)} (${recipe.targetPH ?? 7})\n` }] }
        );
    } else if (
        recipe.reactionType === "oxidation" ||
        recipe.reactionType === "reduction" ||
        recipe.reactionType === "polymerization" ||
        recipe.reactionType === "fermentation"
    ) {
        statusLore.push(
            {
                rawtext: [{ text: '§c' }, { translate: "chemistry.status.temperature" },
                { text: `: ${lab.temperature}℃ (${Math.floor((recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2)}℃)\n` }]
            }
        );
    } else if (recipe.reactionType === "precipitation") {
        statusLore.push(
            {
                rawtext: [{ text: '§c' }, { translate: "chemistry.status.ph" },
                { text: `: ${lab.pH.toFixed(1)} (${recipe.targetPH ?? 7})\n` }]
            },
            {
                rawtext: [{ text: '§c' }, { translate: "chemistry.status.temperature" },
                { text: `: ${lab.temperature}℃\n` }]
            }
        );
    }



    statusLore.push(
        { rawtext: [{ text: '§d' }, { translate: "chemistry.lore.purity", with: [`${calcRank(lab, recipe).rank}`] }] }
    );

    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "chemistry.status.title",
        lore: statusLore,
        editedName: true
    });

    for (const action of ChemistryActions) {
        if (lv < action.unlockLv) {
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "chemistry.locked",
                lore: [{ rawtext: [{ translate: "chemistry.unlock_level" }, { text: `${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            form.setButton(action.slot, {
                iconPath: itemIdToPath[action.icon],
                name: action.name,
                lore: [{ rawtext: [{ text: '§7' }, { translate: "chemistry.action.cost" }, { text: `: ${action.cost}` }] }],
                editedName: true
            });
        }
    }

    form.setButton(49, {
        iconPath: itemIdToPath["minecraft:lime_dye"],
        name: "chemistry.button.complete",
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
    const lab = chemistrySessions.get(player.id);
    const recipe = ChemistryRecipes[lab.recipeId];

    if (slot === 49 && lab.phase != 'preparation') {
        finish(player);
        return;
    }

    const action = ChemistryActions.find(a => a.slot === slot);
    if (!action) {
        openLaboratory(player);
        return;
    }

    const lv = new JobLevel(player, "chemist").getLevel();
    if (lv < action.unlockLv) {
        openLaboratory(player);
        return;
    }
    if (lab.actions + action.cost > lab.maxActions) {
        lab.phase = "failed";
        finish(player);
        return;
    }

    action.run(lab, recipe, lab.ctx, player);
    lab.actions += action.cost;

    lab.voltage = Math.floor(lab.voltage * 100) / 100;
    lab.pH = Math.floor(lab.pH * 100) / 100;
    lab.temperature = Math.floor(lab.temperature * 100) / 100;
    lab.progress = Math.floor(lab.progress * 100) / 100;
    lab.contamination = Math.max(0, Math.floor(lab.contamination * 100) / 100);

    openLaboratory(player);
}

function calcConditionScore(lab, recipe) {
    const type = recipe.reactionType;
    let score = 0;

    if (type === "electrolysis") {
        const optV = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
        score = Math.max(0, 12 - Math.floor(Math.abs(lab.voltage - optV) * 2));
    } else if (type === "neutralization") {
        const targetPH = recipe.targetPH ?? 7;
        score = Math.max(0, 12 - Math.floor(Math.abs(lab.pH - targetPH) * 3));
    } else if (type === "oxidation" || type === "reduction" || type === "polymerization") {
        const optT = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
        score = Math.max(0, 12 - Math.floor(Math.abs(lab.temperature - optT) / 12));
    } else if (type === "precipitation") {
        const tScore = 6 - Math.floor(
            Math.abs(lab.temperature - ((recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2)) / 10
        );
        const pScore = 6 - Math.floor(Math.abs(lab.pH - (recipe.targetPH ?? 7)) * 1.5);
        score = Math.max(0, tScore + pScore);
    } else if (type === "decomposition") {
        const optT = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
        score = Math.max(0, 12 - Math.floor(Math.abs(lab.temperature - optT) / 20));
    } else if (type === "fermentation") {
        const optT = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
        score = Math.max(
            0,
            12 - Math.floor(Math.abs(lab.temperature - optT) / 6)
        );
    }

    return score;
}

function calcEfficiencyBonus(lab, recipe) {
    const condScore = calcConditionScore(lab, recipe);

    if (condScore < 10) return 0;

    const used = lab.actions;
    const max = lab.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(lab, recipe) {
    let score = lab.score;

    score += Math.min(5, Math.floor(lab.progress / 25));

    const cond = calcConditionScore(lab, recipe);

    score += cond;

    score += Math.floor((100 - Math.max(0, lab.contamination)) / 10);
    score += calcEfficiencyBonus(lab, recipe);
    score += Math.min(3, Math.floor(lab.precision * 3));
    score += lab.materialQuality * 1.5;

    if (lab.catalystCount > 0) {
        score += Math.floor(lab.catalystQuality / lab.catalystCount);
    }

    if (lab.phase === "failed") {
        return { rank: "CONTAMINATED", mul: 0.3 };
    }

    if (score >= 95 && 8 < cond) return { rank: "KARON", mul: 12 };
    if (score >= 75 && 8 < cond) return { rank: "IMPOSSIBLE", mul: 10 };
    if (score >= 65 && 8 < cond) return { rank: "EXTRA", mul: 6 };
    if (score >= 55 && 8 < cond) return { rank: "LEGEND", mul: 4 };
    if (score >= 48 && 8 < cond) return { rank: "SSS", mul: 2.5 };
    if (score >= 42 && 8 < cond) return { rank: "SS", mul: 2.0 };
    if (score >= 38 && 8 < cond) return { rank: "S", mul: 1.7 };
    if (score >= 34 && 8 < cond) return { rank: "A", mul: 1.5 };
    if (score >= 30 && 8 < cond) return { rank: "B", mul: 1.4 };
    if (score >= 26) return { rank: "C", mul: 1.3 };
    if (score >= 22) return { rank: "D", mul: 1.2 };
    if (score >= 15) return { rank: "E", mul: 1.0 };
    return { rank: "F", mul: 0.3 };
}

/* ===============================
   Finish
================================ */
function finish(player) {
    const lab = chemistrySessions.get(player.id);
    const recipe = ChemistryRecipes[lab.recipeId];

    if (!checkIngredients(player, lab.scaledIngredients)) {
        chemistrySessions.delete(player.id);
        return;
    }

    consume(player, lab.scaledIngredients);

    const { rank, mul } = calcRank(lab, recipe);

    const resolved = resolveResult(recipe.result);

    const isWaste =
        rank === "CONTAMINATED" && lab.phase === "failed";

    const itemId = isWaste
        ? "mc:chemical_waste"
        : resolved.id;

    const totalCount = isWaste
        ? lab.quantity
        : lab.quantity * resolved.count;

    const items = createStacks(itemId, totalCount);

    for (const item of items) {
        item.setLore([
            { rawtext: [{ text: '§r§a==============' }] },
            { rawtext: [{ text: '§r§e' }, { translate: "chemistry.lore.purity", with: [`${rank}`] }] },
            { rawtext: [{ text: '§r§a==============' }] },
        ]);

        player.dimension.spawnItem(item, player.location);
    }

    chemistrySessions.delete(player.id);

    player.stopSound('chemistry.bubbling');
    player.stopSound('chemistry.electric');
    player.stopSound('chemistry.pour');
    player.stopSound('chemistry.heat');
    player.playSound('chemistry.complete', player.location);

    if (jobs_config.validity && player.hasTag('mcjobs_chemist')) {
        const job = new JobLevel(player, "chemist");
        const level = job.getLevel();

        const baseMoney = recipe.baseMoney * mul;
        const random = getRandomInteger(
            jobs_config.chemistReward.min,
            jobs_config.chemistReward.max
        );

        const reward =
            Math.floor(
                baseMoney *
                100 *
                random *
                job.getReward(level) *
                buff.getMultiplier("chemist") *
                5
            ) / 100;

        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        const finalReward = applyDailyLimit(
            playerData,
            "chemist",
            reward,
            jobs_config.dailyLimit.chemist
        );

        if (finalReward > 0) {
            job.addXp(recipe.baseXp * mul);
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        }

        player.onScreenDisplay.setActionBar(
            {
                rawtext: [
                    { translate: "chemistry.reward.prefix" },
                    { text: ` ${rank} ` },
                    { translate: "chemistry.reward.money" },
                    { text: `+${finalReward}${config.MoneyName}` },
                    { translate: "chemistry.reward.xp" },
                    { text: `${job.getXp()}/${job.getXpRequired(level)}` }
                ]
            }
        );
    }
}