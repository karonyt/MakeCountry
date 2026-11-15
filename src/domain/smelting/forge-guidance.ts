import { capRankByRecipeMastery, getRecipeMasteryProfile } from "../professions/recipe-mastery.js";

export type ForgeStrike = "light_strike" | "heavy_strike" | "fold_metal";
export type QuenchResult = "perfect" | "early" | "cold" | "overheated" | "stressed";

export const SMITHING_RANK_MULTIPLIERS: Readonly<Record<string, number>> = {
    F: 0.4,
    E: 1,
    D: 1.2,
    C: 1.3,
    B: 1.4,
    A: 1.5,
    S: 1.6,
    SS: 1.7,
    SSS: 1.8,
    LEGENDARY: 2,
    EXTRA: 3,
    IMPOSSIBLE: 5,
    KARON: 10,
};

export function getSmithingRankMultiplier(rank: string): number {
    const normalized = rank === "LEGEND" ? "LEGENDARY" : rank;
    return SMITHING_RANK_MULTIPLIERS[normalized] ?? SMITHING_RANK_MULTIPLIERS.F;
}

/**
 * Converts forge performance into a rank before profession-level mastery caps
 * are applied. This lets progression XP reflect the attempt itself while item
 * quality and money can continue to use the capped rank.
 */
export function getSmithingPerformanceRank(score: unknown): string {
    const normalizedScore = Number(score) || 0;
    if (normalizedScore >= 210) return "KARON";
    if (normalizedScore >= 185) return "IMPOSSIBLE";
    if (normalizedScore >= 165) return "EXTRA";
    if (normalizedScore >= 145) return "LEGENDARY";
    if (normalizedScore >= 130) return "SSS";
    if (normalizedScore >= 115) return "SS";
    if (normalizedScore >= 90) return "S";
    if (normalizedScore >= 70) return "A";
    if (normalizedScore >= 55) return "B";
    if (normalizedScore >= 40) return "C";
    if (normalizedScore >= 25) return "D";
    if (normalizedScore >= 10) return "E";
    return "F";
}

export const SMITHING_KARON_CHANCE = 0.001;

export function getSmithingKaronChance(level: unknown): number {
    const numericLevel = Number(level);
    const extraSteps = Number.isFinite(numericLevel)
        ? Math.max(0, Math.floor((numericLevel - 500) / 10)) : 0;
    return Math.min(0.5, SMITHING_KARON_CHANCE + extraSteps * 0.01);
}

export interface SmithingFinish {
    craftLevel: number;
    requiredLevel: number;
    quenchResult?: QuenchResult;
    karonRoll?: number;
}

/** KARON is never awarded by score alone; it comes only from the rare roll.
 * Ranks follow the forge score (materials and operations) as before 10/20.
 */
export function getSmithingScoredRank(score: unknown): string {
    const rank = getSmithingPerformanceRank(score);
    return rank === "KARON" ? "IMPOSSIBLE" : rank;
}

/** Score first, then mastery, then the rare promotion. Previews reuse the
 * session's fixed roll and level. Ineligible recipes never read the roll.
 */
export function getSmithingOutcomeRank(score: unknown, finish: SmithingFinish): string {
    const scoredRank = getSmithingScoredRank(score);
    const rank = capRankByRecipeMastery(scoredRank, finish.craftLevel, finish.requiredLevel);
    const maxRank = getRecipeMasteryProfile(finish.craftLevel, finish.requiredLevel).maxRank;
    if (rank !== "IMPOSSIBLE" || maxRank !== "KARON" || finish.quenchResult !== "perfect") {
        return rank;
    }
    const roll = finish.karonRoll;
    if (typeof roll === "number" && roll >= 0 && roll < getSmithingKaronChance(finish.craftLevel)) {
        return "KARON";
    }
    return rank;
}

export interface StrikeResolution {
    correct: boolean;
    progressDelta: number;
    temperatureDelta: number;
    impurityDelta: number;
    stressDelta: number;
    shapeDelta: number;
    combo: number;
}

