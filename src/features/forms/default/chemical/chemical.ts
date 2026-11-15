import { resolveArtisanFilterPreference } from "@/shared/ui/artisan-filter-preferences.js";
import { artisanFilterLabel, filterArtisanRecipeIds, type ArtisanRecipeFilter } from "@/domain/recipes/artisan-filter.js";
import { addCraftableFilterButton, craftableOnly, toggleCraftableOnly, filterCraftableRecipeIds, CRAFTABLE_FILTER_SLOT } from "@/shared/ui/craftable-filter.js";
import { openArtisanRecipeFilter } from "@/shared/ui/artisan-recipe-filter.js";
import { cancelArtisanCraft, runArtisanCraft } from "@/domain/jobs/pending-artisan-rewards.js";
import { gateGoodUsageRawtext, recipeListName, recipeTitleParts } from "@/domain/recipes/recipe-display.js";
import { CraftingModalFormData as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { ItemStack, Player, world } from "@minecraft/server";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { ChemistryRecipes } from "@/content/chemical/chemical-recipe.js";
import { itemIdToPath } from "@/config/textures.js";
import jobs_config from "@/config/jobs.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { getRandomInteger, langChangeItemName } from "@/shared/utils/minecraft.js";
import { getGameplayRandomValue } from "@/shared/utils/gameplay-random.js";
import {
    cleanRecipeSearchQuery,
    filterUnlockedRecipesForSearch,
    isRecipeSearchActive,
    sortRecipeIdsByLevel,
} from "@/domain/recipes/recipe-list.js";

import { addLastCraftedRecipeButton, getLastCraftedRecipeId, rememberLastCraftedRecipe } from "@/shared/ui/last-crafted-recipe.js";
import {
    ACCIDENT_RISK_THRESHOLD,
    CRITICAL_RISK_THRESHOLD,
    calculateAccidentChance,
    calculateBreakthroughChance,
    calculateEmergencyStabilization,
    calculateOutputYield,
    calculateReactionControlError,
    calculateReactionRiskFactors,
    calculateReactionSafety,
    clamp,
    getReactionControlTargets,
    isTemperatureReaction,
    meetsBreakthroughConditions,
} from "@/domain/chemical/reaction-safety.js";
import {
    CHEMISTRY_REFINEMENT,
    calculateChemistryActionBudget,
    getChemistryRefinementCap,
    calculateProtocolBreakthroughChance,
    calculateResearchYieldBonus,
    createReactionProtocol,
    evaluateProtocolAction,
    getChemistryResearchTechnique,
    getChemistryRankMultiplier,
    getEligibleReactionPulses,
    getIncompleteProtocolDisposition,
    isReactionPulseContained,
} from "@/domain/chemical/reaction-protocol.js";
import {
    capRankByRecipeMastery,
    getRecipeMasteryProfile,
} from "@/domain/professions/recipe-mastery.js";
import { calculateDistillationTemperature } from "@/domain/chemical/reaction-actions.js";

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
const chemistrySessions = new Map();

/* ===============================
   Inventory Utils
================================ */
function countInventory(player: any) {
    const inv = player.getComponent("inventory").container;
    const counts = {};
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

function resolveResult(result: any) {

    if (typeof result === "string") {
        return { id: result, count: 1 };
    }

    return {
        id: result.id,
        count: result.count ?? 1
    };
}

function createStacks(id: any, count: any) {
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

const ACTION_INSTABILITY: Record<string, number> = {
    add_reagent: 8,
    stir: -8,
    add_catalyst: 10,
    increase_voltage: 12,
    decrease_voltage: -8,
    add_acid: 9,
    add_base: 9,
    heat: 12,
    cool: -7,
    filter: -14,
    centrifuge: 10,
    distill: 12,
    measure_purity: -10,
    crystallize: 8,
};

function refreshReactionSafety(lab: any, recipe: any, trackPrecision = true) {
    const safety = calculateReactionSafety(lab, recipe);
    lab.risk = safety.risk;
    lab.stability = safety.stability;

    if (!trackPrecision) return;

    const precise = calcConditionScore(lab, recipe) >= 10
        && lab.precision >= 0.7
        && lab.risk <= 25;
    if (precise) {
        lab.safePrecisionStreak += 1;
    } else if (lab.risk > 35 || calcConditionScore(lab, recipe) < 8) {
        lab.safePrecisionStreak = 0;
    }
}

function isDangerousCondition(lab: any) {
    return lab.risk >= 55 || lab.actions >= lab.maxActions - 1;
}

function registerAccident(player: any, lab: any, recipe: any, forced = false) {
    if (!forced && lab.risk < ACCIDENT_RISK_THRESHOLD) {
        if (lab.risk < 45) lab.dangerSteps = 0;
        return false;
    }

    const chance = calculateAccidentChance(lab.risk, lab.dangerSteps);
    if (!forced && Math.random() >= chance) {
        lab.dangerSteps += 1;
        return false;
    }

    lab.accidents += 1;
    lab.dangerSteps = 0;
    lab.yieldPenalty = clamp(lab.yieldPenalty + 0.2 + lab.risk / 500, 0, 0.8);
    lab.contamination = clamp(lab.contamination + 18, 0, 100);
    lab.progress = Math.max(0, lab.progress - 10);
    lab.score -= 6;
    lab.instability = clamp(lab.instability + 12, 0, 100);
    lab.protocolCombo = 0;
    lab.insightCombo = 0;
    lab.phase = "accident";
    refreshReactionSafety(lab, recipe, false);

    player.stopSound("chemistry.bubbling");
    player.stopSound("chemistry.electric");
    player.playSound("random.explode", player.location);
    player.applyDamage(Math.min(4, 1 + lab.accidents));
    player.sendMessage({
        rawtext: [{ translate: "chemistry.accident.message", with: [`${lab.risk}%`] }]
    });
    return true;
}

function isBreakthroughReady(lab: any, recipe: any) {
    const protocolReady = lab.protocolIndex >= lab.protocol.length - 1
        && lab.insight >= 2;
    return protocolReady
        && meetsBreakthroughConditions(lab, calcConditionScore(lab, recipe));
}

function calcMaxActions(
    recipe: any,
    chemistLevel: number,
    supportedActionKeys: readonly string[],
    protocol: readonly any[]
) {
    return calculateChemistryActionBudget({
        baseActions: recipe.baseActions,
        requiredLevel: recipe.requiredLevel,
        chemistLevel,
        reactionType: recipe.reactionType,
        supportedActions: supportedActionKeys,
        protocol,
    });
}

function reactionVariance(player: any, recipe: any) {
    const lv = new JobLevel(player, "chemist").getLevel();
    const diff = lv - recipe.requiredLevel;
    return getGameplayRandomValue(
        -Math.max(1, 10 - Math.floor(diff / 3)),
        Math.max(1, 10 - Math.floor(diff / 3))
    );
}

function catalystSuccessRate(lab: any, recipe: any) {
    let rate = 1;
    const type = recipe.reactionType;

    if (type === "electrolysis") {
        const optV = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
        if (Math.abs(lab.voltage - optV) > 3) rate -= 0.15;
    } else if (type === "neutralization" || type === "precipitation") {
        if (Math.abs(lab.pH - (recipe.targetPH ?? 7)) > 2) rate -= 0.2;
    }

    if (isTemperatureReaction(recipe)) {
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
    "LEGENDARY": 8,
    "MYTHICAL": 10,
    "MASTERWORK": 9,
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

function getItemQuality(item: any) {
    if (item?.getRawLore().length == 0) return 0;

    const lore = item.getRawLore() ?? [];

    for (const line of lore) {
        if (!line.rawtext) continue;

        for (const part of line.rawtext) {
            if (part.with && part.with.length > 0) {
                const rawRank = part.with[0];
                const rank = (typeof rawRank === "string" ? rawRank : rawRank?.text)?.trim()?.toUpperCase();
                if (rank && rank in RANK_QUALITY_TABLE) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.progress += 12;
            lab.phase = "reacting";

            if (recipe.reactionType === "electrolysis") {
                lab.voltage += getGameplayRandomValue(1, 3);
            } else if (recipe.reactionType === "neutralization") {
                lab.pH += getGameplayRandomValue(-2, 2) * 0.5;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "reacting";
            lab.progress += getGameplayRandomValue(8, 12);
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
        run(lab: any, recipe: any, ctx: any, player: any) {
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (recipe.reactionType !== "electrolysis") return;

            lab.phase = "reacting";
            const target = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
            const variance = ctx.reactionVariance() * 0.15;
            const normalStep = Math.max(1, getGameplayRandomValue(2, 4) + variance);
            const approachStep = lab.voltage < recipe.optimalVoltage[0]
                ? Math.min(
                    target - lab.voltage,
                    Math.max(normalStep, (target - lab.voltage) * 0.7)
                )
                : normalStep;
            lab.voltage += approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (recipe.reactionType !== "electrolysis") return;

            lab.phase = "reacting";
            const target = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
            const normalStep = getGameplayRandomValue(2, 3);
            const approachStep = lab.voltage > recipe.optimalVoltage[1]
                ? Math.min(
                    lab.voltage - target,
                    Math.max(normalStep, (lab.voltage - target) * 0.7)
                )
                : normalStep;
            lab.voltage -= approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (recipe.reactionType !== "neutralization" && recipe.reactionType !== "precipitation") return;

            lab.phase = "reacting";
            const target = recipe.targetPH ?? 7;
            const normalStep = getGameplayRandomValue(1, 3) * 0.5;
            const approachStep = lab.pH > target + 0.25
                ? Math.min(
                    lab.pH - target,
                    Math.max(normalStep, (lab.pH - target) * 0.7)
                )
                : normalStep;
            lab.pH -= approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (recipe.reactionType !== "neutralization" && recipe.reactionType !== "precipitation") return;

            lab.phase = "reacting";
            const target = recipe.targetPH ?? 7;
            const normalStep = getGameplayRandomValue(1, 3) * 0.5;
            const approachStep = lab.pH < target - 0.25
                ? Math.min(
                    target - lab.pH,
                    Math.max(normalStep, (target - lab.pH) * 0.7)
                )
                : normalStep;
            lab.pH += approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (!isTemperatureReaction(recipe)) return;

            lab.phase = "reacting";
            const target = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
            const normalStep = Math.max(20, getGameplayRandomValue(40, 80) + ctx.reactionVariance() * 0.5);
            const approachStep = lab.temperature < recipe.optimalTemperature[0]
                ? Math.min(
                    target - lab.temperature,
                    Math.max(normalStep, (target - lab.temperature) * 0.65)
                )
                : normalStep;
            lab.temperature += approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            if (!isTemperatureReaction(recipe)) return;

            lab.phase = "reacting";
            const target = (recipe.optimalTemperature[0] + recipe.optimalTemperature[1]) / 2;
            const normalStep = getGameplayRandomValue(30, 60);
            const approachStep = lab.temperature > recipe.optimalTemperature[1]
                ? Math.min(
                    lab.temperature - target,
                    Math.max(normalStep, (lab.temperature - target) * 0.65)
                )
                : recipe.optimalTemperature[1] < 0 && lab.temperature > target
                    ? Math.min(
                        lab.temperature - target,
                        Math.max(normalStep, (lab.temperature - target) * 0.65)
                    )
                    : normalStep;
            lab.temperature -= approachStep;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "purifying";
            lab.contamination -= getGameplayRandomValue(20, 30);
            lab.contamination = Math.max(0, lab.contamination);
            lab.progress += 8;
            lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.filter;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "separating";
            lab.contamination -= getGameplayRandomValue(15, 25);
            lab.contamination = Math.max(0, lab.contamination);
            lab.stirringSpeed += 50;
            lab.progress += 15;
            lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.centrifuge;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "purifying";
            lab.contamination -= getGameplayRandomValue(25, 40);
            lab.contamination = Math.max(0, lab.contamination);
            lab.progress += 10;
            lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.distill;
            lab.temperature = calculateDistillationTemperature(lab.temperature);

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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "analyzing";
            const add = Math.random() * 0.3;
            lab.precision = Math.min(1, lab.precision + add);
            lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.measure;
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
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "crystallizing";

            if (recipe.reactionType === "oxidation" || recipe.reactionType === "reduction") {
                lab.temperature -= 30;
            }
            lab.temperature -= 20;
            lab.precision -= 0.1;
            lab.contamination -= 10;
            lab.progress += 20;
            lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.crystallize;
            player.playSound('chemistry.crystallize', player.location);
        }
    },
    {
        key: "emergency_stabilize",
        slot: 38,
        name: "chemistry.action.emergency_stabilize",
        icon: "minecraft:water_bucket",
        unlockLv: 1,
        cost: 2,
        run(lab: any, recipe: any, ctx: any, player: any) {
            lab.phase = "stabilizing";
            lab.emergencyUses += 1;
            lab.dangerSteps = 0;
            lab.protocolCombo = 0;
            lab.insightCombo = 0;
            Object.assign(lab, calculateEmergencyStabilization(lab, recipe));

            player.stopSound("chemistry.bubbling");
            player.stopSound("chemistry.electric");
            player.stopSound("chemistry.heat");
            player.playSound("chemistry.cool", player.location);
            player.sendMessage({ translate: "chemistry.stabilize.message" });
        }
    }
];

const CONDITION_ACTIONS = new Set([
    "increase_voltage", "decrease_voltage", "add_acid", "add_base", "heat", "cool",
]);

function getCatalystLimit(recipe: any) {
    return recipe.maxCatalysts ?? Object.keys(recipe.catalysts ?? {}).length;
}

function isActionRelevant(actionKey: string, recipe: any) {
    if (actionKey === "add_catalyst") {
        return getCatalystLimit(recipe) > 0 && Object.keys(recipe.catalysts ?? {}).length > 0;
    }
    if (actionKey === "increase_voltage" || actionKey === "decrease_voltage") {
        return recipe.reactionType === "electrolysis";
    }
    if (actionKey === "add_acid" || actionKey === "add_base") {
        return recipe.reactionType === "neutralization" || recipe.reactionType === "precipitation";
    }
    if (actionKey === "heat" || actionKey === "cool") {
        return isTemperatureReaction(recipe);
    }
    return true;
}

function getSupportedActionKeys(player: any, recipe: any) {
    const level = new JobLevel(player, "chemist").getLevel();
    return ChemistryActions
        .filter(action => level >= action.unlockLv && isActionRelevant(action.key, recipe))
        .map(action => action.key);
}

function getActionUnavailableReason(player: any, lab: any, recipe: any, action: any) {
    if (!isActionRelevant(action.key, recipe)) return "reaction";
    if (lab.actions + action.cost > lab.maxActions) return "budget";
    if (action.key !== "add_catalyst") return undefined;

    if (lab.usedCatalysts.length >= getCatalystLimit(recipe)) return "catalyst_limit";
    const hasCatalyst = Object.keys(recipe.catalysts ?? {})
        .some(catalyst => hasAll(player, { [catalyst]: 1 }));
    return hasCatalyst ? undefined : "catalyst_missing";
}

function isProtocolStageSatisfied(stageKey: string, lab: any, recipe: any) {
    if (stageKey === "voltage_control" || stageKey === "ph_control"
        || stageKey === "dual_control" || stageKey === "thermal_control") {
        return calcConditionScore(lab, recipe) >= 8;
    }
    if (stageKey === "reaction") return lab.progress >= 55;
    return true;
}

function registerProtocolViolation(lab: any, outcome = "out_of_order") {
    lab.protocolCombo = 0;
    lab.protocolMistakes += 1;
    lab.controlStreak = 0;
    lab.instability = clamp(lab.instability + 8, -30, 100);
    lab.score -= 1.5;
    lab.lastProtocolOutcome = outcome;
}

function applyProtocolAction(
    lab: any,
    recipe: any,
    actionKey: string,
    controlErrorBefore: number,
    interruptedByPulse = false
) {
    if (actionKey === "emergency_stabilize" || interruptedByPulse) return;

    const stage = lab.protocol[lab.protocolIndex];
    if (!stage) return;
    const controlErrorAfter = calculateReactionControlError(lab, recipe);
    const preciseControl = CONDITION_ACTIONS.has(actionKey)
        && controlErrorAfter + 0.01 < controlErrorBefore;
    const controlMistake = CONDITION_ACTIONS.has(actionKey)
        && controlErrorAfter > controlErrorBefore + 0.01;
    const satisfied = isProtocolStageSatisfied(stage.key, lab, recipe);
    const evaluation = evaluateProtocolAction(
        lab.protocol,
        lab.protocolIndex,
        actionKey,
        satisfied && !controlMistake
    );

    if (evaluation.outcome === "completed") {
        lab.protocolIndex = evaluation.nextStageIndex;
        lab.protocolCombo += 1;
        lab.bestProtocolCombo = Math.max(lab.bestProtocolCombo, lab.protocolCombo);
        const gainedInsight = (lab.protocolCombo >= 3 ? 2 : 1) + lab.researchTechnique.insightBonus;
        lab.insight += gainedInsight;
        lab.score += 1 + Math.min(2, lab.protocolCombo * 0.25);
        lab.precision = clamp(lab.precision + 0.03 + lab.researchTechnique.precisionBonus, 0, 1);
        lab.instability = clamp(lab.instability - 3, -30, 100);
        lab.controlStreak = preciseControl ? lab.controlStreak + 1 : 0;
        lab.lastProtocolOutcome = "completed";
        return;
    }

    if (evaluation.outcome === "progress") {
        if (controlMistake) {
            registerProtocolViolation(lab, "control_mistake");
            return;
        }
        if (preciseControl) {
            lab.controlStreak += 1;
            lab.precision = clamp(lab.precision + 0.025 + lab.researchTechnique.precisionBonus, 0, 1);
            lab.score += 0.35;
            lab.instability = clamp(lab.instability - 2, -30, 100);
            if (lab.controlStreak % 2 === 0) lab.insight += 1;
            lab.lastProtocolOutcome = "precision";
        } else {
            lab.lastProtocolOutcome = "progress";
        }
        return;
    }

    if (evaluation.outcome === "revisit" && preciseControl) {
        lab.controlStreak += 1;
        lab.insight += 1;
        lab.precision = clamp(lab.precision + 0.02 + lab.researchTechnique.precisionBonus, 0, 1);
        lab.refinement = (lab.refinement ?? 0) + CHEMISTRY_REFINEMENT.preciseRevisit;
        lab.instability = clamp(lab.instability - 2, -30, 100);
        lab.lastProtocolOutcome = "insight";
        return;
    }

    // Repeating separation work after the separation stage is extra purification,
    // not an out-of-order step; its points go to the mastery-capped refinement pool.
    if (evaluation.outcome === "revisit"
        && lab.protocol.some((entry: any) => entry.key === "separation" && entry.acceptedActions.includes(actionKey))) {
        lab.lastProtocolOutcome = "progress";
        return;
    }

    registerProtocolViolation(lab, evaluation.outcome);
}

function createPulseForSession(lab: any, recipe: any) {
    const eligible = getEligibleReactionPulses(recipe.reactionType, lab.supportedActionKeys);
    if (eligible.length === 0) return undefined;

    const pulse = { ...eligible[Math.floor(Math.random() * eligible.length)] };
    if (pulse.kind === "voltage_surge") {
        lab.voltage += getGameplayRandomValue(4, 7);
        lab.instability += 7;
    } else if (pulse.kind === "ph_acidic_drift") {
        lab.pH = Math.max(0, lab.pH - getGameplayRandomValue(3, 5) * 0.5);
        lab.instability += 6;
    } else if (pulse.kind === "ph_alkaline_drift") {
        lab.pH = Math.min(14, lab.pH + getGameplayRandomValue(3, 5) * 0.5);
        lab.instability += 6;
    } else if (pulse.kind === "thermal_runaway") {
        const span = Math.max(20, recipe.optimalTemperature[1] - recipe.optimalTemperature[0]);
        lab.temperature += Math.max(60, Math.round(span * 0.45));
        lab.instability += 8;
    } else if (pulse.kind === "contamination_bloom") {
        lab.contamination = clamp(lab.contamination + getGameplayRandomValue(15, 25), 0, 100);
        lab.instability += 5;
    }
    lab.instability = clamp(lab.instability, -30, 100);
    return pulse;
}

function maybeTriggerReactionPulse(lab: any, recipe: any) {
    if (lab.activePulse || lab.progress < 20 || lab.phase === "failed") return false;
    if (lab.actions >= lab.maxActions - 1) return false;

    const chance = clamp(
        0.08 + lab.researchTechnique.pulseChanceBonus + lab.risk * 0.0008,
        0.08,
        0.2
    );
    if (Math.random() >= chance) return false;

    const pulse = createPulseForSession(lab, recipe);
    if (!pulse) return false;
    lab.activePulse = pulse;
    lab.lastPulseOutcome = "triggered";
    refreshReactionSafety(lab, recipe, false);
    return true;
}

function resolveActivePulse(lab: any, actionKey: string) {
    const pulse = lab.activePulse;
    if (!pulse) return false;

    lab.activePulse = undefined;
    if (isReactionPulseContained(pulse, actionKey)) {
        if (actionKey === "emergency_stabilize") {
            lab.insightCombo = 0;
            lab.lastPulseOutcome = "stabilized";
            return true;
        }
        lab.pulsesContained += 1;
        lab.insightCombo += 1;
        lab.bestInsightCombo = Math.max(lab.bestInsightCombo, lab.insightCombo);
        lab.insight += lab.insightCombo >= 3 ? 2 : 1;
        lab.score += 2;
        lab.precision = clamp(lab.precision + 0.04 + lab.researchTechnique.precisionBonus, 0, 1);
        lab.instability = clamp(lab.instability - 10, -30, 100);
        lab.yieldPenalty = clamp(
            lab.yieldPenalty - lab.researchTechnique.containmentRecovery,
            0,
            0.8
        );
        lab.lastPulseOutcome = "contained";
        return true;
    }

    lab.insightCombo = 0;
    lab.protocolCombo = 0;
    lab.pulseMisses += 1;
    lab.score -= 2;
    lab.instability = clamp(lab.instability + 14, -30, 100);
    lab.contamination = clamp(lab.contamination + 8, 0, 100);
    lab.yieldPenalty = clamp(lab.yieldPenalty + 0.08, 0, 0.8);
    lab.lastPulseOutcome = "missed";
    return true;
}

/* ===============================
   UI
================================ */
export function openRecipeSelect(player: any, page = 0, searchQuery = "", filter: ArtisanRecipeFilter | undefined = undefined) {
    if (chemistrySessions.has(player.id)) {
        openLaboratory(player);
        return;
    }

    const form = new ChestFormData("large").enableLoreLineBreaks()
        .setTitle({ rawtext: [{ translate: "chemistry.title.laboratory" }] });

    const lv = new JobLevel(player, "chemist").getLevel();
    const cleanSearchQuery = cleanRecipeSearchQuery(searchQuery);
    const searchActive = isRecipeSearchActive(cleanSearchQuery);
    const recipes = ChemistryRecipes as Record<string, any>;
    const selectedFilter = resolveArtisanFilterPreference(player, false, filter);
    const recipeIds = filterCraftableRecipeIds(filterUnlockedRecipesForSearch(
        filterArtisanRecipeIds(sortRecipeIdsByLevel(Object.keys(recipes), recipes), recipes, selectedFilter, false),
        recipes,
        cleanSearchQuery,
        lv
    ), recipes, player, lv);

    fill(form,
        [
            0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 17, 18, 26, 27, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44
        ],
        "minecraft:black_stained_glass_pane"
    );

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

        const catalysts = [];
        for (const key of Object.keys(r.catalysts ?? {})) {
            catalysts.push(
                { text: '\n§7- ' },
                { translate: langChangeItemName(key) },
                { text: `` }
            );
        }

        let conditionText: any = [];

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

        const usageText = r.name === "mc:ammonium_sulfate"
            ? [{ text: "\n§a" }, { translate: "chemical.fertilizer.lore" }]
            : gateGoodUsageRawtext(r.result);

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(slot, {
            iconPath: lv >= r.requiredLevel
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                ? itemIdToPath[r.name]
                : itemIdToPath["minecraft:barrier"],
            name: lv >= r.requiredLevel
                ? recipeListName(r)
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
                        ...usageText,
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
                        { translate: "chemistry.unlock_level" },
                        { text: ` ${r.requiredLevel}` }
                    ]
                }],
            editedName: true
        });
    });

    if (safePage > 0) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "chemistry.page.prev",
            editedName: true
        });
    }

    if ((safePage + 1) * RECIPES_PER_PAGE < recipeIds.length) {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        form.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "chemistry.page.next",
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
        lore: [{ rawtext: [{ text: `§b${artisanFilterLabel(selectedFilter, false)}\n§7${recipeIds.length}件` }] }],
        editedName: true
    });

    form!.setButton(48, {
        iconPath: itemIdToPath["minecraft:hopper"],
        name: "§bジャンルで絞り込み",
        lore: [{ rawtext: [{ text: "§7" + artisanFilterLabel(selectedFilter, false) }] }],
        editedName: true
    });

    if (!craftableOnly(player) || recipeIds.includes(getLastCraftedRecipeId(player.id, "chemistry") ?? "")) addLastCraftedRecipeButton(form, player.id, "chemistry", recipes);

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.show(player).then(r => {
        if (r.canceled) return;

        if (r.selection === CRAFTABLE_FILTER_SLOT) {
            toggleCraftableOnly(player);
            openRecipeSelect(player, 0, cleanSearchQuery, selectedFilter);
            return;
        }

        if (r.selection === 46) {
            const lastRecipeId = getLastCraftedRecipeId(player.id, "chemistry");
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
            openArtisanRecipeFilter(player, selectedFilter, false, next => openRecipeSelect(player, 0, cleanSearchQuery, next));
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
    const recipe = ChemistryRecipes[recipeId];
    const result = resolveResult(recipe.result).id;

    const form = new ModalFormData()
        .title({ translate: 'chemistry.title.amount' })
        .slider({ translate: 'chemistry.status.amount' }, 1, new ItemStack(result).maxAmount, { valueStep: 1, defaultValue: 1 });

    form.show(player).then(r => {
        if (r.canceled) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        startReaction(player, recipeId, r.formValues[0]);
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

function startReaction(player: any, recipeId: any, quantity: any) {
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = ChemistryRecipes[recipeId];

    const scaledIngredients = {};
    for (const k in recipe.ingredients) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        scaledIngredients[k] = recipe.ingredients[k] * quantity;
    }

    if (!checkIngredients(player, scaledIngredients)) return;

    const materialQuality = calcAverageMaterialQuality(player, scaledIngredients);
    const supportedActionKeys = getSupportedActionKeys(player, recipe);
    const protocol = createReactionProtocol(recipe.reactionType, supportedActionKeys);
    const chemistLevel = new JobLevel(player, "chemist").getLevel();
    const researchTechnique = getChemistryResearchTechnique(chemistLevel);

    const initialState = {
        recipeId,
        quantity,
        scaledIngredients,
        progress: 0,
        actions: 0,
        maxActions: calcMaxActions(recipe, chemistLevel, supportedActionKeys, protocol),
        score: 0,
        refinement: 0,
        phase: "preparation",
        contamination: 100,
        usedCatalysts: [],
        precision: Math.random(),
        materialQuality,
        catalystQuality: 0,
        catalystCount: 0,
        stirringSpeed: 0,
        instability: 0,
        stability: 100,
        risk: 0,
        dangerSteps: 0,
        accidents: 0,
        emergencyUses: 0,
        yieldPenalty: 0,
        safePrecisionStreak: 0,
        breakthrough: false,
        supportedActionKeys,
        protocol,
        protocolIndex: 0,
        protocolCombo: 0,
        bestProtocolCombo: 0,
        protocolMistakes: 0,
        lastProtocolOutcome: "none",
        insight: 0,
        insightCombo: 0,
        bestInsightCombo: 0,
        controlStreak: 0,
        activePulse: undefined,
        lastPulseOutcome: "none",
        pulsesContained: 0,
        pulseMisses: 0,
        chemistLevel,
        researchTechnique,

        voltage: 0,
        pH: 7,
        temperature: 20,

        ctx: { reactionVariance: () => reactionVariance(player, recipe) }
    };

    refreshReactionSafety(initialState, recipe, false);

    cancelArtisanCraft(chemistrySessions.get(player.id));
    chemistrySessions.set(player.id, initialState);

    openLaboratory(player);
}

function getProtocolStageTranslation(stageKey: string) {
    return `chemistry.protocol.stage.${stageKey}`;
}

function buildProtocolLore(lab: any) {
    const lore: any[] = [];
    lab.protocol.forEach((stage: any, index: number) => {
        const marker = index < lab.protocolIndex
            ? "§a✓ "
            : index === lab.protocolIndex ? "§e▶ " : "§8○ ";
        lore.push({
            rawtext: [
                { text: marker },
                { translate: getProtocolStageTranslation(stage.key) },
            ],
        });
    });
    if (lab.lastProtocolOutcome !== "none") {
        lore.push({
            rawtext: [
                { text: "\n§7" },
                { translate: `chemistry.protocol.outcome.${lab.lastProtocolOutcome}` },
            ],
        });
    }
    return lore;
}

function getPulseIcon(pulse: any) {
    if (!pulse) return "minecraft:glass_bottle";
    if (pulse.kind === "voltage_surge") return "minecraft:redstone";
    if (pulse.kind === "ph_acidic_drift") return "minecraft:fermented_spider_eye";
    if (pulse.kind === "ph_alkaline_drift") return "minecraft:sugar";
    if (pulse.kind === "thermal_runaway") return "minecraft:blaze_powder";
    return "minecraft:slime_ball";
}

function buildPulseLore(lab: any) {
    const lore: any[] = [];
    if (lab.activePulse) {
        lore.push(
            { rawtext: [{ text: "§c" }, { translate: `chemistry.pulse.${lab.activePulse.kind}` }] },
            { rawtext: [{ text: "§e" }, { translate: "chemistry.pulse.response_window" }] }
        );
    } else {
        lore.push({ rawtext: [{ text: "§a" }, { translate: "chemistry.pulse.stable" }] });
    }
    if (lab.lastPulseOutcome !== "none" && lab.lastPulseOutcome !== "triggered") {
        lore.push({
            rawtext: [
                { text: "§7" },
                { translate: `chemistry.pulse.outcome.${lab.lastPulseOutcome}` },
            ],
        });
    }
    return lore;
}

function getCurrentBreakthroughChance(player: any, lab: any, recipe: any) {
    const level = new JobLevel(player, "chemist").getLevel();
    const baseChance = calculateBreakthroughChance(level, recipe.requiredLevel);
    return calculateProtocolBreakthroughChance(
        baseChance,
        lab.insight,
        Math.max(lab.bestProtocolCombo, lab.bestInsightCombo),
        lab.pulsesContained,
        lab.researchTechnique.breakthroughCap
    );
}

function buildTechniqueLore(player: any, lab: any, recipe: any) {
    const breakthroughChance = getCurrentBreakthroughChance(player, lab, recipe);
    const mastery = getRecipeMasteryProfile(lab.chemistLevel, recipe.requiredLevel);
    const lore: any[] = [
        { rawtext: [{ translate: "chemistry.combo.protocol" }, { text: `: §b${lab.protocolCombo}` }] },
        { rawtext: [{ translate: "chemistry.combo.insight" }, { text: `: §d${lab.insightCombo}` }] },
        { rawtext: [{ translate: "chemistry.status.insight" }, { text: `: §d${lab.insight}` }] },
        {
            rawtext: [
                { translate: "chemistry.status.breakthrough_chance" },
                { text: `: §d${Math.round(breakthroughChance * 100)}%` },
            ],
        },
        {
            rawtext: [
                { text: "\n§6" },
                { translate: "chemistry.research.technique" },
                { text: ` +${lab.researchTechnique.level}` },
            ],
        },
        {
            rawtext: [
                { translate: "chemistry.research.yield_bonus" },
                { text: `: +${Math.round(lab.researchTechnique.yieldBonusRate * 100)}%` },
            ],
        },
        {
            rawtext: [{
                translate: "artisan.mastery.cap",
                with: [mastery.maxRank],
            }],
        },
    ];
    if (mastery.nextRank && mastery.levelsToNext !== undefined) {
        lore.push({
            rawtext: [{
                translate: "artisan.mastery.next",
                with: [mastery.nextRank, `${mastery.levelsToNext}`],
            }],
        });
    } else {
        lore.push({ rawtext: [{ translate: "artisan.mastery.maxed" }] });
    }
    return lore;
}

function effectLine(label: string, value: string) {
    return { rawtext: [{ text: "§7" }, { translate: label }, { text: `: ${value}` }] };
}

function buildActionEffectLore(actionKey: string, recipe: any) {
    const lines: any[] = [];
    if (actionKey === "add_reagent") {
        lines.push(effectLine("chemistry.status.progress", "+12%"));
    } else if (actionKey === "stir") {
        lines.push(
            effectLine("chemistry.status.progress", "+8〜12%"),
            effectLine("chemistry.status.contamination", "-5%")
        );
    } else if (actionKey === "add_catalyst") {
        lines.push(
            effectLine("chemistry.action.effect.success", "+15% / -10%"),
            effectLine("chemistry.action.effect.failure_contamination", "+8%")
        );
    } else if (actionKey === "increase_voltage") {
        lines.push(
            effectLine("chemistry.status.voltage", "+2〜4V"),
            effectLine("chemistry.status.progress", "+10%")
        );
    } else if (actionKey === "decrease_voltage") {
        lines.push(
            effectLine("chemistry.status.voltage", "-2〜3V"),
            effectLine("chemistry.status.progress", "+5%")
        );
    } else if (actionKey === "add_acid") {
        lines.push(
            effectLine("chemistry.status.ph", "§c▼"),
            { rawtext: [{ text: "§7" }, { translate: "chemistry.action.effect.adaptive_control" }] }
        );
    } else if (actionKey === "add_base") {
        lines.push(
            effectLine("chemistry.status.ph", "§a▲"),
            { rawtext: [{ text: "§7" }, { translate: "chemistry.action.effect.adaptive_control" }] }
        );
    } else if (actionKey === "heat") {
        lines.push(
            effectLine("chemistry.status.temperature", "§c▲"),
            { rawtext: [{ text: "§7" }, { translate: "chemistry.action.effect.adaptive_control" }] },
            effectLine("chemistry.status.progress", "+12%")
        );
    } else if (actionKey === "cool") {
        lines.push(
            effectLine("chemistry.status.temperature", "§b▼"),
            { rawtext: [{ text: "§7" }, { translate: "chemistry.action.effect.adaptive_control" }] },
            effectLine("chemistry.status.progress", "+5%")
        );
    } else if (actionKey === "filter") {
        lines.push(effectLine("chemistry.status.contamination", "-20〜30%"));
    } else if (actionKey === "centrifuge") {
        lines.push(
            effectLine("chemistry.status.contamination", "-15〜25%"),
            effectLine("chemistry.status.progress", "+15%")
        );
    } else if (actionKey === "distill") {
        lines.push(
            effectLine("chemistry.status.contamination", "-25〜40%"),
            effectLine("chemistry.status.temperature", "+20℃")
        );
    } else if (actionKey === "measure_purity") {
        lines.push(effectLine("chemistry.status.precision", "+0〜30%"));
    } else if (actionKey === "crystallize") {
        lines.push(
            effectLine("chemistry.status.progress", "+20%"),
            effectLine("chemistry.status.contamination", "-10%")
        );
    } else if (actionKey === "emergency_stabilize") {
        lines.push({ rawtext: [{ translate: "chemistry.action.emergency_stabilize.lore" }] });
    }
    if (CONDITION_ACTIONS.has(actionKey) && getReactionControlTargets({
        voltage: 0,
        pH: 7,
        temperature: 20,
    }, recipe).length === 0) {
        lines.push({ rawtext: [{ translate: "chemistry.action.unavailable.reaction" }] });
    }
    return lines;
}

function buildCompletionLore(lab: any, recipe: any) {
    const protocolReady = lab.phase !== "preparation"
        && lab.protocolIndex >= lab.protocol.length - 1;
    const rank = !protocolReady
        ? "F"
        : lab.risk >= CRITICAL_RISK_THRESHOLD
        ? "CONTAMINATED"
        : resolveMasteredChemistryRank(lab, recipe).rank;
    const resolved = resolveResult(recipe.result);
    const baseCount = lab.quantity * resolved.count;
    const outputYield = calculateOutputYield(baseCount, lab.yieldPenalty, false);
    const researchBonus = calculateResearchYieldBonus(
        outputYield.penalizedCount,
        lab.researchTechnique.yieldBonusRate,
        lab.protocolIndex >= lab.protocol.length - 1
    );
    const output = protocolReady ? outputYield.totalCount + researchBonus : 0;
    const completedStages = Math.min(lab.protocolIndex, lab.protocol.length);
    const lore: any[] = [
        { rawtext: [{ translate: "chemistry.complete.expected_rank" }, { text: `: §e${rank}` }] },
        { rawtext: [{ translate: "chemistry.complete.expected_output" }, { text: `: §a${output}` }] },
        {
            rawtext: [
                { translate: "chemistry.complete.protocol_progress" },
                { text: `: ${completedStages}/${lab.protocol.length}` },
            ],
        },
    ];
    if (lab.activePulse) {
        lore.push({ rawtext: [{ text: "§c" }, { translate: "chemistry.complete.unresolved_pulse" }] });
    }
    if (lab.phase === "preparation") {
        lore.push({ rawtext: [{ text: "§c" }, { translate: "chemistry.complete.not_started" }] });
    } else if (lab.protocolIndex < lab.protocol.length - 1) {
        const requiredStage = lab.protocol[lab.protocolIndex];
        lore.push(
            { rawtext: [{ text: "§c" }, { translate: "chemistry.complete.early_failure" }] },
            { rawtext: [
                { text: "§e" },
                { translate: "chemistry.complete.required_stage" },
                { text: ": " },
                { translate: getProtocolStageTranslation(requiredStage?.key ?? "reaction") },
            ] }
        );
    }
    if (lab.risk >= CRITICAL_RISK_THRESHOLD) {
        lore.push({ rawtext: [{ text: "§c" }, { translate: "chemistry.complete.critical_risk" }] });
    }
    return lore;
}

function openLaboratory(player: any) {
    const lab = chemistrySessions.get(player.id);
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = ChemistryRecipes[lab.recipeId];
    const lv = new JobLevel(player, "chemist").getLevel();
    lab.temperature = Math.max(-273.15, lab.temperature);

    const form = new ChestFormData("large").enableLoreLineBreaks().setTitle({ rawtext: recipeTitleParts(recipe) });

    fill(form, [...Array(9).keys()], "minecraft:black_stained_glass_pane");
    fill(form, [...Array(9).keys()].map(i => i + 45), "minecraft:black_stained_glass_pane");

    const danger = isDangerousCondition(lab);
    if (danger) {
        fill(form, [9, 10, 11, 12, 13, 14, 15, 16, 17],
            "minecraft:red_stained_glass_pane",
            "chemistry.danger.warning.title",
            // @ts-ignore TS(2322): Type 'string' is not assignable to type 'never'.
            [{ translate: 'chemistry.danger.warning.lore' }]
        );
    }

    // The three top panels expose state, not the correct next button.
    // Protocol and pulse state live in the session, so merely reopening the UI
    // never advances or rerolls the experiment.
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(0, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "chemistry.protocol.title",
        lore: buildProtocolLore(lab),
        editedName: true,
    });
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(4, {
        iconPath: itemIdToPath[getPulseIcon(lab.activePulse) as keyof typeof itemIdToPath],
        name: lab.activePulse ? "chemistry.pulse.alert" : "chemistry.pulse.title",
        lore: buildPulseLore(lab),
        editedName: true,
        isGlint: Boolean(lab.activePulse),
    });
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(8, {
        iconPath: itemIdToPath["minecraft:experience_bottle"],
        name: "chemistry.combo.title",
        lore: buildTechniqueLore(player, lab, recipe),
        editedName: true,
        isGlint: lab.protocolCombo >= 3 || lab.insightCombo >= 2,
    });

    const statusLore = [
        { rawtext: [{ text: '§9' }, { translate: "chemistry.status.phase" }, { text: `: ${lab.phase}\n` }] },
        { rawtext: [{ text: '§a' }, { translate: "chemistry.status.progress" }, { text: `: ${lab.progress}%\n` }] },
        { rawtext: [{ text: '§6' }, { translate: "chemistry.status.contamination" }, { text: `: ${Math.max(0, lab.contamination)}%\n` }] },
        { rawtext: [{ text: '§b' }, { translate: "chemistry.status.actions" }, { text: `: ${lab.actions}/${lab.maxActions}\n` }] },
        { rawtext: [{ text: '§e' }, { translate: "chemistry.status.amount" }, { text: `: ${lab.quantity}\n` }] },
        { rawtext: [{ text: lab.stability >= 70 ? '§a' : lab.stability >= 40 ? '§e' : '§c' }, { translate: "chemistry.status.stability" }, { text: `: ${lab.stability}%\n` }] },
        { rawtext: [{ text: lab.risk < 55 ? '§a' : lab.risk < 75 ? '§e' : '§c' }, { translate: "chemistry.status.risk" }, { text: `: ${lab.risk}%\n` }] },
        { rawtext: [{ text: '§d' }, { translate: "chemistry.status.precision" }, { text: `: ${Math.round(lab.precision * 100)}%\n` }] },
        { rawtext: [{ text: lab.instability <= 20 ? '§a' : lab.instability <= 50 ? '§e' : '§c' }, { translate: "chemistry.status.instability" }, { text: `: ${Math.max(0, Math.round(lab.instability))}%\n` }] },
    ];

    const riskFactors = calculateReactionRiskFactors(lab, recipe).slice(0, 2);
    for (const factor of riskFactors) {
        statusLore.push({
            rawtext: [
                { text: "§7↳ " },
                { translate: `chemistry.risk.cause.${factor.cause}` },
                { text: ` +${Math.ceil(factor.value)}` },
            ],
        });
    }

    if (lab.accidents > 0 || lab.yieldPenalty > 0) {
        statusLore.push(
            { rawtext: [{ text: '§c' }, { translate: "chemistry.status.accidents" }, { text: `: ${lab.accidents}\n` }] },
            { rawtext: [{ text: '§6' }, { translate: "chemistry.status.yield_penalty" }, { text: `: -${Math.round(lab.yieldPenalty * 100)}%\n` }] }
        );
    }

    for (const target of getReactionControlTargets(lab, recipe)) {
        const label = target.metric === "ph"
            ? "chemistry.status.ph"
            : target.metric === "voltage"
                ? "chemistry.status.voltage"
                : "chemistry.status.temperature";
        const decimals = target.metric === "ph" ? 1 : 0;
        const unit = target.metric === "voltage" ? "V" : target.metric === "temperature" ? "℃" : "";
        statusLore.push({
            rawtext: [
                { text: target.direction === "hold" ? "§a" : "§c" },
                { translate: label },
                { text: `: ${target.current.toFixed(decimals)}${unit}  §7[` },
                { translate: "chemistry.status.target" },
                { text: ` ${target.min.toFixed(decimals)}〜${target.max.toFixed(decimals)}${unit}]\n` },
            ],
        });
    }

    statusLore.push(
        // @ts-ignore TS(2322): Type '{ translate: string; with: string[]; }' is n... Remove this comment to see the full error message
        { rawtext: [{ text: '§d' }, { translate: "chemistry.lore.purity", with: [`${resolveMasteredChemistryRank(lab, recipe).rank}`] }] }
    );

    if (isBreakthroughReady(lab, recipe)) {
        statusLore.push(
            { rawtext: [{ text: '§d' }, { translate: "chemistry.status.breakthrough_ready" }] }
        );
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(18, {
        iconPath: itemIdToPath["minecraft:book"],
        name: "chemistry.status.title",
        lore: statusLore,
        editedName: true
    });

    for (const action of ChemistryActions) {
        if (lv < action.unlockLv) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            form.setButton(action.slot, {
                iconPath: itemIdToPath["minecraft:barrier"],
                name: "chemistry.locked",
                lore: [{ rawtext: [{ translate: "chemistry.unlock_level" }, { text: `${action.unlockLv}` }] }],
                editedName: true
            });
        } else {
            const unavailableReason = getActionUnavailableReason(player, lab, recipe, action);
            const actionLore: any[] = [
                { rawtext: [{ text: '§7' }, { translate: "chemistry.action.cost" }, { text: `: ${action.cost}` }] },
                ...buildActionEffectLore(action.key, recipe),
            ];
            if (unavailableReason) {
                actionLore.push({
                    rawtext: [
                        { text: "§c" },
                        { translate: `chemistry.action.unavailable.${unavailableReason}` },
                    ],
                });
            }
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            form.setButton(action.slot, {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                iconPath: unavailableReason
                    ? itemIdToPath["minecraft:barrier"]
                    : itemIdToPath[action.icon as keyof typeof itemIdToPath],
                name: action.name,
                lore: actionLore,
                editedName: true
            });
        }
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.setButton(49, {
        iconPath: itemIdToPath[lab.risk >= CRITICAL_RISK_THRESHOLD
            ? "minecraft:red_dye"
            : lab.protocolIndex >= lab.protocol.length - 1
                ? "minecraft:lime_dye"
                : "minecraft:yellow_dye"],
        name: "chemistry.button.complete",
        lore: buildCompletionLore(lab, recipe),
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    form.show(player).then(r => {
        if (r.canceled || r.selection === undefined) return;
        handleAction(player, r.selection);
    });
}

/* ===============================
   Logic
================================ */
function handleAction(player: any, slot: any) {
    const lab = chemistrySessions.get(player.id);
    if (!lab) return;
    if (lab.artisanFinish) { finish(player); return; }
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = ChemistryRecipes[lab.recipeId];

    if (slot === 49) {
        if (lab.phase === "preparation") {
            openLaboratory(player);
            return;
        }

        resolveActivePulse(lab, "complete");
        const controlError = calculateReactionControlError(lab, recipe);
        applyProtocolAction(lab, recipe, "complete", controlError);
        lab.protocolCompleted = lab.protocolIndex >= lab.protocol.length;
        if (!lab.protocolCompleted) {
            lab.protocolAborted = true;
            lab.phase = "failed";
            lab.instability = 100;
            lab.yieldPenalty = 1;
            lab.score = Math.min(lab.score, 0);
            lab.breakthrough = false;
            lab.lastProtocolOutcome = "early_finish";
        }
        refreshReactionSafety(lab, recipe, false);
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
    if (getActionUnavailableReason(player, lab, recipe, action)) {
        openLaboratory(player);
        return;
    }

    const hadActivePulse = Boolean(lab.activePulse);
    const pulseWasResolved = resolveActivePulse(lab, action.key);
    const controlErrorBefore = calculateReactionControlError(lab, recipe);
    action.run(lab, recipe, lab.ctx, player);
    lab.actions += action.cost;
    if (action.key !== "emergency_stabilize") {
        const actionInstability = ACTION_INSTABILITY[action.key] ?? 0;
        lab.instability = clamp(lab.instability * 0.72 + actionInstability, -30, 100);
    }

    lab.voltage = Math.max(0, Math.floor(lab.voltage * 100) / 100);
    lab.pH = Math.floor(lab.pH * 100) / 100;
    lab.temperature = Math.floor(lab.temperature * 100) / 100;
    lab.progress = Math.floor(lab.progress * 100) / 100;
    lab.contamination = clamp(Math.floor(lab.contamination * 100) / 100, 0, 100);

    applyProtocolAction(lab, recipe, action.key, controlErrorBefore, pulseWasResolved);

    refreshReactionSafety(lab, recipe);
    let accident = false;
    if (action.key !== "emergency_stabilize") {
        accident = registerAccident(player, lab, recipe);
    }
    if (!hadActivePulse && !accident && action.key !== "emergency_stabilize") {
        maybeTriggerReactionPulse(lab, recipe);
    }

    openLaboratory(player);
}

function calcConditionScore(lab: any, recipe: any) {
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

function calcEfficiencyBonus(lab: any, recipe: any) {
    const condScore = calcConditionScore(lab, recipe);

    if (condScore < 10) return 0;

    const used = lab.actions;
    const max = lab.maxActions;

    if (used <= max * 0.4) return 8;
    if (used <= max * 0.6) return 6;
    if (used <= max * 0.8) return 4;
    return 0;
}

function calcRank(lab: any, recipe: any) {
    let score = lab.score;
    score += Math.min(lab.refinement ?? 0, getChemistryRefinementCap(lab.chemistLevel, recipe.requiredLevel));

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

    score -= lab.accidents * 10;
    score -= Math.floor(lab.risk / 12);
    score -= Math.round(lab.yieldPenalty * 10);
    score -= lab.emergencyUses;

    if (lab.protocolAborted) {
        return { rank: "F", mul: 0.3 };
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

function resolveMasteredChemistryRank(lab: any, recipe: any) {
    const raw = calcRank(lab, recipe);
    const rank = capRankByRecipeMastery(
        raw.rank,
        lab.chemistLevel,
        recipe.requiredLevel
    );
    return {
        rawRank: raw.rank,
        rank,
        mul: getChemistryRankMultiplier(rank),
    };
}

/* ===============================
   Finish
================================ */
function settleReactionForFinish(player: any, lab: any, recipe: any) {
    refreshReactionSafety(lab, recipe, false);

    if (lab.risk >= CRITICAL_RISK_THRESHOLD) {
        registerAccident(player, lab, recipe, true);
        lab.phase = "failed";
        lab.yieldPenalty = 1;
        return;
    }

    if (lab.risk >= 55) {
        const unsafePenalty = lab.risk >= 75 ? 0.35 : 0.2;
        lab.yieldPenalty = Math.max(lab.yieldPenalty, unsafePenalty);
        lab.score -= lab.risk >= 75 ? 5 : 3;
    }

    if (!isBreakthroughReady(lab, recipe)) return;

    const level = new JobLevel(player, "chemist").getLevel();
    const baseChance = calculateBreakthroughChance(level, recipe.requiredLevel);
    const chance = calculateProtocolBreakthroughChance(
        baseChance,
        lab.insight,
        Math.max(lab.bestProtocolCombo, lab.bestInsightCombo),
        lab.pulsesContained,
        lab.researchTechnique.breakthroughCap
    );
    if (Math.random() < chance) {
        lab.breakthrough = true;
        lab.score += 8;
        player.playSound("random.levelup", player.location);
        player.sendMessage({ translate: "chemistry.breakthrough.message" });
    }
}

function finish(player: any) {
    const lab = chemistrySessions.get(player.id);
    if (!lab || lab.artisanCraftStarted) return;
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const recipe = ChemistryRecipes[lab.recipeId];

    if (!checkIngredients(player, lab.scaledIngredients)) {
        cancelArtisanCraft(lab);
        return;
    }

    const { rank, mul, isWaste, itemId, outputYield, researchYieldBonus, totalCount } = lab.artisanFinish ??= (() => {
        settleReactionForFinish(player, lab, recipe);
        const incompleteDisposition = lab.protocolAborted
            ? getIncompleteProtocolDisposition(lab.quantity)
            : undefined;
        const masteredResult = resolveMasteredChemistryRank(lab, recipe);
        const rank = incompleteDisposition?.rank ?? masteredResult.rank;
        const rankMultiplier = getChemistryRankMultiplier(rank);
        const rewardMultiplier = incompleteDisposition?.rewardMultiplier ?? rankMultiplier;
        const mul = rewardMultiplier * (lab.breakthrough ? 1.25 : 1);

        const resolved = resolveResult(recipe.result);

        const isWaste = Boolean(incompleteDisposition)
            || (rank === "CONTAMINATED" && lab.phase === "failed");

        const itemId = isWaste
            ? "mc:chemical_waste"
            : resolved.id;

        const baseCount = lab.quantity * resolved.count;
        const outputYield = incompleteDisposition
            ? {
                penalizedCount: 0,
                breakthroughBonus: 0,
                totalCount: incompleteDisposition.productCount,
                lostCount: baseCount,
            }
            : calculateOutputYield(baseCount, lab.yieldPenalty, lab.breakthrough);
        const researchYieldBonus = isWaste
            ? 0
            : calculateResearchYieldBonus(
                outputYield.penalizedCount,
                lab.researchTechnique.yieldBonusRate,
                Boolean(lab.protocolCompleted)
            );
        const totalCount = isWaste
            ? incompleteDisposition?.wasteCount ?? lab.quantity
            : outputYield.totalCount + researchYieldBonus;
        return { rank, mul, isWaste, itemId, outputYield, researchYieldBonus, totalCount };
    })();
    if (!runArtisanCraft(player, lab, () => {
        if (!jobs_config.validity || !player.hasTag('mcjobs_chemist')) return undefined;
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
        const xpReward = recipe.baseXp * mul * Math.min(lab.quantity, 25);
        return { job: "chemist", money: reward, xp: xpReward, rank, display: "chemistry" };
    }, () => {
        consume(player, lab.scaledIngredients);
        rememberLastCraftedRecipe(player.id, "chemistry", lab.recipeId);

        const items = createStacks(itemId, totalCount);

        for (const item of items) {
            const itemLore: any[] = [
                { rawtext: [{ text: '§r§a==============' }] },
                { rawtext: [{ text: '§r§e' }, { translate: "chemistry.lore.purity", with: [`${rank}`] }] },
            ];
            if (!isWaste && itemId === "mc:ammonium_sulfate") {
                itemLore.push({ rawtext: [{ text: '§r§a' }, { translate: "chemical.fertilizer.lore" }] });
            }
            if (lab.breakthrough) {
                itemLore.push({ rawtext: [{ text: '§r§d' }, { translate: "chemistry.lore.breakthrough" }] });
            }
            itemLore.push({ rawtext: [{ text: '§r§a==============' }] });
            item.setLore(itemLore);

            player.dimension.spawnItem(item, player.location);
        }

        chemistrySessions.delete(player.id);
    })) return;
    const lostCount = outputYield.lostCount;
    if (!isWaste && lostCount > 0) {
        player.sendMessage({
            rawtext: [{
                translate: "chemistry.yield_penalty.message",
                with: [`${lostCount}`]
            }]
        });
    }

    player.sendMessage({
        rawtext: [{
            translate: "chemistry.research.result",
            with: [
                `${lab.researchTechnique.level}`,
                `${researchYieldBonus}`,
            ],
        }],
    });

    player.stopSound('chemistry.bubbling');
    player.stopSound('chemistry.electric');
    player.stopSound('chemistry.pour');
    player.stopSound('chemistry.heat');
    player.playSound('chemistry.complete', player.location);

}