export interface QuenchState {
    phase: string;
    progress: number;
    temperature: number;
    stress: number;
    completedPatterns: number;
}

export interface ForgeRecipeWindow {
    needTemperature: readonly [number, number] | readonly number[];
}

/**
 * Late-game alloys use temperatures tens of times higher than the starter
 * recipes. Scale the forge's heat input with that recipe window so every
 * unlocked recipe remains reachable inside its action budget.
 */
/**
 * Refinement (slag skimming and controlled cooling) is how a smith turns spare
 * actions into score. Its contribution is capped by recipe mastery so that a
 * long session cannot jump far past the rank the smith has unlocked, while a
 * smith at the unlock level can still reach that rank with good play.
 */
export const FORGE_REFINEMENT = { skimSuccess: 3, skimFailure: -2, controlledCool: 3 } as const;

export function getForgeRefinementCap(level: unknown, requiredLevel: unknown): number {
    const surplus = Math.max(0, Math.floor(Number(level) || 0) - Math.floor(Number(requiredLevel) || 0));
    return 40 + Math.floor(surplus * 0.35);
}

/** Action budget: base + reserved forming/quench steps + level allowance. */
export function getForgeActionBudget(baseActions: unknown, requiredLevel: unknown, level: unknown): number {
    const lv = Math.max(0, Math.floor(Number(level) || 0));
    const required = Math.max(0, Math.floor(Number(requiredLevel) || 0));
    return Math.max(0, Math.floor(Number(baseActions) || 0)) + 5 + Math.min(Math.floor(lv / 3), 60 + required * 3);
}

export function getForgeHeatScale(recipe: ForgeRecipeWindow): number {
    const minimum = Math.max(0, Number(recipe.needTemperature[0]) || 0);
    return Math.max(1, Math.ceil(minimum / 1500));
}

/**
 * Returns a controllable cooling step that grows with the recipe's heat scale.
 * At the orichalcum tool range (39,000-40,000 C), this removes 520-988 C,
 * enough to recover from a single overheat without triggering the final quench.
 */
export function getForgeCoolingRange(recipe: ForgeRecipeWindow): readonly [number, number] {
    const heatScale = getForgeHeatScale(recipe);
    return [20 * heatScale, 38 * heatScale];
}

/** Controlled cooling stops at the target instead of oscillating past it. */
export function getControlledCoolingAmount(temperature: number, recipe: ForgeRecipeWindow, cooling: number): number {
    const midpoint = (recipe.needTemperature[0] + recipe.needTemperature[1]) / 2;
    return temperature > midpoint ? Math.min(cooling, temperature - midpoint) : cooling;
}

export interface ForgeTechnique {
    level: number;
    maxPatternLength: 3 | 4 | 5;
    heatRetention: number;
    stressControl: number;
    techniqueBonus: number;
    missRecovery: "reset" | "step" | "hold";
}

const STRIKES: readonly ForgeStrike[] = ["light_strike", "heavy_strike", "fold_metal"];

export function getForgeTechnique(level: unknown): ForgeTechnique {
    const normalized = Number.isFinite(Number(level)) ? Math.max(1, Math.trunc(Number(level))) : 1;
    return {
        level: normalized,
        maxPatternLength: normalized >= 40 ? 5 : normalized >= 15 ? 4 : 3,
        heatRetention: Math.min(0.4, Math.floor(normalized / 10) * 0.04),
        stressControl: Math.min(0.5, Math.floor(normalized / 10) * 0.05),
        techniqueBonus: Math.min(8, Math.floor(normalized / 15)),
        missRecovery: normalized >= 60 ? "hold" : normalized >= 25 ? "step" : "reset",
    };
}

export function createStrikePattern(
    random: () => number = Math.random,
    maxLength: 3 | 4 | 5 = 5,
): ForgeStrike[] {
    const length = 3 + Math.min(maxLength - 3, Math.max(0, Math.floor(random() * (maxLength - 2))));
    const pattern: ForgeStrike[] = [];

    for (let index = 0; index < length; index++) {
        let strike = STRIKES[Math.min(STRIKES.length - 1, Math.max(0, Math.floor(random() * STRIKES.length)))];
        if (index >= 2 && pattern[index - 1] === strike && pattern[index - 2] === strike) {
            strike = STRIKES[(STRIKES.indexOf(strike) + 1) % STRIKES.length];
        }
        pattern.push(strike);
    }
    return pattern;
}

export function applyForgeTechnique(resolution: StrikeResolution, level: unknown): StrikeResolution {
    const technique = getForgeTechnique(level);
    return {
        ...resolution,
        temperatureDelta: resolution.temperatureDelta < 0
            ? Math.round(resolution.temperatureDelta * (1 - technique.heatRetention))
            : resolution.temperatureDelta,
        stressDelta: resolution.stressDelta > 0
            ? Math.ceil(resolution.stressDelta * (1 - technique.stressControl))
            : resolution.stressDelta,
    };
}

export function getPatternIndexAfterMiss(currentIndex: number, level: unknown): number {
    const recovery = getForgeTechnique(level).missRecovery;
    if (recovery === "hold") return Math.max(0, currentIndex);
    if (recovery === "step") return Math.max(0, currentIndex - 1);
    return 0;
}

export function resolveStrike(
    expected: ForgeStrike,
    selected: ForgeStrike,
    currentCombo: number,
): StrikeResolution {
    if (expected !== selected) {
        return {
            correct: false,
            progressDelta: 2,
            temperatureDelta: -8,
            impurityDelta: 6,
            stressDelta: 12,
            shapeDelta: -2,
            combo: 0,
        };
    }

    const combo = Math.min(9, Math.max(0, currentCombo) + 1);
    const comboShapeBonus = combo >= 3 ? 1 : 0;
    switch (selected) {
        case "light_strike":
            return { correct: true, progressDelta: 6, temperatureDelta: -4, impurityDelta: 0, stressDelta: 1, shapeDelta: 1 + comboShapeBonus, combo };
        case "heavy_strike":
            return { correct: true, progressDelta: 12, temperatureDelta: -12, impurityDelta: 0, stressDelta: 6, shapeDelta: 2 + comboShapeBonus, combo };
        case "fold_metal":
            return { correct: true, progressDelta: 5, temperatureDelta: -8, impurityDelta: -4, stressDelta: -4, shapeDelta: 1 + comboShapeBonus, combo };
    }
}

export function canPerfectQuench(state: QuenchState, recipe: ForgeRecipeWindow): boolean {
    return state.phase === "forging" &&
        state.progress >= 80 &&
        state.completedPatterns >= 1 &&
        state.temperature >= recipe.needTemperature[0] &&
        state.temperature <= recipe.needTemperature[1] &&
        state.stress <= 60;
}

export function judgeQuench(state: QuenchState, recipe: ForgeRecipeWindow): QuenchResult {
    if (state.phase !== "forging" || state.progress < 80 || state.completedPatterns < 1) return "early";
    if (state.temperature < recipe.needTemperature[0]) return "cold";
    if (state.temperature > recipe.needTemperature[1]) return "overheated";
    if (state.stress > 60) return "stressed";
    return "perfect";
}

/**
 * These outcomes destroy the workpiece instead of merely lowering its grade.
 * Keeping this rule in the domain layer prevents an immediate quench from
 * becoming a shortcut to a normal crafted item.
 */
export function isCatastrophicQuench(result: QuenchResult | undefined): boolean {
    return result === "early" || result === "overheated";
}

/** Number of consumable items that remain after reserving the recipe's base materials. */
export function getUnreservedConsumableCount(total: unknown, reserved: unknown): number {
    const inventoryCount = Number.isFinite(Number(total)) ? Math.max(0, Math.trunc(Number(total))) : 0;
    const reservedCount = Number.isFinite(Number(reserved)) ? Math.max(0, Math.trunc(Number(reserved))) : 0;
    return Math.max(0, inventoryCount - reservedCount);
}

